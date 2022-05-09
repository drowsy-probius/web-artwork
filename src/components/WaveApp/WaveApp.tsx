import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { WindowSize, Coordinate } from '../../@types';
import WaveGroup from './WaveGroup';
import { useCanvas } from '../useCanvas';

import Stats from 'stats.js'

interface WaveAppProps {
  windowSize: WindowSize,
}

interface Star{
  coord: Coordinate,
  size: number
}

export default function WaveApp(props: WaveAppProps)
{
  const stats = useMemo(() => new Stats(), []);
  const windowSize = props.windowSize;
  const requestAnimationFrameRef = useRef<number>(-1);
  const canvasRef = useCanvas(windowSize);
  const waveGroupRef = useRef<WaveGroup>();
  const starsRef = useRef<Star[]>([]);


  function drawBackground(context: CanvasRenderingContext2D)
  {
    context.fillStyle = '#00181f';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }


  function makeStars(windowSize: WindowSize)
  {
    const numberOfStars = Math.floor(windowSize.width * windowSize.height / 500);

    let starArray: Array<Star> = [];
    for(let i=0; i<numberOfStars; i++)
    {
      const starSize = Math.random() * 1.0 + 0.5;

      let star: Star = {
        coord: {
          x: Math.floor(Math.random() * (windowSize.width * 4)),
          y: Math.floor(Math.random() * (windowSize.height * 4))
        },
        size: starSize
      };
      starArray[i] = star;
    }
    starsRef.current = [...starArray];
    console.log(`number of stars: ${numberOfStars}`);
  }


  const drawStars = useCallback((context: CanvasRenderingContext2D, radian: number) =>{
    context.save();
    context.rotate(radian);
    context.translate(-windowSize.width, -windowSize.height);
    context.fillStyle = "#bfb900";
    starsRef.current.forEach(s => {
      context.fillRect(s.coord.x, s.coord.y, s.size, s.size);
    });
    // Reset transformation matrix to the identity matrix
    // context.setTransform(1, 0, 0, 1, 0, 0);
    context.restore();
  }, [windowSize]);


  const animate = useCallback((timestamp: number) => {
    stats.begin();

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if(!canvas || !context) return;
    const waveGroup = waveGroupRef.current;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    drawBackground(context);
    drawStars(context, -(timestamp / 1000) * Math.PI/180);

    waveGroup?.draw(context);

    stats.end();
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }, [canvasRef, drawStars, stats]);


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
  }, [animate, stats.dom]);


  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    makeStars(windowSize);

    waveGroupRef.current = new WaveGroup({
      x: windowSize.width,
      y: windowSize.height
    }, Math.floor(canvas.width/200));
    // waveGroupRef.current.resize({
    //   x:windowSize.width,
    //   y:windowSize.height
    // });

    return () => {
    }
  }, [windowSize, canvasRef]);


  return (
    <div>
      <canvas ref={canvasRef} id='WaveApp'>
        This text is displayed if your browser does not support HTML5 Canvas.
      </canvas>
      <div id='performance-stats'></div>
      {/* <audio src="https://github.com/k123s456h/web-artwork/raw/main/public/Waves-sound-effect.mp3" controls autoPlay loop>
        <p>
        Audio file from here:

        Hello,
        Stock audio - Free sound effects, loops and music.
        There are no hidden costs or need to sign-up. 
        Licence: The sound effect is permitted for commercial use under license Creative Commons Attribution 4.0 International License
        http://www.orangefreesounds.com/ 
        </p>
      </audio> */}
    </div>
  );
}