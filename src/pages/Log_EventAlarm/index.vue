<template>
  <section class="logEventAlarm content">
    <s-form :inline="true">
      <s-form-item label="时间">
        <s-select v-model="period" style="width: 200px">
          <s-option label="当天" value="day"></s-option>
          <s-option label="最近一周" value="week"></s-option>
          <s-option label="最近一月" value="month"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item>
        <s-button title="统计" @click="getList">统计</s-button>
      </s-form-item>
      <s-form-item>
        <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      </s-form-item>
      <s-form-item>
        <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      </s-form-item>
      <s-form-item>
        <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
      </s-form-item>
    </s-form>
    <s-row>
      <s-col :span="12"><span class="title"><i class="iconfont icon-pie-chart"></i>类别统计</span></s-col>
      <s-col :span="11" push="1"><span class="title"><i class="iconfont icon-trophy"></i>产生告警最多的资产统计TOP10</span></s-col>
    </s-row>
    <s-row>
      <s-col :span="12">
        <s-scrollbar wrap="scrollHeight">
          <s-table :data="levelLists">
            <s-table-column label="类别" prop="alertType"></s-table-column>
            <s-table-column label="总数" prop="total" show-overflow-tooltip></s-table-column>
            <s-table-column label="短信" prop="msg" show-overflow-tooltip></s-table-column>
            <s-table-column label="邮件" prop="email" show-overflow-tooltip></s-table-column>
            <s-table-column label="微信" prop="weichat" show-overflow-tooltip></s-table-column>
            <s-table-column label="客户端" prop="client" show-overflow-tooltip></s-table-column>
          </s-table>
        </s-scrollbar>
      </s-col>
      <s-col :span="11" push="1">
        <s-table :data="topLists">
          <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
          <s-table-column label="IP地址" prop="controlAdderss" show-overflow-tooltip></s-table-column>
          <s-table-column label="资产类型" prop="citype_Name" show-overflow-tooltip></s-table-column>
          <s-table-column label="告警总数" prop="alertCnt" show-overflow-tooltip></s-table-column>
        </s-table>
      </s-col>
    </s-row>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    component: {
      Download
    },
    data() {
      return {
        period: 'day',
        levelLists: [],
        topLists: []
      }
    },
    methods: {
      getList() {
        var vm = this;
        $axios.get('/eventAlertStat/alert/' + this.period).then((res) => {
          vm.levelLists = res.data;
        });
        $axios.get('/eventAlertStat/alertTop/' + this.period + '/' + Number(10)).then((res) => {
          vm.topLists = res.data;
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.get(`/eventAlertStat/exportAlert/${vm.period}/excel`).then((res) => {
          if (res.data === 'success') {
            Download(`/eventAlertStat/downAlert/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.get(`/eventAlertStat/exportAlert/${vm.period}/pdf`).then((res) => {
          if (res.data === 'success') {
            Download(`/eventAlertStat/downAlert/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.get(`/eventAlertStat/exportAlert/${vm.period}/word`).then((res) => {
          if (res.data === 'success') {
            Download(`/eventAlertStat/downAlert/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    created() {
      this.getList();
    }
  }
</script>
