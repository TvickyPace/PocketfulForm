import axios from "axios";

export default async function apiCallFunction(url, body) {
  try {
    let response = await axios.post(url, body);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
