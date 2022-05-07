import { Coordinate, WindowSize } from "../../@types";
import Circle from "./Circle";

export default class CircleGroup{
  windowSize: WindowSize;
  colorFrom: string = '#1a1f4a';
  colorTo: string = '#ff8c82';
  size: number = 50;
  w_length: number;
  h_length: number;

  circles: Circle[][];

  constructor(windowSize: WindowSize, colorFrom?: string, colorTo?: string, size?: number)
  {
    this.windowSize = windowSize;
    if(colorFrom) this.colorFrom = colorFrom;
    if(colorTo) this.colorTo = colorTo;
    if(size) this.size = size;
    this.windowSize = windowSize;
    this.w_length = this.windowSize.width / (this.size*1.2);
    this.h_length = this.windowSize.height / (this.size*1.2);

    this.circles = [];
    this.resize(windowSize);
  }

  draw(context: CanvasRenderingContext2D, mousePosition: Coordinate)
  {
    this.circles.forEach(e => {
      e.forEach(e => {
        e.draw(context, this.colorFrom);
      })
    });
  }

  resize(windowSize: WindowSize)
  {
    this.windowSize = windowSize;
    this.w_length = this.windowSize.width / (this.size*1.2);
    this.h_length = this.windowSize.height / (this.size*1.2);

    this.circles = [];
    for(let h=0; h<this.h_length; h++)
    {
      this.circles[h] = [];
      for(let w=0; w<this.w_length; w++)
      {
        this.circles[h][w] = new Circle({
          x: w*(this.size*1.2) + this.size/2,
          y: h*(this.size*1.2) + this.size/2,
        }, this.size);
      }
    }
    console.log(this.circles);
  }
}