import Axios from "./Axios"

const http = new Axios({
  baseURL: import.meta.env.DEV ? import.meta.env.VITE_DEV_URL : import.meta.env.VITE_PROD_URL,
  timeout: 5000,
})

export default http
