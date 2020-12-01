<template>
  <section class="content logImportOrder">
    <s-form :inline="true" class="search_form" label-width="90px">
      <div>
        <s-form-item label="日期单位：">
          <s-select v-model="period" @change="showNext">
            <s-option label="年" value="0"></s-option>
            <s-option label="月" value="1"></s-option>
            <s-option label="日" value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="开始日期：">
          <s-date-picker v-model="beginTimes" :editable="editable" v-if="bloomYear" type="year" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
          <s-date-picker v-model="beginTimes" :editable="editable" v-if="bloomMonth" type="month" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
          <s-date-picker v-model="beginTimes" :editable="editable" v-if="bloomDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getStartTime">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="结束日期：">
          <s-date-picker v-model="endTimes" :editable="editable" v-if="bloomYear" type="year" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
          <s-date-picker v-model="endTimes" :editable="editable" v-if="bloomMonth" type="month" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
          <s-date-picker v-model="endTimes" :editable="editable" v-if="bloomDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" @change="getEndTime">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="命令集名称：">
          <s-select v-model="groupUuid">
            <s-option v-for="item in GatherList" :label="item.name" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="showList()">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px">
      <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
    </s-row>
    <s-table-page
      :data="orderList">
      <s-table-column label="用户" prop="userName"></s-table-column>
      <s-table-column label="命令集" prop="cmdGroup"></s-table-column>
      <s-table-column label="使用命令次数" prop="cmdCnt"></s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        period: '日',
        beginTimes: '',
        endTimes: '',
        bloomYear: false,
        bloomMonth: false,
        bloomDate: true,
        orderList: [],
        editable: false,
        GatherList: [],
        groupUuid: ''
      }
    },
    methods: {
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.endTimes.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.beginTimes = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.beginTimes = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.beginTimes.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.endTimes = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.endTimes = val;
        }
      },
      // 时间选择
      showNext(val) {
        this.beginTimes = '';
        this.endTimes = '';
        switch (val) {
          case '0':
            this.bloomYear = true;
            this.bloomMonth = false;
            this.bloomDate = false;
            break;
          case '1':
            this.bloomMonth = true;
            this.bloomDate = false;
            this.bloomYear = false;
            break;
          case '2':
            this.bloomDate = true;
            this.bloomYear = false;
            this.bloomMonth = false;
            break;
        }
      },
      // 列表显示
      showList() {
        let vm = this;
        $axios.post('/keyCmdStat/keyCmdUser', {groupUuid: vm.groupUuid, endTime: vm.endTimes, startTime: vm.beginTimes}).then((res) => {
          if (res.data instanceof Array) {
            vm.orderList = res.data;
          }
        });
      },
      // 命令集数据
      getGatherList() {
        let vm = this;
        return $axios.get('/keyCommandGroup/list').then((res) => {
          if (res.data instanceof Array) {
            vm.GatherList = res.data;
          }
        });
      },
      ExcelDownloadHandle() {
        let vm = this;
        $axios.post('/keyCmdStat/exportUserSessionCmd', {exportType: 'excel', groupUuid: vm.groupUuid, endTime: vm.endTimes, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/keyCmdStat/downUserSessionCmd/excel?t=${new Date().getTime()}`);
          }
        });
      },
      PdfDownloadHandle() {
        let vm = this;
        $axios.post('/keyCmdStat/exportUserSessionCmd', {exportType: 'pdf', groupUuid: vm.groupUuid, endTime: vm.endTimes, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/keyCmdStat/downUserSessionCmd/pdf?t=${new Date().getTime()}`);
          }
        });
      },
      WordDownloadHandle() {
        let vm = this;
        $axios.post('/keyCmdStat/exportUserSessionCmd', {exportType: 'word', groupUuid: vm.groupUuid, endTime: vm.endTimes, startTime: vm.beginTimes}).then((res) => {
          if (res.data === 'success') {
            Download(`/keyCmdStat/downUserSessionCmd/word?t=${new Date().getTime()}`);
          }
        });
      }
    },
    created() {
      this.getGatherList().then(() => {
        this.showList();
      })
    }
  }
</script>
