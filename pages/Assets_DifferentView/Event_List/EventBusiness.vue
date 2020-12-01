/**
* Created by dingyf on 2019/3/14.//Q4高级搜索优化
* 资产事件信息视角-最新事件-业务审计事件
*/
<template>
  <section id="BusinessEvent">
    <s-row type="flex" justify="between" style="margin-bottom:4px;">
      <s-col>
        <!-- 搜索框上左侧按钮 -->
      </s-col>
      <s-col>
        <!-- 搜索框上右侧按钮 -->
        <s-button icon="nav-system-set" type="cancel" title="列设置" @click="showDynamicColSet"></s-button>
      </s-col>
    </s-row>
    <s-row>
      <s-form :inline="true" :model="searchGroup" label-width="65px" ref="searchGroupForm" :rules="searchGroupRules" class="search_form">
        <div>
          <s-form-item label="规则名:">
            <s-input v-model="searchGroup.policy_name" placeholder="请输入" style="width:185px;" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <!--<s-form-item label="中间件系统名">
            <s-select v-model="searchGroup.app_name" placeholder="请选择">
              <s-option
                v-for="(list, index) in appSysNameList"
                :label="list.app_name"
                :value="list.app_name"
                :key="'system' + index">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="服务器IP" prop="server_ip">
            <s-input v-model="searchGroup.server_ip" placeholder="请输入"></s-input>
          </s-form-item>-->
          <s-form-item label="用户名:">
            <s-input v-model="searchGroup.account_name" placeholder="请输入" style="width:185px;" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="客户端IP:" prop="client_ip">
            <s-input v-model="searchGroup.client_ip" placeholder="请输入" style="width:185px;" @keyup.enter.native="searchHandler"></s-input>
          </s-form-item>
          <s-form-item label="事件级别:">
            <s-select v-model="searchGroup.alarm_level" placeholder="请选择" clearable>
              <s-option
                v-for="(item, index) in levels"
                :label="item"
                :value="index"
                :key="'eventLevet' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="事件时间:">
            <s-date-picker
              v-model="searchGroup.start_time"
              type="datetime"
               style="width:185px;"
              placeholder="选择起始时间"
              :editable="false"
              :picker-options="disableAfterToday1"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              v-model="searchGroup.end_time"
              type="datetime"
              placeholder="选择结束时间"
              :editable="false"
               style="width:185px;"
              :picker-options="disableAfterToday2"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="searchHandler">查询</s-button>
        </div>
      </s-form>
    </s-row>

    <page-infinite-table
      :key="columnRefresh"
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
          <img v-if="option.colName==='事件标识'" :src="levelImgs[scope.row.alarm_level]" :alt="levels[scope.row.alarm_level]" class="imgVertical">
          <span v-else-if="option.colName==='事件级别'" v-text="levels[scope.row.alarm_level]"></span>
          <span v-else-if="option.colKey==='status'" v-text="scope.row.itilIncidentOrderUuid?'已进入':'未进入'"></span>
          <span v-else-if="option.colKey==='account_name'" v-text="scope.row.account_name || '无'"></span>
          <span v-else-if="option.colKey==='alarm_time'" v-text="scope.row.alarm_time"></span>
          <span v-else v-text="scope.row[option.colKey]"></span>
        </template>
      </s-table-column>
      <s-table-column
        label="操作"
        width="160">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="showDetail(scope.row, scope.$index)"></i>
          <i v-if="WorkFlowAuth" :class="['iconfont', `icon-${scope.row.itilIncidentOrderUuid?'manage-process':'set-process'}`]"
             :title="scope.row.itilIncidentOrderUuid?'查看流程':'进入流程'"
             @click="handelProcess(scope.row, scope.$index, 'alarm_id')"></i>
        </template>
      </s-table-column>
    </page-infinite-table>

    <!--业务审计事件详情弹框-->
    <s-dialog
      v-if="businessDetailDialog"
      v-model="businessDetailDialog"
      title="事件信息"
      key="businessDetail"
      top="10%"
      width="800px">
      <business-detail
        ref="businessDetail"
        :rowData="businessDetailData"
        @closeDialog="_closeDialog">
      </business-detail>
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
        :eventType="4"
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
        <s-button @click="saveCreateEventOrder">保存</s-button>
        <s-button type="cancel" @click="createEventOrderDialog = false">关闭</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils'
  import mixin from '@/pages/Event_List/EventMixin'
  import businessDetail from '@/pages/Event_List/BusinessDetail'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import dynamicColSet from '@/pages/Event_List/DynamicColSet.vue'
  import auth from '@/common/mixins/auth.js'

  export default {
    components: {
      businessDetail,
      pageInfiniteTable,
      // searchBox,
      dynamicColSet
    },
    data() {
      return {
        columnRefresh: 1, // 动态列变化重新加载表格
        levels: ['未知', '正常', '提示', '警告', '次要', '主要', '严重'],
        levelImgs: ['../../../static/images/incident/weizhi.png',
          '../../../static/images/incident/zhengchang.png',
          '../../../static/images/incident/tishi.png',
          '../../../static/images/incident/jinggao.png',
          '../../../static/images/incident/ciyao.png',
          '../../../static/images/incident/zhuyao.png',
          '../../../static/images/incident/yanzhong.png'
        ],
        appSysNameList: [],         // 中间件系统名下拉选项
        businessDetailDialog: false,
        businessDetailData: {},
        exportType: 0,
        searchFlag: false,
        searchGroup: {
          policy_name: null,
          app_name: '全部',
          server_ip: null,
          account_name: null,
          client_ip: null,
          alarm_level: null,
          start_time: this.getTodayZeroTime(),
          end_time: new Date(),
          device_uuid: this.$route.params.assetUuid
        },
        timeRange: {
          start_time: null,
          end_time: null
        },
        searchGroupRules: {
          server_ip: [Validaters.IP],
          client_ip: [Validaters.IP]
        },
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        getHistoryFlag: true,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbaIncident/list/t_data_alarm_url',
          params: {
            condition: {

            }
          }
        }
      }
    },
    watch: {
      dynaColSetOptions () {
        ++this.columnRefresh;
      }
    },
    mixins: [mixin, auth],
    methods: {
      showDetail(row) {
        var vm = this
        vm.businessDetailData = row
        vm.$set(vm.businessDetailData, 'hideFooter', true)
        vm.businessDetailDialog = true
      },
      showHideSearch() {
        this.searchFlag = !this.searchFlag
      },
      getDateRangeStart(val) {
        let self = this
        self.searchGroup.start_time = val
        self.timeRange.start_time = !val ? null : Math.ceil(new Date(val).getTime() / 1000).toString()
        self.disableAfterToday2 = {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < new Date(self.searchGroup.start_time)
          }
        }
      },
      getDateRangeEnd(val) {
        let self = this
        self.searchGroup.end_time = val
        self.timeRange.end_time = !val ? null : Math.ceil(new Date(val).getTime() / 1000).toString()
        self.disableAfterToday1 = {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() > new Date(self.searchGroup.end_time)
          }
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
            if (this.searchGroup.app_name === '全部') {
              this.axiosHistoryObj.params.condition = Object.assign({}, this.searchGroup, {app_name: null}, this.timeRange)
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
        this.businessDetailDialog = false
      }
    },
    created() {
      $axios.post('sessionCmd/getObjectListByTableName/v_sys_dbaudit_app').then(res => {
        let resData = res.data
        if (resData instanceof Array) {
          this.appSysNameList = resData
          this.appSysNameList.splice(0, 0, {app_name: '全部'})
        }
      })
      this.timeRange.start_time = Math.ceil(this.getTodayZeroTime().getTime() / 1000).toString()
      this.timeRange.end_time = Math.ceil(new Date().getTime() / 1000).toString()
      this.searchGroup.start_time = this.getTodayZeroTime()
      this.searchGroup.end_time = new Date()
      this.axiosHistoryObj.params.condition = Object.assign({}, this.searchGroup, {app_name: null}, this.timeRange);
      // this.searchFlag = true
      // 初始化动态列
      this.initItcompDynamicCol(4)
    }
  }
</script>
