export interface Coordinate {
  x: number,
  y: number
}

export interface WindowSize {
  width: number,
  height: number,
}


export interface Shape{
  draw(context: CanvasRenderingContext2D, options: any) : void,
  animate(options: any): void,
  resize(options: any) : void,
}

export interface Circle extends Shape {
  coord: Coordinate,
  radius: number,
}

export interface Rectangle extends Shape {
  coord: Coordinate,
  size: Coordinate,
  angle: number,
}

export interface orbitType
{
  perihelion: number,
  aphelion: number,
  moons: number,
  ring: boolean,
  mass: number,
  density: number,
  diameter: number
}

export interface orbitsDataType
{
  [key: string]: orbitType
}
