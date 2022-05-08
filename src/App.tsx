import React, { useEffect, useState } from 'react';
import {BrowserRouter, Link, Routes, Route} from 'react-router-dom';

import WaveApp from './components/WaveApp/WaveApp';
import SolarSystemApp from './components/SolarSystemApp/SolarSystemApp';
import MouseTrackerApp from './components/MouseTrackerApp/MouseTrackerApp';

import { WindowSize } from './@types';

import './App.scss';

function App() {
  const [windowSize, setWindowSize] = useState({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  });

  useEffect(()=>{
    window.addEventListener('resize', windowResizeHandler);

    return () => {
      window.removeEventListener('resize', windowResizeHandler);
    }
  }, [window]);

  function windowResizeHandler(event: UIEvent)
  {
    setWindowSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    });
  }

  return (
    <BrowserRouter>
      <div id='navbar'>
        <ul>
          <li><Link to='/'>goto home</Link></li>
          <li><Link to='/wave'>goto wave</Link></li>
          <li><Link to='/solarSystem'>goto solar system</Link></li>
          <li><Link to='/mouseTracker'>goto mouse tracker</Link></li>
        </ul>
      </div>

      <div id='content'>
        <Routes>
          <Route path='/' element={<div>root page</div>}></Route>
          <Route path='/wave' element={<WaveApp windowSize={windowSize}/>} ></Route>
          <Route path='/solarSystem' element={<SolarSystemApp windowSize={windowSize}/>}></Route>
          <Route path='/mouseTracker' element={<MouseTrackerApp windowSize={windowSize}/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
