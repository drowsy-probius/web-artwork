import React, { useState } from "react";

export default function ConsoleLogApp()
{
  const LIMIT = 7;
  const [log, setLog] = useState<string[]>([]);

  const originalLog = console.log;
  console.log = function(...args){
    originalLog.apply(this, args);
    setLog([...args.slice(0, LIMIT), ...log.slice(0, LIMIT - args.length >= 0 ? LIMIT - args.length : 0)]);
  }


  return (
    <div style={{position: 'fixed', left: 0, bottom: '0px', backgroundColor: 'white'}}>
      <b>last {LIMIT} console log message:</b> <br/>
      {
        log.map((msg, idx) => (
          <div key={idx}>{msg}<br/></div>
        ))
      }
    </div>
  );
}