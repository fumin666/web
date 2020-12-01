<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导公共样式组件
 * @Date: 2020-01-21 11:17:07
 * @LastEditors: mybells
 -->
<template>
  <div class="collapse_content" style="margin-left:130px;">
    <div class="contentx">
      <span style="font-size:16px;margin-right:30px;" v-if="title">{{title}}</span>
      <slot></slot>
      <p style="line-height:40px;">{{description}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus">
.collapse_content {
  margin: 15px 0;
  position: relative;

  &:before {
    content: '';
    // border-left: 5px solid orange;
    position: absolute;
    top: 6px;
    height: 30px;
  }

  .contentx {
    padding-left: 30px;

    .s-button {
      margin-right: 20px;
    }
  }
}
</style>
