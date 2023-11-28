import axios from "axios";

export default class TestService {
  async getTestData(): Promise<string> {
    let res;

    try {
      // TODO - change backend hostname once domain a domain is established
      res = await axios.get(`http://localhost:8080/`);
      res = res.data;
    } catch (e) {
      console.error(`There was an issue with the test request: ${e}`);
      return "Nothing";
    }

    return res.data.message;
  }
}
