<template>
  <div id="app">
    <transition :name="$router.app.pageTransition">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        // transitionName: 'slide'
      }
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
  
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #f5f5f5;
  }
  
  .ms-page {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  
  .foo {
    background-color: #fff;
  }
  
  .bar {
    background-color: #f30;
  }
  
  .bar2 {
    background-color: #f60;
  }
  
  .slide-right-enter-active {
    transition: all .4s ease;
  }
  
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
    -webkit-transform: translate3d(100%, 0, 0);
  }
  
  .slide-right-leave {
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
  }
  
  .slide-right-leave-active {
    transition: all .6s ease;
    opacity: .5;
    transform: translate3d(-80%, 0, 0);
    -webkit-transform: translate3d(-80%, 0, 0);
  }
  
  .slide-left-enter-active {
    transition: all .6s ease;
  }
  
  .slide-left-enter {
    opacity: .5;
    transform: translate3d(-80%, 0, 0);
    -webkit-transform: translate3d(-80%, 0, 0);
  }
  
  .slide-left-leave {
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
  }
  
  .slide-left-leave-active {
    transition: all .6s ease;
    opacity: 0;
    transform: translate3d(80%, 0, 0);
    -webkit-transform: translate3d(80%, 0, 0);
  }
  
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  
  .slide-fade-leave-active {
    transition: all .4s ease;
  }
  
  .slide-fade-enter,
  .slide-fade-leave-active {
    padding-left: 10px;
    opacity: 0;
  }
</style>