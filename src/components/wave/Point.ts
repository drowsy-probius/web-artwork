import { Coordinate } from "../../@types";

export default class Point {
  coord: Coordinate;
  speed: number;
  cur: number;
  max: number;

  constructor(index: number, coord: Coordinate)
  {
    this.coord = coord;
    this.speed = 0.1;
    this.cur = index;
    this.max = Math.random() * 10;
  }

  update()
  {
    this.cur += Math.random() * this.speed;
    this.coord.y += Math.sin(this.cur) * this.max;
  }
}