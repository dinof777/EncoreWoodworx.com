import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { screen } from "../spam.ts";

/**
 * The governing rule for these thresholds: a false positive costs a real commission, a
 * false negative costs one junk email. So the legitimate cases below matter more than the
 * spam ones — if a change starts rejecting any of them, the change is wrong.
 */
const DWELL = 30_000; // a realistic human dwell time

const cases: [string, Parameters<typeof screen>[0], boolean][] = [
  // --- the actual spam you received ---
  ["REAL SPAM (as received)", { name:"Xnrdwywo Jpfdcupdn", email:"z.e.q.o.div.iv.ex92.7@gmail.com", message:"MUjzvywecJPoUOHhqYnA", elapsedMs:DWELL }, true],
  ["same spam, honeypot filled", { honeypot:"x", name:"Xnrdwywo", email:"a@b.com", message:"MUjzvywecJPoUOHhqYnA", elapsedMs:DWELL }, true],
  ["same spam, instant submit", { name:"Xnrdwywo Jpfdcupdn", email:"z.e.q.o@gmail.com", message:"MUjzvywecJPoUOHhqYnA", elapsedMs:120 }, true],
  ["no dwell field at all (no JS)", { name:"Bot", email:"a@b.com", message:"buy things now", elapsedMs:undefined }, true],
  // A lone link must NOT be enough — a customer sharing a Pinterest reference looks the
  // same. It scores 3 and needs a second signal, which is the conservative call.
  ["lone link (allowed by design)", { name:"Ann Lee", email:"a@b.com", message:"Great site! https://cheap-pills.example", elapsedMs:DWELL }, false],
  ["link + gibberish name", { name:"Xnrdwywo Jpfdcupdn", email:"a@b.com", message:"https://cheap-pills.example", elapsedMs:DWELL }, true],
  // --- legitimate enquiries that MUST get through ---
  ["real: epoxy table",   { name:"Sarah Whitcombe", email:"sarah.w@gmail.com", message:"Hi — I'd like a quote for an epoxy river table, about 8 feet, walnut if possible.", elapsedMs:DWELL }, false],
  ["real: terse",         { name:"Mike",  email:"mike@fastmail.com", message:"Barn door quote please", elapsedMs:DWELL }, false],
  ["real: very terse",    { name:"Jo",    email:"jo@x.co", message:"Countertops", elapsedMs:DWELL }, false],
  ["real: one long word", { name:"Anna",  email:"a@b.com", message:"Countertops!!!!!!!!!!!!", elapsedMs:DWELL }, false],
  ["real: Polish surname",{ name:"Anna Strzelecki", email:"anna@b.com", message:"Do you build railings?", elapsedMs:DWELL }, false],
  ["real: German surname",{ name:"Hans Schmidt", email:"hans@b.com", message:"Interested in a dining table", elapsedMs:DWELL }, false],
  ["real: dotted gmail",  { name:"Ravi Patel", email:"r.a.v.i.patel@gmail.com", message:"Please quote a live edge desk for my office", elapsedMs:DWELL }, false],
  ["real: shares a URL",  { name:"Dana Kim", email:"dana@b.com", message:"Something like this https://pinterest.com/pin/123 — can you build it?", elapsedMs:DWELL }, false],
  ["real: basket only, no message", { name:"Tom", email:"tom@b.com", message:"", elapsedMs:DWELL }, false],
];

describe("spam screening", () => {
  for (const [label, input, expectSpam] of cases) {
    it(`${expectSpam ? "blocks" : "allows"}: ${label}`, () => {
      assert.equal(screen(input).spam, expectSpam);
    });
  }
});
