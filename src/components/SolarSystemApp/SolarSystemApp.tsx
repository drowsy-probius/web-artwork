import React, { useEffect, useRef } from "react";
import * as PIXI from 'pixi.js';
import { WindowSize } from "../../@types";
import ConsoleLogApp from "../ConsoleLogApp";

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
    <>
      <div id="pixi" ref={pixiAppRef}></div>
      <div style={{position: 'fixed', left: 0, bottom: '0px', backgroundColor: 'white'}}>
        <ConsoleLogApp />
      </div>
    </>
  )
}