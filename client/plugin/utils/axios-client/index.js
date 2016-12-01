import axios from 'axios';

export default axios.create({
  baseURL: `${process.env.SD_API_URL}/api/v1`,
  responseType: 'json'
});
