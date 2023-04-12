import { Md5 } from "ts-md5";
import _ from "lodash";
import { createCanvas } from 'canvas';
import fs from 'fs';

const md5 = new Md5();
const tile_size = 50;
const tiles_per_side = 6;
const total_tiles = tiles_per_side * tiles_per_side;
const hex_to_ints = (md5.appendStr("hello world").end() as string)
  .split("")
  .map((x) => {
    switch (x) {
      case "a":
        return 10;
      case "b":
        return 11;
      case "c":
        return 12;
      case "d":
        return 13;
      case "e":
        return 14;
      case "f":
        return 15;
      default:
        return parseInt(x);
    }
  });
// TODO - possible error? no
const int_to_bools = _.take(
  hex_to_ints.flatMap((x) => x > 7),
  total_tiles / 2
);
console.log(hex_to_ints);
console.log(int_to_bools);

const row = (pos: number) => {
  return Math.trunc(pos / (tiles_per_side / 2));
};
const col = (pos: number) => pos % (tiles_per_side / 2);
const xyTuple: (x: number) => [number, number] = (pos: number) => [col(pos) * tile_size, row(pos) * tile_size];
const xyTupleMirror: (x: number) => [number, number] = (pos: number) => [(tiles_per_side - col(pos) - 1) * tile_size, row(pos) * tile_size];
console.log(xyTuple(2));
const canvas = createCanvas(tile_size * tiles_per_side, tile_size * tiles_per_side);
const context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);
int_to_bools.flatMap((y, i) => {
  context.fillStyle = "green";
  if (y) {
    context.fillRect(...xyTuple(i), tile_size, tile_size)
    context.fillRect(...xyTupleMirror(i), tile_size, tile_size)
  }
})
const out = fs.createWriteStream(__dirname + '/../identicon.jpg')
const stream = canvas.createJPEGStream()
stream.pipe(out);
out.on("finish", () => console.log('the jpg file was created'))
