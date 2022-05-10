import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "@inlet/react-pixi";
import Bunny from "./Bunny";

export default function RotatingBunny(props: any)
{
  const [rotation, setRotation] = useState<number>(0);
  const app = useContext(AppContext);

  const animate = useCallback(delta => {
    setRotation(rotation => rotation + 0.1*delta);
  }, []);

  useEffect(() => {
    app.ticker.add(animate);
    
    return () => {
      app.ticker?.remove(animate);
    }
  }, [app.ticker, animate]);

  return (
    <Bunny {...props} rotation={rotation} />
  );
}