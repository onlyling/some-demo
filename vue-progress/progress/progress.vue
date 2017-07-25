<template>
    <div class="mobile-progress"
        :class="{
            'progress-active': show
            }"
        >
        <div class="bar" :style="myStyle"></div>
    </div>
</template>
<script>
    export default {
        name: 'mobile-progress',
        props: {
            width: String,
            show: Boolean,
            styled: Object
        },
        computed: {
            myStyle() {
                return Object.assign({}, this.styled, {
                    width: this.width
                })
            }
        }
    }
</script>
<style lang="less">
    @import "./progress.less";
</style>