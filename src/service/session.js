/* SESSION STORAGE ENGINE */

let write=(data,exp)=>{
    // data[0] => attribute name; data[1]=> attribe data
    const d = new Date();
    d.setTime(d.getTime() + (exp * 24 * 60 * 60 * 1000));
    document.cookie = `${data[0]}=${data[1]};expires=${d.toUTCString()};path=/`;
    return get(data[0]);
}

let add=(data)=>{
    // check if name already exists
    console.log("adding session data ",data)
    if(get(data[0])) remove(data[0]);
    document.cookie=`${data[0]}=${data[1]};`+document.cookie;
    return get(data[0]);
}

let remove=(attribe)=>{
    let ca = document.cookie.split(';');
    let nca=``;
    for(let i = 0; i < ca.length; i++) {
        let v=ca[i].split("=");
        if(v[0].trim()==attribe) continue;
        nca+=ca[i]
    }
    document.cookie=nca;
    return true;
}
let nuke=()=>{
    document.cookie=""
}

let get=(attribe)=>{
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let v=ca[i].split("=");
        if(v[0].trim()==attribe) return v[1];
    }
    return false;
}

module.exports={write,add,remove,get,nuke}