<template>
  <div id="login">
    <div class="logo">
      <img src="@/assets/logo.png" alt="加载失败" style="width: 100px;height: 100px">
    </div>
    <h1 style="color: white">WBGT及气象信息预警系统</h1>
    <div class="login_title">
      <div class="tree">
        <img src="@/assets/tree.png" alt="加载失败" style="width: 500px;height: 500px">
      </div>
    </div>
    <div class="form">
      <el-form
          ref="ruleFormRef"
          style="max-width: 600px"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="auto"
          class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="ruleForm.password"
              type="password"
              autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            登录
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue'
import useLoginStore from "@/store/loginStore.js";

const ruleFormRef = ref()
const store=useLoginStore()
onMounted(()=>{
  store.init()
})

const ruleForm = reactive({
  username: '',
  password: '',
})

const rules = reactive({
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' },],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' },],
})

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      store.login(ruleForm.username, ruleForm.password)
    } else {
      console.log('提交错误!')
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
#login{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #004d85;
  position: relative;
}
.form{
  margin-top: 100px;
  width: 450px;
  height: 200px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 200px;
}
.el-form{
  display: flex;
  flex-direction: column;
  color: white;
}
:deep(.el-form-item__content){
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo{
  position: absolute;
  left: 3%;
  top: 3%;
}
h1{
  position: absolute;
  left: 38%;
  top: 10%;
}
:deep(.el-form-item__label){
  color: white;
}
</style>