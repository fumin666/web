<!--
 * @Author: 高建鹏
 * @Description: 状态图
 * @Position:
 * @Date: 2019-07-15 15:21:38
 * @LastEditors: 高建鹏
 *      chart:  [
          {
            value:237,
            text:'正常',
            img:'../../../../static/images/assetview/fan-normal.svg'
          },
          {
            value:237,
            text:'正常',
            img:'../../../../static/images/assetview/fan-normal.svg'
          }
        ]
 -->
<template>
<div>
  <s-row class="vstatus">
    <s-col v-for="(item, index) in this.chart" :key="index">
      <div class="mar font1">{{item.value}}</div>
      <div class="mar font2">{{item.text}}</div>
      <div class="mar"><img :src="item.img"></div>
    </s-col>
  </s-row>
</div>
</template>

<script>
export default {
  props: {
    chart: {
      type: Array
    }
  }
}
</script>

<style lang="stylus">
// .vstatus
//   display: flex;
//   height: 100%;
//   justify-content: space-between;
//   text-align: center;
//   margin-top: 60px;
//   .mar
//     margin:15px;
//   .font1
//     font-size:24px;
//     font-weight:bold;
//   .font2
//     font-size:14px;
</style>
