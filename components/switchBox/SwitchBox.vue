<template>
  <s-row class="chartContainer">
    <i class="iconfont icon-left chartIndiIcon" @click="moveLeft()" v-show="max < switchArr.length"></i>
    <i class="iconfont icon-right chartIndiIcon" @click="moveRight()"  v-show="max < switchArr.length"></i>
    <ul class="chartSwitch" ref="ul" :style="{'margin-left': calcOffset}">
      <li v-for="(switchItem,index) in switchArr" :key="index"
          :style="{'width': itemWidth}"
      >
        <slot :item="switchItem"></slot>
      </li>
    </ul>
  </s-row>
</template>

<script>
  export default {
    data () {
      return {
        offset: 0,
        calcOffset: 0
      }
    },
    props: {
      switchArr: {
        type: Array,
        default: []
      },
      max: {
        default: 1
      }
    },
    computed: {
      itemWidth() {
        if (this.switchArr.length > this.max) {
          return 100 / this.max + '%';
        } else {
          return 100 / (this.switchArr.length || 1) + '%';
        }
      }
    },
    methods: {
      moveLeft() {
        if (this.offset >= 0) {
          return;
        }
        this.offset ++;
      },
      moveRight() {
        if (this.offset <= this.max - this.switchArr.length) {
          return;
        }
        this.offset --;
      }
    },
    watch: {
      offset() {
        if (this.$refs.ul.childNodes.length === 0) {
          return;
        }
        let liWidth = this.$refs.ul.childNodes[0].offsetWidth;
        this.calcOffset = this.offset * liWidth + 'px';
      }
    }
  }
</script>

<style lang="stylus">
  .chartContainer
    height: 100%
    position relative
    margin-bottom 0
    white-space nowrap
    overflow hidden
    .chartSwitch
      width: 100%
      height 100%
      overflow-x visible
      font-size 0
      transition margin-left 1s
      & > li
        height 100%
        font-size 12px
        display inline-block
        position relative
    .chartIndiIcon
      display block
      position absolute
      top: 50%
      transform translateY(-50%)
      color: #031937
      font-weight 700
      font-size 22px
      overflow hidden
      z-index 1
      transition: all 0.5s
      &:hover
        color: #279AD8
      &.icon-right
        right: 0px
      &.icon-left
        left 0px
</style>
