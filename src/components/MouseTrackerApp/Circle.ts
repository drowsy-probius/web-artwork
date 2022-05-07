import { Coordinate } from "../../@types";

export default class Circle {
  coord: Coordinate;
  size: number;

  constructor(coord: Coordinate, size: number)
  {
    this.coord = coord;
    this.size = size/2;
  }

  draw(context: CanvasRenderingContext2D, color: string)
  {
    context.beginPath();
    context.fillStyle = color;
    context.arc(this.coord.x, this.coord.y, this.size, 0, 2*Math.PI);
    context.fill();
  }
}