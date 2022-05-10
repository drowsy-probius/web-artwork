import React from "react";
import { Sprite } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

const bunnyIMG = "https://i.imgur.com/IaUrttj.png"
const centerAnchor = new PIXI.Point(0.5, 0.5);

export default function Bunny(props: any)
{
  return (
    <Sprite
      anchor={centerAnchor}
      texture={PIXI.Texture.from(bunnyIMG)}
      {...props}
    />
  )
}