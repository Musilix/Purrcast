import { useState } from 'react';
// import testPosts from "../src/test.json";
import axios from 'axios';
import './app.css';
import PostsPreview from './components/PostsPreview/PostsPreview';
// import TestService from './services/TestService';
// import { Post } from './types/Post';
// import Response from './types/Response';
// import { Post } from './types/Post';

//TODO - probably move this somewhere else
// interface User {
//   id: number;
//   username: string;
//   name: string;
// }
function App() {
  const [uploadError, setUploadError] = useState<string>("");

  // const [testValue, setTestValue] = useState<User[] | string>("...");
  // const testService = new TestService();

  // const [username, setUsername] = useState<string>("")
  // const [name, setName] = useState<string>("")

  const [postImage, setPostImage] = useState<File | null>();

  // Form Related Junk - put this into a hook probably
  // const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   setUsername(e.target.value);
  // }

  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   e.preventDefault();
  //   setName(e.target.value);
  // }

  // const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   console.log("Submitting new user: ", username, name);

  //   testService.addUser(username, name);

  //   setName("");
  //   setUsername("");
  // }

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

  // TODO - move this logic somewhere else
  // Question - is it ok to have async functions in the event handler?
  // const handleTestClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   e.preventDefault();
  //   const testData: string | User[] = await testService.getTestData();
  //   setTestValue(testData);
  // }


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
      {/* <h3>Today is estimated to be _ in _</h3> */}
      {/* <button onClick={(e) => handleTestClick(e)}>Look at Current Users</button> */}

      {/* <div id="data-wrap">
        {

          (typeof testValue !== "string" && testValue !== null) ?
            (
              testValue.map((user: User) => {
                return (
                  <div key={user.id} style={{ backgroundColor: "#242424", borderRadius: "5px", padding: "5px", margin: "10px 0px" }}>
                    <p style={{ "fontSize": "15px" }}>{user.name}</p>
                    <p>{user.username}</p>
                  </div>
                )
              })) : <p>{testValue}</p>

        }
      </div > */}

      {/* <h3 style={{ textAlign: "left" }}>Create a New User</h3>
      <div id="new-user-wrap">
        <form onSubmit={handleUserSubmit}>
          <input id="username-input" type="text" name="username" placeholder="Username" value={username} required onChange={handleUserNameChange} />
          <input id="name-input" type="text" name="name" placeholder="Name (optional)" value={name} onChange={handleNameChange} />
          <button type="submit">Add New User</button>
        </form>
        {
          (uploadError) ?
            <p style={{ color: "red", padding: "2.5px", borderRadius: "5px", border: "1px solid red", "backgroundColor": "lightcoral" }}>{uploadError}</p>
            : ""
        }
      </div> */}

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