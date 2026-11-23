// Unit tests for the roster domain rules. Node strips the TypeScript types, so
// the module under test must keep free of `@/` runtime imports (Node 22.18+).
import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_TIERS,
  EXECUTIVE_TIER_DETAILS,
  describeProvisioningEvent,
  describeRosterError,
  filterRoster,
  getExecutiveTierLabel,
  getRosterAccessState,
  initialRosterActionState,
  isExecutiveTier,
  parseRosterEntry,
  summarizeRoster,
} from "../../lib/admin/executive-roster.ts";
import { formatRole } from "../../lib/member/display.ts";

function form(fields) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(fields)) formData.set(name, value);
  return formData;
}

const valid = {
  email: "nia@example.test",
  fullName: "Nia Newcomer",
  position: "Executive Secretary",
  role: "core_executive",
};

test("tiers", async (suite) => {
  await suite.test("offer exactly the two Executive Board tiers", () => {
    assert.deepEqual(EXECUTIVE_TIERS.map((tier) => tier.value), ["core_executive", "executive"]);
    assert.equal(isExecutiveTier("executive"), true);
    for (const value of ["member", "president", "", null, undefined]) {
      assert.equal(isExecutiveTier(value), false);
    }
  });

  await suite.test("use the same labels as the member-facing role display", () => {
    for (const tier of EXECUTIVE_TIERS) {
      assert.equal(formatRole(tier.value), tier.label);
      assert.equal(getExecutiveTierLabel(tier.value), EXECUTIVE_TIER_DETAILS[tier.value].label);
    }
    assert.equal(getExecutiveTierLabel("something_else"), "something_else");
  });
});

test("parseRosterEntry", async (suite) => {
  await suite.test("normalizes email, spacing, and keeps the raw values", () => {
    const result = parseRosterEntry(form({
      email: "  Nia@Example.TEST ",
      fullName: "  Nia    Newcomer ",
      position: " Executive \t Secretary ",
      role: "core_executive",
    }));
    assert.equal(result.success, true);
    assert.deepEqual(result.data, valid);
    assert.equal(result.values.email, "  Nia@Example.TEST ");
  });

  await suite.test("reports one message per invalid field", () => {
    const result = parseRosterEntry(form({ email: "nobody", fullName: "  ", position: "", role: "president" }));
    assert.equal(result.success, false);
    assert.deepEqual(Object.keys(result.fieldErrors).sort(), ["email", "fullName", "position", "role"]);
    assert.match(result.fieldErrors.email, /valid login email/);
    assert.match(result.fieldErrors.fullName, /full name/);
    assert.match(result.fieldErrors.position, /position/);
    assert.match(result.fieldErrors.role, /membership tier/);
  });

  await suite.test("treats missing fields as empty", () => {
    const result = parseRosterEntry(new FormData());
    assert.equal(result.success, false);
    assert.match(result.fieldErrors.email, /Enter the login email/);
    assert.deepEqual(result.values, { email: "", fullName: "", position: "", role: "" });
  });

  await suite.test("applies the same length limits as the database", () => {
    const longText = "x".repeat(121);
    const result = parseRosterEntry(form({ ...valid, fullName: longText, position: longText }));
    assert.equal(result.success, false);
    assert.match(result.fieldErrors.fullName, /120 characters/);
    assert.match(result.fieldErrors.position, /120 characters/);

    assert.equal(parseRosterEntry(form({ ...valid, fullName: "x".repeat(120) })).success, true);
    assert.equal(
      parseRosterEntry(form({ ...valid, email: `${"a".repeat(250)}@example.test` })).success,
      false,
    );
  });

  await suite.test("rejects emails the database would reject", () => {
    for (const email of ["", "nobody", "nobody@example", "two words@example.test", "a@@b.test", "@example.test"]) {
      assert.equal(parseRosterEntry(form({ ...valid, email })).success, false, email);
    }
  });
});

test("describeRosterError shows database messages written for administrators only", () => {
  assert.equal(describeRosterError({ code: "23505", message: "This email is already on the roster." }), "This email is already on the roster.");
  assert.equal(describeRosterError({ code: "22023", message: "Enter a valid login email address." }), "Enter a valid login email address.");
  assert.equal(describeRosterError({ code: "P0002", message: "That email is not on the roster." }), "That email is not on the roster.");
  assert.match(describeRosterError({ code: "42501", message: "Administrator access is required." }), /Sign in again/);
  // Anything unexpected is never echoed, because it may expose internals.
  assert.equal(
    describeRosterError({ code: "XX000", message: "relation private.approved_executives is broken" }),
    "The roster could not be updated. Please try again.",
  );
  assert.equal(describeRosterError({}), "The roster could not be updated. Please try again.");
  assert.deepEqual(initialRosterActionState, { status: "idle" });
});

const rows = [
  { email: "ana@example.test", full_name: "Ana Active", position: "President", role: "core_executive", active: true, account_status: "verified", has_access: true },
  { email: "ben@example.test", full_name: "Ben Pending", position: "Director", role: "executive", active: true, account_status: "awaiting_verification", has_access: false },
  { email: "cy@example.test", full_name: "Cy Newcomer", position: "Treasurer", role: "core_executive", active: true, account_status: "no_account", has_access: false },
  { email: "di@example.test", full_name: "Di Dormant", position: "Director", role: "executive", active: true, account_status: "verified", has_access: false },
  { email: "ed@example.test", full_name: "Ed Gone", position: "Director", role: "executive", active: false, account_status: "verified", has_access: false },
];

test("getRosterAccessState explains why an entry does or does not grant access", () => {
  assert.deepEqual(rows.map(getRosterAccessState), [
    "active",
    "awaiting_verification",
    "not_signed_up",
    "profile_inactive",
    "deactivated",
  ]);
  // Deactivation always wins, even if the account itself is fine.
  assert.equal(getRosterAccessState({ active: false, account_status: "verified", has_access: true }), "deactivated");
});

test("summarizeRoster counts active tiers, entries awaiting setup, and deactivations", () => {
  assert.deepEqual(summarizeRoster(rows), {
    total: 5,
    activeCore: 2,
    activeExecutive: 2,
    awaitingSetup: 3,
    deactivated: 1,
  });
  assert.deepEqual(summarizeRoster([]), {
    total: 0,
    activeCore: 0,
    activeExecutive: 0,
    awaitingSetup: 0,
    deactivated: 0,
  });
});

test("filterRoster combines text search with a tier or access filter", async (suite) => {
  const emails = (result) => result.map((row) => row.email);

  await suite.test("returns everything by default", () => {
    assert.equal(filterRoster(rows, { query: "", filter: "all" }).length, 5);
    assert.equal(filterRoster(rows, { query: "   ", filter: "all" }).length, 5);
  });

  await suite.test("searches name, email, and position case-insensitively", () => {
    assert.deepEqual(emails(filterRoster(rows, { query: "PENDING", filter: "all" })), ["ben@example.test"]);
    assert.deepEqual(emails(filterRoster(rows, { query: "cy@example", filter: "all" })), ["cy@example.test"]);
    assert.deepEqual(emails(filterRoster(rows, { query: "treasurer", filter: "all" })), ["cy@example.test"]);
    assert.deepEqual(filterRoster(rows, { query: "nobody", filter: "all" }), []);
  });

  await suite.test("filters by tier and by access state", () => {
    assert.deepEqual(emails(filterRoster(rows, { query: "", filter: "core_executive" })), ["ana@example.test", "cy@example.test"]);
    assert.deepEqual(emails(filterRoster(rows, { query: "", filter: "deactivated" })), ["ed@example.test"]);
    assert.deepEqual(emails(filterRoster(rows, { query: "", filter: "awaiting_verification" })), ["ben@example.test"]);
    assert.deepEqual(emails(filterRoster(rows, { query: "director", filter: "executive" })), ["ben@example.test", "di@example.test", "ed@example.test"]);
    assert.deepEqual(emails(filterRoster(rows, { query: "director", filter: "active" })), []);
  });
});

test("describeProvisioningEvent writes a readable summary for each action", async (suite) => {
  const event = (action, details = {}) => ({ action, target_email: "nia@example.test", details });

  await suite.test("added and removed", () => {
    assert.equal(
      describeProvisioningEvent(event("added", { role: "core_executive", position: "Executive Secretary", full_name: "Nia Newcomer" })),
      "Added Nia Newcomer as Core executive member",
    );
    assert.equal(describeProvisioningEvent(event("added")), "Added nia@example.test");
    assert.equal(
      describeProvisioningEvent(event("removed", { full_name: "Nia Newcomer" })),
      "Removed Nia Newcomer from the roster",
    );
  });

  await suite.test("activation changes", () => {
    assert.equal(describeProvisioningEvent(event("activated")), "Reactivated nia@example.test");
    assert.equal(describeProvisioningEvent(event("deactivated")), "Deactivated nia@example.test");
  });

  await suite.test("updates list only what changed", () => {
    assert.equal(
      describeProvisioningEvent(event("updated", {
        from: { role: "core_executive", position: "Executive Secretary", full_name: "Nia Newcomer" },
        to: { role: "executive", position: "Director for Events", full_name: "Nia Newcomer" },
      })),
      "Updated nia@example.test: tier Core executive member → Executive member; position “Executive Secretary” → “Director for Events”",
    );
    assert.equal(describeProvisioningEvent(event("updated")), "Updated nia@example.test");
  });

  await suite.test("ignores malformed details instead of throwing", () => {
    for (const details of [null, "text", 7, [], { from: "x", to: [] }]) {
      assert.equal(describeProvisioningEvent(event("updated", details)), "Updated nia@example.test");
    }
  });
});
