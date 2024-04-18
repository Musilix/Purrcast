import GrantGeoButton from '@/components/Geo/GrantGeoButton/GrantGeoButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UnknownLocation({ overwriteGeoCoords }) {
  return (
    <div
      id="where-are-you"
      className="w-full flex flex-col justify-center items-center"
    >
      <Card className="w-3/4">
        <CardHeader>
          <CardTitle>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              We actually don't know where you are...
            </h4>
          </CardTitle>
          <CardDescription>
            Please enable location services so we can give you an accurate
            prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="w-full">
            {' '}
            If you're not being prompted to let us use your location, you may
            need to go into your settings or click the map pin icon in your
            browser's search bar.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col justify-between ">
          <GrantGeoButton
            overwriteGeoCoords={overwriteGeoCoords}
            buttonText={'Grant Access to Location'}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
