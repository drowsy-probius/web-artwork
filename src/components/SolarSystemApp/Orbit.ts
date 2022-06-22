import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { InteractionEvent } from 'pixi.js';
import { orbitType, WindowSize } from '../../types';
import { randomColorNumber, ellipseEquation } from '../../utils';
import { PIXIContainer, PIXIGraphics, PIXIText } from '../usePIXI';


export default class Orbit
{
  private data: orbitType;

  private color: number;
  private windowSize: WindowSize;

  private planetXDirection: number = 1;
  private equation: Function;

  private container: PIXI.Container;
  private planet: PIXI.Graphics;
  private orbit: PIXI.Graphics;
  private tag: PIXI.Text;
  private etc: Array<PIXI.Graphics>;

  constructor(orbitData: orbitType, windowSize: WindowSize, color?: number)
  {
    this.data = orbitData;
    this.windowSize = windowSize;

    if(color !== undefined) this.color = color;
    else this.color = randomColorNumber(false);

    this.equation = ellipseEquation(
      this.data.perihelion,
      this.data.aphelion,
      this.windowSize.width/2,
      this.windowSize.height/2
    );

    this.container = new PIXIContainer();
    this.planet = new PIXIGraphics();
    this.orbit = new PIXIGraphics();
    this.container.name = this.data.name;
    this.tag = new PIXIText(this.data.name);
    this.etc = [];

    if(this.data.name === "moon") return;
    this.draw();
    this.setListener();
  }

  destroy()
  {
    this.container.destroy(true);
  }

  getContainer()
  {
    return this.container;
  }

  animate(timestamp: number)
  {
    /**
     * a = this.perihelion => x
     * b = this.aphelion  => y
     * 
     * 위로 길쭉한 타원
     */

    const angle = timestamp / this.data.period;

    const a = this.data.perihelion;
    const b = this.data.aphelion;
    const e = Math.sqrt(b*b - a*a)/b;

    const r = a * (1 - e*e) / (1 + e * Math.cos(angle));
    const c = Math.sqrt(b*b - a*a);

    // this.planet.x = r * Math.cos(angle);
    // this.planet.y = r * Math.sin(angle);

    this.tag.x = this.planet.x;
    this.tag.y = this.planet.y;

    // this.planet.rotation = timestamp / this.data.period;
    // this.container.rotation = timestamp / this.data.period;
  }

  private setContainer()
  {
    this.planet.addChild(this.tag);
    const graphics = [this.planet, this.orbit, ...this.etc];
    this.container.addChild(...graphics);
  }


  private draw()
  {
    this.setContainer();

    this.container.position.set(
      this.windowSize.width/2,
      this.windowSize.height/2
    );

    this.planet.position.set(this.data.perihelion, 0);
    this.planet
    .beginFill(this.color)
    .drawCircle(
      0,
      0,
      Math.min(Math.max(this.data.diameter / 2000, 5), 25)
    )
    .endFill();

    if(this.data.name !== "sun")
    {
      
      this.orbit
      .lineStyle({width: 2, color: this.color, alpha: 1})
      .drawEllipse(
        0,
        0,
        this.data.perihelion,
        this.data.aphelion
      );
    }

    this.tag.anchor.set(0.5);
    this.tag.position.set(0, 0);
    this.tag.style.fill = this.color;
  }

  private setListener()
  {
    this.container.interactive = true;
    this.container.on('click', (event: InteractionEvent) => {
      console.log(this.data.name);
      console.log(event.data.global);
    });

  }


} 

