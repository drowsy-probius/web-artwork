import React, { useEffect, useRef, useState } from 'react';
import { WindowSize, Coordinate } from '../../@types';
import WaveGroup from './WaveGroup';

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
  const stats = new Stats();
  const windowSize = props.windowSize;
  const requestAnimationFrameRef = useRef(requestAnimationFrame(animate));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveGroupRef = useRef<WaveGroup>(new WaveGroup({
    x: windowSize.width,
    y: windowSize.height
  }, 5));
  const [stars, setStars] = useState<Array<Star>>([]);

  document.getElementById('performance-stats')?.appendChild(stats.dom);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    const context = canvas?.getContext('2d');

    if(!context) return;

    makeStars(windowSize);

    context.scale(1, 1);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // waveGroupRef.current = new WaveGroup({
    //   x: windowSize.width,
    //   y: windowSize.height
    // }, Math.floor(canvas.width/200));
    waveGroupRef.current.resize({
      x:windowSize.width,
      y:windowSize.height
    })

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
    const waveGroup = waveGroupRef.current;

    context.clearRect(0, 0, windowSize.width, windowSize.height);
    drawBackground(context);
    drawStars(context, -(timestamp / 1000) * Math.PI/180);

    waveGroup.draw(context, {
      x: windowSize.width,
      y: windowSize.height
    });

    stats.end();
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }

  function drawBackground(context: CanvasRenderingContext2D)
  {
    context.fillStyle = '#00181f';
    context.fillRect(0, 0, windowSize.width, windowSize.height);
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
    setStars([...starArray]);
    console.log(`number of stars: ${numberOfStars}`);
  }

  function drawStars(context: CanvasRenderingContext2D, radian: number)
  {
    context.save();
    context.rotate(radian);
    context.translate(-windowSize.width, -windowSize.height);
    context.fillStyle = "#bfb900";
    stars.forEach(s => {
      context.fillRect(s.coord.x, s.coord.y, s.size, s.size);
    });
    // Reset transformation matrix to the identity matrix
    // context.setTransform(1, 0, 0, 1, 0, 0);
    context.restore();
  }

  return (
    <div>
      <canvas ref={canvasRef} id='WaveApp'>
        This text is displayed if your browser does not support HTML5 Canvas.
      </canvas>
      <div id='performance-stats'>

      </div>
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