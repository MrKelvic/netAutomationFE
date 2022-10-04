import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'

let withRoute=(route)=>()=>import (/*webpackChunkName:"view-[request]"*/ `@/routes/${route}.vue`)
// let withPath=(path)=>()=>import (/*webpackChunkName:"view-[request]"*/ `@/${path}.vue`)

const routes = [
  {
    path: '/',
    name: 'root',
    component: withRoute('root/root')
  },
  {
    path: '/login',
    name: 'login',
    component: withRoute('loginroute/loginroute')
  },
  {
    path: '/app',
    name: 'app',
    component: withRoute('app/app'),
    beforeEnter:()=>{
      // to,from,next
    },
    props:true,
    children:[
      {
        path: 'inventory',
        name: 'inventory',
        component: withRoute('inventory/inventory'),
        children:[
          {
            path:'interact/:ip',
            name: 'interact',
            component: withRoute('inventory/interact'),
            props:true
          },
        ]
      },
      {
        path: 'auto',
        name: 'auto',
        component: withRoute('auto/auto'),
        props:true,
      },
      {
        path: 'commands',
        name: 'commands',
        component: withRoute('commands/commands'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: withRoute('dashboard/dashboard'),
      }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
