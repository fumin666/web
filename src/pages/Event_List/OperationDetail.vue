<template>
  <section id="operationDetail">
    <s-scrollbar wrap-style="max-height:480px;">
      <!--<s-form :inline="true">
        <s-form-item label="导出类型">
          <s-select v-model="exportType">
            <s-option label="Word报表导出" :value="0"></s-option>
            <s-option label="Excel报表导出" :value="1"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="导出内容">
          <s-select v-model="exportContentChecked" multiple placeholder="请选择(可多选)">
            <s-option
              v-for="item in exportContent"
              :label="item.name"
              :value="item.id"
              :key="item.id">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item>
          <s-button title="导出">导出</s-button>
        </s-form-item>
      </s-form>-->
      <s-tab @on-click="tabClick">
        <s-tab-pane label="会话回显" :key="0">
          <s-table-page
            :data="cmdTableData">
            <s-table-column label="内容" prop="command_name" show-overflow-tooltip>
            </s-table-column>
            <s-table-column label="时间" width="220">
              <template slot-scope="scope">
                <span v-text="formatDate(scope.row.time)"></span>
              </template>
            </s-table-column>
          </s-table-page>
        </s-tab-pane>
        <s-tab-pane label="会话属性" :key="1">
          <s-row>
            <span class="title">
              <i class="iconfont icon-tag"></i>基本信息
            </span>
          </s-row>
          <s-table :data="listTableData">
            <s-table-column label="会话ID" prop="sessionId"></s-table-column>
            <s-table-column label="协议" prop="protocolName" show-overflow-tooltip></s-table-column>
            <s-table-column label="访问日期" width="180" prop="sessionStartTime" show-overflow-tooltip></s-table-column>
            <s-table-column label="时长">
              <template slot-scope="scope">
                <span v-text="formatSeconds(scope.row.sessionTimeLong)" :title="formatSeconds(scope.row.sessionTimeLong)"></span>
              </template>
            </s-table-column>
            <s-table-column label="流量(字节)" prop="sessionFlow"></s-table-column>
            <s-table-column label="命令数" prop="cmdNum"></s-table-column>
            <s-table-column label="命令告警数" prop="i"></s-table-column>
            <s-table-column label="命令阻断数" prop="j"></s-table-column>
            <s-table-column label="会话阻断数" prop="k"></s-table-column>
          </s-table>
          <s-row>
            <span class="title">
              <i class="iconfont icon-tag"></i>操作端信息
            </span>
          </s-row>
          <s-table :data="listTableData">
            <s-table-column label="操作人" prop="userLoginName"></s-table-column>
            <s-table-column label="客户端IP" prop="sessionClientIp"></s-table-column>
          </s-table>
          <s-row>
            <span class="title">
              <i class="iconfont icon-money"></i>资产端信息
            </span>
          </s-row>
          <s-table :data="listTableData">
            <s-table-column label="目标资产IP" prop="deviceIp"></s-table-column>
            <s-table-column label="端口" prop="port"></s-table-column>
            <s-table-column label="账号名" prop="accountName"></s-table-column>
          </s-table>
          <s-row>
            <span class="title">
              <i class="iconfont icon-tag"></i>其他
            </span>
          </s-row>
          <s-table :data="listTableData">
            <s-table-column label="审核状态">
              <template slot-scope="scope">
                <span v-text="AuditResult[scope.row.sessionAuditResult]"></span>
              </template>
            </s-table-column>
            <s-table-column label="审核批注" prop="sessionAuditRemark"></s-table-column>
            <s-table-column label="会话类型" show-overflow-tooltip prop="sessionTypeStr"></s-table-column>
            <s-table-column label="运维号" prop="sessionOpnumber"></s-table-column>
          </s-table>
        </s-tab-pane>
        <!--<s-tab-pane label="剪贴板审计" :key="2">
          <s-table-page
            :data="clipboardTableData"
            
            :header-search='getListSearchDef()'
            :row-actions='getListRowActionsDef()'>
            <s-table-column label="回话ID" show-overflow-tooltip prop="session_uuid">
            </s-table-column>
            <s-table-column label="类型" prop="clipboardFlag">
            </s-table-column>
            <s-table-column label="文件名称" prop="clipboardName">
            </s-table-column>
            <s-table-column label="文件内容" prop="clipboardCont">
            </s-table-column>
            <s-table-column label="存储时间" show-overflow-tooltip prop="createTime">
            </s-table-column>
          </s-table-page>
        </s-tab-pane>
        <s-tab-pane label="标题审计" :key="3">
          <s-table-page
            :data="titleTableData"
            
            :header-search='getListSearchDef()'
            :row-actions='getListRowActionsDef()'>
            <s-table-column label="回话ID" show-overflow-tooltip prop="session_uuid">
            </s-table-column>
            <s-table-column label="标题内容" show-overflow-tooltip prop="title_text">
            </s-table-column>
          </s-table-page>
        </s-tab-pane>
        <s-tab-pane label="鼠标审计" :key="4">
          <s-table
            :data="mouseTableData">
            <s-table-column type="index" label="序号" width="80">
            </s-table-column>
            <s-table-column label="点击时间" prop="time">
            </s-table-column>
            <s-table-column label="按键类型" prop="command_click">
            </s-table-column>
            <s-table-column label="位置坐标" prop="command_pos">
            </s-table-column>
            <s-table-column label="操作" width="100">
              <template slot-scope="scope">
                <i class="iconfont icon-vcr" title="播放"></i>
              </template>
            </s-table-column>
          </s-table>
        </s-tab-pane>
        <s-tab-pane label="缩略图审计" :key="5">
          <s-table :data="auditTableData">
            <s-table-column label="名称1">
            </s-table-column>
            <s-table-column label="名称2">
            </s-table-column>
            <s-table-column label="名称3">
            </s-table-column>
          </s-table>
        </s-tab-pane>-->
      </s-tab>
    </s-scrollbar>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import mixin from './EventMixin'

  export default {
    data() {
      return {
        cmdTableData: [],           // 会话回显列表
        listTableData: [],          // 会话属性列表
        AuditResult: ['未审核', '合规', '违规'],       // 会话属性->其他->审核状态列表
        clipboardTableData: [],     // 剪贴板审计列表
        titleTableData: [],          // 标题审计列表
        mouseTableData: [],         // 鼠标审计列表
        auditTableData: [],         // 缩略图审计列表
        detailData: {},
        exportType: 0,              // 导出类型
        sessionProperty: [],        // 会话属性列表
        exportContent: [],          // 导出内容可选列表
        exportContentChecked: []    // 导出内容选中列表
      }
    },
    mixins: [mixin],
    props: {
      rowData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      // 运维审计事件详情->tabs点击事件
      tabClick(key) {
      },
      // 会话回显列表操作列初始化
      getListRowActionsDef() {
        let def = [{
          name: '播放',
          type: 'vcr',
          click(row) {
          }
        }]
        return def
      }
    },
    created() {
      // 获取运维审计事件详情
      let uuid = this.rowData.sessionUuid || this.rowData.monitorItemUuid
      $axios.get(`/sessionCmd/getSessionDetailBySessionUuid/${uuid}`).then((res) => {
        let resData = res.data
        if (resData) {
          this.cmdTableData = resData.map_t_session_cmd
          this.titleTableData = resData.map_t_session_title_text
          this.mouseTableData = resData.map_t_session_replay_mouse
          this.auditTableData = resData.map_t_session_bitmap_audit
          this.clipboardTableData = resData.map_t_session_replay_clipboard
          let ijk = {i: resData.i, j: resData.j, k: resData.k}
          if (resData.sessionList) {
            let sessionTypeStr = {sessionTypeStr: resData.sessionTypeMap[resData.sessionList.sessionTypeUuid]}
            this.listTableData = [Object.assign({}, resData.sessionList, ijk, sessionTypeStr)]
          }
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #operationDetail
    .title
      display inline-block
      margin 12px 0 0
      font-size 14px
      color #20a8f7
      vertical-align middle
    .footerRow
      margin-top 15px
      text-align right
      .s-button
        &:nth-of-type(1)
          margin-right 20px
</style>
