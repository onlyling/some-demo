<template>
  <div class="ui-breadcrumb" v-html="getBreadcrumb()"></div>
</template>
<script>
  export default {
    data () {
      return {
        breadcrumb: ['客户管理', '企业客户', '客户列表']
      }
    },
    mounted () {
      // console.log('1')
    },
    watch: {
      $route (to, from) {
        console.log(to)
      }
    },
    methods: {
      getBreadcrumb () {
        return '&nbsp;' + this.breadcrumb.join('&nbsp;&gt;&nbsp;')
      }
    }
  }
</script>