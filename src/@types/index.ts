export interface Coordinate {
  x: number,
  y: number
}

export class CoordinateApp {
  coord: Coordinate;

  constructor(coord: Coordinate)
  {
    this.coord = coord;
  }

  multiply(weight: number|Coordinate)
  {
    if(typeof(weight) === "number" )
    {
      this.coord.x *= weight;
      this.coord.y *= weight;
    }
    else
    {
      this.coord.x *= weight.x;
      this.coord.y *= weight.y;
    }

    return this.coord;
  }

  add(weight: number|Coordinate)
  {
    if(typeof(weight) === "number" )
    {
      this.coord.x += weight;
      this.coord.y += weight;
    }
    else
    {
      this.coord.x += weight.x;
      this.coord.y += weight.y;
    }

    return this.coord;
  }
}

export interface WindowSize {
  width: number,
  height: number,
}