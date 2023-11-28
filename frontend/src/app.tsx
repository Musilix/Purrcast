import { useState } from 'react';
// import testPosts from "../src/test.json";
import './App.css';
import TestService from './services/TestService';
// import { Post } from './types/Post';

function App() {
  // const [splashPosts] = useState<Post[]>(testPosts.posts)
  const [testValue, setTestValue] = useState<string>("...");
  // const [error, setError] = useState(null);
  const testService = new TestService();

  // Question - is it ok to have async functions in the event handler?
  const handleTestClick = async (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    e.preventDefault();
    const testData: string = await testService.getTestData();
    console.log(testData);
    setTestValue(testData);
  }

  return (
    <>
      <h2>Purrcast Test Feed</h2>
      <p>Today is estimated to be _ in _</p>
      {/* <ul>
        {
          splashPosts.map((post) => {
            return (
              <li key={post.id}>
                <img src={post.post_img} alt="cat photo" width="100px" height="100px" />
                <p>{post.name}</p>
                <p>{post.location}</p>
                <p>posted by {post.user.name}</p>
              </li>
            )
          })
        }
      </ul> */}
      <p onClick={(e) => handleTestClick(e)}>Press this to get something special</p>
      <p>The test value is: {testValue}</p>
    </>
  )
}

export default App