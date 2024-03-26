import { useState } from 'react';
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
  isSubmitting,
}: {
  handleSubmit: (data: FormData, endpoint: string) => void;
  setMessage: (message: ResponseMessageType | null) => void;
  isSubmitting: boolean;
}) {
  const [postImage, setPostImage] = useState<File | null>();

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

  return (
    <div
      id="new-post-wrap"
      className="flex flex-col justify-center items-center text-left"
    >
      <div
        id="new-post-intro-wrap"
        className="flex flex-col justify-center items-center mb-2"
      >
        <h1 className="scroll-m-20 pb-4 text-3xl lg:text-4xl text-left break-words font-extrabold tracking-tight">
          Upload a cat pic
        </h1>
        <small className="text-sm font-medium leading-none text-muted-foreground">
          Post a picture of your cat to help predict the weather
        </small>
      </div>

      <form
        id="new-post-form"
        onSubmit={handlePostSubmit}
        encType="multipart/form-data"
      >
        {postImage ? (
          <NewPostPreview
            postImage={postImage}
            setPostImage={setPostImage}
            isSubmitting={isSubmitting}
          />
        ) : (
          <NewPostFormDropZone handlePostChange={handlePostChange} />
        )}
      </form>
    </div>
  );
}
