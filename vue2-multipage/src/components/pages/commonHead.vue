<template>
  <div class="ui-nav fnTransitionAll" id="fnCNav">
    <div class="ui-layout fn-clear ui-nav-box">
      <h1 class="logo-box">
        <a class="logo" href="/index.html" title="金控平台">金控平台</a>
      </h1>
      <div class="nav-box">
        <ul class="nav" id="nav">
          <li v-for="item in nav">
            <a :href="item.show ? item.url : 'javascript:void(0);'" :class="{active: item.url.indexOf(targetPath) >= 0}">{{item.text}}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        nav: [{
          text: '我的工作台',
          url: '/index.html',
          show: true
        },{
          text: '客戶管理',
          url: '/customer.html',
          show: true
        },{
          text: '项目管理',
          url: '/index.html',
          show: true
        },{
          text: '资产管理',
          url: '/index.html',
          show: true
        },{
          text: '自己管理',
          url: '/index.html',
          show: true
        },{
          text: '数据分析',
          url: '/index.html',
          show: true
        },{
          text: '风险监控',
          url: '/index.html',
          show: true
        },{
          text: '操作说明',
          url: '/index.html',
          show: false
        },{
          text: '系统设置',
          url: '/index.html',
          show: true
        }],
      targetPath: ''
      }
    },
    mounted () {
      let pathname = window.location.pathname.split('/')
      this.targetPath = pathname[pathname.length - 1]
    },
    methods: {
      logout () {
        console.log('logout')
      }
    }
  }
</script>
<style lang="less">
  .ui-top { background-color: #fafbfa; height: 35px; line-height: 35px; border-bottom: 1px solid #eeefee; 
    .msg { width: 35px; height: 35px; /*background: url(../../assets/img/top_msg.png) 50% 50% no-repeat;*/ 
      .num { margin-left: 30px; padding: 0 4px; height: 16px; line-height: 16px; border-radius: 8px; background-color: #f30; color: #fff; text-align: center;align-content: flex-start; }
    }
  }
  .ui-nav {
    background-color: #fff; height: 50px;
    .ui-nav-box { display: flex; }
    .logo-box { flex-basis: 145px;
      .logo{ display: block; margin-top: 5px; width: 145px; height: 45px; text-indent: -9999em; background: url(../../assets/img/logo.png);}
    }
    .nav-box { flex: 1;
      .nav{ display: flex; margin-top: 5px;}
      li{ flex: 1; text-align: center; margin: 0 5px;}
      a { display: block; height: 40px; line-height: 40px; font-size: 18px; border-radius: 4px; color: #000; text-align: center; margin: 0 auto; transition: all .2s; -webkit-transition: all .2s; -moz-transition: all .2s; -ms-transition: all .2s; -o-transition: all .2s; }
      a.active, a:hover{ color: #fff; background-color: #7ac0ab; }
    }
  }
</style>