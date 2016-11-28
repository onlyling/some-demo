<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        transitionName: 'slide-back'
      }
    }
  }
</script>

<style>
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
  
  .slide-enter-active {
    transition: all .3s ease;
  }

  .slide-enter{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
    -webkit-transform: translate3d(100%, 0, 0);
  }

  .slide-leave {
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
  }

  .slide-leave-active {
    transition: all .3s ease;
    opacity: .5;
    transform: translate3d(-100%, 0, 0);
    -webkit-transform: translate3d(-100%, 0, 0);
  }


  .slide-back-enter-active {
    transition: all .3s ease;
  }

  .slide-back-enter{
    opacity: .5;
    transform: translate3d(-100%, 0, 0);
    -webkit-transform: translate3d(-100%, 0, 0);
  }

  .slide-back-leave {
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
  }

  .slide-back-leave-active {
    transition: all .3s ease;
    opacity: 0;
    transform: translate3d(100%, 0, 0);
    -webkit-transform: translate3d(100%, 0, 0);
  }
  
  
</style>