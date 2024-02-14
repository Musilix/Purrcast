import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useContext, useState } from "react";
import { Redirect } from "wouter";
import NewPostFormDropZone from "./NewPostFormDropZone";

export default function NewPostForm() {
    const [, setUploadError] = useState<string>("");
    const [postImage, setPostImage] = useState<File | null>();
    const { session } = useContext(AuthContext);

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

    if (session && session.user) {
        return (
            <div id="new-post-wrap" className="w-1/2 max-w-[600px] h-full flex justify-center place-items-center flex-col">
                <h1 className="scroll-m-20 pb-4 text-4xl font-extrabold tracking-tight drop-shadow-custom lg:text-5xl break-words">
                    Post a Cat
                </h1>
                <form id="new-post-form" onSubmit={handlePostSubmit} encType='multipart/form-data'>
                    <NewPostFormDropZone handlePostChange={handlePostChange} />
                    {(postImage) ? <button type="submit">Share</button> : ""}
                </form>
            </div>
        )
    } else {
        return (
            <Redirect to="/login" />
        )
    }
}