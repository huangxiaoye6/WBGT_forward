<template>
  <div class="main">
    <div class="left">
      <div class="dateTime">
        <div class="time">{{formattedTime}}</div>
        <div class="date">{{`${currentTime.getFullYear()}/${currentTime.getMonth() + 1}/${currentTime.getDate()}`}}</div>
      </div>
      <div class="weather">
        <div class="weather_head">
          <img src="@/assets/weather.png" alt="加载错误">
          <span class="temperature" style="font-size: 35px;margin-left: 20px">{{store.temperature}}°C</span>
          <span class="weather_day" style="margin-left: 10px">{{store.weather}}</span>
        </div>
        <div class="weather_body">{{`今天天气${store.weather},风向${store.windDirection}`}}</div>
        <div class="weather_footer">
          <div>
            <div class="weather_content">{{store.province}}</div>
            <div class="weather_title">当前区域</div>
          </div>
          <div>
            <div class="weather_content">{{store.feelsLike}}°C</div>
            <div class="weather_title">体感温度</div>
          </div>
          <div>
            <div class="weather_content">{{store.humidity}}%</div>
            <div class="weather_title">空气湿度</div>
          </div>
          <div>
            <div class="weather_content">{{store.windPower}}级</div>
            <div class="weather_title">风力级别</div>
          </div>
          <div>
            <div class="weather_content">{{store.precip}}mm</div>
            <div class="weather_title">过去1小时降水量</div>
          </div>
          <div>
            <div class="weather_content">{{store.vis}}km</div>
            <div class="weather_title">能见度</div>
          </div>
        </div>
      </div>
      <div class="air">
        <div class="air_left">
          <div class="quality">
            <span style="font-size: 12px;color: #9e9ea0">空气指数</span><br>
            <span>{{store.aqi}}</span>
            <span>{{store.category}}</span>
          </div>
        </div>
        <div class="air_right">
          <div class="airInfo">
            <div class="air_value">{{store.pm10}}</div>
            <div class="air_title">PM10</div>
          </div>
          <div class="airInfo">
            <div class="air_value">{{store.pm2p5}}</div>
            <div class="air_title">PM2.5</div>
          </div>
          <div class="airInfo">
            <div class="air_value">{{store.no2}}</div>
            <div class="air_title">NO2</div>
          </div>
          <div class="airInfo">
            <div class="air_value">{{store.so2}}</div>
            <div class="air_title">SO2</div>
          </div>
          <div class="airInfo">
            <div class="air_value">{{store.co}}</div>
            <div class="air_title">CO</div>
          </div>
          <div class="airInfo">
            <div class="air_value">{{store.o3}}</div>
            <div class="air_title">O3</div>
          </div>
        </div>
      </div>
      <div class="rain">
        <Echarts :options="option2" :chartStyle="'width: 100%;height: 240px'" v-if="store.is_forecastRainShow"></Echarts>
      </div>
      <div class="update">数据来源于：{{store.air_sources}}<br>更新时间：{{store.reportTime}}</div>
    </div>
    <div :class="['center',color]">
      <div class="title">WBGT</div>
      <div class="tem">{{store.WBGTout}}</div>
      <div class="info">
        <span>赛道温度：{{store.Ta}}°C</span>&nbsp;
        <span>赛道湿度：{{store.Rh}}%</span>&nbsp;
        <span>黑球温度：{{store.Tg}}°C</span>&nbsp;
        <span>湿球温度：{{store.Tnw}}°C</span>
      </div>
      <div class="waring">
        <el-image class="imgWaring" style="width: 400px; height: 230px" :src='icon' fit="fill" />
      </div>
      <Echarts :options="option" :chartStyle="'width: 100%;height: 240px'" v-if="store.is_WBGOutShow"></Echarts>
      <div class="update">数据来源于：起终点监测设备<br>更新时间：{{store.createTime}}</div>
      <img class="online" :src="deviceStatus" alt="加载失败" style="width: 20px;height: 20px">
    </div>
    <div class="right">
      <div class="weather_msg">气象风险预警信息</div>
      <div class="weather_forecast">
        <div class="weather_area">{{store.sender}}</div>
        <div class="weather_waring_title">{{store.title}}</div>
        <div class="weather_waring_content">{{store.text}}</div>
        <div class="update">数据来源于：{{store.sources}}<br>更新时间：{{store.updateTime}}</div>
      </div>
      <div class="forecastWaring_Img">
        <el-image class="forecastWaring" v-if="headerStore.imgURL" style="width: 100%; height: 200px"
                  :src="headerStore.imgURL" fit="fill">
        </el-image>
        <el-empty  v-else :image-size="200" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, markRaw, onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import { format } from 'date-fns';
import useMainStore from "@/store/mainStore.js";
import orange from '../assets/orange.png'
import red from '../assets/red.png'
import black from '../assets/black.png'
import green from '../assets/green.png'
import online from '../assets/online.png'
import outline from '../assets/outline.png'
import Echarts from "@/components/Echarts.vue";
import useHeaderStore from "@/store/headerStore.js";
const icon=ref(green)
const store=useMainStore()
const headerStore=useHeaderStore()
const currentTime = ref(new Date());
const formattedTime = computed(() => format(currentTime.value, 'HH:mm:ss'));
const color=ref('green')
const deviceStatus=ref(outline)
let timer;
onMounted(() => {
  colorChange()
  statusChange()
  waringChange()
  store.nowWeather()
  store.nowAir()
  store.dataInfo()
  store.forecastWaring()
  store.forecastRain()
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(five);
  clearInterval(ten)
});

const statusChange=()=>{
  if(store.deviceStatus==='normal'){
    deviceStatus.value=online
  }else {
    deviceStatus.value=outline
  }
}
const colorChange=()=>{
  if(store.WBGTout>=27.8){
    color.value='black'
  }else if(store.WBGTout>=22.8){
    color.value='red'
  }else if(store.WBGTout>=18.3){
    color.value='orange'
  }else if(store.WBGTout>=4.4){
    color.value='green'
  }
}
const waringChange=()=>{
  if(store.WBGTout>=27.8){
    icon.value=black
  }else if(store.WBGTout>=22.8){
    icon.value=red
  }else if(store.WBGTout>=18.3){
    icon.value=orange
  }else if(store.WBGTout>=4.4){
    icon.value=green
  }
}
watch(()=>store.WBGTout,(newValue,oldValue)=>{
  colorChange()
})
watch(()=>store.deviceStatus,(newValue,oldValue)=>{
  statusChange()
})
watch(()=>store.WBGTout,(newValue,oldValue)=>{
  waringChange()
})
const five=setInterval(()=>{
  store.init_five_minutes()
},1000*60*5)
const ten=setInterval(()=>{
  store.init_ten_minutes()
},1000*60*10)
const option = computed(()=>({
  title: {
    text: 'WGBTOut历史数据',
    x:'center',
    y:'20px'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b} : {c}°C'
  },
  dataZoom: [
    {
      type: 'inside',
    },
    {
      type: 'slider'
    }
  ],
  toolbox: {
    feature: {
      magicType: { show: true, type: ['line', 'bar'],title:{line:'切换为折线图',bar:'切换为柱状图'}},
      restore: { show: true ,title: '还原'},
      saveAsImage: { show: true ,title: '保存为图片'}
    },
    right:'10%',
    y:'20px'
  },
  xAxis: {
    type: 'category',
    data: store.WBGTout_label
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: store.WBGTout_value,
      type: 'line'
    }
  ]
}));
const option2 = computed(()=>({

  title: {
    text: '未来2小时降雨数据',
    x:
        'center',
    y:
        '20px'
  }
  ,
  tooltip: {
    trigger: 'item',
    formatter:
        '{b} : {c}毫米'
  }
  ,
  dataZoom: [
    {
      type: 'inside',
    },
    {
      type: 'slider'
    }
  ],
  toolbox:
      {
        feature: {
          magicType: {
            show: true, type:
                ['line', 'bar'], title:
                {
                  line: '切换为折线图', bar:
                      '切换为柱状图'
                }
          }
          ,
          restore: {
            show: true, title:
                '还原'
          }
          ,
          saveAsImage: {
            show: true, title:
                '保存为图片'
          }
        }
        ,
        y: '20px'
      }
  ,
  xAxis: {
    type: 'category',
    data:
    store.minutely_label
  }
  ,
  yAxis: {
    type: 'value'
  }
  ,
  series: [
    {
      data: store.minutely_value,
      type: 'line'
    }
  ]
}))
</script>

<style scoped>
.main{
  width: 100%;
  height: 100%;
  display: flex;
}
.left{
  background-color: white;
  flex: 2;
  display: flex;
  flex-direction: column;
  background-image:linear-gradient(#c4f4fe ,#fdefbe 100%);
  position: relative;
}
.center{
  background-color: white;
  flex: 3;
  position: relative;
}
/*橙色*/
.orange{
  border-left: 10px solid #f0e90a;
  border-right: 10px solid #f0e90a;
}
.orange .title,.orange .tem,.orange .info{
  color: #f0e90a;
}
/*绿色*/
.green{
  border-left: 10px solid green;
  border-right: 10px solid green;
}
.green .title,.green .tem,.green .info{
  color: green;
}
.red{
  border-left: 10px solid #e6382f;
  border-right: 10px solid #e6382f;
}
.red .title,.red .tem,.red .info{
  color: #e6382f;
}
.black{
  border-left: 10px solid #656665;
  border-right: 10px solid #656665;
}
.black .title,.black .tem,.black .info{
  color: #656665;
}
.right{
  flex: 2;
  background-image:linear-gradient(#c4f4fe ,#fdefbe 100%);
}
.dateTime,.weather,.air,.rain{
  flex: 1;
}
.dateTime{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.time{
  color: #4d4d4d;
  font-size: 60px;
  font-weight: bold;
}
.date{
  color: #4d4d4d;
}
.weather{
  position: relative;
}
.weather_head{
  text-align: center;
}
.weather_body{
  margin-top: 10px;
  text-align: center;
}
.weather_footer{
  margin-top: 10px;
  display: flex;
  background-color: #e4f2db;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  box-shadow: 1px 1px 5px #ccc;
  padding: 10px;
  flex-wrap: wrap;
}
.weather_footer div{
  width: 120px;
}
.weather_content{
  font-size: 22px;
  font-weight: bold;
  color: #4a4944;
}
.weather_title{
  font-size: 12px;
  color: #9e9ea0;
}
.position{
  position: absolute;
  font-size: 11px;
  top: 30px;
  right: 0;
  background-color: green;
  border-radius: 15px;
  color: white;
  padding: 0 8px 0 8px;
}
.quality{
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 5px solid #b96191;
  text-align: center;
  box-sizing: border-box;
  font-size: 28px;
  font-weight: 600;
}
.air{
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.air_right{
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.airInfo{
  width: 60px;
  margin-left: 5px;
  margin-top: 5px;
}
.air_title{
  border-top: 2px solid #cfd0d5;
  font-size: 12px;
  text-align: center;
  color: #aaabb0;
}
.air_value{
  text-align: center;
  color: #18181a;
  font-size: 20px;
}
.title{
  height: 120px;
  text-align: center;
  font-size: 100px;
  font-weight: bold;
  line-height: 120px;
}
.tem{
  height: 100px;
  font-size: 80px;
  text-align: center;
  font-weight: bold;
  line-height: 100px;
}
.info{
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.weather_msg{
  width: 100%;
  text-align: center;
  height: 100px;
  font-size: 28px;
  font-weight: 600;
  line-height: 100px;
}
.imgWaring{
  display: block;
  margin:  0 auto;
}
.weather_forecast{
  margin-top: 10px;
  height: 250px;
  box-sizing: border-box;
  margin-right: 20px;
  margin-left: 20px;
  border-radius: 40px;
  box-shadow: 1px 1px 5px #ccc;
  background-color: #e4f2db;
  position: relative;
}
.weather_area{
  height: 50px;
  text-align: center;
}
.weather_waring_title{
  height: 50px;
  text-align: center;
}
.weather_waring_content{
  height: 100px;
}
.forecastWaring_Img{
  margin-top: 200px;
  width: 100%;
}
.update{
  position: absolute;
  bottom: 0;
  right: 30%;
  font-size: 10px;
  border-radius: 15px;
  color: black;
  padding: 0 8px 0 8px;
}
.online{
  position: absolute;
  top: 0;
  right: 0;
}
.weather_area{
  font-weight: bold;
}
.weather_waring_content{
  font-size: 12px;
}
.weather_waring_title{
  font-size: 14px;
}
</style>