<template>
  <div class="ui-body" id="fnMainBox">
    <div class="m-sidebar fn-left fnTransitionAll">
      <div class="ui-full-screen" id="fnFullScreen"></div>
      <h3 class="s-title"><i class="icon icon-hd"></i>项目管理<span class="sjx"></span></h3>
      <div class="fn-usn fn-pt20 fn-pb20 m-ul" id="fnSidebar">
        <ul></ul>
      </div>
    </div>
    <div class="m-main-box">
      <div class="m-main-in fnTransitionAll">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      sidebar: {
        type: Boolean,
        default: true
      }
    },
    mounted(){
      this.$router.push({name: 'companyCustomerList'})
    }
  }
</script>
<style>
  .m-sidebar { border: 1px solid #e5e1e1; border-top: 0; width: 240px; margin-left: 20px; background-color: #fff; max-height: 100%; position: relative; z-index: 1; zoom: 1; }
  .m-sidebar .icon { width: 24px; height: 23px; margin-right: 5px;margin-left:5px; background-image: url(../../assets/img/m_menu_bar_icon.png); background-repeat: no-repeat; vertical-align: middle; }
  .m-sidebar .icon-hd { background-image: url(../../assets/img/m_sidebar_icon.png);background-position: 0 -144px; }

  .m-sidebar .s-title { position: relative; height: 60px; line-height: 60px; background-color: #91c7ae; color: #fff; font-size: 20px; font-weight: 400; text-align: center; }
  .m-sidebar .s-title .sjx { position: absolute; left: 50%; bottom: -10px; margin-left: -7px; width: 0; height: 0; line-height: 0; border-style: dashed; border-width: 7px; border-color: transparent; border-top: solid #91c7ae; }
  .m-sidebar .m-ul { overflow-y: auto; position: relative;}
  .m-sidebar .s-ul { display: none;}
  .m-sidebar .m-ul > .s-ul {position: absolute;min-width: 100%;}
  .m-sidebar .s-ul.active { display: block; }
  .m-sidebar .s-ul-bg { background-color: #f9f9f9; padding-left: 0px; }
  .s-ul-bg0 > .s-li > .s-ul-hd > a{ font-size: 16px; font-weight: bold;}
  .s-ul-bg1 > .s-li > .s-ul-hd > a{ font-size: 16px;}
  .m-sidebar .s-ul-bg1 { background-color: #f9f9f9; padding-left: 0px; }
  .s-ul-bg1 .s-ul-hd a { padding-left: 40px; }
  .m-sidebar .s-ul-bg2 { background-color: #f5f5f5; padding-left: 0px; }
  .s-ul-bg2 .s-ul-hd a { padding-left: 60px; }
  .m-sidebar .s-ul-bg3 { background-color: #f3f3f3; padding-left: 0px; }
  .s-ul-bg3 .s-ul-hd a { padding-left: 80px; }
  .m-sidebar .s-ul-bg4 { background-color: #f1f1f1; padding-left: 0px; }
  .s-ul-bg4 .s-ul-hd a { padding-left: 100px; }
  .m-sidebar .s-li { line-height: 35px; cursor: pointer; }
  /*  .m-sidebar .s-ul-bg0 .s-li { line-height: 65px; } */
  .m-sidebar .s-li a { color: #343232; height: 35px; padding-right: 10px; display: inline-block; *display: inline; *zoom: 1; white-space: nowrap; /*text-overflow: ellipsis; overflow: hidden;*/ }
  .m-sidebar .s-ul-hd { padding-left: 0px; font-size: 14px; color: #4b4a4a; word-break: keep-all; white-space: nowrap; transition: all .2s; -webkit-transition: all .2s; -moz-transition: all .2s; -ms-transition: all .2s; -o-transition: all .2s;}
  .m-sidebar .s-ul-hd:hover, .m-sidebar .s-ul-hd.active { background-color: #e3f2e6; color: #000; font-size: 16px; }
  .m-sidebar .s-ul-hd.active a,.m-sidebar .s-ul-hd:hover a{ color: #000;}

  .m-main-box { width: 100%; height: 100%; }
  .m-main-in { margin: 0 0 0 280px; height: 100%; }
  .m-main-page { overflow-y: auto;}
  .m-main { margin-right: 20px; }
  .m-main.border { border: 1px solid #e5e1e1; margin-right: 18px; }
</style>