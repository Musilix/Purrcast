import { useState } from 'react';
import axios from 'axios';
import './app.css';
import PostsPreview from './components/PostsPreview/PostsPreview';

function App() {
  const [uploadError, setUploadError] = useState<string>("");

  const [postImage, setPostImage] = useState<File | null>();

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

      {/* <img src="/purrcast.gif" alt="Purrcast Logo"/>
      <h1>
          {(import.meta.env.PROD) ? "Purrcast" : "Purrcast Test Feed"}
      </h1>
      <div id="splash-intro-wrap">
        <h3>An old shriveled soothsayer once said:</h3> <blockquote>If your cat lays on it's head, there is rain up ahead.</blockquote>
        <p>I took that very personally and so Purrcast was built to act as a centralized place for you to post and look at photos of peoples cats in your area to determine if it's going to rain soon or maybe just drizzle.</p>
      </div>

      <h2>Posts being made on Mother Earth</h2> */}

      <PostsPreview />

      {/* 
      <div id="new-post-wrap">
        <h3>Make a New Post</h3>
        <p >Upload a photo of your cat!</p>
        <form id="new-post-form" onSubmit={handlePostSubmit} encType='multipart/form-data'>
          <input type="file" name="postImage" id="postImageFile" accept="image/*" onChange={(e) => handlePostChange(e)} />
          <button type="submit">Share</button>
        </form>
      </div> */}
    </>
  )
}

export default App