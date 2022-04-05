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

  multiply(weight: number)
  {
    this.coord.x *= weight;
    this.coord.y *= weight;

    return this.coord;
  }

  add(weight: number)
  {
    this.coord.x += weight;
    this.coord.y += weight;

    return this.coord;
  }
}

export interface WindowSize {
  width: number,
  height: number,
}