import ApiAbstract from "@/apis/apiAbstract"
import { IAction } from "#/action"

class Action extends ApiAbstract<IAction> {
  protected url: string = "/actions"
}

const actionApi = new Action()

export default actionApi
