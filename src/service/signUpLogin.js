
/* Handles user logins, signup and sessions */
import api from './index';
/* import url and properties */
import urls from "@/api/urls"
/* import sessions handler */
import sessions from './session'

/* Error interpretation function */

/* Save session token */

/* Test user data */
export default{
    // call API on ulrs
    // getCourse: (data, token) => request(ACTION,URL,DATA,FALLBACKERRDATA,{token:token,protected: true })
    // getCourse: (data, token) => request(ACTION,URL,DATA,{token:token,protected: true },error,TEMPRESPONS)

   async login(data){
        let {url,type,header}=urls.user.login
        let req=await api(type,url,data,header,{},{id:1,fname:"Kabs",lname:"Kyey",token:"FALLBADATACKERACTIONRDATA"})
        if(req.passed){
            // store session
            (sessions.write(["activeUser",JSON.stringify(req.data)]))
        }
        return req
    },
    signUp(){

    },
    async checkUserSession(){
        // check if user
        /* send token and user id // recieves username and prev */
        let {url,type,header}=urls.application.session
        let activeUser=JSON.parse(sessions.get("activeUser"))
        let req=await api(type,url,{id:activeUser.id,token:activeUser.token},header,{},{fname:"Kabs",lname:"Kyey",prev:1})
        return req
    }
}