// this file handles the base connection to the server
import axios from 'axios';
import {configs} from '@/api/config';
export default()=>{
    return axios.create({
        baseURL:`http://${configs.baseUrl}:${configs.port}/`,
        headers:configs.headers
    })
}