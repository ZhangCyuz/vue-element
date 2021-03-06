// import request from '@/utils/request'
import request from '@/utils/request'
import qs from 'qs'

export function login(data) {

  return request({
    url: '/webUsernameLogin',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
