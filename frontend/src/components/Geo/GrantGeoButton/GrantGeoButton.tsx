import { Button } from '../../ui/button';

export default function GrantGeoButton({
  overwriteGeoCoords,
  buttonText = 'Find Posts Near You',
}: {
  overwriteGeoCoords: () => void;
  buttonText?: string;
}) {
  const onLocationClick = () => {
    overwriteGeoCoords();
  };

  return (
    <Button
      className="rounded-md w-full"
      variant="supabasianPrimary"
      onClick={() => onLocationClick()}
    >
      {buttonText}
    </Button>
  );
}
