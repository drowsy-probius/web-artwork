import React, { useEffect, useRef, useState } from "react";
import { isMobile, MobileView } from "react-device-detect";

export default function ConsoleLogApp()
{
  const LIMIT = 7;
  const [log, setLog] = useState<string[]>([]);
  const buffer = useRef<string[]>([]);

  if(isMobile)
  {
    console.log = function(...args){
      args.forEach(e => {
        buffer.current = [...buffer.current, `[i] ${e}`];
      })
    }

    console.info = function(...args){
      args.forEach(e => {
        buffer.current = [...buffer.current, `[i] ${e}`];
      })
    }

    console.error = function(...args){
      args.forEach(e => {
        buffer.current = [...buffer.current, `[e] ${e}`];
      })
    }

    console.warn = function(...args){
      args.forEach(e => {
        buffer.current = [...buffer.current, `[w] ${e}`];
      })
    }

    console.debug = function(...args){
      args.forEach(e => {
        buffer.current = [...buffer.current, `[d] ${e}`];
      })
    }
  }


  useEffect(() => {
    setLog([...buffer.current, ...log.slice(0, LIMIT - buffer.current.length > 0 ? LIMIT - buffer.current.length : buffer.current.length)]);
    buffer.current = [];
  }, [log]);


  return (
    <MobileView>
      <div style={{position: 'fixed', left: 0, bottom: '0px', backgroundColor: 'white'}}>
        <b>last {LIMIT} console message:</b> <br/><hr/>
        {
          log.map((msg, idx) => (
            <div key={idx}>{msg}<br/></div>
          ))
        }
      </div>
    </MobileView>
  );
}