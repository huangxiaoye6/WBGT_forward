<template>
  <div :class="[color,'header']">
    <el-input
        v-model="store.value"
        style="width: 180px"
        placeholder="选择区域"
        clearable
        class="select"
        size="small"
        @change="store.reset(store.value)"
    />
    <h1 style="font-size: 32px">{{store.title}}</h1>
    <el-dropdown>
    <span class="el-dropdown-link">
      菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="drawer = true">修改信息</el-dropdown-item>
          <el-dropdown-item @click="store.exit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-drawer v-model="drawer" title="I am the title" :with-header="false">
      <div>修改信息</div>
      <div class="changeForm">
        <div>
          <span>修改标题：</span>
          <el-input
              v-model="store.input"
              style="width: 240px"
              placeholder="修改标题"
              clearable
              @change="store.changeInfo()"
          />
        </div>
        <div class="upload">
          <span style="text-align: center;line-height: 180px">上传图片：</span>
          <el-upload
              class="avatar-uploader"
              action="http://api.023runclub.com/base/img/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              name="imgURL"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import useHeaderStore from "@/store/headerStore.js";
import {onMounted, reactive, ref, watch} from "vue";
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import useMainStore from "@/store/mainStore.js";
const drawer = ref(false)
const store=useHeaderStore()
const mainStore=useMainStore()
const imageUrl = ref('')
const color=ref('green')
const handleAvatarSuccess= (
    response,
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  console.log(response.data)
  store.imgURL=response.data.imgURL
  ElMessage.success('图片上传成功')
}

const beforeAvatarUpload= (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('上传图片的格式必须是jpg或png')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片的大小不能超过2MB!')
    return false
  }
  return true
}
const colorChange=()=>{
  if(mainStore.WBGTout>=27.8){
    color.value='black'
  }else if(mainStore.WBGTout>=22.8){
    color.value='red'
  }else if(mainStore.WBGTout>=18.3){
    color.value='orange'
  }else if(mainStore.WBGTout>=4.4){
    color.value='green'
  }
}
onMounted(()=>{
  store.getData()
  // store.test()
  colorChange()
})

watch(()=>mainStore.WBGTout,(newValue,oldValue)=>{
  colorChange()
  console.log(newValue)
})


// setInterval(()=>{
//   add()
// },5000)
</script>

<style scoped>
.header{
  width: 100%;
  height: 100%;
  position: relative;
}
/*橘色*/
.orange{
  background-color: #f0e90a;
}
/*黑色*/
.black{
  background-color: #656665;
}
/*绿色*/
.green{
  background-color: green;
}
/*红色*/
.red{
  background-color: #e6382f;
}
h1{
  text-align: center;
  line-height: 30px;
  color: white;
  width: 800px;
  position: absolute;
  left: 25%;
  top: 30%;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-dropdown{
  height: 20px;
  position: absolute;
  right: 100px;
  top: 40%;
  color: white;
}
.select{
  position: absolute;
  top: 30%;
  left: 5%;
}
.changeForm{
  width: 100%;
  height: 400px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.upload{
  width: 320px;
  display: flex;
  margin-top: 50px;
}
</style>