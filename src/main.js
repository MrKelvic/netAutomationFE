import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
// icon pack
import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'
import Antd from 'ant-design-vue';

import "ant-design-vue/dist/antd.css";
// Font awesome
import "./assets/fontawesome-free-6.1.1-web/css/all.min.css"

// console.log(Antd)
createApp(App)
.use(router)
.use(store)
.use(Antd)
.use(mdiVue,{icons: mdijs})
// .component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')