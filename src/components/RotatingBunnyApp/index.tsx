import React, { useCallback, useEffect, useRef } from "react";
import { WindowSize } from "../../@types";
import * as PIXI from 'pixi.js';

interface RotatingBunnyAppProps
{
  windowSize: WindowSize
}

export default function RotatingBunnyApp(props: RotatingBunnyAppProps)
{
  const windowSize = props.windowSize;
  const prevTime = useRef<number>(Date.now());
  const requestAnimationFrameRef = useRef<number>(-1);

  const renderer = useRef<PIXI.AbstractRenderer>(PIXI.autoDetectRenderer({
    width: windowSize.width,
    height: windowSize.height
  }));
  const stage = useRef<PIXI.Container>(new PIXI.Container());

  const bunny: PIXI.Sprite = PIXI.Sprite.from('/bunny.png');
  
  const setBunny = useCallback(async () => {
    if(renderer.current === undefined || renderer.current === null) return;
    if(stage.current === undefined || stage.current === null) return;

    bunny.anchor.set(0.5);         // sprite의 원점 설정 [0, 1] 
    bunny.position.set(renderer.current.screen.width/2, renderer.current.screen.height/2);
    bunny.interactive = true;
    bunny.buttonMode = true;

    bunny.on('pointerup', (event: PointerEvent) => {
      bunny.scale.x *= 1.25;
      bunny.scale.y *= 1.25;

      console.log(bunny.width, bunny.height);
    });
    
    stage.current.addChild(bunny);
  }, [bunny]);


  const animate = useCallback(async (timestamp: number) => {
    if(renderer.current === undefined || renderer.current === null) return;
    if(stage.current === undefined || stage.current === null) return;
    
    const curTime = Date.now();
    const deltaTime = curTime - prevTime.current;
    const deltaFrame = deltaTime < 0 ? 0 : deltaTime * 60 / 1000;

    bunny.rotation += 0.1 * deltaFrame;

    renderer.current.render(stage.current);

    prevTime.current = curTime;
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }, [bunny]);
  

  useEffect(() => {
    renderer.current.resize(windowSize.width, windowSize.height);

    setBunny();
    document.getElementById('rotating-bunny-app-root')?.appendChild(renderer.current.view);

    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      bunny.removeAllListeners();
      stage.current.removeChildren();
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, [windowSize, bunny, animate, setBunny]);

  return (
    <div id="rotating-bunny-app-root">
    </div>
  )
}