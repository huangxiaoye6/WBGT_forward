<template>
  <div ref="chart" class="chart" :style="chartStyle"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted, ref, watch} from "vue";
const chart=ref()
const props=defineProps({
  options:Object,
  chartStyle:String,
  chartShow:Boolean,
  mapData:Object,
  theme:{
    default:'light'
  }
})
let mgChart:any=null
onMounted(  ()=>{
  mgChart =  echarts.init(chart.value,props.theme);
  mgChart.setOption(props.options, false);
  window.addEventListener('resize', () => {
    mgChart.resize()
  })
})
watch(() => props.options, (newOptions, oldOptions) => {
      if (mgChart) {
        mgChart.setOption(newOptions, true); // 更新时启用动画
      }
    }, { deep: true } // 启用深度观察
);

</script>

<style scoped>

</style>