import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Coordinate, orbitType } from '../../@types';
import { randomInt } from '../../utils';


export default class Orbit
{
  private perihelion: number;
  private aphelion: number;
  private moons: number;
  private ring: boolean;
  private mass: number;
  private density: number;
  private diameter: number;
  private sprite: PIXI.Sprite;

  constructor(orbitData: orbitType)
  {
    this.perihelion = orbitData.perihelion;
    this.aphelion = orbitData.aphelion;
    this.moons = orbitData.moons;
    this.ring = orbitData.ring;
    this.mass = orbitData.mass;
    this.density = orbitData.mass;
    this.diameter = orbitData.diameter;

    this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);


  }

  draw(viewport: Viewport)
  {
    this.sprite.anchor.set(0.5);
    this.sprite.alpha = 1;
    this.sprite.tint = randomInt(0xffffff);
    
    viewport.addChild(this.sprite);
  }
} 

