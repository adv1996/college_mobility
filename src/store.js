import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    boundary: [0, 100],
    tier: 'Ivy Plus',
    percentage: '65',
  },
  mutations: {
    resize (state, payload) {
      state.boundary = payload;
    },
    changeTier (state, payload) {
      state.tier = payload
    },
    changePercentage (state, payload) {
      state.percentage = payload;
    }
  },
  getters: {
    number: state => {
      return state.boundary
    },
    tier: state => {
      return state.tier
    },
    percentage: state => {
      return state.percentage
    }
  },
  actions: {
    setBoundary ({commit}, payload) {
      commit('resize', payload)
    },
    setTier({commit}, payload) {
      commit('changeTier', payload)
    },
    setPercentage({commit}, payload) {
      commit('changePercentage', payload)
    }
  }
})

export default store;