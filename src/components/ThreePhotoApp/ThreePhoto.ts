import * as PIXI from "pixi.js";
import { PIXIApplication } from "../usePIXI";

export default class ThreePhoto
{
  private app: PIXI.Application;

  constructor()
  {
    this.app = new PIXIApplication({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: devicePixelRatio,
    });


  }

  getView(): HTMLCanvasElement
  {
    return this.app.view;
  }
}