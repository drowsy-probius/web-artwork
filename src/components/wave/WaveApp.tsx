import { useEffect, useRef, useState } from 'react';

import { WindowSize, Coordinate } from '../../@types';

import WaveGroup from './WaveGroup';

interface WaveAppProps {
  windowSize: WindowSize,
}

interface Star{
  coord: Coordinate,
  size: number
}


export default function WaveApp(props: WaveAppProps, )
{
  const windowSize = props.windowSize;
  const requestAnimationFrameRef = useRef(requestAnimationFrame(animate));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveGroupRef = useRef<WaveGroup>(new WaveGroup({
    x: windowSize.width,
    y: windowSize.height
  }, 5));
  const [stars, setStars] = useState<Array<Star>>([]);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    const context = canvas?.getContext('2d');

    if(!context) return;

    makeStars(windowSize);

    context.scale(2, 2);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    waveGroupRef.current = new WaveGroup({
      x: windowSize.width,
      y: windowSize.height
    }, Math.floor(canvas.width/200));

    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, [windowSize]);


  function animate(timestamp: number)
  {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if(!canvas || !context) return;
    const waveGroup = waveGroupRef.current;

    // console.log('animate function called');

    context.clearRect(0, 0, windowSize.width, windowSize.height);
    drawBackground(context);
    drawStars(context, (timestamp / 700) * Math.PI/180);

    waveGroup.draw(context);

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

  function drawStars(context: CanvasRenderingContext2D, angle: number)
  {
    context.rotate(angle);
    context.translate(-windowSize.width, -windowSize.height);
    context.fillStyle = "#bfb900";
    stars.forEach(s => {
      context.fillRect(s.coord.x, s.coord.y, s.size, s.size);
    });
    // Reset transformation matrix to the identity matrix
    context.setTransform(1, 0, 0, 1, 0, 0);
  }

  return (
    <div>
      <canvas ref={canvasRef} id='WaveApp'>
        This text is displayed if your browser does not support HTML5 Canvas.
      </canvas>
    </div>
  );
}