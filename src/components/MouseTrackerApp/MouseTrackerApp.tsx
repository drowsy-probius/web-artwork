import React, {useEffect, useRef, useState} from "react";
import { WindowSize, Coordinate } from "../../@types";
import { useCanvas } from "../useCanvas";

import Stats from 'stats.js';
import CircleGroup from "./CircleGroup";
import { interpolateColor, isPositionPositive } from "../../functions";

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
  const CircleGroupRef = useRef<CircleGroup>(new CircleGroup(windowSize));

  /**
   * 최근 point로 마우스의 위치를 추적해볼 것임. 
   * 요소가 변하는 것이 아니라 canvas에서 그리는 방식으로 구현할 것이므로
   * rendering되지 않도록 useState가 아니라 useRef을 사용함. 
   * FIFO queue
   */
  const MaxRecentPoints = 300;
  const TimeLimitRecentPoints = 800;
  const recentPoints = useRef<RecentPoint[]>([]);

  const mousePosition = useRef<Coordinate>({x: -1, y: -1});
  const clickPosition = useRef<Coordinate>({x: -1, y: -1});
  const mouseLeft = useRef<Boolean>(false);

  const [canvasPosition, setCanvasPosition] = useState<Coordinate>(getCanvasPosition);
  

  useEffect(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    document.getElementById('performance-stats')?.appendChild(stats.dom);
    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);

      let perfStats = document.getElementById('performance-stats');
      if(perfStats !== undefined && perfStats !== null)
      {
        perfStats.innerHTML = '';
      }
    }
  }, []);

  useEffect(()=>{
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if(canvas === null || canvas === undefined || context === null || context === undefined) return;

    CircleGroupRef.current.resize({
      width: context.canvas.width,
      height: context.canvas.height
    });
    CircleGroupRef.current.draw(context, mousePosition.current);
    
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

    // context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = '#16202e';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // CircleGroupRef.current.draw(context, mousePosition.current);
    if(!mouseLeft.current)
    {
      context.save();
      context.filter = 'blur(10px)';
      context.beginPath();
      context.fillStyle = '#f0ffdb';
      context.arc(mousePosition.current.x, mousePosition.current.y, 40, 0, 2*Math.PI);
      context.fill();
      context.restore();
    }

    drawRecentPoints(context);

    stats.end();
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }

  function drawRecentPoints(context: CanvasRenderingContext2D)
  {
    /**
     * 맨 앞에 그리기
     */
    context.globalCompositeOperation = 'source-over';

    const colorFrom = '#075bedff';
    const colorTo = '#d6e5ff00';
    const now = Date.now();

    const points = recentPoints.current;

    for(let i=0; i<points.length - 1; i++)
    {
      if(now - points[i].timestamp > TimeLimitRecentPoints || 
        points[i].x < 0 || points[i].y < 0)
      {
        // recentPoints.current = [];
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
      context.lineWidth = 3;
      path.moveTo(points[i].x, points[i].y);
      path.lineTo(points[i+1].x, points[i+1].y);
      context.stroke(path);
    }
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
    </div>
  );
}

