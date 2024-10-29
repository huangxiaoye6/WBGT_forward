import {defineStore} from "pinia";
import axios from "axios";
import requests from "@/utils/requests.js";

const useMainStore = defineStore('main',{
    state: ()=>({
        deviceStatus:localStorage.getItem('deviceStatus'),
        province:'',
        weather:'',
        temperature:'',
        windDirection:'',
        windPower:'',
        humidity:'',
        reportTime:'',
        feelsLike:'',
        windSpeed:'',
        precip:'',
        pressure:'',
        vis:'',
        aqi:'',
        category:'',
        pm10:'',
        pm2p5:'',
        no2:'',
        so2:'',
        co:'',
        o3:'',
        createTime:'',
        Ta:'',
        Tg:'',
        Tnw:'',
        Rh:'',
        WBGTin:'',
        WBGTout:Number(localStorage.getItem('status')),
        sender:'',
        text:'',
        title:'',
        updateTime:'',
        sources:'',
        air_sources:'',
        WBGTout_label:[],
        WBGTout_value:[],
        is_WBGOutShow:false,
        summary:'',
        minutely_label:[],
        minutely_value:[],
        is_forecastRainShow:false,
    }),
    actions:{
        async nowWeather(){
            const res=await axios({
                method:'get',
                url:'https://devapi.qweather.com/v7/weather/now',
                params:{
                    key:'25899d95c0f649c29c3a372f663272f9',
                    location:localStorage.getItem('id'),
                }
            })
            const data=res.data
            if(data.code==='200'){
                this.province=localStorage.getItem('name')
                this.weather=data['now']['text']
                this.temperature=data['now']['temp']
                this.windDirection=data['now']['windDir']
                this.windPower=data['now']['windScale']
                this.humidity=data['now']['humidity']
                const date=new Date(data['updateTime'])
                this.feelsLike=data['now']['feelsLike']
                this.windSpeed=data['now']['windSpeed']
                this.precip=data['now']['precip']
                this.pressure=data['now']['pressure']
                this.vis=data['now']['vis']
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并补零
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                this.reportTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            }
        },
        async nowAir(){
            const res=await axios({
                method:'get',
                url:'https://devapi.qweather.com/v7/air/now',
                params:{
                    key:'25899d95c0f649c29c3a372f663272f9',
                    location:localStorage.getItem('id'),
                }
            })
            const data=res.data
            if (data.code==='200'){
                this.aqi=data['now']['aqi']
                this.category=data['now']['category']
                this.pm10=data['now']['pm10']
                this.pm2p5=data['now']['pm2p5']
                this.no2=data['now']['no2']
                this.so2=data['now']['so2']
                this.co=data['now']['co']
                this.o3=data['now']['o3']
                this.air_sources=data['refer']['sources'][0]
            }
        },
        async dataInfo(){
            this.WBGTout_label=[]
            this.WBGTout_value=[]
            const res=await requests({
                method:'get',
                url:'base/dataInfo/',
                headers:{
                    authorization:localStorage.getItem('token'),
                }
            })
            const data=res.data
            if(data.msg==='查询成功'){
                this.createTime=data['data']['temperatureInfo']['info']['createTime']
                this.Ta=data['data']['temperatureInfo']['info']['Ta']
                this.Tg=data['data']['temperatureInfo']['info']['Tg']
                this.Tnw=data['data']['temperatureInfo']['info']['Tnw']
                this.Rh=data['data']['temperatureInfo']['info']['Rh']
                this.deviceStatus=data['data']['status']
                this.WBGTin = data['data']['temperatureInfo']['info']['WBGTin']
                this.WBGTout = data['data']['temperatureInfo']['info']['WBGTout']
                for(let item in data['data']['temperatureInfo']['data_list']){
                    this.WBGTout_label.unshift(data['data']['temperatureInfo']['data_list'][item]['createTime'])
                    this.WBGTout_value.unshift(data['data']['temperatureInfo']['data_list'][item]['WBGTout'])
                }
                this.is_WBGOutShow=true
                console.log(this.WBGTout_label)
                console.log(this.WBGTout_value)
            }
        },
        async forecastWaring(){
            const res=await axios({
                method:'get',
                url:'https://devapi.qweather.com/v7/warning/now',
                params:{
                    key:'25899d95c0f649c29c3a372f663272f9',
                    location:localStorage.getItem('id'),
                }
            })
            const data=res.data
            if (data.code==='200'){
                const date=new Date(data.updateTime)
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并补零
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                this.updateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                this.sources=data['refer']['sources'][0]
                if (data.warning.length===0){
                    this.sender='预警发布单位：暂无数据'
                    this.text='预警内容：暂无数据'
                    this.title='预警信息标题：暂无数据'
                }else {
                    this.sender=data['warning'][0]['sender']
                    this.text=data['warning'][0]['text']
                    this.title=data['warning'][0]['title']
                }
            }
        },
        async forecastRain(){
            this.minutely_label=[]
            this.minutely_value=[]
            const lat=localStorage.getItem('lat')
            const lon=localStorage.getItem('lon')
            const res=await axios({
                method:'get',
                url:'https://devapi.qweather.com/v7/minutely/5m',
                params:{
                    key:'25899d95c0f649c29c3a372f663272f9',
                    location:`${lon},${lat}`
                }
            })
            const data=res.data
            if (data.code==='200'){
                this.summary=data.summary
                for(let index in data['minutely']){
                    const date=new Date(data['minutely'][index]['fxTime'])
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    this.minutely_label.push(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
                    this.minutely_value.push(data['minutely'][index]['precip'])
                }
                this.is_forecastRainShow=true
            }
        },
        async init_five_minutes(){
            await this.dataInfo()
        },
        async init_ten_minutes(){
            await this.nowWeather()
            await this.nowAir()
            await this.forecastRain()
            await this.forecastWaring()
        }
    }
})
export default useMainStore;