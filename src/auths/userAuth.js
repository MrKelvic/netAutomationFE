import Joi from 'joi';
// import user service
import userService from '@/service/signUpLogin';
// console.log(userService)
let verifyDataPassedByUser=(schema,data)=>{
    try {
        let {value,error} =schema.validate(data);
        // console.log(value,error)
        if(error){
            return{passed:false,data:error.details[0].path[0]=='password'?'Enter password':error.details[0].message.replace('_',' ').replace('"','').replace('"','') }
        }
        return {passed:true,data:value}
    } catch (error) {
        console.log(error)
        return {passed:false,data:"Check credetials"};
    }
}
export default{
    signUp(userCreds){
        let schema=Joi.object({
            fname:Joi.string().required(),
            lname:Joi.string().required(),
            password:Joi.string().min(8).max(32).required(),
            email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
            type:Joi.string()
        })
        let auth=verifyDataPassedByUser(schema,userCreds);
        console.log(auth)
    },
    login(userCreds){
        let schema=Joi.object({
            email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
            password:Joi.string().min(8).max(32).required(),
        })
        let auth=verifyDataPassedByUser(schema,userCreds);
        // console.log(userService," user service")
        if(!auth.passed) return auth.data||"Please provide all credetials in the righ format";
        return userService.login(auth.data)
        // call web service
    },
    checkSession(){
        return userService.checkUserSession()
    }
}
