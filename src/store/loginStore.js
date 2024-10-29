import {defineStore} from "pinia";
import requests from "@/utils/requests.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";
import headerStore from "@/store/headerStore.js";
import HeaderStore from "@/store/headerStore.js";
import axios from "axios";

const useLoginStore =defineStore('login',{
    state:()=>({

    }),
    actions:{
        async login(username,password){
            const store=HeaderStore()
            const res=await requests({
                method:'post',
                url:`/base/login/`,
                data:{
                    username:username,
                    password:password
                }
            })
            const data=res.data
            if (data.code===1000){
                localStorage.setItem('token',data.token);
                await store.getCity('chongqi')
                await router.push('/home')
            } else {
                ElMessage.error(`登陆失败,${data.error}`);
            }
        },
        async init() {
            const res = await requests({
                method: 'get',
                url: `/base/dataInfo/`,
            })
            if (res.data.msg === '查询成功') {
                console.log(res.data)
                localStorage.setItem('deviceStatus',res.data.data.status);
                localStorage.setItem('status',res.data.data['temperatureInfo']['info']['WBGTout']);
            }
        }
    }
})
export default useLoginStore;