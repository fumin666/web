/**
* Created by liushupeng on 2019/2/20.//Q4高级搜索优化
*/
<template>
  <!--运维视角-运维记录-->
  <div>
    <s-row>
      <s-form :inline="true" :model="searchForm" class="search_form" label-width="65px">
        <div>
          <s-form-item label="会话类型:" prop="specialoperTypeName">
            <s-select v-model="searchForm.sessionTypeUuid" clearable>
              <s-option v-for="item in specialoperType"
                        :key="item.uuid"
                        :label="item.specialoperTypeName"
                        :value="item.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="客户端IP:" prop="clientIp">
            <s-input @keyup.enter.native="search" v-model="searchForm.clientIp" style="width: 185px;"></s-input>
          </s-form-item>
          <s-form-item label="操作人:" prop="oprateUserUuid">
            <s-select v-model="searchForm.oprateUserUuid" clearable>
              <s-option v-for="item in oprateUser"
                        :key="item.uuid"
                        :label="item.userRealName"
                        :value="item.uuid">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="协议:" prop="protocolName">
            <s-select v-model="searchForm.protocolName" clearable>
                <s-option v-for="(item, index) in protocolArr"
                        :key="index"
                        :label="item"
                        :value="item"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="账号名:" prop="accountName">
            <s-input @keyup.enter.native="search" v-model="searchForm.accountName" style="width: 185px;"></s-input>
          </s-form-item>
          <s-form-item label="开始时间:">
            <s-date-picker
              type="datetime"
              v-model="startTime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday1"
              style="width: 185px;"
            >
            </s-date-picker>
            ~
            <s-date-picker
              type="datetime"
              v-model="endTime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday2"
              style="width: 185px;"
            >
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="search">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <s-table-page
      ref="multipleTable"
      :data="dataList"

      style="width:100%"
    >
      <s-table-column prop="specialoperTypeName" label="会话类型"></s-table-column>
      <s-table-column prop="sessionClientIp" label="客户端IP" ></s-table-column>
      <s-table-column prop="userRealName" label="操作人" ></s-table-column>
      <s-table-column prop="protocolName" label="协议(端口)" ></s-table-column>
      <s-table-column prop="accountName" label="账号名" ></s-table-column>
      <s-table-column prop="createTime" label="访问时间" ></s-table-column>
      <s-table-column prop="sessionTimeLongView" label="访问时长" ></s-table-column>
      <s-table-column prop="sessionAuditResultName" label="审核状态" ></s-table-column>
    </s-table-page>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  // import searchBox from '@/components/tableCom/src/SearchBox'
  export default {
    name: 'OperationRecord',
    data() {
      return {
        searchForm: {
          sessionTypeUuid: '',
          clientIp: '',
          oprateUserUuid: '',
          protocolName: '',
          accountName: '',
          startTime: '',
          endTime: ''
        },
        startTime: '',
        endTime: '',
        oprateUser: [], // 操作人下拉框
        specialoperType: [], // 会话类型下拉框
        protocolArr: [], // 协议下拉框
        dataList: [],
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        }
      }
    },
    props: {
      uuid: {
        type: String,
        default: ''
      }
    },
    created() {
      this.getAllData({itcompUuid: this.uuid});
      this.getOptions();
    },
    methods: {
      search() {
        let params = {
          startTime: this.startTime !== null ? parseInt(new Date(this.startTime).getTime() / 1000) : null,
          endTime: this.endTime !== null ? parseInt(new Date(this.endTime).getTime() / 1000) : null
        }
        if (params.startTime !== null && params.endTime !== null) {
          if (params.startTime >= params.endTime) {
            params.startTime = null;
            this.$message('开始日期不能大于等于结束日期');
            return;
          }
        }
        if ((params.startTime === null && params.endTime !== null)) {
          this.$message('请选择正确的开始日期和结束日期');
          return;
        }
        if ((params.startTime !== null && params.endTime === null)) {
          this.$message('请选择正确的开始日期和结束日期');
          return;
        }
        this.searchForm.startTime = params.startTime;
        this.searchForm.endTime = params.endTime;
        let options = Object.assign({itcompUuid: this.uuid}, this.searchForm);
        this.getAllData(options);
      },
      getOptions() {
        $axios.get('/basicOperation/initSearchCondtiton').then(res => {
          this.oprateUser = res.data.doubleUser;
          this.specialoperType = res.data.specialType;
          this.protocolArr = res.data.protocolName;
        })
      },
      getAllData(param) {
        $axios.post('/operationLogStat/getSessionListOfItcompByCondition', param).then(res => {
          this.dataList = res.data;
        })
      },
      getDateRangeStart(value) {
        this.disableAfterToday2 = {
          disabledDate(time) {
            return (time.getTime() > Date.now()) || value && (time.getTime() < new Date(value).getTime())
          }
        }
      },
      getDateRangeEnd(value) {
        this.disableAfterToday1 = {
          disabledDate(time) {
            return (time.getTime() > Date.now()) || value && (time.getTime() > new Date(value).getTime())
          }
        }
      }
    },
    components: {

      // searchBox
    }
  }
</script>

<style>
</style>
