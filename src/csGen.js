const fs=require('fs');
const { type } = require('os');
const path=require('path')

let read=(template,dirName)=>{
    let dir=path.join(__dirname).substring(0,(path.join(__dirname).lastIndexOf('/')))+'/src/'+dirName;
    fs.readFile(`${dir}.vue`,'utf8',(err,data)=>{
        if(err){
            console.log(err.message);
            return 0;
        }
        if(!data.length) return false;
        else{
            data=data.split("\n").map(e=>e.split('"').map(el=>el.replace(/\s/g,'')));
            let stop=0;
            let down=true;
            let ar=[];
            let trackers=[];
            let l=null
            for(let i=0;i<data.length;i++){
                l=data[i]
                console.log(l)
                if(l[0].includes(template)){
                    stop+=1;
                    continue;
                }
                if(stop==1){
                    // < opened </ close
                    // ar.push(element())
                }
                // console.log(stop,l.includes(template),l)
                if(stop==2) return ar;
            }
            // console.log(data.split("\n"))
        }
    })
}
let element=(type,id)=>{
    return{
        id:id,
        type:type,
        classes:[],
        children:[]
    }
}
function gen(template,dir){
    console.log(read(template,dir))
}

function index(){
    let arg=process.argv.map((e,index)=>(![0,1].includes(index)?e:null)).filter(e=>e);
    // arg[0]=>templete
    //arg[1]=>dir
    if(arg.length==0||arg[0]=='h'||arg[0]=='help'){
        return false;
    }else{
        gen(arg[0],arg[1])
    }
}
index();