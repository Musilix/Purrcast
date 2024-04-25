import { useToast } from '@/components/ui/use-toast';
export default function ShowGeoErrorMessage(
  error: GeolocationPositionError,
  toast: ReturnType<typeof useToast>['toast'],
) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      toast({
        description:
          "We're unable to get location-specific data until you allow our site to use Geolocation.",
        variant: 'destructive',
      });
      break;
    case error.POSITION_UNAVAILABLE:
      toast({
        description:
          'Location information is unavailable. Maybe try refreshing the page, trying a different browser, or clearing cookies/cache?',
        variant: 'destructive',
      });
      break;
    case error.TIMEOUT:
      toast({
        description: 'The request to get your location timed out.',
        variant: 'destructive',
      });
      break;
    default:
      toast({
        description:
          'An unknown error occurred. Maybe try refreshing the page?',
        variant: 'destructive',
      });
      break;
  }
}
