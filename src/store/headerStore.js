import {defineStore} from "pinia";
import requests from "@/utils/requests.js";
import axios from "axios";
import useMainStore from "@/store/mainStore.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";

const useHeaderStore =defineStore('header',{
    state:()=>({
        title:'',
        value:'',
        input:'',
        imgURL:'',
    }),
    actions:{
        async getData(){
            const token=localStorage.getItem('token');
            const res=await requests({
                method:'get',
                url:`/base/data/`,
                headers:{
                    authorization:token
                }
            })
            const data=res.data
            this.title=data.data.title
            this.imgURL=data.data.imgURL
        },
        async getCity(location){
            const res=await axios({
                method:'get',
                url:`https://geoapi.qweather.com/v2/city/lookup`,
                params:{
                    key:'25899d95c0f649c29c3a372f663272f9',
                    location:location
                }
            })
            const data=res.data
            if (data.code==='200'){
                await localStorage.setItem('name',data.location[0].name)
                await localStorage.setItem('id',data.location[0].id)
                await localStorage.setItem('lat',data.location[0].lat)
                await localStorage.setItem('lon',data.location[0].lon)
            }
        },
        async reset(value){
            await this.getCity(value)
            const store=useMainStore()
            await store.nowWeather()
            await store.nowAir()
            await store.forecastWaring()
            await store.forecastRain()
        },
        exit(){
            localStorage.clear()
            router.push('/login')
        },
        async changeInfo(){
            const res=await requests({
                method:"post",
                url:`/base/data/`,
                data:{
                    title:this.input
                },
                headers:{
                    authorization:localStorage.getItem('token'),
                }
            })
            const data=res.data
            if(data.msg==='修改成功'){
                ElMessage.success('修改成功')
                this.title=data.data.title
                this.input=''
            }
        },
        async test(){
            const res=await axios({
                method:'post',
                url:'https://app.bjjttec.com/base/device/list/',
                headers:{
                    token:'a616daef98191b59c1941cee896c3167',
                    "Content-Type": 'application/json',
                }
            })
            const data=res.data
            console.log(data)
            if (data.code==='00'){
                console.log(data)
            }
        }
    },

})
export default useHeaderStore