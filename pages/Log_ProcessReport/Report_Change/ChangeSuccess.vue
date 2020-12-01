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
      <s-row>
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
                prop="closeCode"
                label="关闭代码">
              </s-table-column>
              <s-table-column
                prop="num"
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
          prop="orderCode"
          label="变更单号">
          <template slot-scope="scope">
            <a @click="goDetail(scope.row.orderUuid)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.orderCode }}</a>
            <span v-else>{{ scope.row.orderCode }}</span>
          </template>
        </s-table-column>
        <s-table-column
          prop="firstCate"
          label="分类一级">
        </s-table-column>
        <s-table-column
          prop="secondCate"
          label="分类二级">
        </s-table-column>
        <s-table-column
          prop="thirdCate"
          label="分类三级">
        </s-table-column>
        <s-table-column
          prop="state"
          label="状态">
        </s-table-column>
        <s-table-column
          prop="riskLevel"
          label="风险级别">
        </s-table-column>
        <s-table-column
          prop="manager"
          label="变更经理">
        </s-table-column>
        <s-table-column
          prop="admin"
          label="变更管理员">
        </s-table-column>
        <s-table-column
          prop="createTime"
          label="提交时间">
        </s-table-column>
        <s-table-column
          prop="briefDescr"
          label="简要描述">
        </s-table-column>
      </s-table>
    </section>
    <div class="down-content print_field noShow">
      <section ref="print">
        <h1 class="noShow">变更成功率统计</h1>
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
                  prop="closeCode"
                  label="关闭代码">
                </s-table-column>
                <s-table-column
                  prop="num"
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
            prop="orderCode"
            label="变更单号">
            <template slot-scope="scope">
              <a @click="goDetail(scope.row.orderUuid)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.orderCode }}</a>
              <span v-else>{{ scope.row.orderCode }}</span>
            </template>
          </s-table-column>
          <s-table-column
            prop="firstCate"
            label="分类一级">
          </s-table-column>
          <s-table-column
            prop="secondCate"
            label="分类二级">
          </s-table-column>
          <s-table-column
            prop="thirdCate"
            label="分类三级">
          </s-table-column>
          <s-table-column
            prop="state"
            label="状态">
          </s-table-column>
          <s-table-column
            prop="riskLevel"
            label="风险级别">
          </s-table-column>
          <s-table-column
            prop="manager"
            label="变更经理">
          </s-table-column>
          <s-table-column
            prop="admin"
            label="变更管理员">
          </s-table-column>
          <s-table-column
            prop="createTime"
            label="提交时间">
          </s-table-column>
          <s-table-column
            prop="briefDescr"
            label="简要描述">
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
          type: 'lineChart',
          width: '400px',
          height: '300px',
          data: []
        },
        chart2: {
          name: 'chart2',
          type: 'lineChart',
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
        $axios.post(`/itilReportCenter/getChangeReport/${9}`, params).then((res) => {
          this.chart1.data = res.data.statchart || []
          this.chart2.data = res.data.statchart || []
          this.tableDataA = res.data.statList
          this.tableDataB = res.data.detailList
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
            reportType: 9,
            exportType: 'excel',
            startTime: startTime,
            endTime: endTime
          }
          this.$confirm('确定将变更成功率统计报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/itilReportCenter/exportItilReport`, param).then(res => {
              if (res.data === 'success') {
                Download(`/itilReportCenter/downItilReport/9/excel`)
              }
            })
          }).catch(() => {});
        }
      },
      goDetail(orderUuid) {
        this.$router.push('/ProcessCenter/modifyDetail/' + orderUuid);
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
