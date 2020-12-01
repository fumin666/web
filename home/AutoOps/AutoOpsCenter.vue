<template>
  <section class="content autoOpsfix" style="height:calc(100vh - 45px);">
    <s-row :gutter="10" style="height:100%;">
      <s-col span="19" style="height:100%;">
        <auto-operation></auto-operation>
        <auto-script-static></auto-script-static>
      </s-col>
      <s-col class="tableList" span="5" style="height:100%;">
        <auto-navs @buttonCount="buttonCount"></auto-navs>
        <div style="padding-left: 10px; padding-right: 10px;">
          <s-scrollbar :wrap-style="wrapstyle">
            <auto-log></auto-log>
          </s-scrollbar>
        </div>
      </s-col>
    </s-row>
  </section>
</template>
<script type="text/babel">
  import AutoLog from './newPage/AutoLog'
  import AutoOperation from './newPage/AutoOperation.vue'
  import AutoNavs from './newPage/AutoNavs'
  import AutoScriptStatic from './newPage/AutoScriptStatic'
  export default {
    data() {
      return {
        btncount: 6,
        maxheight: 172
      }
    },
    computed: {
      wrapstyle() {
        return 'max-height:' + this.maxheight + 'px;';
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', this.computeAutoOpsHeight);
      });
    },
    components: {
      AutoLog,
      AutoOperation,
      AutoNavs,
      AutoScriptStatic
    },
    methods: {
      computeAutoOpsHeight() {
        let navbuttonheight = Math.ceil(this.btncount / 2) * 40;
        // eslint-disable-next-line no-undef
        let sreenheight = $('#index-body').height();
        this.maxheight = sreenheight - navbuttonheight - 25;
      },
      buttonCount(count) {
        this.btncount = count;
        this.computeAutoOpsHeight();
      }
    },
    destroyed() {
      window.removeEventListener('resize', this.computeAutoOpsHeight);
    }
  }
</script>
<style lang="stylus">
// .autoOpsfix
//   background: #f5f7fa;
//   width 100%;
//   min-height unset
//   margin 0 auto
//   font-size 14px
//   .card-line
//     background #fff;
//     .clearfix
//       padding:0 20px;
//       border-bottom 1px solid #DCDEE2;
//       font-family: PingFang SC;
//       .card-title
//         font-size:14px;
//         opacity 0.85;
//       .card-enter
//         font-size:12px;
//         opacity 0.65;
// /* 右侧按钮 */
//   .contentOpacity
//     margin:20px 20px 15px 10px;
// /* 自动化运维模块 */
//   .autoOperation
//     box-shadow: 0px 0px 4px rgba(123, 134, 164, 0.15), 0px 0px 6px rgba(105, 126, 147, 0.15);
//     .cardcol
//       height:100%;
//       padding:0 5px;
//       .cardview
//         padding:10px;
//         height:100%;
//         border: 1px solid #DCDEE2;
//         border-radius: 2px;
//         .s-card-diy-title
//           font-weight unset
//         .s-card-diy-header
//           border-bottom: unset !important;
//     .autoall
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       .autotype
//         text-align center;
//         width:120px;
//         margin-bottom:20px;
//         .autonum
//           font-family: PingFang SC;
//           font-size: 20px;
//           line-height: 28px;
//         .autotask
//           font-family: PingFang SC;
//           font-size: 14px;
//           line-height: 20px;
//     .autofivediv
//       padding: 10px 15px 20px;
//       display:flex;
//       .autoeverydiv
//         padding: 10px;
//         box-sizing: border-box;
//         text-align:cneter;
//         flex:1;
//         margin:0 5px;
//         height:120px;
//         border: 1px solid #DCDEE2;
//         border-radius: 2px;
//         .every1
//           margin-left: 30px;
//           height:50px;
//           line-height: 50px;
//           font-weight: bold;
//         .imgposition
//           position: relative;
//           top: 4px;
//         .imgposition2
//           position: relative;
//           top: 0.5px;
//           margin-right:4px;
// /* 近30天脚本执行状况统计 */
//   .autoScriptStatic
//     box-shadow: 0px 0px 4px rgba(123, 134, 164, 0.15), 0px 0px 6px rgba(105, 126, 147, 0.15);
// /* 近期脚本日志模块 */
//   .autolog
//     padding-right: 8px;
//     .card-line
//       background unset;
//       .s-card-header
//         background:#fff;
//   .autologcontent
//     display: flex;
//     height: 60px;
//     justify-content: flex-start;
//     padding: 10px 0;
//     line-height: 30px;
//     .autolog_left img
//       position: relative;
//       top: 3px;
//     .autolog_right
//       padding-left: 10px;
//       padding-right: 10px;
//       width: 100%;
//       .autolog_righttop
//         display: flex;
//         justify-content: space-between;
//         width: 100%
//         .autolog_righttext1
//           font-family: PingFang SC;
//           font-size: 14px;
//           color: #000000;
//           opacity: 0.65;
//         .autolog_righttext2
//           font-family: PingFang SC;
//           font-size: 12px;
//           color: #000000;
//           opacity: 0.45;
//       .autolog_rightbottom
//           font-family: PingFang SC;
//           font-size: 14px;
//           color: #000000;
//           opacity: 0.65;
</style>
