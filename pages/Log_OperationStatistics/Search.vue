<template>
  <!--会话查询-->
  <section class="logSearch">
    <!--统计部分-->
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="searchBtn">
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="search">查询</s-button>
          </div>
        </template>
      </select-time>
    </s-form>
    <s-row style="margin:15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
    </s-row>
    <!--时间区间以及下面部分-->
    <s-form v-if="flag" :model="form" :rules="rulesForm" label-width="100px" style="width: 600px; margin-left: 38px">
      <!--<s-form-item label="时间区间" class="labelRight">-->
      <!--<s-date-picker-->
      <!--v-model="form.startTimeValue"-->
      <!--type="datetime"-->
      <!--:editable="editable"-->
      <!--value-format="yyyy-MM-dd HH:mm:ss"-->
      <!--:value-format-flag="true"-->
      <!--@change="getStartTime">-->
      <!--</s-date-picker>-->
      <!--<span style="color: #8391a5;font-size: 16px;font-weight: 600;margin: 0 20px;"> ~ </span>-->
      <!--<s-date-picker-->
      <!--v-model="form.endTimeValue"-->
      <!--type="datetime"-->
      <!--:editable="editable"-->
      <!--value-format="yyyy-MM-dd HH:mm:ss"-->
      <!--:value-format-flag="true"-->
      <!--@change="getEndTime">-->
      <!--</s-date-picker>-->
      <!--</s-form-item>-->
      <s-form-item label="协议" style="width: 170%" class="labelRight">
        <s-checkbox-group v-model="form.checkList">
          <s-checkbox v-for="(item, index) in checkArray" :label="item.protocolName" :title="item.protocolName" :key="index" name="type" style="width: 210px;overflow:hidden;white-space:nowrap;"></s-checkbox>
        </s-checkbox-group>
      </s-form-item>
      <s-form-item label="运维类型" class="labelRight">
        <s-select v-model="form.operation" placeholder="选择类型">
          <s-option v-for="(item, index) in operationArray" :label="item.specialoperTypeName" :key="index" :value="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="命令关键字" tip="请输入需要查询的命令关键字，支持模糊查询(禁止以@开头)" prop="importOrder" class="labelRight">
        <s-input v-model="form.importOrder"></s-input>
      </s-form-item>
      <s-form-item label="操作人" class="labelRight">
        <s-input v-model="form.operationer"></s-input>
      </s-form-item>
      <s-form-item label="客户端IP" class="labelRight">
        <s-input v-model="form.clientIp"></s-input>
      </s-form-item>
      <s-form-item label="目标资产IP" class="labelRight">
        <s-input v-model="form.deviceIp"></s-input>
      </s-form-item>
      <s-form-item label="端口" class="labelRight">
        <s-input v-model="form.port"></s-input>
      </s-form-item>
      <s-form-item label="账号名" class="labelRight">
        <s-input v-model="form.accountName"></s-input>
      </s-form-item>
      <!--<s-form-item>-->
      <!--<s-button @click="search()">检索</s-button>-->
      <!--</s-form-item>-->
    </s-form>
    <Audit v-else :show2="show2" :isSearchPage="SearchPage" :searchForm="searchForm" :dataList="dataList" :dateTime="dateTime" @changeFlag = 'flag = 1' @searchPageHandler="search()" ref="auditTable"></Audit>
  </section>
</template>
<script>
  import Audit from './Audit.vue'
  import $axios from 'sunflower-ajax'
  import SelectTime from '@/components/selectTime/SelectTime.vue'
  import {Download} from 'sunflower-common-utils'
  export default{
    components: {
      Audit,
      SelectTime
    },
    data() {
      let validateOrder = (rule, value, callback) => {
        let reg = /^@/;
        if (reg.test(value)) {
          callback(new Error('禁止以@开头'));
        } else {
          callback();
        }
      };
      return {
        searchForm: {},
        form: {
          startTimeValue: '',
          endTimeValue: '',
          checkList: [],
          operation: '',
          importOrder: '',
          operationer: '',
          clientIp: '',
          deviceIp: '',
          port: '',
          accountName: ''
        },
        rulesForm: {
          importOrder: [{ validator: validateOrder, trigger: 'blur' }]
        },
        checkArray: [],
        operationArray: [],
        flag: 1,
        SearchPage: 1,
        dataList: {
          totalCount: 0,
          pageList: []
        },
        dateTime: [],
        protocolUuids: [],
        editable: false
      }
    },
    props: ['show2'],
    methods: {
      ExcelDownloadHandle() {
        let vm = this;
        let {beginTimes, endTimes} = vm.$refs.selecttime;
        let param = {
          exportType: 'excel',
          startTime: beginTimes,
          endTime: endTimes,
          protocolUuids: vm.protocolUuids,
          sessionType: vm.form.operation,
          keyCmd: vm.form.importOrder,
          optUser: vm.form.operationer.trim(),
          client_ip: vm.form.clientIp.trim(),
          device_ip: vm.form.deviceIp.trim(),
          port: vm.form.port,
          account_name: vm.form.accountName.trim()
        }
        $axios.post(`/operationLogStat/makeSessionSearchFile`, param).then((res) => {
          if (res.data) {
            Download(`/operationLogStat/downSessionSearchFile/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        let {beginTimes, endTimes} = vm.$refs.selecttime;
        let param = {
          exportType: 'pdf',
          startTime: beginTimes,
          endTime: endTimes,
          protocolUuids: vm.protocolUuids,
          sessionType: vm.form.operation,
          keyCmd: vm.form.importOrder,
          optUser: vm.form.operationer.trim(),
          client_ip: vm.form.clientIp.trim(),
          device_ip: vm.form.deviceIp.trim(),
          port: vm.form.port,
          account_name: vm.form.accountName.trim()
        }
        $axios.post('/operationLogStat/makeSessionSearchFile', param).then((res) => {
          if (res.data) {
            Download(`/operationLogStat/downSessionSearchFile/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        let {beginTimes, endTimes} = vm.$refs.selecttime;
        let param = {
          exportType: 'word',
          startTime: beginTimes,
          endTime: endTimes,
          protocolUuids: vm.protocolUuids,
          sessionType: vm.form.operation,
          keyCmd: vm.form.importOrder,
          optUser: vm.form.operationer.trim(),
          client_ip: vm.form.clientIp.trim(),
          device_ip: vm.form.deviceIp.trim(),
          port: vm.form.port,
          account_name: vm.form.accountName.trim()
        }
        $axios.post('/operationLogStat/makeSessionSearchFile', param).then((res) => {
          if (res.data) {
            Download(`/operationLogStat/downSessionSearchFile/word?t=${new Date().getTime()}`);
          }
        });
      },
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.form.endTimeValue.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.form.startTimeValue = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.form.startTimeValue = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.form.startTimeValue.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.form.endTimeValue = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.form.endTimeValue = val;
        }
      },
      getCheckList() {
        let vm = this;
        // let notShow = ['PostgreSQL', '其他数据库协议', '其他中间件协议', 'PASSWORD'];
        vm.checkArray = [];
        $axios.get('/operationLogStat/getProtocolList').then(function (res) {
          if (res.data instanceof Array) {
            // res.data.splice(res.data.length - 4, 4)
            vm.checkArray = res.data;
          }
        })
      },
      getSelectList() {
        let vm = this;
        vm.operationArray = [];
        $axios.get('/operationLogStat/getSessionTypeList').then(function (res) {
          if (res.data instanceof Array) {
            vm.operationArray = res.data;
          }
        })
      },
      search() {
        let vm = this;
        let {beginTimes, endTimes} = vm.$refs.selecttime;
        vm.dateTime = {
          beginTimes: beginTimes,
          endTimes: endTimes
        };
        vm.protocolUuids = [];
        vm.form.checkList.forEach((item1) => {
          vm.checkArray.forEach((item2) => {
            if (item1 === item2.protocolName) {
              vm.protocolUuids.push(item2.uuid);
            }
          })
        });
        let param = {
          currentPage: 1,
          pageSize: 10,
          condition: {
            startTime: beginTimes,
            endTime: endTimes,
            protocolUuids: vm.protocolUuids,
            sessionType: vm.form.operation,
            keyCmd: vm.form.importOrder,
            optUser: vm.form.operationer.trim(),
            client_ip: vm.form.clientIp.trim(),
            device_ip: vm.form.deviceIp.trim(),
            port: vm.form.port,
            account_name: vm.form.accountName.trim()
          }
        };
        vm.searchForm = param.condition;
        vm.flag = 0;
        vm.dataList = {};
        $axios.post('/operationLogStat/search', param).then(function (res) {
          vm.dataList = {
            pageList: res.data.pageList,
            totalCount: res.data.totalCount
          };
        })
      }
    },
    watch: {
      show2: function(val) {
        if (val === true) {
          this.getCheckList();
          this.getSelectList()
        }
      }
    }
//    created() {
//      this.getCheckList();
//      this.getSelectList()
//    }
  }
</script>
