<template>
  <div class="change1">
    <section class="reportTop noPrint" style="display: flex;">
      <s-radio-group v-model="activeTab" size="small" style="padding-top: 5px;margin-right: 20px;">
        <s-radio-button label="6">最近半年</s-radio-button>
        <s-radio-button label="3">最近3个月</s-radio-button>
        <s-radio-button label="1">最近1个月</s-radio-button>
      </s-radio-group>
      <s-form :inline="true" class="search_form" style="margin: 10px 0;">
        <div>
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
              style="width: 100%"
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
              @change="getDateRangeEnd"
              style="width: 100%">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="generate()">查询</s-button>
        </div>
      </s-form>
    </section>
    <s-row>
      <s-button icon="printer" @click="print()">打印</s-button>
      <s-button icon="excel" @click="exportButton()">Excel报表</s-button>
    </s-row>
    <div style="display: flex;">
      <div style="display: flex;flex: 1;">
        <s-card ref="card" style="margin-bottom: 20px;width: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
          <s-chart :chart="chart" :click-fun="filterTableData"></s-chart>
        </s-card>
      </div>
    </div>
    <s-table
      :data="tableData"
      max-height="300">
      <s-table-column prop="serialCode" label="发布单号">
        <template slot-scope="scope">
          <a @click="goDetail(scope.row)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.serialCode }}</a>
          <span v-else>{{ scope.row.serialCode }}</span>
        </template>
      </s-table-column>
      <s-table-column prop="briefDesc" label="简要描述"></s-table-column>
      <s-table-column prop="categoryFirstName" label="分类一级"></s-table-column>
      <s-table-column prop="categorySecondName" label="分类二级"></s-table-column>
      <s-table-column prop="categoryThirdName" label="分类三级"></s-table-column>
      <s-table-column prop="publishLevelName" label="发布分级"></s-table-column>
      <s-table-column prop="publishTypeName" label="发布类型"></s-table-column>
      <s-table-column prop="businessReasonName" label="业务理由"></s-table-column>
      <s-table-column prop="benefitPersonName" label="受益人姓名"></s-table-column>
      <s-table-column prop="createTime" label="提交时间"></s-table-column>
    </s-table>
    <div class="down-content print_field noShow">
      <section ref="print" class="down-content print_field">
        <div style="display: flex;">
          <div style="display: flex;flex: 1;">
            <s-card ref="card" style="margin-bottom: 20px;width: 100%;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
              <s-chart :chart="chart1" :click-fun="filterTableData"></s-chart>
            </s-card>
          </div>
        </div>
        <s-table
          :data="tableData"
          max-height="300">
          <s-table-column prop="serialCode" label="发布单号">
            <template slot-scope="scope">
              <a @click="goDetail(scope.row)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.serialCode }}</a>
              <span v-else>{{ scope.row.serialCode }}</span>
            </template>
          </s-table-column>
          <s-table-column prop="briefDesc" label="简要描述"></s-table-column>
          <s-table-column prop="categoryFirstName" label="分类一级"></s-table-column>
          <s-table-column prop="categorySecondName" label="分类二级"></s-table-column>
          <s-table-column prop="categoryThirdName" label="分类三级"></s-table-column>
          <s-table-column prop="publishLevelName" label="发布分级"></s-table-column>
          <s-table-column prop="publishTypeName" label="发布类型"></s-table-column>
          <s-table-column prop="businessReasonName" label="业务理由"></s-table-column>
          <s-table-column prop="benefitPersonName" label="受益人姓名"></s-table-column>
          <s-table-column prop="createTime" label="提交时间"></s-table-column>
        </s-table>
      </section>
      <iframe frameborder="0" scrolling="no" ref="printTaskIframe" id="printTaskIframe"></iframe>
    </div>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    data () {
      return {
        hasProcessCenter: true, // 是否有流程模块
        activeTab: '',
        startTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        tableData: [],
        filterData: [],
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
        chart: {
          name: 'chart',
          type: 'colorfulBarChart',
          width: '100%',
          height: '300px',
          option: {
            yAxis: [
              {
                name: '数量'
              }
            ],
            grid: {
              left: '0%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: false
            },
            series: [
              {
                type: 'bar',
                barWidth: '40%',
                label: {show: true}
              }
            ]
          },
          data: []
        },
        chart1: {
          name: 'chart1',
          type: 'colorfulBarChart',
          width: '800px',
          height: '300px',
          option: {
            yAxis: [
              {
                name: '数量'
              }
            ],
            grid: {
              left: '0%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: false
            },
            series: [
              {
                type: 'bar',
                barWidth: '40%',
                label: {show: true}
              }
            ]
          },
          data: []
        }
      }
    },
    mounted() {
      // 判断是否有流程模块
      let firstMenu = this.$store.getters.firstMenu;
      firstMenu = firstMenu.filter(item => {
        return item.keyWord === 'processCenter';
      });
      if (firstMenu.length <= 0) {
        this.hasProcessCenter = false
      }
      this.getData();
      this.getDateRangeStart(this.startTime)
      this.getDateRangeEnd(this.endTime)
    },
    methods: {
      getData() {
        let params = {
          startTime: parseInt(new Date(this.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.endTime).getTime() / 1000)
        }
        $axios.post(`/itilReportCenter/getPublishReport3/${15}`, params).then((res) => {
          let chartData = res.data.chartData;
          this.tableData = res.data.orderList;
          this.filterData = res.data.orderList;
          let newArr = [];
          for (let i in chartData) {
            let param = {};
            param.name = i;
            param.value = chartData[i];
            newArr.push(param);
          }
          this.chart = {
            name: 'chart',
            type: 'colorfulBarChart',
            width: '100%',
            height: '300px',
            option: {
              yAxis: [
                {
                  name: '数量'
                }
              ],
              grid: {
                left: '0%',
                right: '4%',
                bottom: '15%',
                containLabel: true
              },
              legend: {
                show: false
              },
              series: [
                {
                  type: 'bar',
                  barWidth: '40%',
                  label: {show: true}
                }
              ]
            },
            data: newArr
          }
          this.chart1 = {
            name: 'chart1',
            type: 'colorfulBarChart',
            width: '800px',
            height: '300px',
            option: {
              yAxis: [
                {
                  name: '数量'
                }
              ],
              grid: {
                left: '0%',
                right: '4%',
                bottom: '15%',
                containLabel: true
              },
              legend: {
                show: false
              },
              series: [
                {
                  type: 'bar',
                  barWidth: '40%',
                  label: {show: true}
                }
              ]
            },
            data: newArr
          }
        })
      },
      filterTableData(obj) {
        let filterName = obj.seriesName;
        let newArr = [];
        for (let i in this.filterData) {
          if (this.filterData[i].businessReasonName === filterName) {
            newArr.push(this.filterData[i])
          }
        }
        this.tableData = newArr;
      },
      getPublishReport(type) {
        $axios.get('/itilReportCenter/getPublishReport4/' + type).then((res) => {
          let chartData = res.data.chartData;
          this.tableData = res.data.orderList;
          let mapArr = Object.keys(chartData);
          let newArr = chartData[mapArr[0]];
          let newData = [];
          for (let i in newArr) {
            let param = {};
            param['date'] = i;
            for (let j in chartData) {
              param[j] = chartData[j][i];
            }
            newData.push(param);
          }
          this.chart = {
            name: 'chart3',
            type: 'multilineChart',
            width: '800px',
            height: '300px',
            data: {
              data: newData
            }
          }
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
      },
      generate() {
        if (!this.startTime || !this.endTime) {
          this.$message({
            message: '请先选择时间',
            type: 'error'
          })
        } else {
          this.activeTab = '';
          this.getData()
        }
      },
      print() {
        this.$refs.printTaskIframe.contentWindow.document.body.appendChild(this.$refs.print)
        this.$refs.printTaskIframe.contentWindow.print()
      },
      exportButton() {
        if (!this.startTime || !this.endTime) {
          this.$message({
            message: '请先选择时间',
            type: 'error'
          })
        } else {
          let startTime = parseInt(new Date(this.startTime).getTime() / 1000)
          let endTime = parseInt(new Date(this.endTime).getTime() / 1000)
          let param = {
            reportType: 15,
            exportType: 'excel',
            startTime: startTime,
            endTime: endTime
          }
          this.$confirm('确定将发布管理趋势分析报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/itilReportCenter/exportItilReport`, param).then(res => {
              if (res.data === 'success') {
                Download(`/itilReportCenter/downItilReport/15/excel`)
              }
            })
          }).catch(() => {});
        }
      },
      goDetail(row) {
        this.$router.push('/ProcessCenter/publishDetail/' + row.orderUuid);
      }
    },
    watch: {
      activeTab: {
        handler: function (val) {
          if (val !== '') {
            this.getPublishReport(val);
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
  .change1
    .Changebutton
      margin-right: 10px

  @media print {
  width: 1000px
  }
</style>
