import assert from "node:assert/strict";
import test from "node:test";

import {
  isValidBirthdate,
  isValidUuid,
} from "../../lib/member/profile-validation.ts";

test("isValidUuid accepts canonical UUIDs and rejects path/injection payloads", () => {
  assert.equal(isValidUuid("550e8400-e29b-41d4-a716-446655440000"), true);
  assert.equal(isValidUuid("550E8400-E29B-41D4-A716-446655440000"), true);

  for (const bad of [
    "",
    "not-a-uuid",
    "../../login",
    "550e8400-e29b-41d4-a716-446655440000?error=1",
    "550e8400-e29b-41d4-a716-44665544000",
    "550e8400-e29b-41d4-a716-4466554400000",
    "g50e8400-e29b-41d4-a716-446655440000",
  ]) {
    assert.equal(isValidUuid(bad), false, `Expected invalid UUID: ${bad}`);
  }
});

test("isValidBirthdate enforces 14–100 age range and rejects invalid dates", () => {
  const now = new Date();
  const twentyYearsAgo = new Date(
    now.getFullYear() - 20,
    now.getMonth(),
    now.getDate(),
  )
    .toISOString()
    .split("T")[0];
  const tenYearsAgo = new Date(
    now.getFullYear() - 10,
    now.getMonth(),
    now.getDate(),
  )
    .toISOString()
    .split("T")[0];
  const overHundredYearsAgo = new Date(
    now.getFullYear() - 105,
    now.getMonth(),
    now.getDate(),
  )
    .toISOString()
    .split("T")[0];

  assert.equal(isValidBirthdate(twentyYearsAgo), true);
  assert.equal(isValidBirthdate(tenYearsAgo), false);
  assert.equal(isValidBirthdate(overHundredYearsAgo), false);
  assert.equal(isValidBirthdate("not-a-date"), false);
  assert.equal(isValidBirthdate(""), false);
});
