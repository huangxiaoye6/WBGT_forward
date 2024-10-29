<template>
  <div class="common-layout">
    <el-container>
      <el-header height="80px">
          <Header></Header>
      </el-header>
      <el-main>
        <Main></Main>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>

import Header from "@/components/Header.vue";
import Main from "@/components/Main.vue";
</script>

<style scoped>
.common-layout,.el-container{
  height: 100%;
}
.el-header,.el-main{
  padding: 0;
}
</style>