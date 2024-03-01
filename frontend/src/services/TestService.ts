// import axios, { isAxiosError } from 'axios';
// import { Post } from '../types/Post';
// import Response from '../types/Response';

//TODO - probably move this somewhere else
// interface User {
//   id: number;
//   username: string;
//   name: string;
// }
export default class TestService {
  // async getTestData(): Promise<User[] | string> {
  //   let data: User[];
  //   try {
  //     // TODO - change backend hostname once domain a domain is established
  //     const res = await axios.get(`${import.meta.env.VITE_API_HOST}/users`);
  //     data = res.data;
  //   } catch (e) {
  //     console.error(`There was an issue with the test request: ${e}`);
  //     return 'Nothing';
  //   }
  //   return data;
  // }
  // async addUser(username: string, name?: string): Promise<User | string> {
  //   let data: User;
  //   try {
  //     const res = await axios.post(`${import.meta.env.VITE_API_HOST}/users`, {
  //       name: name,
  //       username: username,
  //     });
  //     data = res.data;
  //   } catch (e) {
  //     console.error(`There was an issue with the test request: ${e}`);
  //     return 'Error Adding User';
  //   }
  //   return data;
  // }
  // async getSplashPosts(): Promise<Response<Post[]>> {
  //   let data: Post[] | undefined;
  //   let error: string | undefined;
  //   try {
  //     const res = await axios.get(`${import.meta.env.VITE_API_HOST}/post`);
  //     data = res.data;
  //   } catch (e) {
  //     if (isAxiosError(e)) {
  //       // console.error(`There was an issue with the test request: ${e}`);
  //       if (e.response) {
  //         // The request was made and the server responded with a status code
  //         error = `Error: ${e.response.status} - ${e.response.data.message}`;
  //       } else if (e.request) {
  //         // The request was made but no response was received
  //         error = 'Error: No response from server';
  //       } else {
  //         // Something happened in setting up the request
  //         error = 'Error: Request failed';
  //       }
  //     }
  //   }
  //   return {
  //     data: data,
  //     error: error,
  //   };
  // }
}
