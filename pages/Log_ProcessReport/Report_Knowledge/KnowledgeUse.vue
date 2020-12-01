<template>
  <div class="event1">
    <section class="reportTop noPrint">
      <s-form :inline="true" class="search_form" style="margin: 10px 0;">
        <div>
          <s-form-item label="创建时间：">
            <s-date-picker
              type="datetime"
              placeholder="选择开始时间"
              v-model="startTime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="disableAfterToday1"
              @change="getDateRangeStart"
              style="width:100%"
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
              style="width:100%">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="generate()">查询</s-button>
        </div>
      </s-form>
      <s-row style="margin: 15px 0 10px">
        <s-button icon="printer" @click="print()">打印</s-button>
        <s-button icon="excel" @click="exportButton()">Excel报表</s-button>
      </s-row>
      <s-card ref="card" style="margin-bottom: 20px">
        <div v-nodata="chart1.data.length === 0">
          <s-chart :chart="chart1"></s-chart>
        </div>
      </s-card>
      <div style="display: flex">
        <div style="width: 400px" v-nodata="chart2.data.length === 0">
          <s-chart :chart="chart2"></s-chart>
        </div>
        <div style="flex: 1">
          <s-table
            style="margin: 0 10% 0 10%; width: 90%"
            :data="tableDataA">
            <s-table-column
              prop="orderType"
              label="流程">
            </s-table-column>
            <s-table-column
              prop="count"
              label="数量">
            </s-table-column>
            <s-table-column
              prop="rate"
              label="占比">
            </s-table-column>
          </s-table>
        </div>
      </div>
    </section>
    <div class="down-content print_field noShow">
      <section ref="print">
        <h1>知识库使用率统计</h1>
        <s-card ref="card" style="margin-bottom: 20px">
          <div>
            <s-chart :chart="chart3"></s-chart>
          </div>
        </s-card>
        <div style="display: flex">
          <div style="width: 400px">
            <s-chart :chart="chart4"></s-chart>
          </div>
          <div style="flex: 1">
            <s-table
              style="margin: 0 10% 0 10%; width: 90%"
              :data="tableDataA">
              <s-table-column
                prop="orderType"
                label="流程">
              </s-table-column>
              <s-table-column
                prop="count"
                label="数量">
              </s-table-column>
              <s-table-column
                prop="rate"
                label="占比">
              </s-table-column>
            </s-table>
          </div>
        </div>
      </section>
      <iframe frameborder="0" scrolling="no" ref="printTaskIframe" id="printTaskIframe"></iframe>
    </div>
  </div>
</template>

<script type="text/babel">
  // import html2canvas from 'html2canvas'
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    data () {
      return {
        startTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        chart1: {
          name: 'chart1',
          type: 'rainbowBarChart',
          width: '100%',
          height: '300px',
          data: []
        },
        chart2: {
          name: 'chart2',
          type: 'pieChart',
          width: '400px',
          height: '300px',
          data: []
        },
        chart3: {
          name: 'chart3',
          type: 'rainbowBarChart',
          width: '700px',
          height: '300px',
          data: []
        },
        chart4: {
          name: 'chart4',
          type: 'pieChart',
          width: '400px',
          height: '300px',
          data: []
        },
        tableDataA: [],
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        }
      }
    },
    mounted() {
      this.getData()
      this.getDateRangeStart(this.startTime)
      this.getDateRangeEnd(this.endTime)
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
        this.$refs.printTaskIframe.contentWindow.document.body.appendChild(this.$refs.print)
        this.$refs.printTaskIframe.contentWindow.print()
      },
      getData() {
        let params = {
          startTime: parseInt(new Date(this.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.endTime).getTime() / 1000)
        }
        $axios.post(`/itilReportCenter/getKnowledgeReport/${12}`, params).then((res) => {
          this.chart1.data = res.data.citeRateHistogramChart || []
          this.chart3.data = res.data.citeRateHistogramChart || []
          this.chart2.data = res.data.citeRatePieChart || []
          this.chart4.data = res.data.citeRatePieChart || []
          this.tableDataA = res.data.citeRateList
        })
      },
      exportButton(name) {
        if (!this.startTime || !this.endTime) {
          this.$message({
            message: '请先选择时间',
            type: 'error'
          })
        } else {
          let startTime = parseInt(new Date(this.startTime).getTime() / 1000)
          let endTime = parseInt(new Date(this.endTime).getTime() / 1000)
          let param = {
            reportType: 12,
            exportType: 'excel',
            startTime: startTime,
            endTime: endTime
          }
          this.$confirm('确定将知识库使用率统计报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/itilReportCenter/exportItilReport`, param).then(res => {
              if (res.data === 'success') {
                Download(`/itilReportCenter/downItilReport/12/excel`)
              }
            })
          }).catch(() => {});
        }
      },
      goDetail(orderUuid) {
        this.$router.push('/ProcessCenter/knowDetail/' + orderUuid);
      }
    }
  }
</script>
<style lang="stylus">
  .event1
    .Eventbutton
      margin-right: 10px

  @media print {
  width: 1000px
  }
</style>
