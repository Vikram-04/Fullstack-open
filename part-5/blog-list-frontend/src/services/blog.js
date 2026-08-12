import axios from "axios";
const baseUrl = "/api/blogs";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

let token = "";
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const create = async (blogObject) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };
  const response = await axios.post(baseUrl, blogObject, config);
  return response.data;
};

export default { setToken, create, getAll };
