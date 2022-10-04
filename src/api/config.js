let configs={
    baseUrl:window?.location?.hostname||"127.0.0.1",
    port:8001,
    headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,PUT,POST,DELETE"},
}
let headers={
    get: (token, protect) => { return { 'Authorization': protect ? 'Bearer ' + token : null } },
    post: (token, protect) => { return { 'Authorization': protect ? 'Bearer ' + token : null } },
    put: () => (token, protect) => { return { 'Authorization': protect ? 'Bearer ' + token : null } },
    delete: () => (token, protect) => { return ({ 'Authorization': protect ? 'Bearer ' + token : null }) },
}
module.exports= {configs,headers};