import { PIXIApplication, PIXIViewport, PIXIGraphics, PIXIContainer } from "../usePIXI";
import { WindowSize, orbitsDataType } from "../../types";
import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import _orbitData from './orbit.json';
import { randomColorNumber } from "../../utils"
import Orbit from "./Orbit";


export default class SolarSystem
{
  private orbitData: orbitsDataType = _orbitData;
  private spaceColor: number = 0x1d2736;

  private app: PIXI.Application;
  private viewport: Viewport;

  private orbits: Array<Orbit>;
  private prevTime: number = 0;
  

  constructor()
  {

    this.app = new PIXIApplication({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      backgroundAlpha: 1,
      resolution: devicePixelRatio,  // for retina display
      backgroundColor: this.spaceColor,
    });

    this.viewport = new PIXIViewport({
      screenWidth: this.app.screen.width,
      screenHeight: this.app.screen.height,
      interaction: this.app.renderer.plugins.interaction
    });

    this.orbits = [];

    this.app.stage.addChild(this.viewport);

    this.setViewportConfiguration();
    this.drawSolarSystem();
  }

  getView(): HTMLCanvasElement
  {
    return this.app.view;
  }

  destroy()
  {
    this.viewport.destroy();
    this.app.destroy(true, true);
  }

  resize(target: HTMLElement | Window)
  {
    this.app.resizeTo = target;
  }

  animate(timestamp: number)
  {
    this.orbits.forEach(orbit => {
      orbit.animate(timestamp);
    });
    this.app.render();
    this.prevTime = timestamp;
  }

  private setViewportConfiguration()
  {
    this.viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate();
  }

  private drawSolarSystem()
  {
    this.orbits.forEach(orbit => {
      orbit.destroy();
    });

    for(const orbitName in this.orbitData)
    {
      const orbitdata = this.orbitData[orbitName];
      const color = randomColorNumber(false);

      const orbit = new Orbit(
        orbitdata,
        {width: this.app.screen.width, height: this.app.screen.height}
      );
      this.orbits.push(orbit);
      this.viewport.addChild(orbit.getContainer());
    }
  }

}

