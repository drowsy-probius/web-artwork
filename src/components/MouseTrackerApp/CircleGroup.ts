import { Coordinate, WindowSize } from "../../@types";
import { interpolateColor, isPointInCircle } from "../../functions";
import Circle from "./Circle";

export default class CircleGroup{
  windowSize: WindowSize;
  colorFrom: string = '#16202e00';
  colorTo: string = '#ff8c82';
  diameter: number = 80;
  weight: number = 1.3;
  w_length: number;
  h_length: number;

  MaxColorLevel: number = 3;
  colorLevels: string[]; // level=0 is mousePosition
  circles: Circle[][];

  constructor(windowSize: WindowSize, colorFrom?: string, colorTo?: string, diameter?: number)
  {
    this.windowSize = windowSize;
    if(colorFrom !== undefined) this.colorFrom = colorFrom;
    if(colorTo !== undefined) this.colorTo = colorTo;
    if(diameter !== undefined) this.diameter = diameter;
    this.windowSize = windowSize;
    this.w_length = this.windowSize.width / (this.diameter*this.weight);
    this.h_length = this.windowSize.height / (this.diameter*this.weight);

    this.circles = [];
    this.resize(windowSize);

    this.colorLevels = [];
    for(let i=0; i<5; i++)
    {
      this.colorLevels[i] = interpolateColor(this.colorFrom, this.colorTo, i/this.MaxColorLevel);
    }
  }

  draw(context: CanvasRenderingContext2D, mousePosition: Coordinate)
  {
    /**
     * 맨 뒤에 그리기
     */
    // context.globalCompositeOperation = 'destination-over';
    context.save();
    context.filter = 'blur(10px)';
    this.circles.forEach(e => {
      e.forEach(e => {
        for(let level=1; level<=this.MaxColorLevel; level++)
        {
          if(isPointInCircle(mousePosition, e.coord, (this.diameter/2)*level))
          {
            e.draw(context, this.colorLevels[level-1]);
            break;
          }
        }

        // else
        // {
        //   e.draw(context, this.colorFrom);
        // }
      })
    });
    context.restore();
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