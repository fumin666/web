<template>
  <div class="content statistics" style="margin:10px;">
    <s-row style="width: calc(100% - 20px)" :gutter="15">
      <s-col span="12">
        <s-card  class="box-card" style="width:100%;" :style="{height: boxCardHeight + 'px'}">
          <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-pie-chart"></i>
                 统计信息
                </span>
          </div>
          <s-row style="width: calc(100% - 20px)">
            <s-col span="8">
              <div class="statisticsTable">
                <table class="statTable" border="1">
                  <tbody><tr>
                    <td>资产总数</td>
                    <td id="deviceTotalNum">{{ deviceTotalNum }}</td>
                  </tr>
                  <tr>
                    <td>线路数</td>
                    <td id="lineTotalNum">{{ lineTotalNum }}</td>
                  </tr>
                  </tbody></table>
              </div>
            </s-col>
            <s-col span="16">
              <s-chart :chart="chart"></s-chart>
            </s-col>
          </s-row>
        </s-card>
      </s-col>
      <s-col span="12">
        <s-card  class="box-card" style="width:100%;" :style="{height: boxCardHeight + 'px'}">
          <div slot="header" class="clearfix">
                <span class="card-title">
                  <i class="iconfont icon-nav-asset-monitor"></i>
                 组件监控
                </span>
          </div>
          <s-chart :chart="chart1"></s-chart>
        </s-card>
      </s-col>
    </s-row>
    <br/>
    <s-row style="width: calc(100% - 20px)" :gutter="15">
      <s-col span="12">
        <s-card  class="box-card" style="width:100%;" :style="{height: boxCardHeight + 'px'}">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-nav-event-center"></i>
              事件级别
            </span>
          </div>
          <div class="btnline" v-if="isChart2Display === 1">
            <s-button size="mini" title="今天">今天</s-button>
            <s-button type="cancel" size="mini" @click="changeChart2(7)" title="近七天">近七天</s-button>
          </div>
          <div class="btnline" v-if="isChart2Display === 7">
            <s-button type="cancel" size="mini" @click="changeChart2(1)" title="今天">今天</s-button>
            <s-button size="mini" title="近七天">近七天</s-button>
          </div>
          <div></div>
          <div v-if="isChart2Display === 1">
            <s-chart :chart="chart2" v-if="chart2.data.length > 0"></s-chart>
            <div class="noData" v-else>暂无数据</div>
          </div>
          <div v-if="isChart2Display === 7">
            <s-chart :chart="chart3" v-if="chart3.data.length > 0"></s-chart>
            <div class="noData" v-else>暂无数据</div>
          </div>
        </s-card>
      </s-col>
      <s-col span="12">
        <s-card  class="box-card" style="width:100%;" :style="{height: boxCardHeight + 'px'}">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-log"></i>
              事件TOP10
            </span>
          </div>
          <s-table
            :data="tableData"
            style="width: calc(100% - 20px);margin-top: 10px;margin-left: 10px"
            height="290">
            <s-table-column
              prop="controlAdderss"
              label="IP地址" show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              prop="citypeName"
              label="资产类型" show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              prop="itcompName"
              label="资产名称" show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              prop="countNum"
              label="总数" show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              prop="levelSeriousNum"
              label="严重数" show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              prop="levelMajorNum"
              label="主要数" show-overflow-tooltip>
            </s-table-column>
          </s-table>
        </s-card>
      </s-col>
    </s-row>
  </div>
</template>
<script>
  import getChartColorList from '@/common/utils/chartColor';
  import {
    countTopoviewNodeAndLine,
    countTopoviewItcompByCitypecategory,
    countTopoviewItcompByStatus,
    countTopoviewByDateAndLevel,
    countTopoviewItcompByIncidentAssetCount
  } from './api/topology_api'

  var colors = getChartColorList(['正常', '告警', '异常']);
  var config = {
    series: [{
      type: 'bar',
      barWidth: 45,
      itemStyle: {
        normal: {
          color: function (params) {
            return colors[params.dataIndex];
          }
        }
      }
    }]
  };

  function getColorFulBarSeries(colorfulData, legend) {
    var seriesData = [];
    var seriesItemObj = {};
    var itemDataObj = {};
    var itemValue = [];
    for (var k = 0; k < colorfulData.length; k++) {
      itemValue = colorfulData[k].value;
      for (var x = 0; x < itemValue.length; x++) {
        if (typeof itemDataObj[itemValue[x].name] === 'undefined') {
          itemDataObj[itemValue[x].name] = [];
        }
        itemDataObj[itemValue[x].name].push(itemValue[x].value);
      }
    }
    for (var i = 0, l = legend.length; i < l; i++) {
      seriesItemObj = {};
      seriesItemObj.name = legend[i];
      seriesItemObj.type = 'bar';
      seriesItemObj.stack = 'stack';
      // 深拷贝
      seriesItemObj.data = itemDataObj[legend[i]];
      seriesData.push(seriesItemObj);
    }
    return seriesData;
  }

  export default {
    data() {
      return {
        deviceTotalNum: 0,
        lineTotalNum: 0,
        subTopoId: '',
        chart: {
          name: 'chart',
          type: 'statRingChart',
          height: '300px',
          width: '100%',
          data: []
        },
        chart1: {
          name: 'chart1',
          type: 'rainbowBarChart',
          height: '300px',
          width: '100%',
          data: [],
          option: config
        },
        isChart2Display: 1,
        chart2: {
          name: 'chart2',
          type: 'colorfulBarChart',
          width: '100%',
          height: '300px',
          data: [],
          option: {}
        },
        chart3: {
          name: 'chart3',
          type: 'colorfulBarChart',
          width: '100%',
          height: '300px',
          data: [],
          option: {}
        },
        boxCardHeight: 360,
        tableData: [],
        dateFlag: 1
      }
    },
    watch: {
      dateFlag: function (val, oldVal) {
        countTopoviewByDateAndLevel(this.subTopoId, val).then((data) => {
          if (this.isChart2Display === 1) {
            this.chart2 = this.getChart2Data(data);
          } else {
            this.chart3 = this.getChart2Data(data);
          }
        });
      }
    },
    mounted() {
      if (this.$route.params.id) {
        this.subTopoId = this.$route.params.id;
      } else {
        this.subTopoId = 'thetopmenu0000000000000000000000';
      }
      countTopoviewNodeAndLine(this.subTopoId).then((data) => {
        this.deviceTotalNum = data[0];
        this.lineTotalNum = data[1];
      });
      countTopoviewItcompByCitypecategory(this.subTopoId).then((data) => {
        this.chart = this.getChartData(data);
      });
      countTopoviewItcompByStatus(this.subTopoId).then((data) => {
        this.chart1 = this.getChart1Data(data);
      });
      countTopoviewByDateAndLevel(this.subTopoId, this.dateFlag).then((data) => {
        this.chart2 = this.getChart2Data(data);
      });
      countTopoviewItcompByIncidentAssetCount(this.subTopoId).then((data) => {
        this.tableData = data;
      });
    },
    methods: {
      changeChart2(type) {
        this.isChart2Display = type;
        this.dateFlag = type
      },
      getChartData(data) {
        return {
          name: 'chart',
          type: 'statRingChart',
          height: '300px',
          width: '100%',
          data: data
        };
      },
      getChart1Data(data) {
        return {
          name: 'chart1',
          type: 'rainbowBarChart',
          height: '300px',
          width: '100%',
          data: data,
          option: config
        };
      },
      getOptions(data) {
        if (data.length === 0) {
          return {};
        }
        let legend = data[0].value.map(item => {
          return item.name;
        });
        let colorList = getChartColorList(legend);
        let options = {
          color: colorList,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b}<br/>{a0}:{c0}<br/>{a1}:{c1}<br/>{a2}:{c2}<br/>{a3}:{c3}<br/>{a4}:{c4}<br/>{a5}:{c5}<br/>{a6}:{c6}'
          },
          legend: {
            orient: 'vertical',
            x: 'right',
            data: legend
          },
          calculable: true,
          xAxis: [{
            type: 'category',
            splitLine: {
              show: false
            },
            data: data.map(item => {
              return item.name;
            })
          }],
          series: getColorFulBarSeries(data, legend)
        };
        console.log(JSON.stringify(options))
        return options;
      },
      getChart2Data(barData) {
        return {
          name: 'chart2',
          type: 'colorfulBarChart',
          width: '100%',
          height: '300px',
          data: barData,
          option: this.getOptions(barData)
        };
      }
    }
  }
</script>
<style>
  .statistics.content{
    width: 100%;
    display: block;
  }
  .statistics .statisticsTable{
    width: 83px;
    height: 61px;
    margin-top: 5px;
    position: relative;
    top: 5px;
    left: 5px;
  }
  .statistics .statTable{
    width: 100%;
    border-width: 2px;
  }
  .statistics .statTable tr{
    height: 30px;
  }
  .statistics .statTable tr td{
    text-align: center;
  }
  .statistics .btnline{
    margin-top: 10px;
  }
</style>
