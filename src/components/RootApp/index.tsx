import React from "react";
import { WindowSize } from "../../types"; 

interface RootAppProps
{
  windowSize: WindowSize,
}

export default function RootApp(props: RootAppProps) 
{
  return (
    <div className="root-app" style={{padding: '10px', top: "20px"}}>
      <a href="https://github.com/k123s456h/web-artwork">source code</a>
    </div>
  );
}