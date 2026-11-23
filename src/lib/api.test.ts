import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parsePage,
  parseSearch,
  parseSessionKey,
  formatDate,
  formatTimeRange,
  MAX_PAGE,
} from "./api.ts";

test("parsePage clamps to 1..MAX_PAGE and takes the first repeated value", () => {
  assert.equal(parsePage({}), 1);
  assert.equal(parsePage({ page: "abc" }), 1);
  assert.equal(parsePage({ page: "-3" }), 1);
  assert.equal(parsePage({ page: ["4", "9"] }), 4);
  assert.equal(parsePage({ page: "999999999" }), MAX_PAGE);
});

test("parseSearch trims and caps length", () => {
  assert.equal(parseSearch({ search: "  kim  " }), "kim");
  assert.equal(parseSearch({ search: "x".repeat(100) }).length, 64);
});

test("parseSessionKey validates teams and time window, re-serializing to ISO", () => {
  const ok = { team1: " a ", team2: "b", from: "2026-09-15 13:00Z", to: "2026-09-15T14:00:00Z" };
  assert.deepEqual(parseSessionKey(ok), {
    team1: "a",
    team2: "b",
    from: "2026-09-15T13:00:00.000Z",
    to: "2026-09-15T14:00:00.000Z",
  });
  assert.equal(parseSessionKey({ ...ok, team2: " " }), null);
  assert.equal(parseSessionKey({ ...ok, from: "nope" }), null);
  assert.equal(parseSessionKey({ ...ok, from: ok.to, to: ok.from }), null);
});

test("Korean pages show dates with slashes and a 24-hour clock, like Japanese", () => {
  const start = "2026-11-22T11:20:00Z";
  const end = "2026-11-22T13:08:00Z";
  assert.equal(formatTimeRange(start, end, "ko"), "11/22 20:20 – 22:08");
  assert.equal(formatDate(end, "ko"), "2026/11/22 22:08:00 GMT+9");
});
