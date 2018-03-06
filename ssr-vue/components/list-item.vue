<template>
  <li>
    <div class="item-title">
      <a class="more" target="_blank" rel="nofollow" :href="item.url">More</a>
      <h2 v-text="item.desc" />
    </div>
    <div class="item-box">
      <span v-text="item.who" />
      &emsp;
      <span v-text="item.publishedAt.slice(0, 10)" />
      &emsp;
      <span v-text="item.type" :class="['type', tagColor(item.type)]" />
    </div>
  </li>
</template>
<script>
export default {
  props: {
    item: Object
  },
  methods: {
    tagColor(type) {
      let className;
      switch (type) {
        case "Android":
          className = " volcano";
          break;

        case "iOS":
          className = " blue";
          break;

        case "休息视频":
          className = " cyan";
          break;

        case "福利":
          className = " gold";
          break;

        case "拓展资源":
          className = " red";
          break;

        case "前端":
          className = " orange";
          break;

        case "App":
          className = " lime";
          break;

        default:
          className = " magenta";
          break;
      }
      return className;
    }
  }
};
</script>

