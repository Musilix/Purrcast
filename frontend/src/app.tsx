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
  const [testValue, setTestValue] = useState<string | User[]>("...");
  const testService = new TestService();

  const [username, setUsername] = useState<string>("")
  const [name, setName] = useState<string>("")

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


  // Question - is it ok to have async functions in the event handler?
  const handleTestClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const testData: string | User[] = await testService.getTestData();
    setTestValue(testData);
  }


  return (
    <>
      <img src="../public/purrcast.gif" alt="Purrcast Logo" style={{ width: "300px", height: "300px" }} />
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
    </>
  )
}

export default App