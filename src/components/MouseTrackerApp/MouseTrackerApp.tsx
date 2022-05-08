import React, {useEffect, useRef, useState} from "react";
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
  const stats = new Stats();

  const windowSize = props.windowSize;

  const canvasRef = useCanvas(windowSize);

  const requestAnimationFrameRef = useRef<number>(-1);

  /**
   * 최근 point로 마우스의 위치를 추적해볼 것임. 
   * 요소가 변하는 것이 아니라 canvas에서 그리는 방식으로 구현할 것이므로
   * rendering되지 않도록 useState가 아니라 useRef을 사용함. 
   * FIFO queue
   */
  const MaxRecentPoints = 100;
  const TimeLimitRecentPoints = 800;
  const recentPoints = useRef<RecentPoint[]>([]);

  const mousePosition = useRef<Coordinate>({x: -1, y: -1});
  const clickPosition = useRef<Coordinate>({x: -1, y: -1});
  const mouseLeft = useRef<Boolean>(false);
  const mouseLeftTime = useRef<number>(-1);
  const trackerColor = new Color();
  trackerColor.aa = Math.max(trackerColor.aa, 128);

  const [tracerLine, setTracerLine] = useState<Boolean>(true);

  const [canvasPosition, setCanvasPosition] = useState<Coordinate>(getCanvasPosition);
  

  useEffect(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    document.getElementById('performance-stats')?.appendChild(stats.dom);

    function toggleTracer(event: MouseEvent)
    {
      event.preventDefault();
      event.stopPropagation();
      setTracerLine(!tracerLine);
    }
    const button = document.getElementById('toggle');
    if(button !== undefined && button !== null)
    {
      button.addEventListener('click', toggleTracer);
    }
    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);

      let perfStats = document.getElementById('performance-stats');
      if(perfStats !== undefined && perfStats !== null)
      {
        perfStats.innerHTML = '';
      }
      button?.removeEventListener('click', toggleTracer);
    }
  }, [tracerLine]);

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
    return () => {
      canvas.removeEventListener('mousemove', canvasMousemoveListener);
      canvas.removeEventListener('mouseup', canvasMouseclickListener);
      canvas.removeEventListener('mouseenter', canvasMouseenterListener);
      canvas.removeEventListener('mouseleave', canvasMouseleaveListener);
    }
  }, [windowSize]);


  /**
   * timestamp: 단위 ms
   * 1000.111ms
   */
  function animate(timestamp: number)
  {
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
        addRecentPoint({
          timestamp: Date.now(),
          x: Math.random() * context.canvas.width,
          y: Math.random() * context.canvas.height
        });
      }
      drawRecentPointsCircle(context);
    }
    trackerColor.animate();

    stats.end();
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }

  function drawRecentPointsCircle(context: CanvasRenderingContext2D)
  {
    /**
     * 맨 앞에 그리기
     */
    context.globalCompositeOperation = 'source-over';

    const colorFrom = trackerColor.toString();
    const colorTo = '#00000000';
    const now = Date.now();

    const points = recentPoints.current;

    context.save();
    for(let i=0; i<points.length; i++)
    {
      if(now - points[i].timestamp > TimeLimitRecentPoints || 
        points[i].x < 0 || points[i].y < 0)
      {
        // recentPoints.current = [];
        continue;
      }

      context.beginPath();
      context.filter = `blur(10px)`;
      context.fillStyle = interpolateColor(colorFrom, colorTo, i/points.length);
      context.arc(points[i].x, points[i].y, Math.min(20, 2/((now - points[i].timestamp)/TimeLimitRecentPoints)), 0, 2*Math.PI);
      context.fill();
    }
    context.restore();
  }

  function drawRecentPointsLine(context: CanvasRenderingContext2D)
  {
    /**
     * 맨 앞에 그리기
     */
    context.globalCompositeOperation = 'source-over';

    const colorFrom = trackerColor.toString();
    const colorTo = '#00000000';
    const now = Date.now();

    const points = recentPoints.current;

    context.save();
    for(let i=0; i<points.length - 1; i++)
    {
      if(now - points[i].timestamp > TimeLimitRecentPoints || 
        points[i].x < 0 || points[i].y < 0)
      {
        recentPoints.current = [];
        continue;
      }

      const colorStart = interpolateColor(colorFrom, colorTo, i/points.length);
      const colorEnd = interpolateColor(colorFrom, colorTo, (i+1)/points.length);

      const gradient = context.createLinearGradient(
        points[i].x, points[i].y,
        points[i+1].x+1, points[i+1].y+1
      );
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);   

      const path = new Path2D();
      context.strokeStyle = gradient;
      // context.filter = `blur(1px)`;
      context.lineWidth = 5;
      path.moveTo(points[i].x, points[i].y);
      path.lineTo(points[i+1].x, points[i+1].y);
      context.stroke(path);
    }
    context.restore();
  }

  function addRecentPoint(recentPoint: RecentPoint)
  {
    if(recentPoints.current.length >= MaxRecentPoints)
    {
      recentPoints.current = [...recentPoints.current.slice(1), recentPoint];
    }
    else
    {
      recentPoints.current = [...recentPoints.current, recentPoint];
    }
  }

  function canvasMouseenterListener(event: MouseEvent)
  {
    event.preventDefault();
    event.stopPropagation();

    mouseLeft.current = false;
  }

  function canvasMouseleaveListener(event: MouseEvent)
  {
    event.preventDefault();
    event.stopPropagation();

    mouseLeft.current = true;
    mouseLeftTime.current = Date.now();
  }

  function canvasMouseclickListener(event: MouseEvent)
  {
    event.preventDefault();
    event.stopPropagation();

    const pos: Coordinate = {
      x: event.clientX - canvasPosition.x,
      y: event.clientY - canvasPosition.y,
    };
    clickPosition.current = pos;

    console.log(`Cpos: (${pos.x}, ${pos.y})`);
  }

  function canvasMousemoveListener(event: MouseEvent)
  {
    event.preventDefault();
    event.stopPropagation();

    const pos: Coordinate = {
      x: event.clientX - canvasPosition.x,
      y: event.clientY - canvasPosition.y,
    };
    addRecentPoint({
      timestamp: Date.now(),
      x: pos.x,
      y: pos.y
    });
    mousePosition.current = pos;

    // console.log(`Mpos: (${pos.x}, ${pos.y})`);
  }

  function getCanvasPosition()
  {
    let pos: Coordinate = {
      x: 0,
      y: 0
    };
    const canvas = canvasRef.current;
    if(!canvas) return pos;
    pos.x = canvas.getBoundingClientRect().left;
    pos.y = canvas.getBoundingClientRect().top;
    return pos;
  }


  return (
    <div>
      <canvas ref={canvasRef} id="MouseTrackerApp" style={{zIndex: 1}}></canvas>
      <div id="performance-stats"></div>
      <button id="toggle" style={{position: 'fixed', right: 0, top: '10px'}}>{tracerLine ? "switch Circle" : "switch Line"}</button>
    </div>
  );
}

