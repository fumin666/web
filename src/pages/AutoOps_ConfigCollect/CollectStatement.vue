/**
* Created by alex on 2018/8/10.
*/
<template>
  <div class="problem">
    <section class="reportTop noPrint" style="margin-top: 15px">
      <s-form :inline="true" class="search_form" ref="searchForm" style="margin-bottom: 10px;">
        <div>
          <s-form-item label="报表类型：">
            <s-select v-model="type">
              <s-option label="采集数据详情" :value="1"></s-option>
              <s-option label="主机操作系统分布" :value="2"></s-option>
              <s-option label="主机厂商类型" :value="3"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="提交时间：">
            <s-date-picker
              type="datetime"
              placeholder="选择开始时间"
              v-model="startTime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday1"
              @change="getDateRangeStart"
            >
            </s-date-picker>
          </s-form-item>
          <s-form-item label="~">
            <s-date-picker
              type="datetime"
              placeholder="选择结束时间"
              v-model="endTime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday2"
              @change="getDateRangeEnd">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="generate()">生成</s-button>
        </div>
      </s-form>
      <s-row>
        <s-button icon="printer" @click="print()">打印</s-button>
        <s-button icon="export" @click="exportButton()">导出</s-button>
      </s-row>
    </section>
    <section id="print-section" class="print_field">
      <div v-if="type !== 1" style="margin: 0 auto;width: 600px">
        <s-chart :chart="chart1" :clickFun="echartClick"></s-chart>
      </div>
      <s-table-page
        :data="tableData">
        <s-table-column
          prop="itcompName"
          label="主机名称">
        </s-table-column>
        <s-table-column
          prop="controlAdderss"
          label="IP地址">
        </s-table-column>
        <s-table-column
          prop="modelNumber"
          label="操作系统">
        </s-table-column>
      </s-table-page>
    </section>
  </div>
</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    data () {
      return {
        type: 1,
        startTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        value: '',
        chart1: {
          name: 'chart',
          type: 'pieChart',
          width: '600px',
          height: '300px',
          data: {},
          option: {
            legend: {
              show: false
            },
            series: [{
              label: {
                normal: {
                  show: true,
                  position: 'outside'
                }
              }
            }]
          }
        },
        tableData: [],
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        os: '',
        mannFact: ''
      }
    },
    components: {
      // Download
    },
    mounted() {
      this.getDateRangeStart(this.startTime)
      this.getDateRangeEnd(this.endTime)
      this.generate()
    },
    methods: {
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
      },
      generate() {
        if (!this.startTime || !this.endTime) {
          this.$message({
            message: '请先选择时间',
            type: 'error'
          })
        } else {
          this.getData()
        }
      },
      print() {
        window.print();
      },
      getData() {
        this.os = ''
        this.mannFact = ''
        let params = {condition: {
          type: this.type,
          startTime: parseInt(new Date(this.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.endTime).getTime() / 1000)
        }}
        this.ajaxTable(params)
      },
      ajaxTable(params) {
        $axios.post(`/ciCollectReport/getCiCollectResult`, params, {
          data: [params],
          logTemplate: '生成|报表(#type#)'
        }).then((res) => {
          this.chart1.data = res.data.chart
          this.tableData = res.data.list
        })
      },
      exportButton() {
        let condition = {
          type: this.type,
          startTime: parseInt(new Date(this.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.endTime).getTime() / 1000)
        }
        if (this.type === 2) {
          condition.os = this.os
        }
        if (this.type === 3) {
          condition.mannFact = this.mannFact
        }
        let params = {condition}
        $axios.post('/ciCollectReport/makeCiCollectReportFile', params, {
          data: [params],
          logTemplate: '导出|报表(#type#)'
        }).then((res) => {
          if (res.data) {
            Download(res.data[0])
          }
        })
      },
      echartClick(data) {
        let condition = {
          type: this.type,
          startTime: parseInt(new Date(this.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.endTime).getTime() / 1000)
        }
        if (this.type === 2) {
          condition.os = data.name
          this.os = data.name
        }
        if (this.type === 3) {
          condition.mannFact = data.name
          this.mannFact = data.name
        }
        let params = {condition}
        this.ajaxTable(params)
      }
    },
    watch: {
      type: function (val, oldVal) {
        this.tableData = [];
        this.os = ''
        this.mannFact = ''
      }
    }
  }
</script>
<style lang="stylus">
  @media print {
    #print-section{
      width: 100%
    }
    #print-section .pagination-wrap {
      display: none
    }
  }
</style>
