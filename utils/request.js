import axios from "axios"
import {getRequestHeader, getApi} from "../helpers"
const request = async (body)=>{
  return await axios.post(getApi("api"),body,{
    headers:getRequestHeader()
  })
}
export default request