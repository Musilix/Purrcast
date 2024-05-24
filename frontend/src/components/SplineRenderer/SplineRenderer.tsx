import Spline from '@splinetool/react-spline';
import { useState } from 'react';

export default function SplineRenderer() {
  const [isCanvasLoading, setIsCanvasLoading] = useState(true);

  return (
    <div
      id="spline-renderer-wrap"
      className="w-full h-full absolute m-0 p-0 top-20 -z-10 overflow-hidden!"
    >
      {/* <Spline scene="https://prod.spline.design/ugKgLYqZQ-qGjCiV/scene.splinecode" /> */}
      <Spline
        scene="https://prod.spline.design/Id37Wk-k2a62bmee/scene.splinecode"
        className={`${
          isCanvasLoading ? 'opacity-0' : 'opacity-1'
        } transition-all duration-1000 ease-in-out`}
        onLoad={() => setIsCanvasLoading(false)}
      />

      <div
        id="blurby"
        className="w-full h-[250px] absolute left-0 bottom-0 p-0 m-0 bg-background blur-2xl"
      ></div>
      <div
        id="blurby-cutoff"
        className="absolute w-full h-[150px] p-0 m-0 left-0 bottom-0 bg-background"
      ></div>
    </div>
  );
}
