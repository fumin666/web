<template>
  <section id="scriptExeHistory" class="scriptExecute">
    <s-scrollbar wrap-style="max-height: 400px;">
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
          <div style="width:170px;margin:0 auto;word-wrap:break-word;">{{historyDetail.fileName}}</div>
        </div>
      </s-col>
      <s-col :span="18">
        <s-row>
          <s-col :span="4" class="grid-content">执行人：</s-col>
          <s-col :span="8" class="grid-content">
              <div>{{historyDetail.excuteUserName}}</div>
          </s-col>
          <s-col :span="4" class="grid-content">开始时间：</s-col>
          <s-col :span="8" class="grid-content">{{historyDetail.startTime}}</s-col>
        </s-row>
        <s-row>
          <s-col :span="4" class="grid-content">目标目录：</s-col>
          <s-col :span="8" class="grid-content">
              <div :title="historyDetail.destPath" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{historyDetail.destPath}}</div>
          </s-col>
          <s-col :span="4" class="grid-content">结束时间：</s-col>
          <s-col :span="8" class="grid-content">{{historyDetail.endTime}}</s-col>
        </s-row>
        <s-row>
          <s-col :span="4" class="grid-content">文件重名：</s-col>
          <s-col :span="8" class="grid-content">{{historyDetail.isCover === 0 ? '忽略' : '不忽略'}}</s-col>
          <s-col :span="4" class="grid-content">路径不存在：</s-col>
          <s-col :span="8" class="grid-content">{{historyDetail.isCreateDir === 0 ? '不创建' : '创建'}}</s-col>
        </s-row>
        <s-row>
          <s-col :span="4" class="grid-content">文件大小：</s-col>
          <s-col :span="8" class="grid-content">
              <div>{{(historyDetail.fileSize / 1024).toFixed(2) + 'KB'}}</div>
          </s-col>
        </s-row>
      </s-col>
    </s-row>
    <s-table :data='resultList'>
      <s-table-column label="主机名称">
        <template slot-scope="scope">
          <div v-html="scope.row.name"></div>
          <div class="subContent" v-html="scope.row.ip"></div>
        </template>
      </s-table-column>
      <s-table-column prop="status" label="执行状态">
        <template slot-scope="scope">
          <s-tag :type="scope.row.status | statusFilter">{{scope.row.status | wordFilter}}</s-tag>
        </template>
      </s-table-column>
      <s-table-column label="执行结果">
        <template slot-scope="scope">
          <span v-html="scope.row.result"></span>
        </template>
      </s-table-column>
    </s-table>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import mixins from '../../AutoOps_HostList/MethodsMixin';

  export default{
    data() {
      return {
        resultList: []
      }
    },
    mixins: [mixins],
    props: {
      historyDetail: {
        type: Object
      }
    },
    computed: {
      sysTheme() {
        let theme = window.localStorage.getItem('theme');
        return (!theme || theme !== 'dark') ? 'chalk' : 'dark'
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = ['danger', 'success']
        return statusMap[status]
      },
      wordFilter(status) {
        const wordMap = ['失败', '成功']
        return wordMap[status]
      }
    },
    created() {
      this.resultList.push(
        {
          name: this.historyDetail.assetName,
          ip: this.historyDetail.assetIp,
          status: this.historyDetail.excuteStatus,
          result: this.historyDetail.result
        }
      )
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #scriptExeHistory
    .s-table .s-tooltip.cell
      white-space: normal
    .icon-Host
      font-size 32px
    .scriptItem
      text-align center
      margin-left -15px
      padding-top 10px
    .scriptItemIcon
      position relative
      display inline-block
      margin-bottom 5px
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
