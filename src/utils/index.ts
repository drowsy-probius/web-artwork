import { Coordinate } from "../types";

interface ColorProps
{
  color?: string,
  useAlpha?: boolean,
}

export class CoordinateApp {
  coord: Coordinate;

  constructor(coord: Coordinate)
  {
    this.coord = {...coord};
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


export class Color
{
  rgb: number[];
  aa: number = 0xff;
  useAlpha: boolean = false;
  maxRGB: number = 0; // closed upper bound
  minRGB: number = 0; // closed lower bound
  animateTarget: number = 0; // 0: rr, 1: gg, 2: bb
  animateSign: number = 1; // 1 or -1


  /**
   * Creates an instance of Color.
   * @param {ColorProps} options
   * options.color: #rrggbbaa or #rrggbb
   * options.useAlpha: set true when you use random color
   * @memberof Color
   */
  constructor(options?: ColorProps)
  {
    this.rgb = [];
    const color = options?.color;
    const useAlpha = options?.useAlpha;

    if(options === undefined || color === undefined)
    {
      this.rgb[0] = randomInt(256);
      this.rgb[1] = randomInt(256);
      this.rgb[2] = randomInt(256);

      if(useAlpha === true)
      {
        this.aa = randomInt(256);
        this.useAlpha = true;
      }
      this.maxRGB = Math.max(this.rgb[0], this.rgb[1], this.rgb[2]);
      this.minRGB = Math.min(this.rgb[0], this.rgb[1], this.rgb[2]);
      if(this.rgb[0] !== this.maxRGB && this.rgb[0] !== this.minRGB) this.animateTarget = 0;
      if(this.rgb[1] !== this.maxRGB && this.rgb[1] !== this.minRGB) this.animateTarget = 1;
      if(this.rgb[2] !== this.maxRGB && this.rgb[2] !== this.minRGB) this.animateTarget = 2;
      return;
    }

    if(color.length < 7)
    {
      throw new Error("invalid color format!");
    }

    this.rgb[0] = parseInt(color.slice(1, 3), 16);
    this.rgb[1] = parseInt(color.slice(3, 5), 16);
    this.rgb[2] = parseInt(color.slice(5, 7), 16);
    if(color.length === 7) return;
    if(color.length !== 9)
    {
      throw new Error("invalid color format!");
    }
    this.aa = parseInt(color.slice(7, 9), 16);
    this.useAlpha = true;
    this.maxRGB = Math.max(this.rgb[0], this.rgb[1], this.rgb[2]);
    this.minRGB = Math.min(this.rgb[0], this.rgb[1], this.rgb[2]);
    if(this.rgb[0] !== this.maxRGB && this.rgb[0] !== this.minRGB) this.animateTarget = 0;
    if(this.rgb[1] !== this.maxRGB && this.rgb[1] !== this.minRGB) this.animateTarget = 1;
    if(this.rgb[2] !== this.maxRGB && this.rgb[2] !== this.minRGB) this.animateTarget = 2;
  }

  animate(delta: number = 1)
  {
    this.rgb[this.animateTarget] += this.animateSign * delta;
    if(this.rgb[this.animateTarget] >= this.maxRGB)
    {
      this.rgb[this.animateTarget] = this.maxRGB;
      for(let i=0; i<3; i++)
      {
        if(i !== this.animateTarget && this.rgb[i] === this.maxRGB)
        {
          this.animateTarget = i;
          this.animateSign = -1;
          break;
        }
      }
    }
    else if(this.rgb[this.animateTarget] <= this.minRGB)
    {
      this.rgb[this.animateTarget] = this.minRGB;
      for(let i=0; i<3; i++)
      {
        if(i !== this.animateTarget && this.rgb[i] === this.minRGB)
        {
          this.animateTarget = i;
          this.animateSign = 1;
          break;
        }
      }
    }

  }

  toString()
  {
    let result = "";
    for(let i=0; i<3; i++)
    {
      result += this.rgb[i].toString(16).padStart(2, '0');
    }
    if(this.useAlpha === true)
    {
      return `#${result}${this.aa.toString(16).padStart(2, '0')}`;
    }
    else
    {
      return `#${result}`;
    }
  }
}

export function colorFromTemperature(temperature: number): number
{
  return 0;
}


export function colorToNumber(color: string): number
{
  return parseInt(color.slice(1), 16);
}

/**
 * interpolate two colors using 0 <= p <= 1
 *
 * @export
 * @param {string} colorA 
 * #rrggbbaa or #rrggbb
 * @param {string} colorB 
 * #rrggbbaa or #rrggbb
 * @param {number} distance
 * how far from colorA: 0 <= p <= 1
 * @param {boolean} toNumber
 * if it is set, return value is number not string
 * @return {string} 
 * #rrggbbaa or #rrggbb
 * 
 */
export function interpolateColor(colorA: string, colorB: string, distance: number): string
{
  if(distance >= 1) return colorA;
  if(distance <= 0) return colorB;

  const color = new Color({color: '#00000000'});
  const cA = new Color({color: colorA});
  const cB = new Color({color: colorB});

  color.rgb[0] = Math.round(cB.rgb[0] + distance*(cA.rgb[0] - cB.rgb[0]));
  color.rgb[1] = Math.round(cB.rgb[1] + distance*(cA.rgb[1] - cB.rgb[1]));
  color.rgb[2] = Math.round(cB.rgb[2] + distance*(cA.rgb[2] - cB.rgb[2]));
  color.aa = Math.round(cB.aa + distance*(cA.aa - cB.aa));

  return color.toString();
}

export function isPointInCircle(point: Coordinate, center: Coordinate, radius: number)
{
  return ((point.x - center.x)*(point.x - center.x) + (point.y - center.y)*(point.y - center.y)) < radius * radius;
}

export function isPositionPositive(point: Coordinate)
{
  return (point.x > 0) && (point.y > 0);
}

export function randomColorString(useAlpha: boolean = false): string
{
  return new Color({useAlpha}).toString();
}

export function randomColorNumber(useAlpha: boolean = false): number
{
  return colorToNumber(randomColorString(useAlpha));
}

/**
 * 
 * from: (x-x0)^2/a^2 + (y-y0)^2/b^2 = 1
 * 
 * @param a 
 * @param b 
 * @param x0 
 * @param y0 
 * @returns 
 */
export function ellipseEquation(a: number, b: number, x0: number, y0: number): Function
{
  return function(x: number): number
  {
    return y0 + b * Math.sqrt(Math.abs(1 - Math.pow((x - x0), 2))/Math.pow(a, 2))
  }
}

export function randomInt(max: number): number;
export function randomInt(min: number, max: number): number;
export function randomInt(n: number, m?: number): number
{
  if(m === undefined)
  {
    return Math.floor(randomFloat(n));
  }
  else
  {
    return Math.floor(randomFloat(n, m));
  }
}

export function randomFloat(max: number): number;
export function randomFloat(min: number, max: number): number;
export function randomFloat(n: number, m?: number): number
{
  if(m === undefined)
  {
    return Math.random() * n;
  }
  else
  {
    return n + (Math.random() * (m - n + 1));
  }
}
