import axios from 'axios';
import { storage } from '../utils/Fun';
import { Message } from 'element-ui'

const apiConfig = {
    baseURL: '/api',
    timeout: 60000,
    responseType: 'json',
    withCredentials: false, //跨域请求是否需要凭证
    headers: {
        'content-type': 'application/json;charset=UTF-8'
    }
}

const instance = axios.create(apiConfig);

instance.interceptors.request.use(
    config => {
        config.headers.token = storage.get('token');
        return config;
    },
    error => {
        Promise.reject(error);
    }
)
instance.interceptors.response.use(
    response => {
        // console.log('response', response);
        let data = response.data
        if (data.status === undefined || data.status === 0) {
            Message.error(data.msg || '请求错误')
        }
        return { data: response.data }
    },
    error => {
        //处理错误逻辑
        if (error.response.status === 401) {
            Message.error('登录信息验证失败，3秒后会自动跳转登录页面~');
            setTimeout(() => {
                window.location.replace('/');
            }, 3000);
        } else {
            Message.error('请求失败，请稍后重试！')
        }
        return Promise.reject(error)
    }

)

const request = (url, method) => params =>
    instance[method](url, params)
    .then(res => {
        return res
    })
    .catch(err => {
        console.error(err)
    })
export const get = url => request(url, 'get');
export const post = url => request(url, 'post');