<template>
  <div class="app-box">
    <div class="top-navs">
      <ul>
        <li v-for="(item, i) in navs" :key="i">
          <nuxt-link :to="item.href" v-text="item.text" />
        </li>
      </ul>
    </div>
    <nuxt/>
  </div>
</template>
<script>
import 'isomorphic-fetch'
export default {
  data: () => {
    return {
      navs: [{
        text: '首页',
        href: '/'
      }, {
        text: '前端',
        href: '/fe'
      }, {
        text: 'Android',
        href: '/android'
      }, {
        text: 'iOS',
        href: '/ios'
      }]
    }
  }
}
</script>
<style lang="less">
  @import url('~assets/reset.less');
  @import url('~assets/layout.less');
</style>


