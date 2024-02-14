import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

export default function NewPostFormDropZone({ handlePostChange }: { handlePostChange: React.EventHandler<React.ChangeEvent<HTMLInputElement>> }) {
    const onDrop = useCallback(acceptedFiles => {
        handlePostChange(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} type="file" name="postImage" id="postImageFile" accept="image/*" />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>

                }
            </div>
        </>
    )

}