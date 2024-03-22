import { AuthContext } from '@/context/AuthContext';
import { useContext, useState } from 'react';
import { Redirect } from 'wouter';
import NewPostPreview from '../NewPostPreview/NewPostPreview';
import NewPostFormDropZone from './NewPostFormDropZone';

// TODO - move this to a shared file
interface ResponseMessageType {
  type: 'default' | 'success' | 'destructive';
  title: string;
  content: string;
}

export default function NewPostForm({
  handleSubmit,
  setMessage,
}: {
  handleSubmit: (data: FormData, endpoint: string) => void;
  setMessage: (message: ResponseMessageType | null) => void;
}) {
  const [postImage, setPostImage] = useState<File | null>();
  const { session } = useContext(AuthContext);

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO - add proper validation and move implementation to service
    if (postImage) {
      const formData = new FormData();
      formData.append('userUploadedFile', postImage);

      // TODO - this is valid, but we need to define the type of the handleSubmit prop in the func def
      await handleSubmit(formData, '/post/upload');
      setPostImage(null);
    }
  };

  const handlePostChange = (acceptedFile: File) => {
    setMessage(null);
    setPostImage(acceptedFile);
  };

  if (session && session.user) {
    return (
      <div
        id="new-post-wrap"
        className="w-full max-w-[600px] h-full flex justify-center place-items-center flex-col mt-5"
      >
        <h1 className="scroll-m-20 pb-4 text-4xl font-extrabold tracking-tight lg:text-5xl break-words">
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
            <NewPostFormDropZone handlePostChange={handlePostChange} />
          )}
        </form>
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
}
