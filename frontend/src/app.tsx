import { useEffect, useState } from 'react';
// import testPosts from "../src/test.json";
import axios from 'axios';
import './app.css';
import TestService from './services/TestService';
import { Post } from './types/Post';
import Response from './types/Response';
// import { Post } from './types/Post';

//TODO - probably move this somewhere else
interface User {
  id: number;
  username: string;
  name: string;
}
function App() {
  const [testValue, setTestValue] = useState<User[] | string>("...");
  const testService = new TestService();

  const [username, setUsername] = useState<string>("")
  const [name, setName] = useState<string>("")

  const [splashPosts, setSplashPosts] = useState<Post[]>([]);

  const [postImage, setPostImage] = useState<File | null>();

  // on component mount
  useEffect(() => {
    //get posts
    console.log("Mounting App. Getting posts...")
    testService.getSplashPosts().then((res: Response<Post[]>) => {
      console.log(res);
      setSplashPosts(res.data ?? []);
    });
  }, []);

  // Form Related Junk - put this into a hook probably
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUsername(e.target.value);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setName(e.target.value);
  }

  const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submitting new user: ", username, name);

    testService.addUser(username, name);

    setName("");
    setUsername("");
  }

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting new post: ", postImage);

    // TODO - add proper validation and move implementation to service
    if (postImage) {
      const formData = new FormData();
      formData.append("file", postImage);

      //TODO - switch to this
      // const res = await axios.post(`${import.meta.env.VITE_API_HOST}/`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })

      const res = await axios.post(`${import.meta.env.VITE_API_HOST}/post/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(res);

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

  // Question - is it ok to have async functions in the event handler?
  const handleTestClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const testData: string | User[] = await testService.getTestData();
    setTestValue(testData);
  }


  return (
    <>
      <img src="/purrcast.gif" alt="Purrcast Logo" style={{ width: "300px", height: "300px" }} />
      <h1 style={{ margin: "0px" }}>Purrcast Test Feed</h1>
      <h3>Today is estimated to be _ in _</h3>
      <button onClick={(e) => handleTestClick(e)}>Look at Current Users</button>

      <div id="data-wrap">
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
      </div >

      <hr style={{
        backgroundColor: "gray",
        height: "2px",
        borderRadius: "5px",
        border: "0px"
      }} />

      <h3 style={{ textAlign: "left" }}>Create a New User</h3>
      <div id="new-user-wrap">
        <form onSubmit={handleUserSubmit}>
          <input id="username-input" type="text" name="username" placeholder="Username" value={username} required onChange={handleUserNameChange} />
          <input id="name-input" type="text" name="name" placeholder="Name (optional)" value={name} onChange={handleNameChange} />
          <button type="submit">Add New User</button>
        </form>
      </div>

      <div id="post-wrap">
        {
          splashPosts && splashPosts.length > 0 ? (
            <ul>
              {splashPosts.map((post) => (
                <li key={post.id}>
                  <img src={`${import.meta.env.VITE_CLOUDINARY_URL}/${post.contentId}`} />
                  <p>{`Posted by: ${post.author.name}`}</p>
                  <p>{post.author.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No Posts</p>
          )
        }
      </div>
      <div id="new-post-wrap">
        <h3>Make a New Post</h3>
        <p>Upload a photo of your cat!</p>
        <form id="new-post-form" onSubmit={handlePostSubmit} encType='multipart/form-data'>
          <input type="file" name="postImage" id="postImageFile" accept="image/*" onChange={(e) => handlePostChange(e)} />
          <button type="submit">Share</button>
        </form>
      </div>
    </>
  )
}

export default App