import React, { useEffect, useRef } from "react";
import * as PIXI from 'pixi.js';
import { WindowSize } from "../../@types";

interface SolarSystemAppProps
{
  windowSize: WindowSize
}


export default function SolarSystemApp(props: SolarSystemAppProps)
{
  const windowSize = props.windowSize;
  const pixiAppRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pixiApp = new PIXI.Application({resizeTo: window});
    pixiAppRef.current?.appendChild(pixiApp.view);
    pixiApp.start();
    return () => {
      pixiApp.destroy(true, true);
    }
  }, []);


  return (
    <div id="pixi" ref={pixiAppRef}></div>
  )
}