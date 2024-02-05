import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useContext, useState } from "react";
import { Redirect } from "wouter";

export default function NewPostForm() {
    const [uploadError, setUploadError] = useState<string>("");
    const [postImage, setPostImage] = useState<File | null>();
    const loggedIn = false;
    const session = useContext(AuthContext);

    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Submitting new post: ", postImage);

        // TODO - add proper validation and move implementation to service
        if (postImage) {
            const formData = new FormData();
            formData.append("file", postImage);

            // TODO - utilize service class for implementation details?
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_HOST}/post/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(res);
            } catch (err) {
                setUploadError((err as Error).message);
            }

            setPostImage(null);
        }
    }

    const handlePostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const extractedFile = e.target as HTMLInputElement & {

            files: FileList;
        }

        setPostImage(extractedFile.files[0]);
    }
    return (
        <>
            {(session && session.user) ?
                <div id="new-post-wrap">
                    <h3>Make a New Post</h3>
                    <p >Upload a photo of your cat!</p>
                    <form id="new-post-form" onSubmit={handlePostSubmit} encType='multipart/form-data'>
                        <input type="file" name="postImage" id="postImageFile" accept="image/*" onChange={(e) => handlePostChange(e)} />
                        <button type="submit">Share</button>
                    </form>
                </div> :

                (<Redirect to="/login" />)
            }
        </>

    )

}