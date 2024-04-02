import { Loader2, X } from 'lucide-react';
import { Button } from '../ui/button';

// FIXME - I don't like prop drilling isSubmitting down to this component, but hey... baba booey
export default function NewPostPreview({
  postImage,
  setPostImage,
  isSubmitting,
}: {
  postImage: File;
  setPostImage: (file: File | null) => void;
  isSubmitting: boolean;
}) {
  return (
    <>
      <div className="relative rounded-md min-w-[300px] max-w-[400px] m-5 p-5 shadow-md flex flex-col justify-center items-center border border-foreground">
        {isSubmitting && (
          <div className="absolute flex justify-center items-center top-0 left-0 bg-slate-300/50 z-50 w-full h-full rounded-lg shadow">
            <Loader2 size="64" className="animate-spin" />
          </div>
        )}
        <img
          className="rounded-md w-full"
          src={URL.createObjectURL(postImage)}
          alt="preview"
        />
      </div>

      <div className="flex flex-row justify-center *:mx-2.5">
        <Button className="w-1/2" type="submit" disabled={isSubmitting}>
          Share
        </Button>
        <Button
          onClick={() => setPostImage(null)}
          variant="outline"
          className="p-2 m-0 rounded-md hover:bg-popover"
          disabled={isSubmitting}
        >
          <X className="size-5 " />
        </Button>
      </div>
    </>
  );
}
