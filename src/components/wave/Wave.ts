import Point from "./Point";
import { Coordinate, CoordinateApp } from "../../@types";

export default class Wave {
  color: string;
  numberOfPoints: number;

  stageSize: Coordinate | undefined;

  points: Array<Point> | undefined;
  pointGap: number | undefined;

  surfaces: Array<Coordinate> | undefined;
  center: Coordinate | undefined;

  gradient: Array<number> | undefined;
  

  constructor(windowSize:Coordinate, color: string, numberOfPoints: number)
  {
    this.color = color;
    this.numberOfPoints = numberOfPoints;
    this.resize(windowSize);
  }

  resize(stageSize: Coordinate)
  {
    this.stageSize = stageSize;
    this.center = new CoordinateApp(stageSize).multiply(1.5);

    this.pointGap = stageSize.x / (this.numberOfPoints - 1);

    this.init();
  }

  init()
  {
    if(!this.pointGap || !this.center) return;

    let pointArray: Array<Point> = [];
    for(let i=0; i<this.numberOfPoints; i++)
    {
      pointArray[i] = new Point(i, {
        x: this.pointGap * i,
        y: this.center.y
      });
    }
    this.points = [...pointArray];
  }

  draw(context: CanvasRenderingContext2D)
  {
    if(!this.points || !this.stageSize) return;

    if(this.points.length === 0)
    {
      console.log('no points');
      return;
    }

    context.beginPath();

    let prev: Coordinate = this.points[0].coord;
    
    context.moveTo(prev.x, prev.y);

    this.points.forEach((point, index) => {
      if(!this.points || !this.gradient || !this.surfaces) return;

      let current: Coordinate = new CoordinateApp({
        x: prev.x + point.coord.x,
        y: prev.y + point.coord.y
      }).multiply(0.5);

      context.quadraticCurveTo(prev.x, prev.y, current.x, current.y);
      this.gradient[index] = (current.y - prev.y) / (current.x - prev.x);
      this.surfaces[index] = current;

      prev = point.coord;

      if(index !== 0 && index !== this.points.length - 1)
      {
        point.update();
      }
    });

    context.lineTo(prev.x, prev.y);
    context.lineTo(this.stageSize.x, this.stageSize.y);
    context.lineTo(0, this.stageSize.y);
    context.lineTo(this.points[0].coord.x, this.points[0].coord.y);

    context.fillStyle = this.color;
    context.fill();
    // context.stroke(); // 윤곽선 칠하기
    // context.closePath(); // fill하면 자동으로 closePath됨
  }
}