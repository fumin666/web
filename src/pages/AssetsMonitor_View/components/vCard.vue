<!--
 * @Author: 高建鹏
 * @Description: card可滚动卡片
 * @Position:
 * @Date: 2019-07-22 16:11:37
 * @LastEditors: 高建鹏
 -->
<template>
<s-card class="vcard">
  <div class="header">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
    </div>
  </div>
  <div class="body">
    <s-scrollbar wrap-style="height: 320px;" style="margin-right:-2px;">
      <slot></slot>
    </s-scrollbar>
  </div>
</s-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
<style lang="stylus">
// .vcard
//   height: 100%;
//   background: #0B1A2C;
//   // border: 1px solid #E1E1E1;
//   padding: 0;
//   .header
//     height: 32px;
//     line-height: 32px;
//     padding: 0 16px;
//     font-size: 14px;
//     font-weight: bold;
//     font-family: PingFang SC;
//     // border-bottom: 1px solid #e5e5e5;
//     background: #19314D;
//     color: #6CD2FD;
//   .body
//     padding: 5px 0;
//   .clearfix
//     height: 32px;
//   .clearfix:before,
//   .clearfix:after
//     display: table;
//     content: "";
//     clear: both
</style>
