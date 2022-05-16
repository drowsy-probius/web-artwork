import React, { useCallback, useEffect, useRef } from "react";
import { WindowSize } from "../../@types";
import * as PIXI from 'pixi.js';

interface SolarSystemAppProps
{
  windowSize: WindowSize
}

export default function SolarSystemApp(props: SolarSystemAppProps)
{
  const windowSize = props.windowSize;
  const prevTime = useRef<number>(Date.now());
  const requestAnimationFrameRef = useRef<number>(-1);

  const renderer = useRef<PIXI.AbstractRenderer>();
  const stage = useRef<PIXI.Container>();

  const bunny: PIXI.Sprite = PIXI.Sprite.from('/bunny.png');
  
  const setBunny = useCallback(async () => {
    if(renderer.current === undefined || renderer.current === null) return;
    if(stage.current === undefined || stage.current === null) return;

    bunny.anchor.set(0.5);         // sprite의 원점 설정 [0, 1] 
    bunny.position.set(renderer.current.screen.width/2, renderer.current.screen.height/2);
    bunny.interactive = true;
    bunny.buttonMode = true;

    bunny.on('pointerdown', () => {
      bunny.scale.x *= 1.25;
      bunny.scale.y *= 1.25;
    });
    
    stage.current.addChild(bunny);
  }, [bunny]);


  const animate = useCallback(async (timestamp: number) => {
    if(renderer.current === undefined || renderer.current === null) return;
    const curTime = Date.now();
    const deltaTime = curTime - prevTime.current;
    const deltaFrame = deltaTime < 0 ? 0 : deltaTime * 60 / 1000;

    bunny.rotation += 0.1 * deltaFrame;

    renderer.current.render(bunny);

    prevTime.current = curTime;
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }, [bunny]);
  

  useEffect(() => {
    renderer.current = PIXI.autoDetectRenderer({
      width: windowSize.width,
      height: windowSize.height
    });
    stage.current = new PIXI.Container();
    document.getElementById('solar-system-app-root')?.appendChild(renderer.current.view);

    setBunny();

    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      stage.current?.removeChildren();
      stage.current?.destroy(true);
      renderer.current?.destroy(true);
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, [windowSize, animate, setBunny]);

  return (
    <div id="solar-system-app-root">
      hello?
    </div>
  )
}