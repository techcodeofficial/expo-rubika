import axios from "axios"
import {getRequestHeader, getApi} from "../helpers"
const rubinoRequest = async (body)=>{
  return await axios.post(getApi("rubino"),body)
}
export default rubinoRequest