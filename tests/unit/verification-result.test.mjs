import assert from "node:assert/strict";
import test from "node:test";

import { parseVerificationResult } from "../../lib/auth/verification-result.ts";

test("successful verification links", () => {
  assert.equal(parseVerificationResult("?code=abc123", ""), "confirmed");
  assert.equal(parseVerificationResult("", "#access_token=x&type=signup"), "confirmed");
  assert.equal(parseVerificationResult("?token_hash=h&type=email", ""), "confirmed");
});

test("errors in the URL fragment are read, not ignored", () => {
  const hash = "#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired";
  assert.equal(parseVerificationResult("", hash), "expired");
  assert.equal(
    parseVerificationResult("", "#error=access_denied&error_code=bad&error_description=nope"),
    "invalid",
  );
});

test("errors in the query string are read too", () => {
  assert.equal(parseVerificationResult("?error_code=otp_expired", ""), "expired");
  assert.equal(parseVerificationResult("?error=server_error", ""), "invalid");
  assert.equal(parseVerificationResult("?error_code=user_already_exists", ""), "already_confirmed");
});

test("an error always beats a success signal", () => {
  assert.equal(parseVerificationResult("?code=abc", "#error_code=otp_expired"), "expired");
});

test("resend mode and direct visits", () => {
  assert.equal(parseVerificationResult("?resend=1", ""), "resend");
  assert.equal(parseVerificationResult("", ""), "unknown");
  assert.equal(parseVerificationResult("?foo=bar", "#baz"), "unknown");
});
