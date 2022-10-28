
<template>
    <div>
      <div>
        <div class="deviceModule_cont">
          <div class="deviceModule">
            <div class="pan" v-for="i in parseInt((interfaceList.length+1)/2)" :key="i">
              <div class="interfaceGroup">
                <span v-for="x in 2" class="interface" :key="x">
                  <span v-if="interfaceList[rendIn(x,i)]">
                    <span v-if="x==1" class="intTitle">
                      {{interfaceList[rendIn(x,i)].shortName}}
                    </span>
                    <span :style="`background:${interFaceColor(interfaceList[rendIn(x,i)].state,interfaceList[rendIn(x,i)].connected)};`" class="interCard">
                      <span :style="x==1?'top:0px;':'bottom:0px;'" class="shdow-l"></span>
                      <span :style="x==1?'top:0px;':'bottom:0px;'" class="shdow-r"></span>
                    </span>
                     <span v-if="x!=1" class="intTitle">
                      {{interfaceList[rendIn(x,i)].shortName}}
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <ul class="key">
            <li>
              <span>Administratively Down</span>
              <span :style="`background:${interFaceColor(false,false)};`" class="key-code"></span>
            </li>
             <li>
              <span>Disconnected</span>
              <span :style="`background:${interFaceColor(true,false)};`" class="key-code"></span>
            </li>
            <li>
              <span>Connected</span>
              <span :style="`background:${interFaceColor(true,true)};`" class="key-code"></span>
            </li>
          </ul>
        </div>
        <div>
          <!-- {{interfaceList[0]}} -->
          <div class="content-table">
             <a-table v-if="interfaceList.length" :columns="tableCols" :data-source="interfaceList" :scroll="{x:1300}" :pagination="{ pageSize:20,size:'small',showSizeChanger:false }">
              <template #state="{ text }">
                <a-tag :color="interFaceColor(text,true)" style="color:var(--color);">
                  {{ text?'Up':'Admin Down' }}
                </a-tag>
              </template>
              <template #connected="{ text }">
                <a-tag :color="interFaceColor(true,text)" style="color:var(--color);" >
                  {{ text?'Up':'Down' }}
                </a-tag>
              </template>
              <template #routed="{ text }">
                <span>{{text?'routed port':'switchport'}}</span>
              </template>
              <template #edit="{ record }">
              <span>
                <a-button @click="editThis(record)" type="link">
                  <!-- {{record.mode}} -->
                  <i class="fa-regular fa-edit"></i>
                </a-button>
              </span>
            </template>
            </a-table>
          </div>
        </div>
        <div class="drawer">
          <!--  -->
          <a-modal v-model:visible="isInEdit.show" 
          :centered="true" :destroyOnClose="true" 
          :closable="false" :maskClosable="false"
          :bodyStyle="{height:100}"
          @ok="saveEdit"
          @cancel="editClose" title="Interface">
          <!-- <p>{{this.isInEdit.int}}</p> -->
            <h2 v-if="isInEdit.int">{{isInEdit.int.fullName}}
              <a-tag v-if="isInEdit.int.subId" color="blue" >
                  sub interface
                </a-tag>
            </h2>
             <a-form layout="vertical" :model="isInEdit.int">
              <a-form-item :colon="false" label="Administrative state">
                <a-switch v-model:checked="isInEdit.int.state" />
              </a-form-item>
              <a-form-item :colon="false" label="Routed Interface">
                  <a-switch :disabled="!allowL2" @change="layerChange" v-model:checked="isInEdit.int.routed" />
                  <span style="display:inline-block;margin:0px 20px;">{{isInEdit.int.routed?'routed port':'switch port'}}</span>
                  <!-- <a-radio-group @change="layerChange" v-model:value="isInEdit.int.layer">
                    <a-radio :disabled="!allowL2" :value="false">Switch port</a-radio>
                    <a-radio :disabled="isInEdit.int.mode=='trunk'" :value="true">Routed port</a-radio>
                  </a-radio-group> -->
                </a-form-item>
              <div v-if="isInEdit.int.state">
                <a-form-item v-if="allowL2&&!isInEdit.int.routed" :colon="false" label="Interface mode">
                  <a-radio-group @change="controlIntType" v-model:value="isInEdit.int.mode">
                    <a-radio value="access">Access</a-radio>
                    <a-radio value="trunk">Trunk</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="allowL2">
                  <div v-if="isInEdit.int.mode=='access'&&!isInEdit.int.routed">
                    <a-form-item :colon="false" label="Data VLAN">
                      <a-input v-model:value="isInEdit.int.data" />
                    </a-form-item>
                    <a-form-item :colon="false" label="Voice VLAN">
                      <a-input v-model:value="isInEdit.int.voice" />
                    </a-form-item>
                  </div>
                  <div v-if="isInEdit.int.mode=='trunk'&&!isInEdit.int.routed">
                    <a-form-item :colon="false" label="Allowed VLANs">
                      <a-input v-model:value="isInEdit.int.allowedVlans" />
                    </a-form-item>
                    <a-form-item :colon="false" label="Native VLAN">
                      <a-input v-model:value="isInEdit.int.nativeVlan" />
                    </a-form-item>
                  </div>
                </div>
                <div v-if="isInEdit.int.routed&&isInEdit.int.mode!='trunk'">
                  <a-form-item :colon="false" label="IP address">
                    <a-input v-model:value="isInEdit.int.ip" />
                  </a-form-item>
                  <a-form-item :colon="false" label="Mask">
                    <a-input v-model:value="isInEdit.int.mask" />
                  </a-form-item>
                </div>
                <a-form-item :colon="false" label="Description">
                  <a-input v-model:value="isInEdit.int.description" />
                </a-form-item>
              </div>
              <div v-else>
                <p>Interface is down</p>
              </div>
            </a-form>
          </a-modal>
        </div>
      </div>
    </div>
</template>

<script>
// imports goes here
/* Work on sub interfaces */
// import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import genFns from '@/api/generalFns';
export default {
  name: 'interfaceview',
  props:['content','deviceType'],
  components: {
    },
  computed:{
    allowL2(){
      // if interface is not a vlan nor a loopback and device is a switch all interface to be layer 2
      return !['Vlan','Loopback'].includes(this.isInEdit.int.module)&&['switch'].includes(this.deviceType)
    },
    isSubInterface(){
          return true
    },
    rendIn(){
      return (x,i)=>(x==1?((2*i)-1):(2*i))-1
    },
    interFaceColor(){
      return (adminState,connected)=>{
          if(adminState&&connected) return '#00a947'//'#0eaf52';
          if(!adminState) return '#7e0303';
          return '#4e4b4b'
      }
    }
  },
  data(){
    return{
      isInEdit:{
        int:null,
        show:false,
        temp:null,
        removed:[]
      },
      interfaceList:[],
      tableCols:[],
      compareCache:[],
      changes:[]
    }
  },
  methods:{
    cleanUpChanges(changes){
      return changes
    },
    computeChanges(){
      // console.clear()
      const index=this.changes.findIndex(e=>e.id==this.isInEdit.int.fullName);
      const change=genFns.checkDiff(this.compareCache[this.isInEdit.int.index],this.isInEdit.int)
      // console.log("change :: ",change)
      if(index==-1){
        this.changes.push({
            id:this.isInEdit.int.fullName,
            type:'interfaces',
            changes:change
          })
      }else{
        this.changes[index].changes=change
      }
      console.log(this.changes)
      this.$emit("changeEvent",{target:'interfaces',value:this.cleanUpChanges(this.changes)})
    },  
    saveEdit(){
      this.computeChanges()
      this.interfaceList[this.isInEdit.int.index]=Object.assign({},JSON.parse(JSON.stringify(this.isInEdit.int)))
      this.isInEdit.int=null
      this.isInEdit.show=false
      this.isInEdit.removed=[]
      // console.log("addedDiff :: ",addedDiff(this.isInEdit.int,this.isInEdit.temp))
      // console.log("deletedDiff :: ",deletedDiff(this.isInEdit.int,this.isInEdit.temp))
      // console.log("updatedDiff :: ",diff(this.isInEdit.int,this.isInEdit.temp))

    },
    editThis(record){
      // console.log(record)
      this.isInEdit.int=record
      this.isInEdit.show=true
      this.isInEdit.removed=[]
      //store state of what is to be changed 
      this.isInEdit.temp=Object.assign({},JSON.parse(JSON.stringify(this.isInEdit.int)))
    },
    editClose(){
      // reset back to initial ignoring all changes
      this.interfaceList[this.isInEdit.int.index]=this.isInEdit.temp
      this.isInEdit.show=false;
      this.isInEdit.int=null
      this.isInEdit.temp=null
    },
    layerChange(e){
      const l3=[{key:"ip",def:''},{key:"mask",def:''},{key:"ip_helper",def:''}]
      const l2=[{key:"mode",def:'access'},{key:"allowedVlans",def:'all'},{key:"voice",def:null},{key:"data",def:'1'},{key:"nativeVlan",def:'1'}]
      const isChanged=this.isInEdit.temp.routed!=this.isInEdit.int.routed//e.target.value
      if(!this.isInEdit.int.routed){
        //if changed to layer2 remove all L3 properties
        for(let remove of l3){
          if(isChanged){
            //check if value has been stored in cached if not store in cache array
            const f=this.isInEdit.removed.find(e=>e.key==remove.key)
            if(!f) this.isInEdit.removed.push({key:remove.key,value:this.isInEdit.int[remove.key]})
          }else{
            // if value has not changed from what it was before then remove from cached
            this.isInEdit.removed=this.isInEdit.removed.filter(e=>e.key==remove.key)
          }
          // remove changed key from the actual value
          delete this.isInEdit.int[remove.key]
        }
        for(let add of l2){
          // add L2 key value pairs to the new value
          this.isInEdit.int[add.key]=add.def
        }
      }
      else{
        for(let remove of l2){
          if(isChanged){
            const f=this.isInEdit.removed.find(e=>e.key==remove.key)
            if(!f) this.isInEdit.removed.push({key:remove.key,value:this.isInEdit.int[remove.key]})
          }else{
            this.isInEdit.removed=this.isInEdit.removed.filter(e=>e.key==remove.key)
          }
          delete this.isInEdit.int[remove.key]
        }
        for(let add of l3){
          this.isInEdit.int[add.key]=add.def
        }
      }
      // console.log(this.isInEdit.removed)
    },
    controlIntType(e){
      this.isInEdit.int.routed=e.target.value=='trunk'?false:this.isInEdit.int.routed
    },
    genColumns(){
      if(!this.interfaceList[0]) return []
      let filters=["index","name","ip_helper","module","shortName","description","id","allowedVlans","voice","nativeVlan"]
      let temp=Object.keys(this.interfaceList[0]).filter(e=>!filters.includes(e))
      let tempL3=Object.keys(this.interfaceList[this.interfaceList.length-1]).filter(e=>!filters.includes(e)&&!temp.includes(e))
      let smallWidth=["connected","state","routed","data","outgoing_acl","inbound_acl","mode"]
      this.tableCols=[...temp,...tempL3].map(e=>({
        title:e,
        key:e,
        dataIndex:e,
        slots:{ customRender:e},
        width:smallWidth.includes(e)?100:150
      }))
      this.tableCols.push({
        title:"Edit",
        dataIndex:"edit",
        key:"edit",
        slots: { customRender:"edit"}
      })
      this.tableCols[0].fixed="left"
      this.tableCols[0].width=200
      this.tableCols[this.tableCols.length-1].fixed="right"
      this.tableCols[this.tableCols.length-1].width=40
    },
    genLinearInterface(){
        let interList=[]
        let index=0
        // console.log("Content::: ",this.content)
        for(let layer in this.content){
          for(let l2module in this.content[layer]){
            for(let intFace of this.content[layer][l2module].members){
              interList.push({index:index,...intFace})
              this.compareCache.push({index:index,...intFace})
              index+=1
            }
          }
        }
        // console.clear()
        this.interfaceList=interList
        // console.log("compareCache:: ",this.compareCache)
        this.genColumns()
    }
  },
  mounted(){
    this.genLinearInterface()
  },
  watch:{

  }
}
</script>
<style scoped>
.deviceModule_cont{
  margin:40px 0px;
}
.deviceModule{
  background:var(--color);
  color:var(--background);
  border:1px solid var(--g-color);
  width:fit-content;
  display:flex;
  padding:6px;
  border-radius:5px;
  margin:20px 0px;
}
.pan{
  /* border:1px solid green; */
  margin:0px 7px;
}
.interfaceGroup{
  display:grid;
}
.interface{
  margin:3px 0px;
}
.interface>span{
  display:grid;
  place-content:center;
  place-items:center;
}
.intTitle{
  font-size:0.9em;
}
.interCard{
  display:block;
  /* background:green; */
  position:relative;
  width:30px;
  height:28px;
}
.shdow-l{
  position:absolute;
  background:#fff;
  left:0px;
  width:5px;
  height:5px;
}
.shdow-r{
  position:absolute;
  background:#fff;
  right:0px;
  width:5px;
  height:5px;
}
.key{
  display:flex;
  margin:10px 0px;
}
.key>li{
  margin-right:10px;
  display:flex;
  place-content:center;
  place-items:center;
  color:var(--color);
  /* color:var(--color-grey); */
}
.key-code{
  width:13px;
  height:13px;
  border-radius:30px;
  display:inline-block;
  margin:0px 4px;
}
</style>
