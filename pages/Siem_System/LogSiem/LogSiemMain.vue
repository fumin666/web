/**
* Created by alex on 2019/2/23.
*/
<template>
  <div>
    <s-row class="content" style="margin-top: 10px;">
      <s-form :inline="true" :model="form" label-width="80px" :rules="formRules" class="search_form" style="margin: 10px 0;">
        <div>
          <s-form-item label="源IP地址：">
            <s-input @keyup.enter.native="listSearch" v-model="form.hostIp"></s-input>
          </s-form-item>
          <s-form-item label="资产名称：">
            <s-input @keyup.enter.native="listSearch" v-model="form.host"></s-input>
          </s-form-item>
          <s-form-item label="内容：">
            <s-tooltip content="查询长度限制在100个字符以内，超出的字符将被截断。" placement="bottom">
              <s-input @keyup.enter.native="listSearch" v-model="form.logMessage"></s-input>
            </s-tooltip>
          </s-form-item>
          <s-form-item label="级别：">
            <s-select v-model="form.logLabel" clearable>
              <s-option v-for="(item, index) in level" :value="item.configValue" :label="item.configName"
                        :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="特性：">
            <s-select v-model="form.facilityLabel" clearable>
              <s-option v-for="(item, index) in Facilitydata" :value="item.value" :label="item.name"
                        :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="接收时间：">
            <!-- <s-date-picker
               v-model="form.receivedTime"
               type="datetime"
               :value-format-flag="true"
               placeholder="请选择日期时间">
             </s-date-picker>-->
            <s-date-picker
              v-model="form.timeStart"
              type="datetime"
              placeholder="选择起始时间"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday1"
              @change="getDateRangeStart">
            </s-date-picker>
            ~
            <s-date-picker
              v-model="form.timeEnd"
              type="datetime"
              placeholder="选择结束时间"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday2"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" title="查询" @click="listSearch()">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <page-infinite-table
      ref="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="axioslogObj"
      :startAjax="getlogFlag"
    >
      <s-table-column show-overflow-tooltip prop="receivedTime" label="接收时间"></s-table-column>
      <s-table-column show-overflow-tooltip prop="hostIp" label="源IP地址"></s-table-column>
      <s-table-column show-overflow-tooltip prop="host" label="资产名称"></s-table-column>
      <s-table-column show-overflow-tooltip prop="program" label="程序"></s-table-column>
      <s-table-column show-overflow-tooltip prop="logLabel" width="120" label="级别"></s-table-column>
      <s-table-column show-overflow-tooltip prop="facilityLabel" label="特性"></s-table-column>
      <s-table-column show-overflow-tooltip click-dialog prop="logMessage"  width="600" label="内容"></s-table-column>
    </page-infinite-table>
  </div>
</template>

<script>
  import {omit} from 'lodash'
  import $axios from 'sunflower-ajax'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  // import inputTree from '@/components/inputTree/InputTree';
  // import DateRange from '@/components/tableCom/src/DateRange';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  export default {
    /* props: ['show0'], */
    data() {
      return {
        level: [],
        Facilitydata: [],
        disableAfterToday1: {
          disabledDate(time) {
            return false;
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return false
          }
        },
        form: {
          receivedTime: '',
          hostIp: '',
          host: '',
          logLabel: '',
          facilityLabel: '',
          logMessage: '',
          timeStart: '',
          timeEnd: ''
        },
        formRules: {},
        getlogFlag: false,
        searchChunkFlag: false,
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        logSelections: {},
        criteria: {
          condition: {
            assetUuid: ''
          }
        },
        axioslogObj: {
          type: 'post',
          url: '/searchManage/getLogInfolistForCondition',
          params: {
            condition: {}
          }
        },
        searchOptions: [],
        listFromSearch: false
      }
    },
    created() {
      let date = new Date()
      let Y = date.getFullYear()
      let M = date.getMonth() + 1
      let D = date.getDate()
      M = M < 10 ? ('0' + M) : M
      D = D < 10 ? ('0' + D) : D
      this.form.timeStart = Y + '-' + M + '-' + D + ' ' + '00:00:00'
      this.form.timeEnd = Y + '-' + M + '-' + D + ' ' + '23:59:59'
      this.listSearch()
      if (this.$route.query && this.$route.query.ip) { // 从资产面板跳转过来
        this.form = Object.assign(this.form, {
          hostIp: this.$route.query.ip
        });
        this.axioslogObj.params.condition = Object.assign(this.axioslogObj.params.condition, this.form);
      }
      this.getlogFlag = true;
      this.levelData();
    },
    methods: {
      getDateRangeStart(val) {
        let self = this
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.form.timeEnd.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.form.timeStart = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          self.form.timeStart = val
          self.disableAfterToday2 = {
            disabledDate(time) {
              return time.getTime() < new Date(self.form.timeStart) - 24 * 60 * 60 * 1000
            }
          }
        }
      },
      getDateRangeEnd(val) {
        let self = this
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.form.timeStart.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.form.timeEnd = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          self.form.timeEnd = val
          this.disableAfterToday1 = {
            disabledDate(time) {
              return time.getTime() > new Date(self.form.timeEnd)
            }
          }
        }
      },
      inputTreeChange(nodeData) {
        this.criteria.condition.citypelist = [nodeData.uuid];
        nodeData[this.defaultProps.children].forEach(item => {
          this.criteria.condition.citypelist.push(item.uuid);
        });
      },
      listSearch () {
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
          let timeStart = vm.form.timeStart ? vm.form.timeStart : ''
          let timeEnd = vm.form.timeEnd ? vm.form.timeEnd : ''
          let a = Object.assign({}, {
            receivedTime: timeStart + ' # ' + timeEnd,
            hostIp: vm.form.hostIp.trim ? vm.form.hostIp.trim() : vm.form,
            host: vm.form.host.trim ? vm.form.host.trim() : vm.form.host,
            logLevel: vm.form.logLabel,
            facility: String(vm.form.facilityLabel),
            logMessage: vm.form.logMessage.trim ? vm.form.logMessage.slice(0, 99).trim() : vm.form.logMessage.slice(0, 99)
          });
          let obj = a
          let arr = []
          Object.keys(obj).map(function (key) {
            // obj[key] = obj[key].trim()
            if (!obj[key] || obj[key].trim && obj[key].trim() === '#') {
              arr.push(key)
            }
          })
          vm.axioslogObj.params.condition = omit(a, arr)
          vm.getlogFlag = true;
        }
      },
      /* 日志级别数据 */
      levelData() {
        $axios.post('/searchManage/getLogInfoSubDataForCondition').then(({data}) => {
          this.level = data.logLevelList
          this.Facilitydata = data.logFacilities
        })
      }
    },
    components: {
      pageInfiniteTable
      // inputTree,
      // DateRange,
      // SearchBox
    }
  }
</script>
