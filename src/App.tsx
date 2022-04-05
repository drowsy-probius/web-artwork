import React, { useEffect, useState } from 'react';
import {BrowserRouter, Link, Routes, Route} from 'react-router-dom';

import WaveApp from './components/wave/WaveApp';

import { WindowSize } from './@types';

import './App.scss';

function App() {
  const [windowSize, setWindowSize] = useState(getSize);

  function getSize(): WindowSize
  {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
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
          <li><Link to='/solar-system'>goto solar-system</Link></li>
        </ul>
      </div>

      <div id='content'>
        <Routes>
          <Route path='/' element={<div>main page</div>}></Route>
          <Route path='/wave' element={<WaveApp windowSize={windowSize}/>} ></Route>
          <Route path='/solar-system' element={<div>solar-system</div>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
