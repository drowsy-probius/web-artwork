import { Coordinate } from "../../@types";

export default class Rectangle {
  coord: Coordinate;
  size: Coordinate;
  angle: number;
  

  constructor(size: Coordinate)
  {
    this.coord = {
      x: 0,
      y: 0,
    };
    this.size = size;
    this.angle = 0;
  }

  resize(size: Coordinate)
  {
    console.log('rectangle resize!')
  }

  draw(context: CanvasRenderingContext2D, coord: Coordinate, gradient: number)
  {
    if(!coord)
    {
      return;
    }

    context.save();
    context.beginPath();
    context.fillStyle = '#5c2500';
    
    // 해당 직사각형 회전을 위해서 원점 이동
    context.translate(coord.x + this.size.x / 2, coord.y - this.size.y/1.6);
    // 적절한 값: 50을 곱해서 자연스러운 기울기 연출
    this.angle = Math.atan(gradient) * 50 * Math.PI/180;
    context.rotate(this.angle);
    // 원점보다 너비/2만큼 왼쪽으로 이동해서 채우므로
    // 더 자연스러운 직사각형 움직임
    context.fillRect(-this.size.x/1.5, 0, this.size.x, this.size.y);

    context.closePath();
    context.restore();
  }
}