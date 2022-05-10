import React, { useEffect, useState } from 'react';
import {BrowserRouter, Link, Routes, Route} from 'react-router-dom';

import { WindowSize } from './@types';

import RootApp from './components/RootApp';
import WaveApp from './components/WaveApp';
import SolarSystemApp from './components/SolarSystemApp';
import MouseTrackerApp from './components/MouseTrackerApp';
import ConsoleLogApp from './components/ConsoleLogApp';
import ReactPIXIExample1App from './components/ReactPIXIExample1App';

import './App.scss';


function App() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  });
  const [renderChildren, setRenderChildren] = useState<Boolean>(false);


  useEffect(()=>{
    window.addEventListener('resize', windowResizeHandler);
    
    setRenderChildren(true);
    return () => {
      window.removeEventListener('resize', windowResizeHandler);
    }
  }, []);

  function windowResizeHandler(event: UIEvent)
  {
    setWindowSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
  }

  return (
    <>
      {
        renderChildren 
        ? 
        <>
          <ConsoleLogApp/>
          <BrowserRouter>
            <div id='navbar'>
              <ul>
                <li><Link to='/'>home</Link></li>
                <li><Link to='/wave'>wave</Link></li>
                <li><Link to='/mouseTracker'>mouse tracker</Link></li>
                <li><Link to='/solarSystem'>solar system (not completed)</Link></li>
                <li><Link to='/react-pixi-1'>react pixi 1 (not completed)</Link></li>
              </ul>
            </div>

            <div id='content'>
              <Routes>
                <Route path='/' element={<RootApp windowSize={windowSize} />}></Route>
                <Route path='/wave' element={<WaveApp windowSize={windowSize}/>} ></Route>
                <Route path='/mouseTracker' element={<MouseTrackerApp windowSize={windowSize}/>}></Route>
                <Route path='/solarSystem' element={<SolarSystemApp windowSize={windowSize}/>}></Route>
                <Route path='/react-pixi-1' element={<ReactPIXIExample1App windowSize={windowSize}/>}></Route>
              </Routes>
            </div>
          </BrowserRouter>
        </>
        :
        "loading..."
      }
    </>
  );
}

export default App;
