/**
* Created by alex on 2019/2/26.
*/
<template>
  <section class="content" style="margin-top: 20px;">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="日志源类别：">
            <input-tree v-model="citypeUuid" name="uuid" :data="searchOptions"
                        :props="defaultProps" :hasDelIcon="true"></input-tree>
          </s-form-item>
        </template>
        <template slot="searchBtn">
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
          </div>
        </template>
      </select-time>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="downloadHandle(1)">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="downloadHandle(3)">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="downloadHandle(2)">PDF报表</s-button>
    </s-row>
    <s-table-page :data="topLists">
      <s-table-column label="策略名" prop="strategyName"></s-table-column>
      <s-table-column label="日志源类别" prop="citypeName"></s-table-column>
      <s-table-column label="总数" prop="totol"></s-table-column>
      <s-table-column label="严重" prop="level6"></s-table-column>
      <s-table-column label="主要" prop="level5"></s-table-column>
      <s-table-column label="次要" prop="level4"></s-table-column>
      <s-table-column label="警告" prop="level3"></s-table-column>
      <s-table-column label="提示" prop="level2"></s-table-column>
      <s-table-column label="正常" prop="level1"></s-table-column>
      <s-table-column label="未知" prop="level0"></s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import inputTree from '@/components/inputTree/InputTree';
  import {Download} from 'sunflower-common-utils'
  import SelectTime from '@/components/selectTime/SelectTime.vue'

  export default {
    components: {
      SelectTime,
      inputTree
    },
    data() {
      return {
        searchOptions: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        citypeUuid: '',
        topLists: [],
        typeList: []
      }
    },
    methods: {
      getList() {
        if (this.$refs.selecttime.beginTimes === null || this.$refs.selecttime.beginTimes === '') {
          this.$message.error('请选择开始时间！');
          return
        }
        if (this.$refs.selecttime.endTimes === null || this.$refs.selecttime.endTimes === '') {
          this.$message.error('请选择结束时间！');
          return
        }
        let period = {
          startTime: this.$refs.selecttime.beginTimes,
          endTime: this.$refs.selecttime.endTimes,
          citypeUuid: this.citypeUuid
        }
        $axios.post('/syslogReport/strategyReportCount', period).then((res) => {
          this.topLists = res.data
        });
      },
      downloadHandle(type) {
        let form = {
          startTime: this.$refs.selecttime.beginTimes,
          endTime: this.$refs.selecttime.endTimes,
          citypeUuid: this.citypeUuid,
          type: type
        }
        $axios.post('/syslogReport/strategyReportExport', form).then((res) => {
          Download(`/syslogReport/downLoadLogReport/${res.data}`);
        });
      },
      getSourceType() {
        $axios.get('/syslogAuditSetting/getSyslogTree').then(({data}) => {
          this.searchOptions = data;
        });
      }
    },
    mounted() {
      this.getList();
      this.getSourceType()
    }
  }
</script>
