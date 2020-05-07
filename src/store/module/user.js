import {
  login,
  getAuthorization,
  // getUserInfo,
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
     // 获取token
     handleAuthorization ({ commit }, { appid, secret }) {
      // username = username.trim()
      return new Promise((resolve, reject) => {
        getAuthorization({
          appid,
          secret
        }).then(res => {
          // const data = res.data
          // console.log('test.js handleAuthorization res', res);
          const { access_token, token_type } = res;
          const authToken = `${token_type} ${access_token}`;
                // console.log("getToken authToken", authToken);
                // CommonFunc.setCookie("authorization", authToken);
          commit('setToken', authToken)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 登录
    handleLogin ({ commit }, { username, password }) {
      username = username.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          const data = res.data
          console.log('test.js handleLogin res', res);

          // commit('setToken', data.token)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
      })
    },
    // 获取用户相关信息
    // getUserInfo ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     try {
    //       getUserInfo(state.token).then(res => {
    //         const data = res.data
    //         commit('setAvatar', data.avatar)
    //         commit('setUserName', data.name)
    //         commit('setUserId', data.user_id)
    //         commit('setAccess', data.access)
    //         commit('setHasGetInfo', true)
    //         resolve(data)
    //       }).catch(err => {
    //         reject(err)
    //       })
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    // },
  }
}
