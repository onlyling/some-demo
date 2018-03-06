<template>
  <ul class="list-ul">
    <list-item v-for="item in list" :item="item" :key="item._id" />
  </ul>
</template>
<script>
import ListItem from "./list-item";
export default {
  props: {
    list: Array
  },
  components: {
    ListItem
  }
};
</script>