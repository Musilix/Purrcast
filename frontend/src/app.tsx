import { useState } from 'react';
// import testPosts from "../src/test.json";
import './App.css';
import TestService from './services/TestService';
// import { Post } from './types/Post';

//TODO - probably move this somewhere else
interface User {
  id: number;
  username: string;
  name: string;
}
function App() {
  // const [splashPosts] = useState<Post[]>(testPosts.posts)
  const [testValue, setTestValue] = useState<string | User[]>("...");
  // const [error, setError] = useState(null);
  const testService = new TestService();

  // Question - is it ok to have async functions in the event handler?
  const handleTestClick = async (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
    e.preventDefault();
    const testData: string | User[] = await testService.getTestData();
    setTestValue(testData);
  }

  return (
    <>
      <h2>Purrcast Test Feed</h2>
      <p>Today is estimated to be _ in _</p>
      <b><p onClick={(e) => handleTestClick(e)}>Press this to get something special</p></b>

      <div id="data-wrap">
        {

          (typeof testValue !== "string" && testValue !== null) ?
            (
              testValue.map((user: User) => {
                return (
                  <div key={user.id} style={{ backgroundColor: "#333333", borderRadius: "5px", padding: "5px", margin: "10px 0px" }}>
                    <p style={{ "fontSize": "15px" }}>{user.name}</p>
                    <p>{user.username}</p>
                  </div>
                )
              })) : <p>{testValue}</p>

        }
      </div >
    </>
  )
}

export default App