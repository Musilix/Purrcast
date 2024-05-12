import axios from 'axios';

interface userSessionType {
  access_token: string;
}

// Put anything you need to test in here that isn't really directly connected to a component
export default async function handleTestClick() {
  const userSession: userSessionType = JSON.parse(
    localStorage.getItem('userSession') ?? '',
  );

  await axios.post(`${import.meta.env.VITE_API_HOST}/test`, {
    headers: {
      Authorization: `Bearer ${userSession?.access_token}`,
    },
  });
}
