<template>
  <div class="ui-top">
    <div class="ui-layout fn-clear">
      <div class="fn-right">
        <a href="javascript:void(0);" hrefs="javascript: void(0);">修改密码</a>
        &emsp;
        <a href="javascript: void(0);" @click="logout">退出</a>
      </div>
      您好
      <span class="fn-f30 fn-ml5">43434</span>
      ，欢迎来到金控平台！
    </div>
  </div>
</template>
<script>
  export default {
    methods: {
      logout () {
        console.log('logout')
      }
    }
  }
</script>