const {get} =  require('@/service/session')
let gen=(string,ty,protect)=>{
    if(protect) return {url:string,type:ty,header:{protect:Boolean(protect),token:JSON.parse(get("activeUser")).token||""}}
    return {url:string,type:ty,header:{protect:Boolean(protect)}}
}
let urls={
    user:{
        login:gen('login',"post",false)
    },
    application:{
        session:gen('session',"post",false),//confirm session token
        inventory:{
            get:gen('inventory',"get",true),
            add:gen('inventory',"post",true),
            update:gen('inventory',"put",true),
            delete:gen('inventory',"delete",true),
        },
        state:{
            get:gen('state',"get",true),
        },
        engine:{
            auto:gen('engine',"post",false),
            report:gen('report',"post",false),

        }
    }
}

module.exports=urls