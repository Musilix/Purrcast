import { FileImage } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function NewPostFormDropZone({ handlePostChange, handleErrorChange }) {
    const handleDropAccepted = useCallback((acceptedFiles: File[]) => {
        console.log(acceptedFiles[0]);
        handlePostChange(acceptedFiles[0]);
    }, []);

    const handleDropRejection = useCallback((fileRejections) => {
        handleErrorChange(fileRejections[0].errors[0].message);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp']
        },
        maxFiles: 1,
        maxSize: 100000000, //100MB
        noDrag: false,
        onDropAccepted: handleDropAccepted,
        onDropRejected: handleDropRejection
        // onDrop
    });

    return (
        <>
            <div className="min-w-full sm:min-w-full md:min-w-[500px] flex flex-col justify-center place-items-center text-foreground bg-input rounded-md border-dashed border-muted-foreground border-2 p-8 my-5 cursor-pointer hover:border-foreground *:m-1" {...getRootProps()}>

                <input {...getInputProps()} name="postImage" id="postImageFile" />
                {
                    isDragActive ?
                        <>
                            <FileImage size={48} color="hsl(var(--muted-foreground))" />
                            <p className="leading-7 [&:not(:first-child)]:mt-6 break-words text-muted-foreground">
                                Drop File Here to Upload
                            </p>
                        </> :
                        <>
                            <FileImage size={48} color="hsl(var(--muted-foreground))" />
                            <p className="leading-7 [&:not(:first-child)]:mt-6 break-words text-muted-foreground">
                                Drag File to Upload or Click Here
                            </p>
                        </>
                }
            </div>
        </>
    )

}