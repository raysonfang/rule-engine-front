import request from '@/axios'

// 获取登录用户信息 import {getUserInfo} from "@/api"
export function getUserInfo() {
    return request({
        url: '/user/getUserInfo',
        method: 'post',
    })
}
