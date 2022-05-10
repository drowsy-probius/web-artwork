import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { WindowSize, Coordinate } from "../../@types";
import { useCanvas } from "../useCanvas";

import Stats from 'stats.js';
import { Color, interpolateColor } from "../../utils";

interface MouseTrackerAppProps{
  windowSize: WindowSize
}

interface RecentPoint extends Coordinate{
  timestamp: number
}

export default function MouseTrackerApp(props: MouseTrackerAppProps)
{
  const stats = useMemo(() => new Stats(), []);

  const windowSize = props.windowSize;

  const canvasRef = useCanvas(windowSize);

  const requestAnimationFrameRef = useRef<number>(-1);

  /**
   * 최근 point로 마우스의 위치를 추적해볼 것임. 
   * 요소가 변하는 것이 아니라 canvas에서 그리는 방식으로 구현할 것이므로
   * rendering되지 않도록 useState가 아니라 useRef을 사용함. 
   * FIFO queue
   */
  const MaxRecentPoints = 75;
  const TimeLimitRecentPoints = 800;
  const TimeIntervalRecentPoints = Math.floor(2 * TimeLimitRecentPoints / MaxRecentPoints);

  const recentPoints = useRef<RecentPoint[]>([]);

  const mousePosition = useRef<Coordinate>({x: -1, y: -1});
  const clickPosition = useRef<Coordinate>({x: -1, y: -1});
  const mouseLeft = useRef<Boolean>(false);
  const mouseLeftTime = useRef<number>(-1);
  const trackerColor = useRef<Color>(new Color());
  trackerColor.current.aa = Math.max(trackerColor.current.aa, 192);

  const [tracerLine, setTracerLine] = useState<Boolean>(true);
  const [useBlur, setUseBlur] = useState<Boolean>(false);

  const [canvasPosition, setCanvasPosition] = useState<Coordinate>({x: -1, y: -1});
  
  /***************************************** */

  const drawRecentPointsCircle = useCallback(async (context: CanvasRenderingContext2D) => {
    /**
     * 맨 앞에 그리기
     */
    context.globalCompositeOperation = 'source-over';

    const colorFrom = trackerColor.current.toString();
    const colorTo = '#00000000';
    const now = Date.now();

    const points = recentPoints.current;

    context.save();
    if(useBlur) context.filter = `blur(5px)`;
    for(let i=0; i<points.length; i++)
    {
      if(now - points[i].timestamp > TimeLimitRecentPoints || 
        points[i].x < 0 || points[i].y < 0)
      {
        // recentPoints.current = [];
        continue;
      }

      context.fillStyle = interpolateColor(colorFrom, colorTo, i/points.length);
      context.beginPath();
      context.arc(points[i].x, points[i].y, Math.min(25/devicePixelRatio, 2/((now - points[i].timestamp)/TimeLimitRecentPoints)), 0, 2*Math.PI);
      context.fill();
    }
    context.restore();
  }, [useBlur]);


  const drawRecentPointsLine = useCallback(async (context: CanvasRenderingContext2D) => {
    /**
     * 맨 앞에 그리기
     */
    context.globalCompositeOperation = "source-over";

    const colorFrom = trackerColor.current.toString();
    const colorTo = "#00000000";
    const now = Date.now();

    const points = recentPoints.current;

    context.save();
    if (useBlur) context.filter = `blur(3px)`;
    for (let i = 0; i < points.length - 1; i++) {
      if (
        now - points[i].timestamp > TimeLimitRecentPoints ||
        points[i].x < 0 ||
        points[i].y < 0
      ) {
        // recentPoints.current = [];
        continue;
      }

      const colorStart = interpolateColor(
        colorFrom,
        colorTo,
        i / points.length
      );
      const colorEnd = interpolateColor(
        colorFrom,
        colorTo,
        (i + 1) / points.length
      );

      const gradient = context.createLinearGradient(
        points[i].x,
        points[i].y,
        points[i + 1].x + 1,
        points[i + 1].y + 1
      );
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);

      const path = new Path2D();
      context.strokeStyle = gradient;
      context.lineWidth = 5;
      path.moveTo(points[i].x, points[i].y);
      path.lineTo(points[i + 1].x, points[i + 1].y);
      context.stroke(path);
    }
    context.restore();
  }, [useBlur]);


  const addRecentPoint = useCallback( (recentPoint: RecentPoint) => {
    if(recentPoints.current.length > 0)
    {
      const latestPoint = recentPoints.current[recentPoints.current.length - 1];
      const timeInterval = recentPoint.timestamp - latestPoint.timestamp;
      if(timeInterval < TimeIntervalRecentPoints) return;
    }

    if(recentPoints.current.length >= MaxRecentPoints)
    {
      recentPoints.current = [...recentPoints.current.slice(1), recentPoint];
    }
    else
    {
      recentPoints.current = [...recentPoints.current, recentPoint];
    }
  }, [TimeIntervalRecentPoints]);


  const canvasMouseenterListener = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    mouseLeft.current = false;
  }, []);


  const canvasMouseleaveListener = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    mouseLeft.current = true;
    mouseLeftTime.current = Date.now();
  }, []);


  const canvasMouseclickListener = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const pos: Coordinate = {
      x: event.clientX - canvasPosition.x,
      y: event.clientY - canvasPosition.y,
    };
    clickPosition.current = pos;

    console.log(`Cpos: (${pos.x}, ${pos.y})`);
  }, [canvasPosition]);


  const canvasMousemoveListener = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const pos: Coordinate = {
      x: (event.clientX - canvasPosition.x),
      y: (event.clientY - canvasPosition.y),
    };
    addRecentPoint({
      timestamp: Date.now(),
      x: pos.x,
      y: pos.y
    });
    mousePosition.current = pos;

    // console.log(`Mpos: (${pos.x}, ${pos.y})`);
  }, [addRecentPoint, canvasPosition]);


  const canvasTouchmoveListener = useCallback((event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    const touches = event.changedTouches;

    for(let i=0; i<touches.length; i++)
    {
      const pos: Coordinate = {
        x: (touches[i].clientX - canvasPosition.x),
        y: (touches[i].clientY - canvasPosition.y),
      };
      addRecentPoint({
        timestamp: now,
        x: pos.x,
        y: pos.y
      });
      mousePosition.current = pos;
    }
  }, [addRecentPoint, canvasPosition]);


  const canvasTouchstartListener = useCallback((event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();

    mouseLeft.current = false;
  }, []);


  const canvasTouchendListener = useCallback((event: TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();


    const touches = event.changedTouches;

    mouseLeft.current = true;

    for(let i=0; i<touches.length; i++)
    {
      const pos: Coordinate = {
        x: (touches[i].clientX - canvasPosition.x),
        y: (touches[i].clientY - canvasPosition.y),
      };
      clickPosition.current = pos;
      console.log(`Cpos: (${pos.x}, ${pos.y})`);
    }
  }, [canvasPosition]);


  const getCanvasPosition = useCallback(() => {
    let pos: Coordinate = {
      x: 0,
      y: 0
    };
    const canvas = canvasRef.current;
    if(!canvas) return pos;
    pos.x = canvas.getBoundingClientRect().left;
    pos.y = canvas.getBoundingClientRect().top;
    return pos;
  }, [canvasRef]);


  /**
   * timestamp: 단위 ms
   * 1000.111ms
   */
   const animate = useCallback(async (timestamp: number) => {
    stats.begin();
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if(canvas === null || canvas === undefined || context === null || context === undefined) return;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // background
    context.fillStyle = '#16202e';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    if(tracerLine)
    {
      drawRecentPointsLine(context);
    }
    else
    {
      if(mouseLeft.current === true && (Date.now() - mouseLeftTime.current) >= TimeLimitRecentPoints)
      {
        let coord: Coordinate = {
          x: Math.random() * context.canvas.width,
          y: Math.random() * context.canvas.height,
        }
        addRecentPoint({
          timestamp: Date.now(),
          ...coord
        });
      }
      drawRecentPointsCircle(context);
    }
    trackerColor.current.animate();
    // console.log(trackerColor.current.toString());

    stats.end();
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }, [canvasRef, drawRecentPointsCircle, drawRecentPointsLine, stats, tracerLine, addRecentPoint]);

  
  useEffect(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    document.getElementById('performance-stats')?.appendChild(stats.dom);

    function toggleTracer(event: MouseEvent)
    {
      event.preventDefault();
      event.stopPropagation();
      setTracerLine(!tracerLine);
      mouseLeft.current = true;
      recentPoints.current = [];
    }
    function toggleUseBlur(event: MouseEvent)
    {
      event.preventDefault();
      event.stopPropagation();
      setUseBlur(!useBlur);
    }
    const button = document.getElementById('toggle');
    const buttonBlur = document.getElementById('toggle-blur');
    if(button !== undefined && button !== null)
    {
      button.addEventListener('click', toggleTracer);
    }
    if(buttonBlur !== undefined && buttonBlur !== null)
    {
      buttonBlur.addEventListener('click', toggleUseBlur);
    }
    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);

      let perfStats = document.getElementById('performance-stats');
      if(perfStats !== undefined && perfStats !== null)
      {
        perfStats.innerHTML = '';
      }
      button?.removeEventListener('click', toggleTracer);
      buttonBlur?.removeEventListener('click', toggleUseBlur);
    }
  }, [tracerLine, useBlur, animate, stats.dom]);


  useEffect(()=>{
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if(canvas === null || canvas === undefined || context === null || context === undefined) return;

    setCanvasPosition(getCanvasPosition());

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    canvas.addEventListener('mousemove', canvasMousemoveListener);
    canvas.addEventListener('mouseup', canvasMouseclickListener);
    canvas.addEventListener('mouseenter', canvasMouseenterListener);
    canvas.addEventListener('mouseleave', canvasMouseleaveListener);

    canvas.addEventListener('touchmove', canvasTouchmoveListener);
    canvas.addEventListener('touchstart', canvasTouchstartListener);
    canvas.addEventListener('touchend', canvasTouchendListener);
    return () => {
      canvas.removeEventListener('mousemove', canvasMousemoveListener);
      canvas.removeEventListener('mouseup', canvasMouseclickListener);
      canvas.removeEventListener('mouseenter', canvasMouseenterListener);
      canvas.removeEventListener('mouseleave', canvasMouseleaveListener);

      canvas.removeEventListener('touchmove', canvasTouchmoveListener);
      canvas.removeEventListener('touchstart', canvasTouchstartListener);
      canvas.removeEventListener('touchend', canvasTouchendListener);
    }
  }, [windowSize, canvasMouseclickListener, canvasMouseenterListener, canvasMousemoveListener, canvasMouseleaveListener,
  canvasTouchmoveListener, canvasTouchstartListener, canvasTouchendListener, canvasRef, getCanvasPosition]);


  return (
    <div>
      <canvas ref={canvasRef} id="MouseTrackerApp" style={{zIndex: 1}}></canvas>
      <div id="performance-stats"></div>
      <button id="toggle" style={{position: 'fixed', right: 0, bottom: '50px'}}>{tracerLine ? "switch Circle" : "switch Line"}</button>
      <button id="toggle-blur" style={{position: 'fixed', right: 0, bottom: '0px'}}>{useBlur ? "disable blur" : "[!] enable blur"}</button>
    </div>
  );
}

