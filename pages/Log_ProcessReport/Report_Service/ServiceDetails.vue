<template>
  <div class="change1">
    <section class="reportTop noPrint">
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
      <s-row style="margin: 15px 0 10px;">
        <s-button icon="printer" @click="print()">打印</s-button>
        <s-button icon="excel" @click="exportButton()">Excel报表</s-button>
      </s-row>
      <s-card ref="card" style="margin-bottom: 20px">
        <div style="display: flex">
          <div style="width: 400px">
            <s-chart :chart="chart1"></s-chart>
          </div>
          <div style="flex: 1">
            <s-table
              style="margin: 0 10% 0 10%; width: 90%"
              :data="tableDataA">
              <s-table-column
                prop="assorment"
                label="请求分类一级">
              </s-table-column>
              <s-table-column
                prop="count"
                label="数量">
              </s-table-column>
              <s-table-column
                prop="percent"
                label="占比">
              </s-table-column>
            </s-table>
          </div>
        </div>
      </s-card>
      <s-table
        :data="tableDataB"
        max-height="300">
        <s-table-column
          prop="serialCode"
          label="请求单号">
          <template slot-scope="scope">
            <a @click="goDetail(scope.row.uuid)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.serialCode }}</a>
            <span v-else>{{ scope.row.serialCode }}</span>
          </template>
        </s-table-column>
        <s-table-column
          prop="briefDesc"
          label="简要描述">
        </s-table-column>
        <s-table-column
          prop="endUserName"
          label="最终用户姓名">
        </s-table-column>
        <s-table-column
          prop="categoryFirstName"
          label="请求分类一级">
        </s-table-column>
        <s-table-column
          prop="categorySecondName"
          label="请求分类二级">
        </s-table-column>
        <s-table-column
          prop="categoryThirdName"
          label="请求分类三级">
        </s-table-column>
        <s-table-column
          label="优先级">
          <template slot-scope="scope">
            <span v-if="scope.row.priority === 1">重大</span>
            <span v-if="scope.row.priority === 2">高</span>
            <span v-if="scope.row.priority === 3">中</span>
            <span v-if="scope.row.priority === 4">低</span>
          </template>
        </s-table-column>
        <s-table-column
          prop="application"
          label="应用系统">
        </s-table-column>
        <s-table-column
          prop="managerUserName"
          label="请求管理员">
        </s-table-column>
        <s-table-column
          prop="assigneUserName"
          label="请求受派者">
        </s-table-column>
        <s-table-column
          prop="statusName"
          label="状态">
        </s-table-column>
        <s-table-column
          prop="createTime"
          label="提交时间">
        </s-table-column>
      </s-table>
    </section>
    <div class="down-content print_field noShow">
      <section ref="print">
        <h1 class="noShow">按发布管理详细信息</h1>
        <s-card ref="card" style="margin-bottom: 20px">
          <div style="display: flex">
            <div style="width: 400px">
              <s-chart :chart="chart2"></s-chart>
            </div>
            <div style="flex: 1">
              <s-table
                style="margin: 0 10% 0 10%; width: 90%"
                :data="tableDataA">
                <s-table-column
                  prop="assorment"
                  label="请求分类一级">
                </s-table-column>
                <s-table-column
                  prop="count"
                  label="数量">
                </s-table-column>
                <s-table-column
                  prop="percent"
                  label="占比">
                </s-table-column>
              </s-table>
            </div>
          </div>
        </s-card>
        <s-table
          :data="tableDataB"
          max-height="300">
          <s-table-column
            width="160px"
            prop="serialCode"
            label="请求单号">
            <template slot-scope="scope">
              <a @click="goDetail(scope.row.uuid)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.serialCode }}</a>
              <span v-else>{{ scope.row.serialCode }}</span>
            </template>
          </s-table-column>
          <s-table-column
            prop="briefDesc"
            label="简要描述">
          </s-table-column>
          <s-table-column
            prop="endUserName"
            label="最终用户姓名">
          </s-table-column>
          <s-table-column
            prop="categoryFirstName"
            label="请求分类一级">
          </s-table-column>
          <s-table-column
            prop="categorySecondName"
            label="请求分类二级">
          </s-table-column>
          <s-table-column
            prop="categoryThirdName"
            label="请求分类三级">
          </s-table-column>
          <s-table-column
            label="优先级">
            <template slot-scope="scope">
              <span v-if="scope.row.priority === 1">重大</span>
              <span v-if="scope.row.priority === 2">高</span>
              <span v-if="scope.row.priority === 3">中</span>
              <span v-if="scope.row.priority === 4">低</span>
            </template>
          </s-table-column>
          <s-table-column
            prop="application"
            label="应用系统">
          </s-table-column>
          <s-table-column
            prop="managerUserName"
            label="请求管理员">
          </s-table-column>
          <s-table-column
            prop="assigneUserName"
            label="请求受派者">
          </s-table-column>
          <s-table-column
            prop="statusName"
            label="状态">
          </s-table-column>
          <s-table-column
            prop="createTime"
            label="提交时间">
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
        hasProcessCenter: true, // 是否有流程模块
        startTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        endTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        value: '',
        chart1: {
          name: 'chart',
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
      // 判断是否有流程模块
      let firstMenu = this.$store.getters.firstMenu;
      firstMenu = firstMenu.filter(item => {
        return item.keyWord === 'processCenter';
      });
      if (firstMenu.length <= 0) {
        this.hasProcessCenter = false
      }
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
        $axios.post(`/itilReportCenter/getRequestReport/${16}`, params).then(({data}) => {
          this.chart1.data = data.charts || []
          this.chart2.data = data.charts || []
          this.tableDataA = data.tables
          console.log(data.resultOrders);
          this.tableDataB = data.resultOrders
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
            reportType: 16,
            exportType: 'excel',
            startTime: startTime,
            endTime: endTime
          }
          this.$confirm('确定将服务请求数据详情报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/itilReportCenter/exportItilReport`, param).then(res => {
              if (res.data === 'success') {
                Download(`/itilReportCenter/downItilReport/16/excel`)
              }
            })
          }).catch(() => {});
        }
      },
      goDetail(orderUuid) {
        this.$router.push('/ProcessCenter/requestServiceDetail/' + orderUuid);
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
