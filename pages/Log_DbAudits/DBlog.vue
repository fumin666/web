/**
* Created by alex on 2019/3/4.
*/
<template>
  <section class="content">
    <s-form :inline="true" class="search_form" style="margin: 10px 0;">
      <div>
        <select-time ref="selecttime"></select-time>
      </div>
      <div class="search_btn">
        <s-button title="查询" icon='magnifier' @click="clickHandle">查询</s-button>
      </div>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="downloadHandle('excel')">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="downloadHandle('word')">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="downloadHandle('pdf')">PDF报表</s-button>
    </s-row>
    <s-row>
      <s-col>
        <s-chart :chart="dataChart"></s-chart>
      </s-col>
    </s-row>
    <s-table-page :data="topLists" >
      <s-table-column v-for="(value, key, index) in typeList" :label="value" :prop="key" :key="index">
        <template slot-scope="scope">
          <span>{{scope.row[key]}}</span>
        </template>
      </s-table-column>
    </s-table-page>
  </section>
</template>

<script>
import $axios from 'sunflower-ajax'
// import inputTree from '@/components/inputTree/InputTree';
import {Download} from 'sunflower-common-utils'

import SelectTime from './components/DBSelectTime'

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
      dataChart: {
        name: 'dataChart',
        type: 'multilineChart',
        width: '100%',
        height: '320px',
        option: {
          title: {
            x: '6%',
            text: '数据库账号数量时间统计',
            textStyle: {
              color: '#000'
            }
          },
          color: ['#60acfc', '#5bc49f', '#32d3eb', '#feb64d', '#ff7c7c', '#9287e7', '#2fb2ed', '#36cec8', '#ffdc2d', '#fc8069', '#626de1', '#648cd9'],
          legend: {
            orient: 'vertical',
            x: '85%'
          }
        },
        data: {}
      }
    }
  },
  watch: {
    '$store.state.theme': function(val) {
      this.getTheme(val)
    }
  },
  methods: {
    getTheme(val) {
      if (val === 'dark') {
        this.dataChart.option.title.textStyle.color = 'rgba(255, 255, 255, 0.85)'
        this.dataChart.option.title.textStyle.fontSize = '18px'
      } else {
        this.dataChart.option.title.textStyle.color = 'rgba(0, 0, 0, 0.85)'
        this.dataChart.option.title.textStyle.fontSize = '18px'
      }
    },
    formData() {
      let start = this.$refs.selecttime.formatBegin
      let end = this.$refs.selecttime.formatEnd
      let type = this.$refs.selecttime.period
      let startTime = ''
      let endTime = ''
      typeof start === 'number' ? startTime = start / 1000 : startTime = (start.getTime()) / 1000
      typeof end === 'number' ? endTime = end / 1000 : endTime = (end.getTime()) / 1000
      let data = {
        startTime: startTime,
        endTime: endTime,
        timeType: type
      }
      return data
    },
    getList() {
      const form = this.formData()
      $axios.post('/dbauditReport/accountAudit', form).then((res) => {
        if (res.status === 200) {
          this.topLists = res.data.data
          this.typeList = res.data.relation
          let arrdata = JSON.parse(JSON.stringify(res.data.data));
          let arrrelation = JSON.parse(JSON.stringify(res.data.relation));
          delete arrrelation['timeStat']
          let relation = {};
          for (let i in arrrelation) {
            relation[arrrelation[i]] = i;
          }
          for (let x in arrdata) {
            arrdata[x].date = arrdata[x].timeStat;
            delete arrdata[x].timeStat
            for (let j in arrdata[x]) {
              if (arrrelation[j]) {
                arrdata[x][arrrelation[j]] = arrdata[x][j];
                delete arrdata[x][j]
              }
            }
          }
          let obj = {
            relation: relation,
            data: arrdata
          }
          this.dataChart.data = obj
        }
      });
    },
    clickHandle() {
      this.getList()
    },
    downloadHandle(type) {
      let form = this.formData()
      Download(`/dbauditReport/accountAuditExport/${form.startTime}/${form.endTime}/${form.timeType}/${type}`);
    }
  },
  mounted() {
    this.getList()
    let mainTheme = localStorage.getItem('theme');
    this.getTheme(mainTheme)
  }
}
</script>
