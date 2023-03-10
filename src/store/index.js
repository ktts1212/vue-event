import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoApi } from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}
  },
  getters: {
    username (state) {
      return state.userInfo.username
    },
    nickname: (state) => { return state.userInfo.nickname },
    user_pic: state => state.userInfo.user_pic

  },
  mutations: {
    updateToken (state, val) {
      state.token = val
    },
    updateUserInfo (state, val) {
      state.userInfo = val
    }
  },
  actions: {
    async initUserInfo (store) {
      const { data: res } = await getUserInfoApi()
      console.log(res.code)
      if (res.code === 0) {
        store.commit('updateUserInfo', res.data)
      }
    }
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
