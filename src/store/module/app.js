import {
  localSave,
  localRead
} from '@/libs/util'

export default {
  state: {
    local: localRead('local'),
  },
  getters: {
    // langLocal: state => state.local
  },
  mutations: {
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    }

  },
  actions: {
  }
}
