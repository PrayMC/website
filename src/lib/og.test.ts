import { test } from "node:test";
import assert from "node:assert/strict";
import { fitFontSize, parseFontFaces } from "./og.ts";

test("parseFontFaces reads weight and truetype url from each @font-face", () => {
  const css = `@font-face {
  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/a.ttf) format('truetype');
}
@font-face {
  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 800;
  src: url(https://fonts.gstatic.com/b.ttf) format('truetype');
}`;
  assert.deepEqual(parseFontFaces(css), [
    { weight: 400, url: "https://fonts.gstatic.com/a.ttf" },
    { weight: 800, url: "https://fonts.gstatic.com/b.ttf" },
  ]);
  assert.deepEqual(parseFontFaces(""), []);
});

test("fitFontSize shrinks long names between min and max, with a 10% margin", () => {
  assert.equal(fitFontSize("afef", 320, 64, 32), 64);
  assert.equal(fitFontSize("sexyaco145", 320, 64, 32), 45);
  assert.equal(fitFontSize("Hamburger", 320, 64, 32), 49);
  assert.equal(fitFontSize("알바가nono", 320, 64, 32), 55);
  assert.equal(fitFontSize("호파카와친구들", 320, 64, 32), 44);
  assert.equal(fitFontSize("호파카와친구들호파카와친구들", 320, 64, 32), 32);
});
