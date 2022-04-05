import { Coordinate } from "../../@types";

export default class Point {
  coord: Coordinate;
  filedY: number;
  speed: number;
  cur: number;
  max: number;

  constructor(index: number, coord: Coordinate)
  {
    this.coord = coord;

    this.filedY = coord.y;
    this.speed = 0.05;
    this.cur = index;
    this.max = Math.random() * 40;
  }

  update()
  {
    this.cur += Math.random() * this.speed;
    this.coord.y = this.filedY + Math.sin(this.cur) * this.max;
  }
}