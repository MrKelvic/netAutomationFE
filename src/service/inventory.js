
/* Handles site management interaction with the server */
import api from './index';
/* import url and properties */
import {application} from "@/api/urls"
const inventory=application.inventory
const stateUrls=application.state
export default{
    async getInventory(data){
        let {url,type,header}=inventory.get
        let req=await api(type,url,data,header,{})
        return req
    },
    async addInventory(data){
        let {url,type,header}=inventory.add
        let req=await api(type,url,data,header,{})
        return req
    },
    async updateInventory(data){
        let {url,type,header}=inventory.update
        let req=await api(type,url,data,header,{})
        return req
    },
    async deleteInventory(data){
        let {url,type,header}=inventory.delete
        console.log(data)
        let req=await api(type,url,data,header,{})
        return req
    },
    async getState(data){
        let {url,type,header}=stateUrls.get
        let req=await api(type,url,data,header,{})
        return req
    }
}