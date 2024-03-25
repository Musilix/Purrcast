import { FileImage } from 'lucide-react';
import { useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';

interface NewPostFormDropZoneProps {
  handlePostChange: (acceptedFile: File) => void
}

export default function NewPostFormDropZone({
  handlePostChange
}: NewPostFormDropZoneProps) {

  const handleDropAccepted = useCallback((acceptedFiles: File[]) => {
    handlePostChange(acceptedFiles[0]);
  }, []);

  const handleDropRejection = useCallback((fileRejections: FileRejection[]) => {
    throw new Error(fileRejections[0].errors[0].message);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxFiles: 1,
    maxSize: 100000000, //100MB
    noDrag: false,
    onDropAccepted: handleDropAccepted,
    onDropRejected: handleDropRejection,
    // onDrop
  });

  // TODO: Switch up the upload method to only allow people to upload a file by actively using their phone's camera
  // They cannot upload a file from their phone or computers file system
  return (
    <>
      <div
        className="min-w-[350px] sm:min-w-[350px] md:min-w-[500px] flex flex-col justify-center place-items-center text-foreground bg-input rounded-md border-dashed border-muted-foreground border-2 p-8 my-5 cursor-pointer hover:border-foreground *:m-1"
        {...getRootProps()}
      >
        <input {...getInputProps()} name="postImage" id="postImageFile" />
        {isDragActive ? (
          <>
            <FileImage size={48} color="hsl(var(--muted-foreground))" />
            <p className="leading-7 [&:not(:first-child)]:mt-6 break-words text-muted-foreground">
              Drop File Here to Upload
            </p>
          </>
        ) : (
          <>
            <FileImage size={48} color="hsl(var(--muted-foreground))" />
            <p className="leading-7 [&:not(:first-child)]:mt-6 break-words text-muted-foreground">
              Drag File to Upload or Click Here
            </p>
          </>
        )}
      </div>
    </>
  );
}
