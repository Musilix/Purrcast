import Spline from '@splinetool/react-spline';

export default function SplineRenderer() {
  return (
    <div className="w-full h-full absolute m-0 p-0 -z-1">
      <Spline scene="https://prod.spline.design/ugKgLYqZQ-qGjCiV/scene.splinecode" />
    </div>
  );
}
