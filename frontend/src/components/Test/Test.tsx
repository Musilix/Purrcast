// import { Button } from "@/components/ui/button";
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

export default function Test() {
  const { toast } = useToast();

  return (
    <>
      <Button onClick={() => toast({ description: 'Hello World!' })}>
        Click me
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast({
            title: 'There was an issue processing your request',
            description: 'Hello World!',
            variant: 'destructive',
          })
        }
      >
        Click me
      </Button>
      <Button
        variant="outline"
        onClick={() => toast({ description: 'Hello World!' })}
      >
        Click me
      </Button>
    </>
  );
}
