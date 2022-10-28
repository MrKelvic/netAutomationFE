import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist'


export default createStore({
  plugins: [new VuexPersistence().plugin],
  state: {
    auth:null,
    application:{
      automatePayload:null
    }
  },
  mutations: {
    addAutomatePayload(state, payload) {
      state.application.automatePayload = payload?payload:null
    },
  },
  actions: {
    setAutomatePayload({ commit },payload) { 
        commit('addAutomatePayload',payload)
    },
  },
});