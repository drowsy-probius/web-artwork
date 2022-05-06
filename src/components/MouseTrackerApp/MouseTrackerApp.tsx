import React, {useEffect, useRef} from "react";
import { WindowSize } from "../../@types";

import Stats from 'stats.js';

interface MouseTrackerAppProps{
  windowSize: WindowSize
}

export default function MouseTrackerApp(props: MouseTrackerAppProps)
{
  const stats = new Stats();
  document.getElementById('performance-stats')?.appendChild(stats.dom);

  const windowSize = props.windowSize;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestAnimationFrameRef = useRef(requestAnimationFrame(animate));

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    const context = canvas.getContext('2d');
    if(!context) return;
    
    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, [windowSize]);


  function animate(timestamp: number)
  {
    stats.begin();
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if(!canvas || !context) return;


    stats.end();
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }



  return (
    <div>
      <canvas ref={canvasRef} id="MouseTrackerApp">
        이 메시지가 보이면 브라우저가 HTML canvas를 지원하지 않는 것입니다.
      </canvas>
      <div id="performance-stats"></div>
    </div>
  );
}

