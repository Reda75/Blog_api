import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)
import axios from "axios"
export default new Vuex.Store({
  state :{
    jwt_token :'',
    users: [],
  },

  getters :{
    getToken : state => {
      return state.jwt_token;
    },
    getUsers : state => {
      return state.users;
    },

  },

  mutations :{
    setToken(state, payload){
      state.jwt_token = payload
    },
    getUsers(state, payload){
      console.log(payload)
      state.users = payload;
      console.log(state.users)
    },

  },

  actions: {
    setToken(context, payload) {
      context.commit('setToken', payload)
    },

    getUsers(context) {
      console.log("in store.setUsers")
      const path = 'http://localhost:5000/api/v1/users/'
      axios.get(path)
        .then((res) => {
          console.log(res)
          console.log(res.data)
          context.commit('getUsers', res.data)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
})
