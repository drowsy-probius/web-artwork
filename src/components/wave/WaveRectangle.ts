import Wave from "./Wave";
import Rectangle from "./Rectangle";
import { Coordinate } from "../../@types";

export default class WaveRectangle extends Wave
{
  size: Coordinate; // rectangle size
  rectangle: Rectangle;
  boatPoint: number;

  constructor(windowSize: Coordinate, color: string, numberOfPoints: number, size={x:100, y:30})
  {
    super(windowSize, color, numberOfPoints);

    this.size = size;
    this.boatPoint = Math.floor(numberOfPoints/2);
    this.rectangle = new Rectangle(size);
    this.resize(windowSize);
  }

  resize(size: Coordinate)
  {
    // this.rectangle.resize(size);
  }

  draw(context: CanvasRenderingContext2D)
  {
    if(!this.surfaces || !this.gradient) return;

    super.draw(context);
    this.rectangle.draw(context, this.surfaces[this.boatPoint], this.gradient[this.boatPoint]);
  }
}