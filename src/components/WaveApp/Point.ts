import { Coordinate } from "../../types";

export default class Point {
  coord: Coordinate;
  cur: number;
  max: number;

  constructor(index: number, coord: Coordinate, max=0.1)
  {
    this.coord = coord;
    this.cur = index;
    this.max = Math.random() * max;
  }

  update(speed: number)
  {
    this.cur += Math.random() * speed;
    this.coord.y += Math.sin(this.cur) * this.max;
  }
}