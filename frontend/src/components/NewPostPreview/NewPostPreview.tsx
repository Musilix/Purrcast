import { X } from 'lucide-react';
import { Button } from '../ui/button';

export default function NewPostPreview({
  postImage,
  setPostImage,
}: {
  postImage: File;
  setPostImage: (file: File | null) => void;
}) {
  return (
    <>
      <div className="rounded-md min-w-[300px] max-w-1/2 m-5 p-5 aspect-square shadow-md">
        <img
          className="rounded-md"
          src={URL.createObjectURL(postImage)}
          alt="preview"
        />
      </div>

      <div className="flex flex-row justify-center *:mx-2.5">
        <Button className="w-1/2" type="submit">
          Share
        </Button>
        <Button
          onClick={() => setPostImage(null)}
          variant="outline"
          className="p-2 m-0 rounded-md hover:bg-popover"
        >
          <X className="size-5 " />
        </Button>
      </div>
    </>
  );
}
