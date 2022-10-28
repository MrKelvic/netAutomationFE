
/* Handles site management interaction with the server */
import api from './index';
/* import url and properties */
import {application} from "@/api/urls"
let urls=application.engine
export default{
    async engineAction(data){
        let {url,type,header}=urls.auto
        let req=await api(type,url,data,header,{})
        return req
    },
    async genReport(data){
        let {url,type,header}=urls.report
        let req=await api(type,url,data,header,{})
        return req
    },
    async digestChanges(data){
        let {url,type,header}=urls.digestChanges
        let req=await api(type,url,data,header,{})
        return req
    }
}