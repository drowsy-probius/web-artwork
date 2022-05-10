import React from "react";
import { WindowSize } from "../../@types";
import { Stage } from "@inlet/react-pixi";
import * as PIXI from 'pixi.js';

interface SolarSystemAppProps
{
  windowSize: WindowSize
}

export default function SolarSystemApp(props: SolarSystemAppProps)
{
  const windowSize = props.windowSize;
  
  return (
    <>
      <Stage width={windowSize.width} height={windowSize.height} options={{ backgroundColor: 0x00000f }}>

      </Stage>
    </>
  )
}