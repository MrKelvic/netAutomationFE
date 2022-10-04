import API from '@/api/api'
import {headers} from '@/api/config'
let API_request = async function(type, url,data,header,errorMessage,temp) {
        // console.log(temp," tepm")
        let req;
        try {
            if (type == "delete") req = await API().delete(url, { headers: { 'Authorization': header.protected ? 'Bearer ' + header.token : null }, data:data});
            else if (type == "get") req = await API()[type](url, { headers: headers[type](header.token, header.protected, null), params: data })
            else req = await API()[type](url, data, header.protected ? { headers: { 'Authorization': header.protected ? 'Bearer ' + header.token : null } } : null)
            return { passed: true, data: req.data }
        } catch (error) {
            console.log("NETWORK ERROR")
            // console.dir(error)
            // check to see if response came with an error mess else generic else empty obj
            // return false
            return {passed:true,data:temp}||{ passed: false, data: errorMessage || (error?.response?.data?.err) || [] }
        }
    }

export default API_request;