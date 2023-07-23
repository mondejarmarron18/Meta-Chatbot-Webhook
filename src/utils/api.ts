import axios from 'axios';

const api = axios.create({
  baseURL: 'https://graph.facebook.com/v17.0',
});

export default api;
