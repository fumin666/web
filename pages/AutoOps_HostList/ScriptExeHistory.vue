<template>
  <section id="scriptExeHistory">
    <s-row>
      <s-col :span="6">
        <div class="scriptItem">
          <div class="scriptItemIcon">
            <img
              alt="`脚本-${historyDetail.scriptName}`"
              :src="`./static/images/autoOps/script-icon-${sysTheme}.png`" />
            <span
              class="scriptStatus"
              :style="{background: calScriptStatus(historyDetail.excuteStatus).color}">
              {{calScriptStatus(historyDetail.excuteStatus).text}}
            </span>
          </div>
          <div>{{historyDetail.scriptName}}</div>
          <div style="margin-top: 8px;">
            <s-button @click="goToAuditDetail">审计详情</s-button>
          </div>
        </div>
      </s-col>
      <s-col :span="18">
        <s-row>
          <s-col :span="4" class="grid-content">执行人：</s-col>
          <s-col :span="8" class="grid-content">
            <s-tooltip :content="historyDetail.excuteUserName">
              <div>{{historyDetail.excuteUserName}}</div>
            </s-tooltip>
          </s-col>
          <s-col :span="4" class="grid-content">开始时间：</s-col>
          <s-col :span="8" class="grid-content">{{historyDetail.startTime}}</s-col>
        </s-row>
        <s-row>
          <s-col :span="4" class="grid-content">脚本库：</s-col>
          <s-col :span="8" class="grid-content">
            <s-tooltip :content="historyDetail.scriptLibName">
              <div>{{historyDetail.scriptLibName}}</div>
            </s-tooltip>
          </s-col>
          <s-col :span="4" class="grid-content">结束时间：</s-col>
          <s-col :span="8" class="grid-content">{{historyDetail.endTime}}</s-col>
        </s-row>
        <s-row>
          <s-col :span="4" class="grid-content">执行参数：</s-col>
          <s-col :span="8" class="grid-content" style="overflow: hidden">
            <s-tooltip :content="historyDetail.scriptParam">
              <div>{{historyDetail.scriptParam}}</div>
            </s-tooltip>
          </s-col>
          <s-col :span="4" class="grid-content">超时时间：</s-col>
          <s-col :span="8" class="grid-content">{{historyDetail.overtime}}</s-col>
        </s-row>
        <s-row>
          <s-col :span="24" class="grid-content">执行主机：{{historyDetail.assetName}}</s-col>
          <!--<s-col :span="18" class="grid-content">
            <span
              class="rowScriptStatus"
              :style="{background: calScriptStatus(1)}">成功x</span>
          </s-col>-->
        </s-row>
      </s-col>
    </s-row>

    <s-table :data="historyList" id="historyListTable">
      <s-table-column label="主机名称" width="210">
        <template slot-scope="scope">
          <s-row class="hostName">
            <s-col :span="5">
              <span class="icon-host-ctn">
                <i class="iconfont icon-Host"></i>
              </span>
            </s-col>
            <s-col :span="19">
              <div style="padding: 8px 0;">
                <div class="cellItem">{{scope.row.assetName}}</div>
                <div class="cellItem cellItemTip">{{scope.row.assetIp}}</div>
              </div>
            </s-col>
          </s-row>
        </template>
      </s-table-column>
      <s-table-column label="执行状态" width="120">
        <template slot-scope="scope">
          <div style="padding: 8px 0;">
            <span
              class="rowScriptStatus"
              :style="{background: calScriptStatus(scope.row.excuteStatus).color}">
              {{calScriptStatus(scope.row.excuteStatus).text}}
            </span>
            <div style="margin-top: 3px;">账户：{{scope.row.assetAccount}}</div>
          </div>
        </template>
      </s-table-column>
      <s-table-column label="执行结果">
        <template slot-scope="scope">
          <div
            class="moreResultTxt"
            v-text="scope.row.result && scope.row.result.replace(/<\/br>/g, '')"></div>
          <div
            class="moreResult"
            v-if="scope.row.result && scope.row.result.length > 30"
            @click="moreResult(scope.row.result)">更多...</div>
        </template>
      </s-table-column>
    </s-table>

    <!--脚本执行结果更多详情弹框-->
    <s-dialog
      v-model="moreResultDialog"
      v-if="moreResultDialog"
      title="执行结果"
      append-to-body>
      <div style="word-wrap: break-word" v-html="moreResultContent"></div>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import mixins from './MethodsMixin';

  export default{
    data() {
      return {
        historyList: [],            // 弹框下方表格数据
        moreResultDialog: false,    // 脚本执行结果更多详情弹框
        moreResultContent: ''       // 脚本执行结果更多详情弹框内容
      }
    },
    mixins: [mixins],
    props: {
      historyDetail: {
        type: Object
      }
    },
    computed: {
      // 判断主题->判断脚本图片主题
      sysTheme() {
        let theme = window.localStorage.getItem('theme');
        return (!theme || theme !== 'dark') ? 'chalk' : 'dark'
      }
    },
    methods: {
      // 跳转至脚本审计详情
      goToAuditDetail() {
        this.$emit('closeDialog');
        setTimeout(() => {
          this.$router.push('/AutoOpsCenter/autoops_log/0');
        }, 0)
      },
      // 脚本执行结果更多详情弹框
      moreResult(result) {
        this.moreResultContent = result;
        this.moreResultDialog = true;
      }
    },
    created() {
      this.historyList = [this.historyDetail];
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #scriptExeHistory
    .scriptItem
      text-align center
      margin-left -15px
      padding-top 10px
    .scriptItemIcon
      position relative
      display inline-block
      margin-bottom 5px
    #historyListTable
      .hostName
        .icon-Host
          font-size 32px
        .icon-host-ctn
          display inline-block
          padding-top 22px
        .cellItem
          margin-top 3px
      .moreResultTxt
        float left
        width 88%
        overflow hidden
      div.moreResult
        cursor pointer
        float right
        &:hover
          text-decoration underline
    .scriptStatus, .rowScriptStatus
      display inline-block
      height 22px
      line-height 22px
      border-radius 3px
      font-size 14px
      color #fff
      text-align center
    .scriptStatus
      width 54px
      position absolute
      top 6px
      right -24px
    .rowScriptStatus
      padding 0 10px
</style>
