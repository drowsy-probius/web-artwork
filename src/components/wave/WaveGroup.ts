import { Coordinate } from "../../@types";
import Wave from "./Wave";
import WaveRectangle from "./WaveRectangle";

export default class WaveGroup {
  color: string;
  numberOfWaves: number;
  numberOfPointsPerWave: number;
  waves: Array<Wave | WaveRectangle>;
  boatWaveIdx: number;

  constructor(windowSize: Coordinate, numberOfPointsPerWave=5, numberOfWaves=5, color='#42bff530')
  {
    console.log(`numberOfPointsPerWave= ${numberOfPointsPerWave}`);
    this.color = color;
    this.numberOfWaves = numberOfWaves;
    this.numberOfPointsPerWave = numberOfPointsPerWave;

    this.waves = [];
    this.boatWaveIdx = Math.floor(numberOfWaves/2);

    for(let i=0; i<numberOfWaves; i++)
    {
      if(i === this.boatWaveIdx)
      {
        this.waves[i] = new WaveRectangle(windowSize, this.color, numberOfPointsPerWave);
      }
      else
      {
        this.waves[i] = new Wave(windowSize, this.color, this.numberOfPointsPerWave);
      }
    }
  }

  resize(size: Coordinate)
  {
    this.waves.forEach(wave => {
      wave.resize(size);
    });
  }

  draw(context: CanvasRenderingContext2D)
  {
    this.waves.forEach(wave => {
      wave.draw(context);
    });
  }
}