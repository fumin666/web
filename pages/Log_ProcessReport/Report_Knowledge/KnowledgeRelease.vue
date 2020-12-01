<template>
  <div class="problem">
    <section class="reportTop noPrint">
      <s-form :inline="true" class="search_form" style="margin: 10px 0;">
        <div>
          <s-form-item>
            <s-select v-model="supportGroupUuid" placeholder="请选择支持组">
              <s-option v-for="(item, index) in supportGroupList" :label="item.groupName" :value="item.uuid" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item>
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
        <s-table
          :data="tableDataB"
          max-height="300">
          <s-table-column
            prop="userName"
            label="组成员姓名">
          </s-table-column>
          <s-table-column
            prop="createCount"
            label="提交的知识单总数">
          </s-table-column>
          <s-table-column
            prop="publishCount"
            label="已发布的知识单总数">
          </s-table-column>
          <s-table-column
            prop="cancelCount"
            label="已取消的知识单总数">
          </s-table-column>
        </s-table>
      </s-card>
      <s-row>
        <s-col :span="8">
          <span class="echartTitle">提交占比率</span>
          <div>
            <s-chart :chart="chart1"></s-chart>
          </div>
        </s-col>
        <s-col :span="8">
          <span>发布占比率</span>
          <div>
            <s-chart :chart="chart2"></s-chart>
          </div>
        </s-col>
        <s-col :span="8">
          <span>取消占比率</span>
          <div>
            <s-chart :chart="chart3"></s-chart>
          </div>
        </s-col>
      </s-row>
      <s-table
        :data="tableDataA">
        <s-table-column
          prop="userName"
          label="组成员姓名">
        </s-table-column>
        <s-table-column
          prop="createRate"
          label="提交的知识单占比">
        </s-table-column>
        <s-table-column
          prop="publishRate"
          label="已发布的知识单占比">
        </s-table-column>
        <s-table-column
          prop="cancelRate"
          label="已取消的知识单占比">
        </s-table-column>
      </s-table>
    </section>
    <div class="down-content print_field noShow">
      <section ref="print">
        <h1>知识库发布率统计</h1>
        <s-card ref="card" style="margin-bottom: 20px">
          <s-table
            :data="tableDataB"
            max-height="300">
            <s-table-column
              prop="userName"
              label="组成员姓名">
            </s-table-column>
            <s-table-column
              prop="createCount"
              label="提交的知识单总数">
            </s-table-column>
            <s-table-column
              prop="publishCount"
              label="已发布的知识单总数">
            </s-table-column>
            <s-table-column
              prop="cancelCount"
              label="已取消的知识单总数">
            </s-table-column>
          </s-table>
        </s-card>
        <s-row>
          <s-col :span="8">
            <span class="echartTitle">提交占比率</span>
            <div>
              <s-chart :chart="chart4"></s-chart>
            </div>
          </s-col>
          <s-col :span="8">
            <span>发布占比率</span>
            <div>
              <s-chart :chart="chart5"></s-chart>
            </div>
          </s-col>
          <s-col :span="8">
            <span>取消占比率</span>
            <div>
              <s-chart :chart="chart6"></s-chart>
            </div>
          </s-col>
        </s-row>
        <s-table
          :data="tableDataA">
          <s-table-column
            prop="userName"
            label="组成员姓名">
          </s-table-column>
          <s-table-column
            prop="createRate"
            label="提交的知识单占比">
          </s-table-column>
          <s-table-column
            prop="publishRate"
            label="已发布的知识单占比">
          </s-table-column>
          <s-table-column
            prop="cancelRate"
            label="已取消的知识单占比">
          </s-table-column>
        </s-table>
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
        supportGroupUuid: '',
        supportGroupList: [],
        value: '',
        chart1: {
          name: 'chart1',
          type: 'pieChart',
          width: '400px',
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
          type: 'pieChart',
          width: '400px',
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
        chart5: {
          name: 'chart5',
          type: 'pieChart',
          width: '400px',
          height: '300px',
          data: []
        },
        chart6: {
          name: 'chart6',
          type: 'pieChart',
          width: '400px',
          height: '300px',
          data: []
        },
        tableDataA: [],
        tableDataB: [],
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
      this.getSelect()
      this.getData()
      this.getDateRangeStart(this.startTime)
      this.getDateRangeEnd(this.endTime)
    },
    methods: {
      getSelect() {
        $axios.get(`/itilWorkflowConfig/getAllSupportGroupCointainDelete`).then((res) => {
          this.supportGroupList = res.data
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
          endTime: parseInt(new Date(this.endTime).getTime() / 1000),
          supportGroupUuid: this.supportGroupUuid
        }
        $axios.post(`/itilReportCenter/getKnowledgeReport/${11}`, params).then((res) => {
          this.chart1.data = res.data.createRateChart || []
          this.chart2.data = res.data.publishedRateChart || []
          this.chart3.data = res.data.canceledRateChart || []
          this.chart4.data = res.data.createRateChart || []
          this.chart5.data = res.data.publishedRateChart || []
          this.chart6.data = res.data.canceledRateChart || []
          this.tableDataA = res.data.publishRateList
          this.tableDataB = res.data.publishCountList
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
            reportType: 11,
            exportType: 'excel',
            startTime: startTime,
            endTime: endTime,
            supportGroupUuid: this.supportGroupUuid
          }
          this.$confirm('确定将知识库发布率统计报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/itilReportCenter/exportItilReport`, param).then(res => {
              if (res.data === 'success') {
                Download(`/itilReportCenter/downItilReport/11/excel`)
              }
            })
          }).catch(() => {});
        }
      }
    }
  }
</script>
<style lang="stylus">
  .problem1
    .Problembutton
      margin-right: 10px

  @media print {
  width: 1000px
  }
</style>
