<template>
  <section id="operationEvent">
    <div>
      <s-form
        :inline="true"
        class="search_form" style="margin:10px 0" label-width='110px'
        ref="searchGroupForm"
        :model="searchGroup"
        :rules="searchGroupRules">
        <div>
          <s-form-item label="事件标识：">
            <s-select v-model="searchGroup.level" placeholder="请选择" clearable>
              <s-option :label="i" :value="index" v-for="(i,index) in levels" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="流程状态：" v-if="WorkFlowAuth">
            <s-select v-model="searchGroup.workflowStatus" placeholder="请选择" clearable>
              <s-option label="未进入" :value="1" ></s-option>
              <s-option label="处理中" :value="2" ></s-option>
              <s-option label="已处理" :value="3" ></s-option>
              <s-option label="已忽略" :value="4" ></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="规则名称：">
            <s-input v-model="searchGroup.bwName" placeholder="请输入" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="运维用户：">
            <s-input v-model="searchGroup.userRealName" placeholder="请输入"  @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="客户端IP：" prop="sessionClientIp">
            <s-input v-model="searchGroup.sessionClientIp" placeholder="请输入" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="目标资产名称：" prop="deviceName">
            <s-input v-model="searchGroup.deviceName" placeholder="请输入" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="目标资产IP：" prop="deviceIp">
            <s-input v-model="searchGroup.deviceIp" placeholder="请输入" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="资产账号：" prop="accountName">
            <s-input v-model="searchGroup.accountName" placeholder="请输入" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="协议：">
            <s-select v-model="searchGroup.protocolName" placeholder="请选择" clearable>
              <s-option label="TELNET" value="TELNET" ></s-option>
              <s-option label="SSH" value="SSH" ></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="命令名：">
            <s-input v-model="searchGroup.command_name" placeholder="请输入" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="命令类型：">
            <s-select v-model="searchGroup.command_type" placeholder="请选择" clearable>
              <s-option label="会话阻断" :value="4" ></s-option>
              <s-option label="命令阻断" :value="3" ></s-option>
              <s-option label="命令告警" :value="2" ></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="事件时间：">
            <s-date-picker
              v-model="searchGroup.start_time"
              type="datetime"
              placeholder="选择起始时间"
              :editable="false"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              v-model="searchGroup.end_time"
              type="datetime"
              placeholder="选择结束时间"
              :editable="false"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button title="查询" icon='magnifier' @click="searchPost">查询</s-button>
        </div>
      </s-form>
      <div class="margin-bottom-15">
        <div class="fr">
          <s-button icon="nav-system-set" type="cancel" title="列设置" @click="showDynamicColSet"></s-button>
        </div>
        <div class="clr"></div>
      </div>
    </div>
    <s-page-infinite-table
      class="event-status-box"
      ref="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="axiosObj"
      :startAjax="getFlag">
      <s-table-column
        v-for="option in dynaColSetOptions"
        :label="option.colName"
        :prop="option.colKey"
        :key="option.colName"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="option.colName === '事件标识'" :class="levelStatus[scope.row.level]" class="status-basic">{{scope.row.levelStr}}</span>
          <span v-else-if="option.colName === '事件级别'" :class="levelStatus[scope.row.level]" class="status-basic" v-text="levels[scope.row.level]"></span>
          <span v-else-if="option.colKey === 'workflowStatus'" v-text="scope.row.itilIncidentOrderUuid?'已处理':'未处理'"></span>
          <span v-else-if="option.colKey === 'type'" v-text="typeArr[scope.row.type]"></span>
          <span v-else-if="option.colKey === 'createTime'" v-text="formatDate(scope.row.insertTime)"></span>
          <span v-else v-text="scope.row[option.colKey]"></span>
        </template>
      </s-table-column>
      <s-table-column
        label="操作"
        width="160">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="showDetail(scope.row, scope.$index)" title="查看"></i>
          <i v-if="WorkFlowAuth" :class="['iconfont', `icon-${scope.row.itilIncidentOrderUuid?'manage-process':'set-process'}`]"
             :title="scope.row.itilIncidentOrderUuid?'查看流程':'进入流程'"
             @click="handelProcess(scope.row, scope.$index, 'sessionCmdUuid')"></i>
          <i
            :class="['iconfont', `icon-${scope.row.safeOrderUuid === null?'order-add':'underway'}`]"
            :title="scope.row.safeOrderUuid === null?'通报下发':'通报中'"
            v-if="authSafetyBulletin"
            @click="bulletinHandle(scope.row, scope.$index, 'sessionCmdUuid')"></i>

        </template>
      </s-table-column>
    </s-page-infinite-table>

    <!--运维审计事件详情弹框-->
    <s-dialog
      width="900px"
      top="10%"
      v-if="bloomDetail"
      v-model="bloomDetail"
      title="事件详情"
      key="bloomDetail">
      <operation-detail
        ref="operationDetail"
        :rowData="detailData"
        @closeDialog="_closeDialog">
      </operation-detail>
    </s-dialog>

    <!--表格动态列设置弹框-->
    <s-dialog
      width="200px"
      top="142px"
      class="dynaColSetDialog"
      v-if="dynaColSetDialog"
      v-model="dynaColSetDialog"
      title="表格列设置"
      key="dynaColSetDialog">
      <dynamic-col-set
        :eventType="2"
        @closeDynColSet="_closeDynColSet"></dynamic-col-set>
    </s-dialog>

    <!--最新事件手动创建事件单，进入itsm流程-->
    <s-dialog
      v-model="createEventOrderDialog"
      v-if="createEventOrderDialog"
      width="600px"
      top="10%"
      title="创建工单">
      <create-event-order ref="createEventOrder"></create-event-order>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCreateEventOrder(2)">保存</s-button>
        <s-button type="cancel" @click="createEventOrderDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--通报下发-->
    <add-release-bulletin
      v-if="addReleaseBulletinFlag"
      v-model="addReleaseBulletinFlag"
      :bulletinTypeUuid="bulletinTypeUuid"
      :incidentUuid="incidentUuid"
      :rowData="rowData"
      @updateTable="searchPost"
    ></add-release-bulletin>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  import mixin from './EventMixin'
  import {Validaters} from 'sunflower-common-utils'
  import OperationDetail from './OperationDetail'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import sPageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  import dynamicColSet from './DynamicColSet.vue'
  import auth from '@/common/mixins/auth.js'

  export default {
    data() {
      return {
        levels: ['未知', '正常', '提示', '警告', '次要', '主要', '严重'],
        typeArr: ['', '', '命令告警', '命令阻断', '会话阻断'],
        levelStatus: [ 'status-unknown', 'status-normal', 'status-prompt', 'status-warn', 'status-secondary',
          'status-serious', 'status-urgency'],
        operationListOrigin: [],
        operationList: [],                // 运维审计事件列表
        searchKeyWord: '',
        searchFlag: false,
        searchGroup: {
          level: null,
          workflowStatus: null,
          bwName: null,
          userRealName: null,
          deviceName: null,
          accountName: null,
          sessionClientIp: null,
          deviceIp: null,
          protocolName: null,
          command_name: null,
          command_type: null,
          start_time: this.getTodayZeroTime(),
          end_time: new Date()
        },
        timeRange: {
          start_time: null,
          end_time: null
        },
        searchGroupRules: {
          sessionClientIp: [Validaters.IP],
          deviceIp: [Validaters.IP]
        },
        bloomDetail: false,               // 运维审计事件详情弹框
        detailData: {},
        exportType: 0,                    // 导出类型
        getFlag: true,
        axiosObj: {
          type: 'post',
          url: '/sessionCmd/list',
          params: {
            condition: {}
          }
        }
      }
    },
    mixins: [mixin, auth],
    components: {
      OperationDetail,
      // searchBox,
      sPageInfiniteTable,
      dynamicColSet
    },
    methods: {
      // 运维审计事件->事件详情查看
      showDetail(row) {
        let vm = this
        vm.detailData = row
        vm.$set(vm.detailData, 'hideFooter', true)
        vm.bloomDetail = true
      },
      getDateRangeStart(value) {
        let self = this;
        let start = this.searchGroup.start_time ? new Date(this.searchGroup.start_time).getTime() : 0
        let end = this.searchGroup.end_time ? new Date(this.searchGroup.end_time).getTime() : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchGroup.start_time = null;
            self.timeRange.start_time = null;
          } else {
            self.timeRange.start_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000).toString()
          }
        } else {
            self.timeRange.start_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000).toString()
        }
      },
      getDateRangeEnd(value) {
        let self = this;
        let start = this.searchGroup.start_time ? new Date(this.searchGroup.start_time).getTime() : 0
        let end = this.searchGroup.end_time ? new Date(this.searchGroup.end_time).getTime() : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchGroup.end_time = null;
            self.timeRange.end_time = null;
          } else {
            self.timeRange.end_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000).toString()
          }
        } else {
            self.timeRange.end_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000).toString()
        }
      },
      searchPost() {
        this.$refs['searchGroupForm'].validate(valid => {
          if (valid) {
            for (let key in this.searchGroup) {
              if (!this.searchGroup[key] && this.searchGroup[key] !== 0) {
                this.searchGroup[key] = null
              }
              if (this.searchGroup[key] !== null && typeof this.searchGroup[key] === 'string') {
                this.searchGroup[key] = this.searchGroup[key].replace(/(^\s*)|(\s*$)/g, '')
              }
            }
            this.axiosObj.params.condition = Object.assign({}, this.searchGroup, this.timeRange)
          } else {
            return false
          }
        })
      },
      _closeDialog() {
        // [bug修改]更新列表时，上传查询的结束时间未同步至当前最新时间，使部分数据被过滤不显示
        this.timeRange.end_time = parseInt(new Date().getTime() / 1000 + 60).toString()
        // 关闭弹框后将页面显示的结束时候更新为当前时间
        this.searchGroup.end_time = new Date()
        this.searchPost()
        this.bloomDetail = false
      }
    },
    created() {
      let uuidObj = {};
      if (this.$route.params.start !== '0') { // 从事件趋势跳转
        this.timeRange.start_time = Math.ceil(new Date(this.$route.params.start).getTime() / 1000).toString()
        this.timeRange.end_time = Math.ceil(new Date(this.$route.params.end).getTime() / 1000).toString()
        this.searchGroup.start_time = new Date(this.$route.params.start)
        this.searchGroup.end_time = new Date(this.$route.params.end)
      } else if (this.$route.query && this.$route.query.ip) { // 从资产面板跳转过来
        this.searchGroup.start_time = null;
        this.searchGroup.end_time = null;
        uuidObj = {assetuuid: this.$route.query.uuid};
      } else {
        this.timeRange.start_time = Math.ceil(this.getTodayZeroTime().getTime() / 1000).toString()
        this.timeRange.end_time = Math.ceil(new Date().getTime() / 1000).toString()
        this.searchGroup.start_time = this.getTodayZeroTime()
        this.searchGroup.end_time = new Date()
      }
      this.axiosObj.params.condition = Object.assign({}, this.searchGroup, this.timeRange, uuidObj);
      // this.searchFlag = true
      // 初始化动态列
      this.initDynamicCol(2)
    }
  }
</script>

<style>

</style>
