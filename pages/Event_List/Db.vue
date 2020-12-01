<template>
  <section id="DbEvent">
    <div>
      <s-form
        class="search_form" style="margin:10px 0" label-width='100px'
        :inline="true"
        ref="searchGroupForm"
        :model="searchGroup"
        :rules="searchGroupRules">
        <div>
          <s-form-item label="规则名：">
            <s-input v-model="searchGroup.policy_name" placeholder="请输入" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="数据库名：">
            <s-select v-model="searchGroup.dbi_name" placeholder="请选择">
              <s-option
                v-for="(list, index) in dbiNameList"
                :label="list.dbi_name"
                :value="list.dbi_name"
                :key="'db' + index">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="数据库IP：" prop="dbi_ip">
            <s-input v-model="searchGroup.dbi_ip" placeholder="请输入" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="数据库账号：">
            <s-input v-model="searchGroup.account_name" placeholder="请输入" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="客户端IP：" prop="client_ip">
            <s-input v-model="searchGroup.client_ip" placeholder="请输入" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="客户端MAC：" prop="client_mac">
            <s-input v-model="searchGroup.client_mac" placeholder="请输入" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="事件级别：">
            <s-select v-model="searchGroup.alarm_level" placeholder="请选择" clearable>
              <s-option
                v-for="(item, index) in levels"
                :label="item"
                :value="index"
                :key="'eventLevet' + index"></s-option>
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
          <s-button title="查询" icon='magnifier' @click="searchHandler">查询</s-button>
        </div>
      </s-form>
      <div class="margin-bottom-15">
        <div class="fr">
          <s-button icon="nav-system-set" type="cancel"  title="列设置" @click="showDynamicColSet"></s-button>
        </div>
        <div class="clr"></div>
      </div>
    </div>
    <page-infinite-table
      class="event-status-box"
      ref="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="axiosHistoryObj"
      :startAjax="getHistoryFlag">
      <s-table-column
        v-for="option in dynaColSetOptions"
        :label="option.colName"
        :prop="option.colKey"
        :key="option.colName"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="option.colName === '事件标识'" :class="levelStatus[parseInt(scope.row.alarm_level)]" class="status-basic">{{scope.row.alarm_name}}</span>
          <span v-else-if="option.colName === '事件级别'" :class="levelStatus[parseInt(scope.row.alarm_level)]" class="status-basic" v-text="scope.row.alarm_name"></span>
          <span v-else-if="option.colKey==='status'" v-text="scope.row.status"></span>
          <span v-else-if="option.colKey==='account_name'" v-text="scope.row.account_name || '无'"></span>
          <span v-else-if="option.colKey==='alarm_time'" v-text="scope.row.alarm_time"></span>
          <span v-else v-text="scope.row[option.colKey]"></span>
        </template>
      </s-table-column>
      <s-table-column
        label="操作"
        width="160"
        :show-overflow-tooltip="false">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="show(scope.row, scope.$index)"></i>
          <i v-if="WorkFlowAuth" :class="['iconfont', `icon-${scope.row.itilIncidentOrderUuid?'manage-process':'set-process'}`]"
             :title="scope.row.itilIncidentOrderUuid?'查看流程':'进入流程'"
             @click="handelProcess(scope.row, scope.$index, 'alarm_id')"></i>
          <i
            :class="['iconfont', `icon-${scope.row.safeOrderUuid === null?'order-add':'underway'}`]"
            :title="scope.row.safeOrderUuid === null?'通报下发':'通报中'"
            v-if="authSafetyBulletin"
            @click="bulletinHandle(scope.row, scope.$index,'alarm_id')"></i>
        </template>
      </s-table-column>
    </page-infinite-table>

    <!--数据库审计事件详情弹框-->
    <s-dialog
      width="800px"
      top="10%"
      v-if="bloomDetail"
      v-model="bloomDetail"
      title="事件信息"
      key="bloomDetail">
      <db-detail
        ref="dbDetail"
        :rowData="DBdetailData"
        @closeDialog="_closeDialog">
      </db-detail>
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
        :eventType="3"
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
        <s-button @click="saveCreateEventOrder(3)">保存</s-button>
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
      @updateTable="searchHandler"
    ></add-release-bulletin>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import mixin from './EventMixin'
  import DbDetail from './DatabaseDetail'
  import {Validaters} from 'sunflower-common-utils'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import dynamicColSet from './DynamicColSet.vue'
  import auth from '@/common/mixins/auth.js'

  export default {
    components: {
      DbDetail,
      pageInfiniteTable,
      // searchBox,
      dynamicColSet
    },
    data() {
      return {
        levels: ['未知', '正常', '提示', '警告', '次要', '主要', '严重'],
        levelStatus: [ 'status-unknown', 'status-normal', 'status-prompt', 'status-warn', 'status-secondary',
          'status-serious', 'status-urgency'],
        dbiNameList: [],        // 数据库名下拉列表
        bloomDetail: false,
        DBdetailData: {},
        exportType: 0,
        searchFlag: false,
        searchGroup: {
          policy_name: null,
          dbi_name: '全部',
          dbi_ip: null,
          account_name: null,
          client_ip: null,
          client_mac: null,
          alarm_level: null,
          start_time: this.getTodayZeroTime(),
          end_time: new Date()
        },
        timeRange: {
          start_time: null,
          end_time: null
        },
        searchGroupRules: {
          dbi_ip: [Validaters.IP],
          client_ip: [Validaters.IP]
        },
        getHistoryFlag: true,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbaIncident/list/t_data_alarm_dbsql',
          params: {
            condition: {}
          }
        }
      }
    },
    mixins: [mixin, auth],
    methods: {
      show(row, index) {
        var vm = this
        vm.DBdetailData = row
        vm.$set(vm.DBdetailData, 'hideFooter', true)
        vm.bloomDetail = true
      },
      showHideSearch() {
        this.searchFlag = !this.searchFlag
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
            self.timeRange.start_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000)
          }
        } else {
            self.timeRange.start_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000)
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
            self.timeRange.end_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000)
          }
        } else {
            self.timeRange.end_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000)
        }
      },
      searchHandler() {
        this.$refs['searchGroupForm'].validate(valid => {
          if (valid) {
            for (let key in this.searchGroup) {
              if (this.searchGroup[key] === '') {
                this.searchGroup[key] = null
              }
              if (this.searchGroup[key] !== null && typeof this.searchGroup[key] === 'string') {
                this.searchGroup[key] = this.searchGroup[key].replace(/(^\s*)|(\s*$)/g, '')
              }
            }
            if (this.searchGroup.dbi_name === '全部') {
              this.axiosHistoryObj.params.condition = Object.assign({}, this.searchGroup, {dbi_name: null}, this.timeRange)
            } else {
              this.axiosHistoryObj.params.condition = Object.assign({}, this.searchGroup, this.timeRange)
            }
          } else {
            return false
          }
        })
      },
      _closeDialog() {
        // [bug修改]更新列表时，结束时间未同步至当前最新时间，使部分数据被过滤不显示
        this.timeRange.end_time = parseInt(new Date().getTime() / 1000 + 60)
        // 关闭弹框后将页面显示的结束时候更新为当前时间
        this.searchGroup.end_time = new Date()
        this.searchHandler()
        this.bloomDetail = false
      }
    },
    created() {
      $axios.post('sessionCmd/getObjectListByTableName/v_sys_dbaudit_dbinstance').then(res => {
        let resData = res.data
        if (resData instanceof Array) {
          this.dbiNameList = resData
          this.dbiNameList.splice(0, 0, {dbi_name: '全部'})
        }
      });
      if (this.$route.params.start !== '0') {
        this.timeRange.start_time = Math.ceil(new Date(this.$route.params.start).getTime() / 1000)
        this.timeRange.end_time = Math.ceil(new Date(this.$route.params.end).getTime() / 1000)
        this.searchGroup.start_time = new Date(this.$route.params.start)
        this.searchGroup.end_time = new Date(this.$route.params.end)
      } else {
        this.timeRange.start_time = Math.ceil(this.getTodayZeroTime().getTime() / 1000)
        this.timeRange.end_time = Math.ceil(new Date().getTime() / 1000)
        this.searchGroup.start_time = this.getTodayZeroTime()
        this.searchGroup.end_time = new Date()
      }
      this.axiosHistoryObj.params.condition = Object.assign({}, this.searchGroup, {dbi_name: null}, this.timeRange);
      if (this.$route.query && this.$route.query.ip) { // 从资产面板跳转过来
        this.searchGroup = Object.assign(this.searchGroup, {
          client_ip: this.$route.query.ip,
          start_time: null,
          end_time: null
        });
        this.axiosHistoryObj.params.condition = Object.assign(this.axiosHistoryObj.params.condition, this.searchGroup);
      }
      // this.searchFlag = true
      // 初始化动态列
      this.initDynamicCol(3)
    }
  }
</script>
