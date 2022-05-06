import React, { useEffect, useState } from 'react';
import {BrowserRouter, Link, Routes, Route} from 'react-router-dom';

import WaveApp from './components/WaveApp/WaveApp';
import SolarSystemApp from './components/SolarSystemApp/SolarSystemApp';
import MouseTrackerApp from './components/MouseTrackerApp/MouseTrackerApp';

import { WindowSize } from './@types';

import './App.scss';

function App() {
  const [windowSize, setWindowSize] = useState(getSize);

  function getSize(): WindowSize
  {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };
  }

  useEffect(()=>{
    const resizeHandler = ()=>{setWindowSize(getSize())};
    window.addEventListener('resize', resizeHandler);
  }, []);

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
          <Route path='/solarSystem' element={<SolarSystemApp/>}></Route>
          <Route path='/mouseTracker' element={<MouseTrackerApp windowSize={windowSize}/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
