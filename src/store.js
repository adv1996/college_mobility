import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    boundary: [0, 100],
    tier: 'Ivy Plus',
  },
  mutations: {
    resize (state, payload) {
      state.boundary = payload;
    },
    changeTier (state, payload) {
      state.tier = payload
    }
  },
  getters: {
    number: state => {
      return state.boundary
    },
    tier: state => {
      return state.tier
    }
  },
  actions: {
    setBoundary ({commit}, payload) {
      commit('resize', payload)
    },
    setTier({commit}, payload) {
      commit('changeTier', payload)
    }
  }
})

export default store;