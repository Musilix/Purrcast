// hooks
import { useEffect, useState } from 'preact/hooks';

// components
import SignupForm from './components/SignUpForm/SignUpForm';

// types
import User from './types/User';

// styles
import './app.css';
import NavBar from './components/NavBar/NavBar';
import "./globals.css";

export function App() {

  // encapsulate these details into provider of some sort
  const [currUser, setCurrUser] = useState<User | null>(null);
  useEffect(() => {

  }, []);

  return (
    <>
      <NavBar />
      <div class="card">
        {
          currUser ? <div>Logged in as {currUser.username}</div> : <SignupForm />
        }
      </div>
    </>
  )
}
