<template>
  <div class="list">
    <scroll-bar :scrollY="pageY">
      <div class="test-div" v-for="item in list">{{item}}</div>
    </scroll-bar>
  </div>
</template>

<script>
import ScrollBar from '../components/scrollBar'

export default {
  data () {
    return {
      pageY: 100,
      list: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18']
    }
  },
  components: {
    ScrollBar
  }
}
</script>

<style>
  html, body, #app, .list{ width: 100%; height: 100%; font-size: 20px; overflow: hidden; }
  .m-top{ position: fixed; top: 0; left: 0; width: 100%; height: 1rem; line-height: 1rem; z-index: 2; background-color: #fff; }
  .list { position: relative; background-color: #000; color: #fff; }
  .test-div{ height: 6rem; background-color: #f5f5f5; border-bottom: 1px solid #fff; color: #000; }
</style>