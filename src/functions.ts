import { Coordinate } from "./@types";

export class Color
{
  rr: number = 0;
  gg: number = 0;
  bb: number = 0;
  aa: number = 0;

  /**
   * @param color 
   * #rrggbbaa or #rrggbb
   */
  constructor(color: string)
  {
    if(color.length < 7)
    {
      throw new Error("invalid color format!");
    }

    this.rr = parseInt(color.slice(1, 3), 16);
    this.gg = parseInt(color.slice(3, 5), 16);
    this.bb = parseInt(color.slice(5, 7), 16);
    if(color.length === 7) return;
    if(color.length !== 9)
    {
      throw new Error("invalid color format!");
    }
    this.aa = parseInt(color.slice(7, 9), 16);
  }

  toString()
  {
    return `#${this.rr.toString(16).padStart(2, '0')}${this.gg.toString(16).padStart(2, '0')}${this.bb.toString(16).padStart(2, '0')}${this.aa.toString(16).padStart(2, '0')}`;
  }
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
 * @return {string} 
 * #rrggbbaa or #rrggbb
 * 
 */
export function interpolateColor(colorA: string, colorB: string, distance: number): string
{
  if(distance >= 1) return colorA;
  if(distance <= 0) return colorB;

  const color = new Color('#00000000');
  const cA = new Color(colorA);
  const cB = new Color(colorB);

  color.rr = Math.round(cB.rr + distance*(cA.rr - cB.rr));
  color.gg = Math.round(cB.gg + distance*(cA.gg - cB.gg));
  color.bb = Math.round(cB.bb + distance*(cA.bb - cB.bb));
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