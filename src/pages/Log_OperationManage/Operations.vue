<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-21 13:28:59
 * @LastEditTime: 2019-08-21 13:28:59
 * @LastEditors: your name
 -->
<template>
  <section class="content">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="来源类别：">
            <s-select v-model="form.source" clearable placeholder="请选择来源类别" @change="getSourceOptions">
              <s-option v-for="(value, key, index) in sourceList" :label="key" :value="value" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item v-show="oplabelshow == 1" label="运维人员：">
            <s-select v-model="form.operateUserList" collapse-tags multiple clearable placeholder="请选择运维人员">
              <s-option v-for="(item, index) in UserList" :label="item.name" :value="item.value" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="目标类别：">
            <s-select v-model="form.target" clearable placeholder="请选择目标类别" @change="getTargetOptions">
              <s-option v-for="(value, key, index) in targetList" :label="key" :value="value" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item v-show="childTypeShow != 0" label="子类别：">
            <s-select v-model="form.columnList" collapse-tags multiple clearable placeholder="请选择子类别">
              <s-option v-for="(item, index)  in column" :label="item.name" :value="item.value" :key="index"></s-option>
            </s-select>
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
      <s-button title="EXCEL报表" icon="excel" @click="downloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="downloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="downloadHandle('pdf')">PDF报表</s-button>
    </s-row>
    <s-table-page :data="topLists" >
      <s-table-column show-overflow-tooltip v-for="(item, index) in operationColumnList" :label="item.colName" :key="item.colName" :prop="item.colKey" ></s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  // import inputTree from '@/components/inputTree/InputTree';
  import {Download} from 'sunflower-common-utils'

  import SelectTime from '@/components/selectTime/SelectTime.vue'

  export default {
    components: {
      SelectTime
      // inputTree
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
        typeList: [],
        form: {
          source: 0,
          operateUserList: [],
          target: 0,
          columnList: []
        },
        sourceList: [],
        UserList: [],
        targetList: [],
        column: [],
        oplabelshow: 0,
        childTypeShow: 0,
        operationColumnList: []
      }
    },
    methods: {
      getList() {
        let {beginTimes, endTimes, period} = this.$refs.selecttime
        let periodTime = {
          startTime: parseInt(new Date(beginTimes).getTime() / 1000),
          endTime: parseInt(new Date(endTimes).getTime() / 1000),
          timeUnit: period
        }
        let mixForm = Object.assign(periodTime, this.form);
        $axios.post('/operationLogStat/getOperationTotalStatList', mixForm).then((res) => {
          res.data.forEach(function (item) {
            item['sessionFlow'] = item['sessionFlow']
          })
          this.topLists = res.data
        });
        this.getTableFieldList()
      },
      downloadHandle(type) {
        let {beginTimes, endTimes, period} = this.$refs.selecttime
        let periodTime = {
          startTime: parseInt(new Date(beginTimes).getTime() / 1000),
          endTime: parseInt(new Date(endTimes).getTime() / 1000),
          timeUnit: period,
          exportType: type
        }
        let mixForm = Object.assign(periodTime, this.form);
        $axios.post('/operationLogStat/makeOperationTotalStatFile', mixForm).then(({data}) => {
          if (data) {
            Download(`/operationLogStat/downOperationTotalStatFile/${type}`);
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
            })
          }
        });
      },
      getSourceType() {
        $axios.get('/operationLogStat/getOperationStatisticSourceCategory').then(({data}) => {
          this.sourceList = data.source
          this.targetList = data.target
        });
      },
      getSourceOptions(val) {
        if (val === '') {
          val = 0
        }
        $axios.get(`/operationLogStat/getOperationStatConditon/${val}`).then(({data}) => {
          this.UserList = data
          this.oplabelshow = val
        });
      },
      getTargetOptions(val) {
        if (val === '') {
          val = 0
        }
        $axios.get(`/operationLogStat/getOperationStatConditon/${val}`).then(({data}) => {
          this.form.columnList = []
          this.column = data
          this.childTypeShow = val
        });
      },
      getTableFieldList() {
        let source = this.form.source
        let target = this.form.target
        if (source === '') {
          source = 0
        }
        if (target === '') {
          target = 0
        }
        $axios.get(`operationLogStat/operationStatisticTableField/${source}/${target}`).then(({data}) => {
          this.operationColumnList = []
          for (let key in data) {
            let dataItem = {}
            dataItem.colKey = key
            dataItem.colName = data[key]
            this.operationColumnList.push(dataItem)
          }
        });
      }
    },
    mounted() {
      this.getList()
      this.getSourceType()
    }
  }
</script>
