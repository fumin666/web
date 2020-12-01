<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:41
 * @LastEditTime : 2019-12-27 16:07:20
 * @LastEditors  : mybells
 -->
<template>
  <section class="alarm-more-content alarm-center">
    <div>
      <s-form
        class="search_form" style="margin:10px 0" label-width='100px'
        ref="searchForm"
        :inline="true"
        :model="searchForm">
        <div>
          <s-form-item label="规则名称：">
            <s-input
              v-model="searchForm.ruleName">
            </s-input>
          </s-form-item>
          <s-form-item label="事件级别：">
            <s-select v-model="searchForm.eventLevel" clearable>
              <s-option label="未知" :value="0"></s-option>
              <s-option label="正常" :value="1"></s-option>
              <s-option label="提示" :value="2"></s-option>
              <s-option label="警告" :value="3"></s-option>
              <s-option label="次要" :value="4"></s-option>
              <s-option label="主要" :value="5"></s-option>
              <s-option label="严重" :value="6"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="事件内容：">
            <s-input
              v-model="searchForm.eventContent"></s-input>
          </s-form-item>
          <s-form-item label="告警时间：">
            <s-date-picker
              type="datetime"
              placeholder="选择起始时间"
              v-model="searchForm.start_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :editable="false"
              :clearable="false"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              type="datetime"
              placeholder="选择结束时间"
              v-model="searchForm.end_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :editable="false"
              :clearable="false"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button title="查询" icon='magnifier' @click="searchPost()">查询</s-button>
        </div>
      </s-form>
    </div>

    <page-infinite-table
      ref="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="axiosHistoryObj"
      :startAjax="getHistoryFlag"
      @filter-change="filterChangeHandler" v-if="showTable">
      <s-table-column
        label="告警来源"
        width="130"
        prop="source"
        :formatter="formatAlarmSource"
        column-key="source"
        :filters="alarmSourceFilters"
        :filtered-value="filteredValue"
        filter-placement="bottom-start"
        show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="规则名称"  width="150" prop="ruleName" show-overflow-tooltip></s-table-column>
      <s-table-column label="告警时间" width="190" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-text="formatDate(scope.row.alarmTime * 1000)"></div>
        </template>
      </s-table-column>
      <s-table-column label="事件级别"  width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="getLevel(scope.row.eventLevel)"></span>
        </template>
      </s-table-column>
      <s-table-column label="事件内容" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="filterHTMLTag(scope.row.eventContent, '</br>')"></span>
        </template>
      </s-table-column>
      <s-table-column label="短信" width="100">
        <template slot-scope="scope">
          <span
            class="clickable"
            v-text="scope.row.messageResult"
            @click="showDetail(scope.row, scope.$index, 3)"></span>
        </template>
      </s-table-column>
      <s-table-column label="邮件" width="100">
        <template slot-scope="scope">
          <span
            class="clickable"
            v-text="scope.row.emailResult"
            @click="showDetail(scope.row, scope.$index, 2)"></span>
        </template>
      </s-table-column>
      <s-table-column label="微信" width="100">
        <template slot-scope="scope">
          <span
            class="clickable"
            v-text="scope.row.wechatResult"
            @click="showDetail(scope.row, scope.$index, 4)"></span>
        </template>
      </s-table-column>
      <s-table-column label="客户端" width="100">
        <template slot-scope="scope">
          <span
            class="clickable"
            v-text="scope.row.dwrResult"
            @click="showDetail(scope.row, scope.$index, 1)"></span>
        </template>
      </s-table-column>
    </page-infinite-table>

    <s-dialog
      width="650px"
      v-model="bloom"
      title="发送状态">
      <s-scrollbar wrap-style="max-height:500px;">
        <s-table-page
          :data="alarmStatus"
          key="alarmStatus">
          <s-table-column :label="alarmTypeColName" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="alarmTypeColName === '短信号'">{{scope.row.alarmReceiver | capitalize}}</span>
              <span v-else-if="alarmTypeColName === '微信号'">{{scope.row.alarmReceiver | capitalizeWechat}}</span>
              <span v-else>{{scope.row.alarmReceiver}}</span>
            </template>
          </s-table-column>
          <s-table-column label="发送时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{formatDate(scope.row.createTime * 1000)}}</span>
            </template>
          </s-table-column>
          <s-table-column label="状态" width="90">
            <template slot-scope="scope">
              <i :class="'iconfont icon-'+ (scope.row.alarmStatus === 0 ? 'error-bold' : 'correct-bold')"
                 @click="resend(scope.row)"></i>
            </template>
          </s-table-column>
          <!--<s-table-column label="失败原因" prop="failMsg" show-overflow-tooltip></s-table-column>-->
        </s-table-page>
      </s-scrollbar>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  // import SearchBox from '@/components/tableCom/src/SearchBox'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'

  export default {
    components: {
      // SearchBox,
      pageInfiniteTable
    },
    data() {
      return {
        bloom: false,
        docType: '1',
        searchForm: {
          ruleName: null,
          eventLevel: null,
          start_time: null,
          end_time: null,
          eventContent: null
        },
        timeRange: {
          start_time: null,
          end_time: null
        },
        notificationType: ['dwrResult', 'emailResult', 'messageResult', 'wechatResult'],
        alarmStatus: [],
        resourceArr: [],    // 告警来源数字-文字对应数组
        // -------------条件搜索---------------
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        // 无限分页参数
        getHistoryFlag: true,
        axiosHistoryObj: {
          type: 'post',
          url: '/dataAlarmLog/list',
          params: {
            condition: {}
          }
        },
        alarmTypeArr: ['登录名', '邮件号', '短信号', '微信号'],
        alarmTypeColName: '',
        // 告警来源字段 搜索筛选值
        alarmSourceFilters: [],
        filteredValue: [],
        filteredValueOrigin: [],
        showTable: false
      }
    },
    methods: {
      /* 时间格式化(s->yy-mm-dd hh:mm:ss) */
      formatDate(seconds) {
        if (seconds) {
          let date = new Date()
          date.setTime(seconds)
          let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
          let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
          let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
          let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
          let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
          return dateStr
        } else {
          return ''
        }
      },
      filterHTMLTag(sourceString, tag) {
        return sourceString ? sourceString.toString().replace(new RegExp(tag, 'g'), '') : '';
      },
      exportAlarm() {},
      showDetail(row, index, type) {
        let notificationType = this.notificationType[type - 1]
        let totalNum = parseInt(row[notificationType].split('/')[1])
        if (totalNum <= 0) {
          this.$message({
            type: 'info',
            message: '暂无具体内容！'
          })
        } else {
          $axios.get(`/dataAlarmLog/getDataAlarmSendLogByDataAlarmLogUuid/${row.uuid}/${type}`).then(res => {
            let resData = res.data
            if (resData instanceof Array && resData.length > 0) {
              this.alarmTypeColName = this.alarmTypeArr[resData[0].alarmType - 1]
            }
            this.alarmStatus = resData
            this.bloom = true
          })
        }
      },
      resend(row) {
        if (row.status === 0) {
          console.log('resend');
        }
      },
      // 告警来源数字->文字格式化
      formatAlarmSource(row, column, cellValue) {
        let filterName = ''
        this.resourceArr.forEach(v => {
          if (parseInt(v.name) === cellValue) {
            filterName = v.value
          }
        })
        console.log(filterName);
        return filterName
      },
      getLevel(num) {
        let level = ['未知', '正常', '提示', '警告', '次要', '主要', '严重'];
        return level[num];
      },
      // 限制告警时间起始-结束时间大小关系
      getDateRangeStart(value) {
        let start = this.searchForm.start_time ? new Date(this.searchForm.start_time).getTime() : 0
        let end = this.searchForm.end_time ? new Date(this.searchForm.end_time).getTime() : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchForm.start_time = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.searchForm.start_time ? new Date(this.searchForm.start_time).getTime() : 0
        let end = this.searchForm.end_time ? new Date(this.searchForm.end_time).getTime() : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchForm.end_time = '';
          }
        }
      },
      // 条件搜索点击事件
      searchPost(filter) {
        for (let key in this.searchForm) {
          if (this.searchForm[key] === '') {
            this.searchForm[key] = null
          }
        }
        this.timeRange.start_time = this.searchForm.start_time === null ? null : parseInt(new Date(this.searchForm.start_time).getTime() / 1000);
        this.timeRange.end_time = this.searchForm.end_time === null ? null : parseInt(new Date(this.searchForm.end_time).getTime() / 1000);
        if (filter) this.axiosHistoryObj.params.condition = Object.assign({}, {sourceList: filter}, this.searchForm, this.timeRange)
        else this.axiosHistoryObj.params.condition = Object.assign({}, this.searchForm, this.timeRange)
      },
      // 告警来源 filter 过滤处理函数
      filterChangeHandler(filterValList) {
        this.searchPost(filterValList.source)
      }
    },
    filters: {
      capitalize: (value) => {
        if (!value) return ''
        if (value.length > 3) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      },
      capitalizeWechat: (value) => {
        if (!value) return ''
        if (value.length > 0) {
          return value.substring(0, 1) + '******'
        } else {
          return value
        }
      }
    },
    created() {
      this.axiosHistoryObj.params.condition = Object.assign({}, this.searchForm)
      $axios.get('/infoSend/getSelectModelByClassName/com.suninfo.util.constant/DataAlarmSourceEnum').then(({data}) => {
        if (data && data instanceof Array) {
          let str = this.$route.fullPath.toString();
          data.forEach(item => {
            this.alarmSourceFilters.push({
              text: item.value,
              value: item.name
            })
            if (str.indexOf('eventLevel') === -1) {
              this.filteredValue.push(item.name)
            }
            this.filteredValueOrigin.push(item.name)
          })
          this.resourceArr = data
          console.log(this.resourceArr);
          if (this.$route.query.value === 4) {
            this.axiosHistoryObj.params.condition.sourceList = [this.$route.query.value]
          }
          // 有请求参数
          if (str.indexOf('eventLevel') !== -1) {
            this.filteredValue.push(this.$route.query.eventLevel.name);
            this.axiosHistoryObj.params.condition.sourceList = this.filteredValue;
          }
          this.showTable = true;
        }
      })
    }
  }
</script>

<style>
  .alarm-more-content{
    margin: 20px 20px 0 20px;
  }
  .alarm-center .handler-btns .s-select {
    width: 100px;
    vertical-align: middle;
  }
  .alarm-center .handler-btns .s-select .s-input-inner {
    height: 30px;
  }
  .alarm-center .clickable {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
