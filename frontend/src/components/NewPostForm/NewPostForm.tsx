import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Redirect } from 'wouter';
import NewPostPreview from '../NewPostPreview/NewPostPreview';
import NewPostFormDropZone from './NewPostFormDropZone';

interface UserSession {
  access_token: string;
}

export default function NewPostForm() {
  const [uploadError, setUploadError] = useState<string>('');
  const [postImage, setPostImage] = useState<File | null>();

  // TODO - define hook to grab local storage items
  const userSession = JSON.parse(
    localStorage.getItem('userSession') ?? '',
  ) as UserSession;
  const { session } = useContext(AuthContext);

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO - add proper validation and move implementation to service
    if (postImage) {
      const formData = new FormData();
      formData.append('userUploadedFile', postImage);

      await axios
        .post(`${import.meta.env.VITE_API_HOST}/post/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userSession.access_token}`,
          },
        })
        .catch((err) => {
          setUploadError(err.message);
        });

      setPostImage(null);
    }
  };

  const handlePostChange = (acceptedFile: File) => {
    setPostImage(acceptedFile);
  };

  if (session && session.user) {
    return (
      <div
        id="new-post-wrap"
        className="w-full max-w-[600px] h-full flex justify-center place-items-center flex-col"
      >
        <h1 className="scroll-m-20 pb-4 text-4xl font-extrabold tracking-tight drop-shadow-custom lg:text-5xl break-words">
          Post a Cat
        </h1>

        <form
          id="new-post-form"
          onSubmit={handlePostSubmit}
          encType="multipart/form-data"
        >
          {postImage ? (
            <NewPostPreview postImage={postImage} setPostImage={setPostImage} />
          ) : (
            <NewPostFormDropZone
              handlePostChange={handlePostChange}
              handleErrorChange={setUploadError}
            />
          )}
        </form>

        {uploadError ? (
          <p>{`We had an issue uploading your file. ${uploadError}`}</p>
        ) : (
          ''
        )}
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
}
