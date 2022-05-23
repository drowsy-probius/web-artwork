import { Viewport } from "pixi-viewport";
import React, { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { WindowSize, orbitsDataType, Coordinate } from "../../@types";
import { getGraphics, getPIXIApp, getSpriteFromImg, useRenderer, useStage, useViewport } from '../usePIXI';
import _orbitData from './orbit.json';

const orbitData: orbitsDataType = _orbitData;
const spaceColor: number = 0x1d2736;
const app = getPIXIApp();
const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  interaction: app.renderer.plugins.interaction
});
app.stage.addChild(viewport);
viewport
  .drag()
  .pinch()
  .wheel()
  .decelerate();


interface SolarSystemAppProps
{
  windowSize: WindowSize
}

export default function SolarSystemApp(props: SolarSystemAppProps)
{
  const windowSize = props.windowSize;
  const requestAnimationFrameRef = useRef<number>(-1);


  const animate = useCallback(async (timestamp: number) => {



    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const appRoot = document.getElementById("solar-system-app-root");
    if(appRoot === null ) return;

    appRoot.appendChild(app.view);
    
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      appRoot.removeChild(app.view);

      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  }, [
    viewport,
    animate
  ]);

  useEffect(() => {

    viewport.resize(windowSize.width, windowSize.height);
    

  }, [windowSize, viewport]);

  return (
    <div id="solar-system-app-root">

    </div>
  )
}

function configureViewport(viewport: RefObject<Viewport>): void
{
  if(viewport.current === null) return;

  viewport.current
        .drag({
            // direction: 'all',                // (x, y, or all) direction to drag
            // pressDrag: true,                 // whether click to drag is active
            // wheel: true,                     // use wheel to scroll in direction (unless wheel plugin is active)
            // wheelScroll: 1,                  // number of pixels to scroll with each wheel spin
            // reverse: false,                  // reverse the direction of the wheel scroll
            // clampWheel: false,               // clamp wheel (to avoid weird bounce with mouse wheel)
            // underflow: 'center',             // (top-left, top-center, etc.) where to place world if too small for screen
            // factor: 1,                       // factor to multiply drag to increase the speed of movement
            // mouseButtons: 'all',             // changes which mouse buttons trigger drag, use: 'all', 'left', right' 'middle', or some combination, like, 'middle-right'; you may want to set viewport.options.disableOnContextMenu if you want to use right-click dragging
            // keyToPress: null,                // array containing https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code codes of keys that can be pressed for the drag to be triggered, e.g.: ['ShiftLeft', 'ShiftRight'}
            // ignoreKeyToPressOnTouch: false,  // ignore keyToPress for touch events
            // lineHeight: 20,                  // scaling factor for non-DOM_DELTA_PIXEL scrolling events (used for firefox mouse scrolling)
        })
        .decelerate({
            // friction: 0.95,              // percent to decelerate after movement
            // bounce: 0.8,                 // percent to decelerate when past boundaries (only applicable when viewport.bounce() is active)
            // minSpeed: 0.01,              // minimum velocity before stopping/reversing acceleration
        })
        .pinch({
            // noDrag: false,               // disable two-finger dragging
            // percent: 1,                  // percent to modify pinch speed
            // factor: 1,                   // factor to multiply two-finger drag to increase the speed of movement
            // center: null,                // place this point at center during zoom instead of center of two fingers
            // axis: 'all',                 // axis to zoom
        })
        .wheel({
            // percent: 0.1,                // smooth the zooming by providing the number of frames to zoom between wheel spins
            // interrupt: true,             // stop smoothing with any user input on the viewport
            // reverse: false,              // reverse the direction of the scroll
            // center: null,                // place this point at center during zoom instead of current mouse position
            // lineHeight: 20,	            // scaling factor for non-DOM_DELTA_PIXEL scrolling events
            // axis: 'all',                 // axis to zoom
        });
}