<!--
 * @Author: 高建鹏
 * @Description: 进度条
 * @Position:
 * @Date: 2019-07-15 15:21:38
 * @LastEditors: 高建鹏
 *      chart: {
          process: 30,
          text1:'name',
          text2:'name',
          ip:'192.132.123.123',
          isBlue:false
        },
  或者
        chart: {
          process: 30,
          value:2345,
          unit:'kps'
          text1:'name',
          text2:'name',
          ip:'192.132.123.123',
          isBlue:true   #60ACFC : #32D3EB
        },
 -->
<template>
<s-col :span="24">
  <s-row class="vprocessbar" style="display:flex;padding:0 20px;">
    <s-col style="height:100%;width:calc(100% - 60px)">
      <div class="vprocessbar-font">
        <div class="vprocessbar-font1" style="display:flex">
          <div style="width:100px;">{{chart.ip}}</div>&nbsp;
          <div style="white-space: nowrap; text-overflow: ellipsis;overflow: hidden;" :title="chart.text1">{{chart.text1}}</div>
          <div v-if="chart.text1">&nbsp;|&nbsp;</div>
          <div style="white-space: nowrap; text-overflow: ellipsis;overflow: hidden;" :title="chart.text2">{{chart.text2}}</div>
        </div>
        <s-progress type="line" :class="{blue:chart.isBlue,blue2:!chart.isBlue}" :stroke-width="10" :show-text="false" :percentage="chart.process>0?chart.process:0" v-if="chart.process||(!chart.isBlue)"></s-progress>
        <div v-else>|</div>
      </div>
    </s-col>
    <s-col style="font-weight: bold;margin-top: 20px;margin-left: 10px;">
      <div class="vprocessbar-unit">
        <div :title="chart.value" style="font-size:15px;" class="vprocess-title">{{chart.value}}</div>
      </div>
    </s-col>
  </s-row>
</s-col>
</template>

<script>
export default {
  props: {
    chart: {
      type: Object
    }
  },
  // computed: {
  //   text1() {
  //     if (this.chart.text1) {
  //       if (this.chart.text1.length > 20) {
  //         return this.chart.text1.substr(0, 20) + '...';
  //       } else {
  //         return this.chart.text1
  //       }
  //     }
  //   },
  //   text2() {
  //     if (this.chart.text2) {
  //       if (this.chart.text2.length > 20) {
  //         return this.chart.text2.substr(0, 20) + '...';
  //       } else {
  //         return this.chart.text2
  //       }
  //     }
  //   }
  // },
  created() {
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
// .vprocessbar
//   height: 40px;
//   margin: 4px 0 7px 0;
  // .vprocessbar-nounit
  //       height: 40px;
  //       line-height: 40px;
  //       font-size: 16px;
//   .vprocessbar-font
//       font-size: 12px;
//       color: #392C28;
//     .vprocessbar-font1
//         margin-top: 4px;
//         margin-bottom: 5px;
//   .blue
//     .s-progress-bar
//       .s-progress-bar-inner
//         background:#60ACFC !important;
        //  .s-progress-bar-outer
        //     border: unset !important;
        //     background-color: unset !important;
//   .blue2
//     .s-progress-bar
//       .s-progress-bar-inner
//         background:#32D3EB !important;
</style>
