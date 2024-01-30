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

      // TODO - utilize service class for implementation details
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
      <img src="/purrcast.gif" alt="Purrcast Logo" style={{ width: "300px", height: "300px" }} />
      <h1 style={{ marginTop: "0px" }}>{(import.meta.env.PROD) ? "Purrcast" : "Purrcast Test Feed"}</h1>
      <div id="splash-intro-wrap">

        <h3>An old shriveled soothsayer once said:</h3> <blockquote>If your cat lays on it's head, there is rain up ahead.</blockquote>
        <p>I took that very personally and so Purrcast was built to act as a centralized place for you to post and look at photos of peoples cats in your area to determine if it's going to rain soon or maybe just drizzle.</p>
      </div>
      <hr style={{
        backgroundColor: "gray",
        height: "2px",
        borderRadius: "5px",
        border: "0px"
      }} />

      <h2 style={{ fontSize: "45px" }}>Posts being made on Mother Earth</h2>
      <PostsPreview />


      <hr style={{
        backgroundColor: "gray",
        height: "2px",
        borderRadius: "5px",
        border: "0px"
      }} />

      <div id="new-post-wrap">
        <h3 style={{ fontSize: "25px", textAlign: "left", margin: "15px 0px" }}>Make a New Post</h3>
        <p style={{ fontSize: "20px", textAlign: "left", margin: "15px 0px" }}>Upload a photo of your cat!</p>
        <form id="new-post-form" onSubmit={handlePostSubmit} encType='multipart/form-data'>
          <input style={{ width: "50%", minWidth: "250px", textAlign: "left" }} type="file" name="postImage" id="postImageFile" accept="image/*" onChange={(e) => handlePostChange(e)} />
          <button type="submit">Share</button>
        </form>
      </div>
    </>
  )
}

export default App