<template>
  <section id="monitorEvent">
    <div>
      <s-form
        :inline="true"
        class="search_form" style="margin:10px 0" label-width='75px'
        ref="searchGroupForm"
        :model="searchGroup"
        :rules="searchGroupRules">
        <div>
          <s-form-item label="事件级别：">
            <s-select v-model="searchGroup.level" placeholder="请选择" clearable>
              <s-option
                v-for="(item, index) in levels"
                :label="item"
                :value="index"
                :key="'eventLevet' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="恢复状态：">
            <s-select v-model="searchGroup.isRecoveryIncident" placeholder="请选择" clearable>
              <s-option label="已恢复" :value="1" :key="'recover' + 1"></s-option>
              <s-option label="未恢复" :value="0" :key="'recover' + 0"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="流程状态：" v-if="WorkFlowAuth">
            <s-select v-model="searchGroup.eventOrderStatus" placeholder="请选择" clearable>
              <s-option label="未进入" :value="1"></s-option>
              <s-option label="处理中" :value="2"></s-option>
              <s-option label="已处理" :value="3"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="资产名称：">
            <s-input v-model="searchGroup.itcompName" placeholder="请输入" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="IP地址：" prop="controlAdderss">
            <s-input v-model="searchGroup.controlAdderss" placeholder="请输入" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="更新时间：">
            <s-date-picker
              type="datetime"
              placeholder="选择起始时间"
              v-model="start_time"
              :editable="false"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              type="datetime"
              placeholder="选择结束时间"
              v-model="end_time"
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
          <s-button  icon="nav-system-set" type="cancel"  title="列设置" @click="showDynamicColSet"></s-button>
        </div>
        <div class="clr"></div>
      </div>
    </div>
    <!--真分页表格-->
    <div>
      <s-table :data="monitorList" style="width:100%;" class="event-status-box">
        <s-table-column
          v-for="option in dynaColSetOptions"
          :label="option.colName"
          :prop="option.colKey"
          :key="option.colKey"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="option.colKey === 'level'" :class="levelStatus[scope.row.level]" class="status-basic">{{scope.row.levelStr}}</span>
            <span v-else-if="option.colKey==='createTimeStr'" v-text="formatDate(scope.row.createTime)"></span>
            <span v-else-if="option.colKey==='modifyTimeStr'" v-text="formatDate(scope.row.modifyTime)"></span>
            <span v-else v-text="scope.row[option.colKey]"></span>
          </template>
        </s-table-column>
        <s-table-column
          label="操作"
          width="160">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" title="查看" @click="showMonitorDetail(scope.row, scope.$index)"></i>
            <i v-if="WorkFlowAuth"
               :class="['iconfont', `icon-${scope.row.itilIncidentOrderUuid?'manage-process':'set-process'}`]"
               :title="scope.row.itilIncidentOrderUuid?'查看流程':'进入流程'"
               @click="handelProcess(scope.row, scope.$index)"></i>
            <i
              :class="['iconfont', `icon-${scope.row.safeOrderUuid === null?'order-add':'underway'}`]"
               :title="scope.row.safeOrderUuid === null?'通报下发':'通报中'"
              v-if="authSafetyBulletin"
               @click="bulletinHandle(scope.row, scope.$index)"></i>

          </template>
        </s-table-column>
      </s-table>
      <s-row class="pageRow">
        <s-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page="formInline.currentPage" :page-size="formInline.pageSize"
                      layout="total, sizes, prev, pager, next, jumper" :total="formInline.totalCount">
        </s-pagination>
      </s-row>
    </div>
    <!--监控事件信息详情弹框-->
    <s-dialog
      width="800px"
      top="10%"
      v-if="monitorDetailFlag"
      v-model="monitorDetailFlag"
      title="监控事件信息"
      key="monitorDetail">
      <monitor-detail
        ref="monitorDetail"
        :detailData="monitorDetailData"
        @closeDialog="_closeDialog">
      </monitor-detail>
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
        :eventType="1"
        @closeDynColSet="_closeDynColSet"></dynamic-col-set>
    </s-dialog>

    <!--最新事件手动创建事件单，进入itsm流程-->
    <s-dialog
      v-model="createEventOrderDialog"
      v-if="createEventOrderDialog"
      width="600px"
      top="10%"
      title="创建工单">
      <create-event-order ref="createEventOrder" :sysIncidentType="sysIncidentType"></create-event-order>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCreateEventOrder(1)">保存</s-button>
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
      @updateTable="getList"
    ></add-release-bulletin>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  // import {batchUuid} from 'sunflower-common-utils'
  import {cloneDeep} from 'lodash'
  import {Validaters} from 'sunflower-common-utils'
  import mixin from './EventMixin'
  import auth from '@/common/mixins/auth.js'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import monitorDetail from './MonitorDetail.vue'
  import dynamicColSet from './DynamicColSet.vue'

  export default {
    data() {
      return {
        monitorListOrigin: [],      // 监控事件列表初始值
        monitorList: [],            // 监控事件列表
        levels: ['未知', '正常', '提示', '警告', '次要', '主要', '严重'],
        levelStatus: [ 'status-unknown', 'status-normal', 'status-prompt', 'status-warn', 'status-secondary',
          'status-serious', 'status-urgency'],
        searchFlag: false,
        monitorDetailFlag: false,   // 监控事件详情弹框
        monitorDetailData: {},      // 监控事件详情数据
        searchKeyWord: '',          // 查询关键字
        start_time: this.getTodayZeroTime(),
        end_time: new Date(),
        searchGroup: {
          level: null,
          isRecoveryIncident: null,
          eventOrderStatus: null,
          start_time: parseInt(this.getTodayZeroTime().getTime() / 1000),
          end_time: parseInt(new Date().getTime() / 1000),
          itcompName: null,
          controlAdderss: null
        },
        searchGroupRules: {
          controlAdderss: [Validaters.IP]
        },
        formInline: { // 根据分页、查询条件查询列表的参数
          condition: {
            level: null,
            isRecoveryIncident: null,
            eventOrderStatus: null,
            start_time: null,
            end_time: null,
            itcompName: null,
            controlAdderss: null
          },
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        }
      }
    },
    mixins: [mixin, auth],
    components: {
      monitorDetail,
      // searchBox,
      dynamicColSet
    },
    created() {
      // 事件中心>事件趋势跳转过来
      if (this.$route.params.start !== '0') {
        this.searchGroup = Object.assign({}, this.searchGroup, {
          start_time: parseInt(new Date(this.$route.params.start).getTime() / 1000),
          end_time: parseInt(new Date(this.$route.params.end).getTime() / 1000)
        });
        this.start_time = new Date(this.$route.params.start);
        this.end_time = new Date(this.$route.params.end);
      }
      if (this.$route.query && this.$route.query.ip) { // 从资产面板跳转过来
        this.searchGroup = Object.assign(this.searchGroup, {
          start_time: null,
          end_time: null,
          controlAdderss: this.$route.query.ip
        });
      }
      // 初始化监控事件列表
      this.getList();
      // 初始化动态列
      this.initDynamicCol(1)
    },
    methods: {
      /* 获取(刷新)监控事件列表 */
      getList() {
        let vm = this
        let param = cloneDeep(vm.searchGroup);
        this.formInline.condition = param
        $axios.post('/incidentCount/impIncidentList', this.formInline).then((res) => {
          if (res.data) {
            this.monitorList = res.data.pageList;
            this.formInline.totalCount = res.data.totalCount;
            this.formInline.pageSize = res.data.pageSize;
          }
        })
      },
      /* 页码 */
      handleSizeChange(curPageSize) {
        this.formInline.currentPage = 1;
        this.formInline.pageSize = curPageSize;
        this.getList();
      },
      /* 分页 */
      handleCurrentChange(current) {
        if (current === this.formInline.currentPage) return;
        this.formInline.currentPage = current;
        this.getList();
      },
      // 搜索功能初始化
      getListSearchDef() {
        return {
          show: false
        }
      },
      showMonitorDetail(row) {
        this.monitorDetailData = row
        this.$set(this.monitorDetailData, 'hideFooter', true)
        this.monitorDetailFlag = true
      },
      searchAction() {
        // let searchGroupObj = Object.assign({}, this.searchGroup)
      },
      showHideSearch() {
        this.searchFlag = !this.searchFlag
      },
      getDateRangeStart(val) {
        let self = this
        let start = this.start_time ? new Date(this.start_time).getTime() : 0
        let end = this.end_time ? new Date(this.end_time).getTime() : 0
        if (start && end) {
          if (start > end) {
            self.searchGroup.start_time = null;
            self.start_time = null;
            this.$message({
              message: '开始日期不能大于等于结束日期！',
              type: 'error'
            });
            return false;
          } else {
            self.searchGroup.start_time = parseInt(new Date(val).getTime() / 1000);
          }
        } else {
          self.searchGroup.start_time = parseInt(new Date(val).getTime() / 1000);
        }
      },
      getDateRangeEnd(val) {
        let self = this
        let start = this.start_time ? new Date(this.start_time).getTime() : 0
        let end = this.end_time ? new Date(this.end_time).getTime() : 0
        if (start && end) {
          if (end < start) {
            self.searchGroup.end_time = null;
            self.end_time = null;
            this.$message({
              message: '开始日期不能大于等于结束日期！',
              type: 'error'
            });
            return false;
          } else {
            self.searchGroup.end_time = parseInt(new Date(val).getTime() / 1000);
          }
        } else {
          self.searchGroup.end_time = parseInt(new Date(val).getTime() / 1000);
        }
      },
      /* eslint-disable no-new */
      // 监控事件条件查询
      searchPost() {
        this.getList()
      },
      // 点击手动查询按钮
      searchHandler() {
        this.$refs.searchGroupForm.validate((valid) => {
          if (valid) this.searchPost()
          else return false
        })
      },
      _closeDialog() {
        this.monitorDetailFlag = false
        this.getList()
      }
    }
  }
</script>
