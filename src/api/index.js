import request from '@/utils/request'

export const registerApi = () => {
  return request({
    url: '/api/reg',
    method: 'post',
    data: {
      username: 'qwertyqew',
      password: '111111',
      repassword: '111111'
    }
  })
}
