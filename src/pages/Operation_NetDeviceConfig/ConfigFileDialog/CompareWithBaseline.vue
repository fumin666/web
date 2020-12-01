<!--
 * @Author: songyf
 * @Date: 2020-4-16
 * @LastEditors: songyf
 * @Description: 配置文件管理-与基线对比
 -->
<template>
  <s-dialog v-model="dialogFlag" title="与基线对比" width="1000px" append-to-body class="compare-with-baseline" id="compare-with-baseline1">
    <div></div>
    <div class="info">
      <s-row :gutter="10">
        <s-col :span="12" class="line">
          <div class="item-title">
            <s-button class="fl">当前文件</s-button>
            <span class="date">备份时间 : {{compareBaselineData.historyContent.createTime}}</span>
          </div>
          <div class="baseline-name">
            {{compareBaselineData.historyContent.backupFileName}}
          </div>
        </s-col>
        <s-col :span="12">
          <div class="item-title">
            <s-button class="fl base-button" disabled>基线文件</s-button>
            <span class="date">设置时间 : {{compareBaselineData.baselineContent[0].baseTime}}</span>
          </div>
          <div class="baseline-name">
            {{compareBaselineData.baselineContent[0].backupFileName}}
          </div>
        </s-col>
      </s-row>
    </div>
    <div>
      <s-scrollbar wrap-class="configHeight">
        <code-diff id="compare-file"
                   v-if="tablEmptyFlag"
                   :old-string="oldStr"
                   :new-string="newStr"
                   :context="10"
                   outputFormat="side-by-side">
        </code-diff>
        <div v-else class="empty-info">文件内容相同</div>

      </s-scrollbar>
      <s-row class="diff-info"  v-if="tablEmptyFlag">
        <s-col :span="12"><span class="diff-icon diff-base"></span>
          表示当前文件有不同</s-col>
        <s-col :span="12"> <span class="diff-icon diff-his"></span>
          表示基线文件有不同</s-col>
      </s-row>
    </div>
  </s-dialog>
</template>

<script>
  import CodeDiff from 'vue-code-diff'
  export default {
    components: {
      CodeDiff
    },
    data() {
      return {
        dialogFlag: false,
        tablEmptyFlag: true,
       /* searchForm: {
          showType: '0'
        }, */
        oldStr: 'old code',
        newStr: 'new code'
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      compareBaselineData: {
        type: Object,
        default: null
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    created() {
    },
    mounted() {
      this.oldStr = this.compareBaselineData.historyContent.fileContent
      this.newStr = this.compareBaselineData.baselineContent[0].fileContent
      this.$nextTick(() => {
        let tablEmpty = document.getElementsByClassName('d2h-info')
        console.log(tablEmpty);
        if (tablEmpty.length === 2 && tablEmpty[1].innerText === 'File without changes') {
          this.tablEmptyFlag = false
        }
      })
    },
    methods: {
    }
  }
</script>
<style lang="stylus">
  .compare-with-baseline
    .s-scrollbar-thumb
      margin-top 15px
    .info
      box-shadow 0px 1px 8px rgba(0, 0, 0, 0.18)
      padding 10px
      .line
        border-right  1px dashed #DCDEE2
      .item-title
        height: 32px
        .s-button
          cursor default
        .date
          margin-left 15px
          line-height 32px
      .baseline-name
        clear both
        margin-top 15px
    .empty-info
      text-align center
    .diff-info
      margin-top 10px
      .diff-icon
        display: inline-block
        width 30px
        height: 20px
        border-radius 3px
        margin-right 10px
        vertical-align middle
      .diff-base
        background-color #ffb6ba
      .diff-his
        background-color #97f295
    .configHeight
      max-height 400px
      margin-top 15px
      #compare-file
        .hljs-addition
          background-color transparent
        .d2h-del, .d2h-info, .d2h-ins
          // background-color transparent
          border-color: none
        .d2h-file-side-diff
          .d2h-diff-tbody
            & > tr
              & td
                height 24px
                line-height 23px
        .d2h-code-side-line
          margin-left 40px
        .d2h-code-side-linenumber
          border none
</style>

