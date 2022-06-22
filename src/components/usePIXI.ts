import { RefObject, useEffect, useRef } from "react";
import { WindowSize } from "../types";
import { Viewport } from "pixi-viewport";
import * as PIXI from 'pixi.js';


export const PIXIApplication  = PIXI.Application;
export const PIXISprite       = PIXI.Sprite;
export const PIXIContainer    = PIXI.Container;
export const PIXIGraphics     = PIXI.Graphics;
export const PIXIText         = PIXI.Text;
export const PIXILoader       = PIXI.Loader;
export const PIXITextStyle    = PIXI.TextStyle;
export const PIXIFilters      = PIXI.filters;
export const PIXIViewport     = Viewport;



/**
 * windowSize가 변경될 때마다 resize하고 모든 listener를 제거함.
 *
 * @export
 * @param {WindowSize} windowSize
 * @param {PIXI.IRendererOptionsAuto} [options]
 * @return {*}  {RefObject<PIXI.AbstractRenderer>}
 */

export function useRenderer(windowSize: WindowSize, options?: PIXI.IRendererOptionsAuto): RefObject<PIXI.AbstractRenderer>
{
  const renderer = useRef<PIXI.AbstractRenderer>(
    PIXI.autoDetectRenderer({
      width: windowSize.width,
      height: windowSize.height,
      ...options
    })
  );

  useEffect(() => {
    const curentRenderer = renderer.current; 
    
    curentRenderer.resize(windowSize.width, windowSize.height);

    return () => {
      curentRenderer.removeAllListeners();
      
    }
  }, [windowSize]);

  return renderer;
}

/**
 * windowSize가 변경 될 때마다 
 * 현재 stage의 children 삭제하고 자신도 제거함. 
 * 그리고 새로운 Container를 할당함
 *
 * @export
 * @param {WindowSize} windowSize
 * @return {*}  {(RefObject<PIXI.Container | undefined>)}
 */
export function useStage(windowSize: WindowSize): RefObject<PIXI.Container>
{
  const stage = useRef<PIXI.Container>(new PIXI.Container());

  useEffect(() => {
    stage.current = new PIXI.Container();

    return () => {
      stage.current?.removeChildren();
      stage.current?.destroy(true);
    }
  }, [windowSize]);

  return stage;
}
