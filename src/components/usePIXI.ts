import { RefObject, useEffect, useRef } from "react";
import { Coordinate, WindowSize } from "../@types";
import * as PIXI from 'pixi.js';


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


interface useSpriteOptions
{
  anchor?: Coordinate | number,
  position?: Coordinate,
  interactive?: boolean,
  buttonMode?: boolean,
}

/**
 * uri(로컬 주소 또는 웹 url)로부터 image를 불러오고
 * options에 맞춰서 해당 sprite의 옵션을 설정함.
 * 리액트 객체는 아님.
 *
 * @export
 * @param {PIXI.SpriteSource} uri
 * @param {useSpriteOptions} [options]
 * @return {*}  {PIXI.Sprite}
 */
export function getSpriteFromImg(uri: PIXI.SpriteSource, options?: useSpriteOptions): PIXI.Sprite
{
  const sprite: PIXI.Sprite = PIXI.Sprite.from(uri);

  if(options !== undefined)
  {
    if(options.anchor) 
    {
      if(typeof(options.anchor) === "number") sprite.anchor.set(options.anchor);
      else sprite.anchor.set(options.anchor.x, options.anchor.y);
    }

    if(options.position) sprite.position.set(
                            options.position.x,
                            options.position.y
                          );
    if(options.interactive !== undefined) sprite.interactive = options.interactive;
    if(options.buttonMode !== undefined) sprite.buttonMode = options.buttonMode;
  }

  return sprite;
}

export function getGraphics()
{
  const graphics = new PIXI.Graphics();

  return graphics;
}