import { FileImage } from "lucide-react";
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

export default function NewPostFormDropZone({ handlePostChange }: { handlePostChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> }) {
    const onDrop = useCallback((acceptedFiles: Array<Object>) => {
        handlePostChange(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <div className="flex flex-col justify-center place-items-center text-foreground bg-input rounded-md border-dashed border-muted-foreground border-2 p-8 my-5 cursor-pointer hover:border-foreground *:m-1" {...getRootProps()}>
                <FileImage size={48} />
                <input {...getInputProps()} type="file" name="postImage" id="postImageFile" accept="image/*" />
                {
                    isDragActive ?
                        <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
                            Drag File to Upload or Click Here
                        </p> :
                        <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
                            Click Here to Upload an Image
                        </p>

                }
            </div>
        </>
    )

}