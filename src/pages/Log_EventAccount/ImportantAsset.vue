<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 18:03:19
 * @LastEditTime: 2019-08-28 16:03:25
 * @LastEditors: Please set LastEditors
 -->
/**
 * @author fumin
 * @date 2019/7/22
 * @Description:报表中心 >事件统计报表 > 登录重要资产事件报表
*/
<template>
  <section class="content eventAccount" id="logAudit">
    <s-row>
      <s-col :span="24">
        <s-form :inline="true">
          <select-time ref="selecttime">
            <template slot="serachForm">
              <s-form-item label="运维用户：">
                <s-input v-model="searchGroup.userName"></s-input>
              </s-form-item>
              <s-form-item label="客户端IP：" prop="clientIp">
                <s-input v-model="searchGroup.clientIp" placeholder="请输入"></s-input>
              </s-form-item>
              <s-form-item label="目标资产IP：" prop="targetIp">
                <s-input v-model="searchGroup.targetIp" placeholder="请输入"></s-input>
              </s-form-item>
              <s-form-item label="目标资产名称：" label-width="110px">
                <s-input v-model="searchGroup.targetName" placeholder="请输入"></s-input>
              </s-form-item>
            </template>
            <template slot="searchBtn">
              <div class="search_btn">
                <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
              </div>
            </template>
          </select-time>
          <s-form-item>
            <s-button icon="excel" title="EXCEL报表" @click="DownloadHandle('excel')">EXCEL报表</s-button>
          </s-form-item>
          <s-form-item>
            <s-button icon="word" title="WORD报表" @click="DownloadHandle('word')">WORD报表</s-button>
          </s-form-item>
          <s-form-item>
            <s-button icon="pdf" title="PDF报表" @click="DownloadHandle('pdf')">PDF报表</s-button>
          </s-form-item>
        </s-form>
      </s-col>
    </s-row>
    <s-row>
      <s-row>
            <span class="title">
              <i class="iconfont icon-trophy"></i>事件详情
            </span>
      </s-row>
      <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag" @filter-change="filterChangeHandler">
        <s-table-column label="事件级别"
                        prop="levelStr"
                        width="170px"
                        column-key="eventLevel"
                        show-overflow-tooltip></s-table-column>
        <s-table-column label="事件时间" prop="createTimeStr"></s-table-column>
        <s-table-column label="运维用户" prop="userName" width="170px"></s-table-column>
        <s-table-column label="客户端IP" prop="clientIp"></s-table-column>
        <s-table-column label="目标资产IP" prop="targetIp"></s-table-column>
        <s-table-column label="目标资产名称" prop="targetName"></s-table-column>
        <s-table-column label="资产账号" prop="accountName"></s-table-column>
        <s-table-column label="登录协议" prop="protocolName"></s-table-column>
        <s-table-column label="事件内容" prop="eventInfo"></s-table-column>
        <s-table-column label="会话ID" prop="sessionId"></s-table-column>
      </page-infinite-table>
    </s-row>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  import SelectTime from '@/components/selectTime/SelectTime.vue'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
     components: {
      SelectTime,
      pageInfiniteTable
    },
    data() {
      return {
        filters: [
          // {text: '未知', value: '0'},
          // {text: '正常', value: '1'},
          // {text: '提示', value: '2'},
          // {text: '警告', value: '3'},
          // {text: '次要', value: '4'},
          // {text: '主要', value: '5'},
          {text: '严重', value: '6'}],
        levelLists: [],
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/operationEventStat/getMajorAssetEventList',
          params: {
            condition: {}
          }
        },
        searchGroup: {
          userName: null,
          clientIp: null,
          targetIp: null,
          targetName: null,
          eventInfo: null,
          assetuuid: null
        }
      }
    },
    methods: {
      // 无限分页，筛选功能
      filterChangeHandler(val) {
        let param = {currentPage: 1, pageSize: 10, condition: {}}
        this.searchGroup.eventLevel = val['eventLevel'].join(',')
        param.condition = Object.assign({}, this.searchGroup, {startTime: this.$refs.selecttime.beginTimes, endTime: this.$refs.selecttime.endTimes})
        this.axiosHistoryObj.params.condition = param.condition;
      },
       // 点击会话ID跳转
      // showDetail(row) {
      //   this.$router.push({path: `/LogCenter/log_operationcount`, query: {sessionId: row.sessionId}})
      // },
      getList() {
        this.getHistoryFlag = true;
        let param = {currentPage: 1, pageSize: 10, condition: {}}
        param.condition = Object.assign({}, this.searchGroup, {startTime: this.$refs.selecttime.beginTimes, endTime: this.$refs.selecttime.endTimes})
        this.axiosHistoryObj.params = Object.assign({}, param);
      },
      DownloadHandle(type) {
        let form = {
          reportType: type,
          startTime: this.$refs.selecttime.beginTimes,
          endTime: this.$refs.selecttime.endTimes,
          userName: this.searchGroup.userName,
          clientIp: this.searchGroup.clientIp,
          targetName: this.searchGroup.targetName,
          targetIp: this.searchGroup.targetIp
        }
        $axios.post('/operationEventStat/createMajorAssetEventReport', form).then((res) => {
          if (res.data) {
            Download(`/operationEventStat/downMajorAssetEventReport/${type}`);
          }
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
