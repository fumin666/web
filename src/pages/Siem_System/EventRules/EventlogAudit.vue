<template>
  <div id="logAudit">
    <div>
      <s-form :inline="true" :model="form" :rules="formrules" class="search_form" style="margin:10px 0" label-width='90px'>
        <div>
          <s-form-item label="事件级别：">
            <s-select v-model="form.logLabel" clearable>
              <s-option v-for="(item, index) in level" :value="item.configValue" :label="item.configName"
                        :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="IP地址：" prop="hostIP">
            <s-input @keyup.enter.native="eventsSearch" v-model="form.hostIP"></s-input>
          </s-form-item>
          <s-form-item label="事件信息：">
            <s-input @keyup.enter.native="eventsSearch" v-model="form.logMessage"></s-input>
          </s-form-item>
          <s-form-item label="日志源名称：">
            <s-input @keyup.enter.native="eventsSearch" v-model="form.hostName"></s-input>
          </s-form-item>
          <s-form-item label="事件规则名：">
            <s-input @keyup.enter.native="eventsSearch" v-model="form.strategyName"></s-input>
          </s-form-item>
          <s-form-item label="更新时间：">
            <s-date-picker
              v-model="form.timeStart"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择起始时间"
              :editable="false"
              :picker-options="disableAfterToday1"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              v-model="form.timeEnd"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择结束时间"
              :editable="false"
              :picker-options="disableAfterToday2"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
          <s-form-item label="等保规则：">
            <s-select v-model="form.protectType" clearable @change="oneChange">
              <s-option v-for="(item, index) in levelProtectList" :value="item.value.uuid" :label="item.value.typeName" :key="index"></s-option>
            </s-select>
            <s-select v-model="form.protectCategory" clearable @change="twoChange">
              <s-option v-for="(item, index) in twoList" :value="item.value.uuid" :label="item.value.keyName" :key="index"></s-option>
            </s-select>
            <s-select v-model="form.protectTarget" clearable>
              <s-option v-for="(item, index) in threeList" :value="item.uuid" :label="item.keyName" :key="index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button title="查询" icon='magnifier' @click="eventsSearch">查询</s-button>
        </div>
      </s-form>
      <div class="margin-bottom-15">
        <div class="fr">
          <s-button icon="nav-system-set" type="cancel" title="列设置" @click="showDynamicColSet"></s-button>
        </div>
        <div class="clr"></div>
      </div>
    </div>
    <page-infinite-table
      class="event-status-box"
      ref="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="axioseventsObj"
      :startAjax="geteventsFlag">
      <s-table-column
        v-for="option in dynaColSetOptions"
        :label="option.colName"
        :prop="option.colKey"
        :key="option.colKey"
        :width="option.colKey === 'eventLevelLabel' ? '100' : option.colKey === 'eventLevel' ? '100' : option.colKey === 'eventMessage' ? '400': option.colKey === 'hostName' ? '150' : ''"
        show-overflow-tooltip>
        <template slot-scope="scope" width="45">
          <span v-if="option.colKey === 'eventLevel'" :class="levelStatus[scope.row.eventLevel]" class="status-basic">{{scope.row.eventLevelLabel}}</span>
          <span v-else-if="option.colKey==='status'" v-text="scope.row.itilIncidentOrderUuid?'已进入':'未进入'"></span>
          <!--  <span v-else-if="option.colKey==='eventLevelLabel'" v-text="getLevel(scope.row.eventLevel)"></span>-->
          <!-- <a v-else-if="option.colKey==='count'" v-text="scope.row.count" @click="openLogWindow(scope.row.uuid)" class="ip" href="javascript:;"></a>-->
          <span v-else v-text="scope.row[option.colKey]"></span>
        </template>
      </s-table-column>
      <!--<s-table-column show-overflow-tooltip prop="prop" label="标识" label-width="50px">
        <template slot-scope="scope" width="45">
          <img :src="filterStateImg(scope.row.eventLevel)" alt="" class="stateImg">
        </template>
      </s-table-column>
      <s-table-column show-overflow-tooltip prop="eventLevelLabel" label="事件级别" label-width="50px">
        &lt;!&ndash;  <template slot-scope="scope">
            <span v-text="getLevel(scope.row.eventLevel)"></span>
          </template>&ndash;&gt;
      </s-table-column>
      <s-table-column show-overflow-tooltip prop="eventMessage" label="事件信息"></s-table-column>
      <s-table-column show-overflow-tooltip prop="createTime" label="创建时间"></s-table-column>
      <s-table-column show-overflow-tooltip prop="modifyTime" label="更新时间"></s-table-column>
      <s-table-column show-overflow-tooltip prop="hostName" label="日志源名称"></s-table-column>
      <s-table-column show-overflow-tooltip prop="hostIp" label="IP地址">
      </s-table-column>
      <s-table-column show-overflow-tooltip prop="count" label="事件累计">
        <template slot-scope="scope">
          <a @click="openLogWindow(scope.row.uuid)" class="ip" href="javascript:;">{{ scope.row.count }}</a>
        </template>
      </s-table-column>-->
      <s-table-column show-overflow-tooltip prop="" label="操作" width="180">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="getDetails(scope.row)"></i>
          <i v-if="WorkFlowAuth" :class="['iconfont', `icon-${scope.row.itilIncidentOrderUuid?'manage-process':'set-process'}`]"
             :title="scope.row.itilIncidentOrderUuid?'查看流程':'进入流程'"
             @click="handelProcess(scope.row, scope.$index)"></i>
          <i
            :class="['iconfont', `icon-${scope.row.safeOrderUuid === null?'order-add':'underway'}`]"
            :title="scope.row.safeOrderUuid === null?'通报下发':'通报中'"
            v-if="authSafetyBulletin"
            @click="bulletinHandle(scope.row, scope.$index)"></i>
          <!--<i class="iconfont icon-delete" title="删除" @click="eventsActionsDef(scope.row)"></i>-->
        </template>
      </s-table-column>
    </page-infinite-table>

    <!-- 日志详情 -->
    <s-dialog
      v-model="logDetailDialog"
      v-if="logDetailDialog"
      width="900px"
      title="事件详情">
      <page-infinite-table
        loading-text="正在加载中"
        :ajax-obj="axiosHistoryObjLog"
        :startAjax="getHistoryFlagLog"
        ref="infiniteTableLog"
        key="infiniteTableLog"
        :header-search="{show: true, offset: 15, width: 6}">
        <s-table-column show-overflow-tooltip label="接收时间" prop="receivedTime"></s-table-column>
        <s-table-column show-overflow-tooltip label="源IP地址" prop="hostIp"></s-table-column>
        <s-table-column show-overflow-tooltip label="资产名称" prop="host"></s-table-column>
        <s-table-column show-overflow-tooltip label="摘要" prop="logMessage"></s-table-column>
        <s-table-column show-overflow-tooltip label="级别" prop="logLabel"></s-table-column>
        <s-table-column show-overflow-tooltip label="特性" prop="facilityLabel"></s-table-column>
      </page-infinite-table>
    </s-dialog>

    <!--SIEM日志事件详情-->
    <s-dialog
      v-model="logInfoDialog"
      v-if="logInfoDialog"
      width="900px"
      title="事件详情">
      <div class="info-table">
        <s-row class="info-row">
          <s-col :span="5" class="grid-content bg-purple">事件级别</s-col>
          <s-col :span="7" class="grid-content bg-purple-light">{{ logInfoData.eventLevelLabel }}</s-col>
          <s-col :span="5" class="grid-content bg-purple">IP地址</s-col>
          <s-col :span="7" class="grid-content bg-purple-light">{{ logInfoData.hostIp }}</s-col>
        </s-row>
        <s-row class="info-row">
          <s-col :span="5" class="grid-content bg-purple">创建时间</s-col>
          <s-col :span="7" class="grid-content bg-purple-light">{{ logInfoData.createTime }}</s-col>
          <s-col :span="5" class="grid-content bg-purple">更新时间</s-col>
          <s-col :span="7" class="grid-content bg-purple-light">{{ logInfoData.modifyTime }}</s-col>
        </s-row>
        <s-row class="info-row">
          <s-col :span="5" class="grid-content bg-purple">日志源名称</s-col>
          <s-col :span="19" class="grid-content bg-purple-light">{{ logInfoData.hostName }}</s-col>
        </s-row>
        <s-row class="info-row">
          <s-col :span="5" class="grid-content bg-purple">事件信息</s-col>
          <s-col :span="19" class="grid-content bg-purple-light">{{ logInfoData.eventMessage }}
          </s-col>
        </s-row>
      </div>
    </s-dialog>

    <!--表格动态列设置弹框-->
    <s-dialog
      width="200px"
      top="142px"
      class="dynaColSetDialog"
      v-model="dynaColSetDialog"
      v-if="dynaColSetDialog"
      title="表格列设置"
      key="dynaColSetDialog">
      <dynamic-col-set
        :eventType="5"
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
        <s-button @click="saveCreateEventOrder(5)">保存</s-button>
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
  </div>
</template>

<script>
  import {omit} from 'lodash'
  import $axios from 'sunflower-ajax'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  // import inputTree from '@/components/inputTree/InputTree';
  // import DateRange from '@/components/tableCom/src/DateRange';
  import dynamicColSet from '@/pages/Event_List/DynamicColSet.vue'
  import mixin from '@/pages/Event_List/EventMixin'
  import {Validaters} from 'sunflower-common-utils'
  import auth from '@/common/mixins/auth.js'

  export default {
    /* props: ['show1'], */
    data() {
      return {
        levelStatus: [ 'status-unknown', 'status-normal', 'status-prompt', 'status-warn', 'status-secondary',
          'status-serious', 'status-urgency'],
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        level: [],
        logDetailDialog: false,
        axiosHistoryObjLog: {
          type: 'post',
          url: 'searchManage/getLogInfoByEventForPage',
          params: {
            condition: {}
          }
        },
        getHistoryFlagLog: false,
        form: {
          logLabel: '',
          hostIP: '',
          host: '',
          timeEnd: new Date(),
          timeStart: this.getTodayZeroTime(),
          hostName: '',
          logMessage: '',
          strategyName: '',
          protectType: '',
          protectCategory: '',
          protectTarget: ''
        },
        timeRange: {
          start_time: null,
          end_time: null
        },
        geteventsFlag: false,
        searchChunkFlag: false,
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        criteria: {
          condition: {
            assetUuid: '',
            update: []
          }
        },
        axioseventsObj: {
          type: 'post',
          url: '/searchManage/getEventInfolistForCondition',
          params: {
            condition: {}
          }
        },
        searchOptions: [],
        logInfoDialog: false,
        logInfoData: {},
        formrules: {
          hostIP: [
            Validaters.IP
          ]
        },
        levelProtectList: [],
        protectCategoryObj: [],
        twoList: [],
        threeList: []
      }
    },
    created() {
      this.eventsSearch()
      this.geteventsFlag = true;
      this.levelData();
      this.getSearchSelect();
      // 初始化动态列
      this.initDynamicCol(5);
      this.getList()
    },
    methods: {
      getList () {
        if (this.$route.query && this.$route.query.ip) { // 从资产面板跳转过来
          this.form = Object.assign(this.form, {
            timeStart: null,
            timeEnd: null,
            hostIP: this.$route.query.ip
          });
          this.axioseventsObj.params.condition = Object.assign({}, {
            modifyTime: this.form.timeStart + ' # ' + this.form.timeEnd,
            hostIp: this.form.hostIP
          });
        }
        // 事件中心>事件趋势跳转过来
        if (this.$route.params.start !== '0') {
          this.form = Object.assign({}, this.form, {
            timeStart: new Date(this.$route.params.start),
            timeEnd: new Date(this.$route.params.end)
          });
          this.axioseventsObj.params.condition = Object.assign({}, {
            modifyTime: this.formatDate(this.form.timeStart.getTime() / 1000) + ' # ' + this.formatDate(this.form.timeEnd.getTime() / 1000)
          });
        }
      },
      getDetails(row) {
        this.logInfoData = row
        this.logInfoDialog = true
      },
      getTodayZeroTime() {
        let date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      },
      openLogWindow(uuid) {
        var vm = this;
        vm.axiosHistoryObjLog.params.condition = Object.assign({}, {
          eventUuid: uuid
        });
        vm.logDetailDialog = true
        vm.getHistoryFlagLog = true;
      },
      getLevel(num) {
        let level = ['严重', '主要', '次要', '警告', '提示', '正常', '未知'];
        return level[parseInt(num)]
        /*  return [num]; */
      },
      getDateRangeStart(value) {
        let self = this;
        let start = this.form.timeStart ? new Date(this.form.timeStart).getTime() : 0
        let end = this.form.timeEnd ? new Date(this.form.timeEnd).getTime() : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.form.timeStart = null;
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
        let start = this.form.timeStart ? new Date(this.form.timeStart).getTime() : 0
        let end = this.form.timeEnd ? new Date(this.form.timeEnd).getTime() : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.form.timeEnd = null;
            self.timeRange.end_time = null;
          } else {
            self.timeRange.end_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000).toString()
          }
        } else {
            self.timeRange.end_time = !value ? null : Math.ceil(new Date(value).getTime() / 1000).toString()
        }
      },
      filterStateImg(val) {
        switch (val) {
          case 0:
            return '../../../static/images/incident/weizhi.png';
          case 1:
            return '../../../static/images/incident/zhengchang.png';
          case 2:
            return '../../../static/images/incident/tishi.png';
          case 3:
            return '../../../static/images/incident/jinggao.png';
          case 4:
            return '../../../static/images/incident/ciyao.png';
          case 5:
            return '../../../static/images/incident/zhuyao.png';
          case 6:
            return '../../../static/images/incident/yanzhong.png';
        }
      },
      axioseventsList() {
        this.criteria.condition.assetUuid = this.$route.params.compId;
        this.axioseventsObj.params.condition = Object.assign({}, this.criteria.condition);
      },
      eventsTreeChange(nodeData) {
        this.criteria.condition.citypelist = [nodeData.uuid];
        nodeData[this.defaultProps.children].forEach(item => {
          this.criteria.condition.citypelist.push(item.uuid);
        });
      },
      eventsSearch () {
        var vm = this;
        if (!vm.form.timeStart && vm.form.timeEnd) {
          vm.$message({
            type: 'error',
            message: '请选择开始时间!'
          });
        } else if (vm.form.timeStart && !vm.form.timeEnd) {
          vm.$message({
            type: 'error',
            message: '请选择结束时间!'
          });
        } else {
          let a = Object.assign({}, {
            modifyTime: vm.formatDate(new Date(vm.form.timeStart).getTime() / 1000) + ' # ' + vm.formatDate(new Date(vm.form.timeEnd).getTime() / 1000),
            eventLevel: vm.form.logLabel.trim(),
            hostIp: vm.form.hostIP.trim(),
            eventMessage: vm.form.logMessage.trim(),
            hostName: vm.form.hostName.trim(),
            protectType: this.form.protectType.trim(),
            protectCategory: this.form.protectCategory.trim(),
            protectTarget: this.form.protectTarget.trim(),
            strategyName: this.form.strategyName.trim()
          });
          let obj = a
          let arr = []
          Object.keys(obj).map(function (key) {
            if (!obj[key] || obj[key].trim() === '#') {
              arr.push(key)
            }
          })
          vm.axioseventsObj.params.condition = omit(a, arr)
          vm.geteventsFlag = true;
        }
      },
      levelData() {
        $axios.post('/searchManage/getLogInfoSubDataForCondition').then(({data}) => {
          this.level = data.EventLevelList
        })
      },
      // 事件走ITSM流程成功后，mixins中调用该函数，刷新列表
      _closeDialog() {
        this.eventsSearch();    // 刷新SIEM日志事件列表
      },
      getSearchSelect() {
        $axios.get('/strategyInfo/getProtectInfo/1').then((res) => {
          let _self = this
          this.levelProtectList = res.data
          res.data.forEach(item => {
            let keyName = item.value.uuid
            let value = item.children
            _self.protectCategoryObj[keyName] = value
          })
        })
      },
      oneChange(val) {
        this.form.protectCategory = ''
        this.form.protectTarget = ''
        this.twoList = this.protectCategoryObj[val]
      },
      twoChange(val) {
        this.form.protectTarget = ''
        let obj = {}
        this.twoList.forEach(item => {
          let keyName = item.value.uuid
          let value = item.children
          obj[keyName] = value
        })
        this.threeList = obj[val]
      }
    },
    components: {
      pageInfiniteTable,
      // searchBox,
      // inputTree,
      // DateRange,
      dynamicColSet
    },
    mixins: [mixin, auth]
  }
</script>

<style lang="stylus">
  #logAudit
    .s-search-group-wrapper
      min-height: 60px !important
</style>

