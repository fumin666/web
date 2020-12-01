/**
 * @author fumin
 * @date 2019/7/19
 * @Description:事件中心 -》最新事件 -》登录重要资产事件//Q4高级搜索优化
*/
<template>
  <section id="logAudit">
    <s-row>
      <s-form :inline="true" :model="searchGroup" label-width="100px" class="search_form" ref="searchGroupForm" :rules="searchGroupRules">
        <div>
          <s-form-item label="运维用户:">
            <s-input v-model="searchGroup.userName" placeholder="请输入" style="width:185px;" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="客户端IP:" prop="clientIp">
            <s-input v-model="searchGroup.clientIp" placeholder="请输入" style="width:185px;" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="目标资产IP:" prop="targetIp">
            <s-input v-model="searchGroup.targetIp" placeholder="请输入" style="width:185px;" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="目标资产名称:">
            <s-input v-model="searchGroup.targetName" placeholder="请输入" style="width:185px;" @keyup.enter.native="searchPost"></s-input>
          </s-form-item>
          <s-form-item label="事件时间:">
            <s-date-picker
              v-model="searchGroup.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择起始时间"
              style="width:185px;"
              :editable="false"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              v-model="searchGroup.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择结束时间"
              style="width:185px;"
              :editable="false"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="searchPost">查询</s-button>
        </div>
      </s-form>
      <div class="fr" style="margin: 15px 0">
        <s-button icon="nav-system-set" type="cancel"  title="列设置" @click="showDynamicColSet"></s-button>
      </div>
    </s-row>
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
          <span v-else-if="option.colKey === '资产账号'" v-text="scope.row.accout === null ? '--' : scope.row.accout"></span>
          <span v-else-if="option.colKey === '协议'" v-text="scope.row.xieyi === null ? '--' : scope.row.xieyi"></span>
          <span v-else-if="option.colKey === 'createTime'" v-text="formatDate(scope.row.insertTime)"></span>
          <span v-else v-text="scope.row[option.colKey]"></span>
        </template>
      </s-table-column>
    </s-page-infinite-table>
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
        :eventType="6"
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
        <s-button @click="saveCreateEventOrder(6)">保存</s-button>
        <s-button type="cancel" @click="createEventOrderDialog = false">关闭</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  import mixin from './EventMixin'
  import {Validaters} from 'sunflower-common-utils'
  // import OperationDetail from './OperationDetail'

  // import searchBox from '@/components/tableCom/src/SearchBox'
  import sPageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  import dynamicColSet from './DynamicColSet.vue'

  export default {
    data() {
      return {
        levels: ['未知', '正常', '提示', '警告', '次要', '主要', '严重'],
        levelStatus: [ 'status-unknown', 'status-normal', 'status-prompt', 'status-warn', 'status-secondary',
          'status-serious', 'status-urgency'],
        searchKeyWord: '',
        searchFlag: false,
        searchGroup: {
          userName: null,
          clientIp: null,
          targetIp: null,
          targetName: null,
          eventInfo: null,
          assetuuid: null,
          startTime: this.getTodayZeroTime(),
          endTime: new Date()
        },
        timeRange: {
          startTime: null,
          endTime: null
        },
        searchGroupRules: {
          clientIp: [Validaters.IP],
          targetIp: [Validaters.IP]
        },
        getFlag: true,
        axiosObj: {
          type: 'post',
          url: '/operationEventStat/getMajorAssetEventList',
          params: {
            condition: {}
          }
        }
      }
    },
    mixins: [mixin],
    components: {
      // OperationDetail,
      // searchBox,
      sPageInfiniteTable,
      dynamicColSet
    },
    methods: {
      // 点击会话ID跳转
      // showDetail(row) {
      //   this.$router.push({path: `/LogCenter/log_operationcount`, query: {sessionId: row.sessionId}})
      // },
      getDateRangeStart(value) {
        let self = this;
        let start = this.searchGroup.startTime ? new Date(this.searchGroup.startTime).getTime() : 0
        let end = this.searchGroup.endTime ? new Date(this.searchGroup.endTime).getTime() : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchGroup.startTime = null;
            self.timeRange.startTime = null;
          } else {
            self.timeRange.startTime = !value ? null : value
          }
        } else {
            self.timeRange.startTime = !value ? null : value
        }
      },
      getDateRangeEnd(value) {
        let self = this;
        let start = this.searchGroup.startTime ? new Date(this.searchGroup.startTime).getTime() : 0
        let end = this.searchGroup.endTime ? new Date(this.searchGroup.endTime).getTime() : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchGroup.endTime = null;
            self.timeRange.endTime = null;
          } else {
            self.timeRange.endTime = !value ? null : value
          }
        } else {
            self.timeRange.endTime = !value ? null : value
        }
      },
      searchPost() {
        this.$refs['searchGroupForm'].validate(valid => {
          if (valid) {
            for (let key in this.searchGroup) {
              if (!this.searchGroup[key]) {
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
      YymmddFormat(newDate) {
        let Month = newDate.getMonth() + 1;
        Month = Month >= 10 ? Month : '0' + Month;
        let d = newDate.getDate();
        d = d >= 10 ? d : '0' + d
        let hour = newDate.getHours()
        hour = hour >= 10 ? hour : '0' + hour
        let minu = newDate.getMinutes()
        minu = minu >= 10 ? minu : '0' + minu
        let seconds = newDate.getSeconds()
        seconds = seconds >= 10 ? seconds : '0' + seconds
        return [
          [newDate.getFullYear(), Month, d].join('-'), [hour, minu, seconds].join(':')
        ].join(' ');
      }
    },
    created() {
      if (this.$route.params.start !== '0') { // 从资产面板跳转过来
        let startTime = new Date(this.getTodayZeroTime())
        let endTime = new Date(new Date())
        this.timeRange.startTime = this.YymmddFormat(startTime)
        this.timeRange.endTime = this.YymmddFormat(endTime)
        this.searchGroup.startTime = this.getTodayZeroTime()
        this.searchGroup.endTime = new Date()
        this.searchGroup.assetuuid = this.$route.params.assetUuid
      } else {
        let startTime = new Date(this.getTodayZeroTime())
        let endTime = new Date(new Date())
        this.timeRange.startTime = this.YymmddFormat(startTime)
        this.timeRange.endTime = this.YymmddFormat(endTime)
        this.searchGroup.startTime = this.getTodayZeroTime()
        this.searchGroup.endTime = new Date()
      }
      this.axiosObj.params.condition = Object.assign({}, this.searchGroup, this.timeRange);
      // this.searchFlag = true
      // 初始化动态列
      this.initDynamicCol(6)
    }
  }
</script>

<style>

</style>
