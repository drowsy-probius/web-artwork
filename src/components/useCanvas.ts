/**
 * reference: 
 * https://blog.dalgu.app/dev/1
 */

import { RefObject, useEffect, useRef } from "react";
import { WindowSize } from "../@types";

export function useCanvas(windowSize: WindowSize): RefObject<HTMLCanvasElement>
{
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const context = canvas.getContext('2d');
    if(!context) return;

    // canvas의 크기는 그대로 유지
    canvas.style.width = windowSize.width + "px";
    canvas.style.height = windowSize.height + "px";

    // pixel 수 늘려서 선명하게 보이도록 함.
    canvas.width = windowSize.width * devicePixelRatio;
    canvas.height = windowSize.height * devicePixelRatio;
    context.scale(devicePixelRatio, devicePixelRatio);
  }, [windowSize]);

  return canvasRef;
}