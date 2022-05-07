import { Coordinate, WindowSize } from "../../@types";
import { isPointInCircle } from "../../functions";
import Circle from "./Circle";

export default class CircleGroup{
  windowSize: WindowSize;
  colorFrom: string = '#00132b';
  colorTo: string = '#ff8c82';
  diameter: number = 50;
  weight: number = 1.2;
  w_length: number;
  h_length: number;

  circles: Circle[][];

  constructor(windowSize: WindowSize, colorFrom?: string, colorTo?: string, diameter?: number)
  {
    this.windowSize = windowSize;
    if(colorFrom) this.colorFrom = colorFrom;
    if(colorTo) this.colorTo = colorTo;
    if(diameter) this.diameter = diameter;
    this.windowSize = windowSize;
    this.w_length = this.windowSize.width / (this.diameter*this.weight);
    this.h_length = this.windowSize.height / (this.diameter*this.weight);

    this.circles = [];
    this.resize(windowSize);
  }

  draw(context: CanvasRenderingContext2D, mousePosition: Coordinate)
  {
    /**
     * 맨 뒤에 그리기
     */
    context.globalCompositeOperation = 'destination-over';
    this.circles.forEach(e => {
      e.forEach(e => {
        if(isPointInCircle(mousePosition, e.coord, this.diameter/2))
        {
          e.draw(context, this.colorTo);
        }
        else
        {
          e.draw(context, this.colorFrom);
        }
      })
    });
  }

  resize(windowSize: WindowSize)
  {
    this.windowSize = windowSize;
    this.w_length = this.windowSize.width / (this.diameter*this.weight);
    this.h_length = this.windowSize.height / (this.diameter*this.weight);

    this.circles = [];
    for(let h=0; h<this.h_length; h++)
    {
      this.circles[h] = [];
      for(let w=0; w<this.w_length; w++)
      {
        this.circles[h][w] = new Circle({
          x: w*(this.diameter*this.weight) + this.diameter/2,
          y: h*(this.diameter*this.weight) + this.diameter/2,
        }, this.diameter);
      }
    }
  }
}