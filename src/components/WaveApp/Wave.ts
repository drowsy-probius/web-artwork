import Point from "./Point";
import { Coordinate } from "../../types";
import { CoordinateApp } from "../../utils";

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
    this.numberOfPoints = numberOfPoints+1;
    this.resize(windowSize);
  }

  resize(stageSize: Coordinate)
  {
    this.stageSize = stageSize;
    this.center = new CoordinateApp(stageSize).multiply(2/3);

    this.pointGap = stageSize.x / (this.numberOfPoints - 1);
    this.gradient = [];
    this.surfaces = [];

    this.init();
  }

  init()
  {
    if(!this.pointGap || !this.center || !this.stageSize) return;

    let pointGap = this.pointGap;
    let centerPoint: Coordinate = this.center;

    let pointArray: Array<Point> = [];
    for(let i=0; i<this.numberOfPoints-1; i++)
    {
      pointArray[i] = new Point(i, {
        x: pointGap * i,
        y: centerPoint.y
      });
    }
    pointArray[pointArray.length] = new Point(pointArray.length, {
      x: this.stageSize.x,
      y: centerPoint.y
    })
    this.points = [...pointArray];
  }

  draw(context: CanvasRenderingContext2D, timedelta: number)
  {
    if(!this.points || !this.stageSize) return;

    if(this.points.length === 0)
    {
      console.log('no points');
      return;
    }
    
    context.beginPath();
    context.fillStyle = this.color;

    let prev: Coordinate = this.points[0].coord;
    
    context.moveTo(prev.x, prev.y);

    this.points.forEach((point, index, points) => {
      if(!this.gradient || !this.surfaces) return;

      let current: Coordinate = new CoordinateApp({
        x: prev.x + point.coord.x,
        y: prev.y + point.coord.y
      }).multiply(0.5);

      // wave point paint for debug
      // context.fillStyle = '#33ff00';
      // context.fillRect(current.x, current.y, 3, 3);
      // context.fillStyle = this.color;

      context.quadraticCurveTo(prev.x, prev.y, current.x, current.y);
      prev = point.coord;

      this.gradient[index] = (current.x - prev.x) === 0 ? 0 : (current.y - prev.y) / (current.x - prev.x);
      this.surfaces[index] = current;

      if(index !== 0 && index !== points.length - 1)
      {
        point.update(timedelta);
      }

    });

    context.lineTo(prev.x, prev.y); // create line to last point
    context.lineTo(context.canvas.width, context.canvas.height); // to right bottom
    context.lineTo(0, context.canvas.height); // to left bottom
    //context.lineTo(this.points[0].coord.x, this.points[0].coord.y);

    context.fill();
    // context.stroke(); // 윤곽선 칠하기
    // context.closePath(); // fill하면 자동으로 closePath됨
  }
}