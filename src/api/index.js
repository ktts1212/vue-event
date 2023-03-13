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

export const getArtCateListApi = () => {
  return request({
    url: '/my/cate/list'
  })
}

export const addArtCateListApi = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

export const updateArtCateListApi = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

export const deleteArtCateListApi = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

export const updateArticleApi = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd
  })
}

export const getArticleListApi = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    method: 'GET',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

export const getArtDetailApi = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

export const delArticleApi = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
