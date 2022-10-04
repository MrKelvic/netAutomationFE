const fs=require('fs');
const path=require('path')
let template=(name)=>`
<template>
    <div>

    </div>
</template>

<script>
// imports goes here
export default {
  name: '${name}',
  props:[],
  components: {

  },
  computed:{

  },
  data(){
    return{

    }
  },
  methods:{

  },
  mounted(){

  },
  watch:{

  }
}
</script>
<style scoped>

</style>
`

function createDir(dirName,fileName,createFile){
    let dir=path.join(__dirname).substring(0,(path.join(__dirname).lastIndexOf('/')))+'/src/'+dirName+'/'+fileName+'/';
    fs.mkdirSync(dir)
    console.log(`Created dir ${dir}`)
    if(createFile){
        fs.writeFileSync(dir+'/'+fileName+'.vue',template(fileName),(err)=>{
            if(err){
                console.log(`Failed to create ${fileName}.vue created at \n ${dir}`)
            }
        })
    }
    console.log(`File created ${fileName}.vue created`)
    
}



function index(){
    let arg=process.argv.map((e,index)=>(![0,1].includes(index)?e.toLowerCase():null)).filter(e=>e);
    // arg[0]=>type
    // arg[1]=>Foldername
    // arg[2]=> create file (default is false which creates the file )
    arg[0]=arg[0]?arg[0][0].toLowerCase():null;
    if(arg.length==0||arg[0]=='h'||arg[0]=='help'){
        return false;
    }else{
        if(arg[0][0]=="c"){
            // create component
            createDir(`components`,arg[1],!arg[2])
        }else if(arg[0][0]=="r"){
            // create route
            createDir(`routes`,arg[1],!arg[2])
        }else if(arg[0][0]=="s"){
            // create route
            createDir(`routes/${arg[1]}`,arg[2],!arg[3])
            // create child route routes/PARENT_ROUT ROUTE_NAME
        }
        else if(arg[0][0]=="v"){
            //create view
            createDir(`views`,arg[1],!arg[2])
        }
        // 
    }
}
index();