import React from "react";
import { WindowSize } from "../../@types";
import { Stage, Text } from "@inlet/react-pixi"
import RotatingBunny from "./RotatingBunny";

interface ReactPIXIExample1AppProps
{
  windowSize: WindowSize,
}

/**
 * https://codesandbox.io/s/react-pixi-fiber-typescript-template-613ly?file=/src/App.tsx
 */
export default function ReactPIXIExample1App(props: ReactPIXIExample1AppProps){
  const windowSize = props.windowSize;

  return (
    <>
      <div style={{position: "fixed", bottom: "10px", padding: "15px"}}>
        <a href="https://codesandbox.io/s/react-pixi-fiber-typescript-template-613ly?file=/src/App.tsx">
          original source code
        </a>
      </div>
      <Stage width={windowSize.width} height={windowSize.height} options={{ backgroundColor: 0xcccccc }}>
        <Text x={100} y={100} text="Hello world!" ></Text>
        <RotatingBunny position="50,50"/>
      </Stage>
    </>

  );
}