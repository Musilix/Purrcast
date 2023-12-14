import axios from "axios";

//TODO - probably move this somewhere else
interface User {
  id: number;
  username: string;
  name: string;
}
export default class TestService {
  async getTestData(): Promise<User[] | string> {
    let data: User[];

    try {
      // TODO - change backend hostname once domain a domain is established
      const res = await axios.get(`http://localhost:8080/users`);
      data = res.data;
    } catch (e) {
      console.error(`There was an issue with the test request: ${e}`);
      return "Nothing";
    }

    return data;
  }

  async addUser(username: string, name?: string): Promise<User> {
    let data: User;

    try {
      const res = await axios.post(`http://localhost:8080/users`, {
        name: name,
        username: username,
      });
      data = res.data;
    } catch (e) {
      console.error(`There was an issue with the test request: ${e}`);
      return { id: -1, username: "", name: "" };
    }

    return data;
  }
}
