import React, { useCallback, useEffect, useRef } from "react";
import { WindowSize } from "../../types";
import SolarSystem from "./SolarSystem";

interface SolarSystemAppProps
{
  windowSize: WindowSize
}

export default function SolarSystemApp(props: SolarSystemAppProps)
{
  const windowSize = props.windowSize;
  const SolarSystemRef = useRef<SolarSystem>();
  const requestAnimationFrameRef = useRef<number>(-1);

  const animate = useCallback(async (timestamp: number) => {
    const SolarSystem = SolarSystemRef.current;
    if(SolarSystem !== undefined)
    {
      SolarSystem.animate(timestamp);
    }

    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    SolarSystemRef.current?.destroy();
    SolarSystemRef.current = new SolarSystem();

    document.getElementById('solar-system-app-root')?.appendChild(
      SolarSystemRef.current.getView()
    )

    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, []);


  useEffect(() => {
    SolarSystemRef.current?.resize(window);

  }, [windowSize]);

  return (
    <div id="solar-system-app-root">

    </div>
  )
}
