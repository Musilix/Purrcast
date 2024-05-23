import Spline from '@splinetool/react-spline';

export default function SplineRenderer() {
  return (
    <div
      id="spline-renderer-wrap"
      className="w-full h-full absolute m-0 p-0 top-20 -z-10 overflow-hidden!"
    >
      <Spline scene="https://prod.spline.design/ugKgLYqZQ-qGjCiV/scene.splinecode" />

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
