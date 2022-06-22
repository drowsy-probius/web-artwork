import React, { ChangeEvent, useCallback, useEffect, useState, useRef } from "react";

export default function ThreePhotoApp(props: any)
{
  const [image, setImage] = useState<File>();
  const [imageURL, setimageURL] = useState<string>();
  const [uploaded, setUploaded] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);

  function uploadImageHandler(event: ChangeEvent<HTMLInputElement>){
    if(!event.target.files) return;
    setImage(event.target.files[0]);
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
      console.log('image has not been rendered');
      return;
    }

    const canvas = document.getElementById("depthMapCanvas") as HTMLCanvasElement | null;
    if(canvas === null) return;
    const context = canvas.getContext('2d');
    if(context === null) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const position = imageRef.current.getBoundingClientRect();
    console.log(position);
    canvas.width = position.width;
    canvas.height = position.height;

  }, [imageURL]);

  return (
    <div id="ThreePhotoApp">
      {
        uploaded 
        ?
        null
        :
        <input 
        type="file" 
        id="upload"
        accept='image/jpg,impge/png,image/jpeg'
        onChange={uploadImageHandler}/>
      }
      
      <div className="content" >
        <canvas id="depthMapCanvas"></canvas>
        {
          imageURL 
          ?
          <img ref={imageRef} id="uploadedImage" src={imageURL} alt="uploaded image" draggable={false}/>
          :
          null
        }
      </div>
    </div>
  )
}