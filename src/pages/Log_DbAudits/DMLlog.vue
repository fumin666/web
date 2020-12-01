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
        <s-chart :chart="cmdChart"></s-chart>
      </s-col>
      <s-col>
        <s-chart :chart="dataChart"></s-chart>
      </s-col>
    </s-row>
    <s-table-page :data="topLists" >
      <s-table-column v-for="(value, key, index) in typeList" :label="value" :prop="key" :key="index"></s-table-column>
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
        cmdChart: {
          name: 'cmdChart',
          type: 'multilineChart',
          width: '100%',
          height: '320px',
          option: {
            color: ['#60acfc', '#5bc49f', '#32d3eb', '#feb64d', '#ff7c7c', '#9287e7', '#2fb2ed', '#36cec8', '#ffdc2d', '#fc8069', '#626de1', '#648cd9'],
            title: {
              x: '6%',
              text: 'DML指令操作次数的统计',
              textStyle: {
                color: '#000'
              }
            },
            legend: {
              orient: 'vertical',
              x: '85%'
            }
          },
          data: {}
        },
        dataChart: {
          name: 'dataChart',
          type: 'multilineChart',
          width: '100%',
          height: '320px',
          option: {
            color: ['#60acfc', '#5bc49f', '#32d3eb', '#feb64d', '#ff7c7c', '#9287e7', '#2fb2ed', '#36cec8', '#ffdc2d', '#fc8069', '#626de1', '#648cd9'],
            title: {
              x: '6%',
              text: 'DML操作次数的统计',
              textStyle: {
                color: '#000'
              }
            },
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
          this.cmdChart.option.title.textStyle.color = 'rgba(255, 255, 255, 0.85)'
          this.cmdChart.option.title.textStyle.fontSize = '18px'
          this.dataChart.option.title.textStyle.color = 'rgba(255, 255, 255, 0.85)'
          this.dataChart.option.title.textStyle.fontSize = '18px'
        } else {
          this.cmdChart.option.title.textStyle.color = 'rgba(0, 0, 0, 0.85)'
          this.cmdChart.option.title.textStyle.fontSize = '18px'
          this.dataChart.option.title.textStyle.color = 'rgba(0, 0, 0, 0.85)'
          this.dataChart.option.title.textStyle.fontSize = '18px'
        }
      },
      getChart() {
        // 命令维度
        const form = this.formData()
        $axios.post('/dbauditReport/dmlCmdTimeStat', form).then((res) => {
          let arrdata = JSON.parse(JSON.stringify(res.data.data));
          let arrrelation = JSON.parse(JSON.stringify(res.data.relation));
          let relation = {};
          for (let i in arrrelation) {
            if (i === 'date') {
              relation['date'] = arrrelation[i];
            } else {
              relation[arrrelation[i]] = i;
            }
          }
          let data = [];
          for (let x in arrdata) {
            let obj = {};
            for (let j in arrdata[x]) {
              if (j === 'date') {
                obj['date'] = arrdata[x][j];
              } else {
                if (arrrelation[j]) {
                  obj[arrrelation[j]] = arrdata[x][j];
                } else {
                  obj[j] = arrdata[x][j];
                }
              }
            }
            data.push(obj);
          }
          let obj = {
            relation: relation,
            data: data
          }
          this.cmdChart.data = obj
        })
      },
      getChart1() {
        // 数据库维度
        const form = this.formData()
        $axios.post('/dbauditReport/dmlDatabaseTimeStat', form).then((res) => {
          let arrdata = JSON.parse(JSON.stringify(res.data.data));
          let arrrelation = JSON.parse(JSON.stringify(res.data.relation));
          let relation = {};
          for (let i in arrrelation) {
            if (arrrelation[i] !== 'date') {
              relation[arrrelation[i]] = i;
            }
          }
          let data = [];
          for (let x in arrdata) {
            let obj = {};
            for (let j in arrdata[x]) {
              if (j === 'date') {
                obj['date'] = arrdata[x][j];
              } else {
                if (arrrelation[j]) {
                  obj[arrrelation[j]] = arrdata[x][j];
                } else {
                  obj[j] = arrdata[x][j];
                }
              }
            }
            data.push(obj);
          }
          let obj = {
            relation: relation,
            data: data
          }
          this.dataChart.data = obj
        })
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
        $axios.post('/dbauditReport/dmlDataCmdTimeStat', form).then((res) => {
          this.topLists = res.data.data
          this.typeList = res.data.relation
        });
      },
      clickHandle() {
        this.getList()
        this.getChart()
        this.getChart1()
      },
      downloadHandle(type) {
        let form = this.formData()
          Download(`/dbauditReport/dmlDatabaseTimeStatExport/${form.startTime}/${form.endTime}/${form.timeType}/${type}`);
      }
    },
    mounted() {
      this.getList();
      this.getChart();
      this.getChart1();
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
    }
  }
</script>

