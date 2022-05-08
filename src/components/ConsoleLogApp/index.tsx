import React, { useEffect, useState } from "react";
import { MobileView, isMobile } from "react-device-detect";

export default function ConsoleLogApp()
{
  const LIMIT = 5;
  const [log, setLog] = useState<string[]>([]);


  const originalLog = console.log;
  console.log = function(txt){
    if(isMobile)
    {
      if(log.length >= LIMIT)
      {
        setLog([txt, ...log.slice(0, 4)]);
      }
      else
      {
        setLog([txt, ...log]);
      }
    }
    else
    {
      originalLog(txt);
    }
  }
  

  return (
    <MobileView>
      <b>last {LIMIT} console log message:</b> <br/>
      {
        log.map((msg, idx) => (
          <div key={idx}>{msg}<br/></div>
        ))
      }
    </MobileView>
  );
}