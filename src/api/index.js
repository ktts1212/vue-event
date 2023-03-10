import request from '@/utils/request'

export const registerApi = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'post',
    data: {
      username,
      password,
      repassword
    }
  })
}

export const loginApi = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export const getUserInfoApi = () => {
  return request({
    url: '/my/userinfo',
    method: 'get'
  })
}

export const getMenusApi = () => {
  return request({
    url: '/my/menus'
  })
}

export const updateUserInfoApi = ({ id, email, nickname, username, user_pic }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      email,
      nickname,
      username,
      user_pic
    }
  })
}

export const updateUserAvatarApi = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

export const updateUserPwdApi = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
