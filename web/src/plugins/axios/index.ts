import Axios from './Axios';

const baseURL = import.meta.env.DEV ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL;
const http = new Axios({
  baseURL,
  timeout: 5000
});
export default http;
