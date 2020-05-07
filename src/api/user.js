export const login = ({ username, password }) => {
  const data = {
    username,
    password
  }
  return ServiceRequest.post('user/login', data);
}

/* 获取token */
export const getAuthorization = ({ appid, secret }) => {
  const data = {
    appid,
    secret
  }
  return ServiceRequest.post('token/getToken', data);
}
