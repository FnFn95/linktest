import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
// import { forEach, hasOneOf, objEqual } from '@/libs/tools'
const { title, cookieExpires, useI18n } = config

// export const TOKEN_KEY = 'token'
export const TOKEN_KEY = 'authorization'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

export const setCookie = (key, value) => {
  Cookies.set(key, value, { expires: cookieExpires || 1 })
}

export const setCookie2 = (key, value, expires) => {
  Cookies.set(key, value, { expires: expires || cookieExpires || 1 })
}

export const getCookie = (key) => {
  const value = Cookies.get(key)
  if (value) return value
  else return false
}

export const removeCookie = (key) => {
  Cookies.remove(key)
}
