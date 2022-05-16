import React, { useCallback, useEffect, useRef } from "react";
import { WindowSize } from "../../@types";
import { getGraphics, getSpriteFromImg, useRenderer, useStage } from '../usePIXI';
import _orbitData from './orbit.json';

interface orbitDataType
{
  [key: string]: {
    perihelion: number,
    aphelion: number,
    moons: number,
    ring: boolean,
    mass: number,
    density: number,
    diameter: number
  }
}
const orbitData: orbitDataType = _orbitData;


interface SolarSystemAppProps
{
  windowSize: WindowSize
}

export default function SolarSystemApp(props: SolarSystemAppProps)
{
  const windowSize = props.windowSize;
  const requestAnimationFrameRef = useRef<number>(-1);
  const prevTime = useRef<number>(Date.now());

  const renderer = useRenderer(windowSize, {
    backgroundColor: 0xffffff,
  });
  const stage = useStage(windowSize);
  const bunny = getSpriteFromImg('/bunny.png', {
    anchor: 0.5,
    position: {
      x: windowSize.width/2,
      y: windowSize.height/2
    },
    interactive: true,
    buttonMode: true
  });

  const graphics = getGraphics();

  const animate = useCallback(async (timestamp: number) => {
    const currentRenderer = renderer.current;
    const currentStage = stage.current;
    if(currentRenderer === null || currentStage === null) return;

    const curTime = Date.now();
    const deltaTime = curTime - prevTime.current;
    const deltaFrame = deltaTime < 0 ? 0 : deltaTime * 60 / 1000;

    bunny.rotation += 0.1 * deltaFrame;

    currentRenderer.render(currentStage);

    prevTime.current = curTime;
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }, [renderer, stage, bunny]);

  useEffect(() => {
    const currentRenderer = renderer.current;
    const currentStage = stage.current;
    if(currentRenderer === null || currentStage === null) return;

    bunny.on('pointerup', (event: PointerEvent) => {
      bunny.scale.x *= 1.25;
      bunny.scale.y *= 1.25;

      console.log(bunny.width, bunny.height);
    });

    
    const color = 0x000000
    for(const planetName in orbitData)
    {
      graphics.lineStyle(2, color + Math.random()*16581375, 1);
      const planet = orbitData[planetName];
      console.log(planet);
      graphics.drawEllipse(
        currentRenderer.width/2, 
        currentRenderer.height/2, 
        planet.perihelion, 
        planet.aphelion
      );
    }
    

    currentStage.addChild(graphics);
    // currentStage.addChild(bunny);

    document.getElementById('solar-system-app-root')?.appendChild(currentRenderer.view);
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, [windowSize, animate, renderer, stage, bunny]);

  return (
    <div id="solar-system-app-root">

    </div>
  )
}