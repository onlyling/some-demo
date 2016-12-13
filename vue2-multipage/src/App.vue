<template>
  <div id="app">
    <common-head-top></common-head-top>
    <common-head></common-head>
    <common-body>
      <common-breadcrumb></common-breadcrumb>
      <router-view></router-view>
    </common-body>
  </div>
</template>
<script>

  import commonHeadTop from 'components/pages/commonHeadTop.vue'
  import commonHead from 'components/pages/commonHead.vue'
  import commonBody from 'components/pages/commonBody.vue'

  export default {
    components: {
      commonHeadTop,
      commonHead,
      commonBody
    }
  }
</script>
<style lang="less">
  .m-body { height: 100%; width: 100%; overflow: hidden; min-width: 1050px; overflow-x: auto; }
  .m-body::-webkit-scrollbar { width: 8px; height: 8px; }
  .m-body::-webkit-scrollbar-track { background-color: #fff;}
  .m-body::-webkit-scrollbar-thumb { background-color: #509776; -webkit-border-radius: 2em; -moz-border-radius: 2em; border-radius: 2em; }

</style>