import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { PIXIApplication, PIXIFilters, PIXISprite } from "../usePIXI";

const POINTCOLOR = "#FFFFFF33";

export default function ThreePhotoApp(props: any)
{
  const [image, setImage] = useState<File>();
  const [imageURL, setimageURL] = useState<string>();
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [isRendered, setIsRendered] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const isMouseDownRef = useRef<boolean>(false);

  function uploadImageHandler(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files) return;
    setImage(event.target.files[0]);
  }

  function make3DPhoto()
  {
    if(canvasRef.current === null) return;

    /**
     * depth map은 검은색 배경에 흰색으로 칠해진 것이므로
     * 새로운 캔버스를 만들어서 검은 배경인 이미지를 얻는다.
     */
    const depthMapCanvas = document.createElement("canvas") as HTMLCanvasElement;
    depthMapCanvas.width = canvasRef.current.width;
    depthMapCanvas.height = canvasRef.current.height;

    const context = depthMapCanvas.getContext('2d');
    if(context === null) return;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, depthMapCanvas.width, depthMapCanvas.height);
    context.drawImage(canvasRef.current, 0, 0);

    const depthMap = depthMapCanvas.toDataURL();

    /**
     * PIXI를 활용해서 3d photo 생성
     */
    if(imageURL === undefined || depthMap === undefined)
    {
      console.log("image url error?");
      return;
    }

    const app = new PIXIApplication({
      width: depthMapCanvas.width,
      height: depthMapCanvas.height,
    });
    const appRoot = document.getElementById("ThreePhoto");
    if(appRoot === null)
    {
      console.log("pixi root is not rendered");
      return;
    }
    appRoot.appendChild(app.view);

    const uploadedImage = PIXISprite.from(imageURL);
    uploadedImage.width = depthMapCanvas.width;
    uploadedImage.height = depthMapCanvas.height;
    app.stage.addChild(uploadedImage);

    const depthMapImage = PIXISprite.from(depthMap);
    app.stage.addChild(depthMapImage);

    const filter = new PIXIFilters.DisplacementFilter(depthMapImage);
    app.stage.filters = [filter];

    window.onmousemove = (event: MouseEvent) => {
      filter.scale.x = (window.innerWidth / 2 - event.clientX) / 200;
      filter.scale.y = (window.innerHeight / 2 - event.clientY) / 200;
    }

    setIsRendered(true);
  }


  useEffect(() => {
    /**
     * this hool called when new image is selected
     */
    if(!image) return;
    const fileReader = new FileReader();
    fileReader.onload = (event: ProgressEvent<FileReader>) => {
      if(event.target === null) return;

      const {result} = event.target;
      if(result === null) return;

      if(typeof result === 'string')
      {
        setimageURL(result); 
      }
      else
      {
        setimageURL(new TextDecoder("utf-8").decode(result));
      }
    }
    fileReader.readAsDataURL(image);

    setUploaded(true);
    return () => {
      if(fileReader && fileReader.readyState === 1)
      {
        fileReader.abort();
      }
    }
  }, [image]);


  useEffect(() => {
    /**
     * this hook called when uploaded image is rendered.
     */
    if(imageURL === undefined || imageRef.current === null)
    {
      console.log('uploaded image has not been rendered');
      return;
    }

    const canvas = canvasRef.current;
    if(canvas === null) return;
    const context = canvas.getContext('2d');
    if(context === null) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const position = imageRef.current.getBoundingClientRect();
    console.log("photo position: ", position);
    
    canvas.width = position.width;
    canvas.height = position.height;


    canvas.addEventListener("mousedown", (event: MouseEvent) => {
      isMouseDownRef.current = true;
    });
    canvas.addEventListener("mousemove", (event: MouseEvent) => {
      if(!isMouseDownRef.current) return;
      const canvas = canvasRef.current;
      if(canvas === null) return;
      const context = canvas.getContext('2d');
      if(context === null) return;

      context.filter = "blur(15px)";
      context.fillStyle = POINTCOLOR;
      context.beginPath();
      context.arc(event.offsetX, event.offsetY, 20, 0, 2*Math.PI);
      context.fill();
    });
    canvas.addEventListener("mouseup", (event: MouseEvent) => {
      isMouseDownRef.current = false;
    });
    canvas.addEventListener("mouseout", (event: MouseEvent) => {
      isMouseDownRef.current = false;
    });

  }, [imageURL]);

  return (
    <div id="ThreePhotoApp">
      {
        uploaded 
        ?
          isRendered 
          ? 
          null 
          :
          <button type="submit" className="buttons" onClick={make3DPhoto}>make it 3d!</button>
        :
        <input 
        type="file" 
        className="buttons"
        accept='image/jpg,impge/png,image/jpeg'
        onChange={uploadImageHandler}/>
      }

      <div className="content" id="ThreePhoto">
        {
          isRendered
          ?
          null
          :
          <>
            
            {
            imageURL 
            ?
            <>
              <canvas id="maskingCanvas" ref={canvasRef}></canvas>
              <img ref={imageRef} id="uploadedImage" src={imageURL} alt="uploaded" draggable={false}/>
            </>
            :
            <div>
            <p>How to use it</p>
            <p>1. Select your photo</p>
            <p>2. Paint the objects in front of others</p>
            <p>*All the processes are done in your browser.</p>
            <p>So the server do not take anything from you</p>
            </div>
            }
          </>
        }
      </div>

    </div>
  )
}