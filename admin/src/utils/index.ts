import Auth from "./auth"
import { fullScreen } from "./fullScreen"
import store from "./store"
import formatDate from "./formatDate"

export const utils = {
  store: new store(),
  auth: new Auth(),
  fullScreen,
  formatDate,
}
