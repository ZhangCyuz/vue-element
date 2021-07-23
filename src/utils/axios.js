import Axios from 'axios'
import {
  Message
} from 'element-ui'
import { getToken } from './auth'
import qs from 'qs'
import Cookies from 'js-cookie'

const myAxios = Axios.create({
  baseURL: Cookies.get('BASE_URL'),
  timeout: 3000
})

// 携带token
console.log(getToken())
myAxios.defaults.headers.common['token'] = getToken()
myAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// request interceptor
myAxios.interceptors.response.use(function(response) {
  console.log(response)
  if (response.data.code !== '0') {
    Message({
      message: response.data.msg || 'error',
      type: 'error',
      duration: 1000
    })
    return Promise.reject(response.msg)
  }
  return response
}, function(error) {
  return Promise.reject(error)
})

export function get(url, params) {
  return myAxios({
    method: 'get',
    params,
    url,
    timeout: 10000
  })
}

export function post(url, data) {
  return myAxios({
    method: 'post',
    data: qs.stringify(data),
    url,
    timeout: 10000,
    dataType: 'json'
  })
}

export function post_array(url, data) {
  return myAxios({
    method: 'post',
    data: data,
    url,
    timeout: 10000,
    dataType: 'json'
  })
}
