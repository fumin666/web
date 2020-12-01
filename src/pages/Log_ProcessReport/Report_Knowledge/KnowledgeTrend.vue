<template>
  <div class="change1">
    <section class="reportTop noPrint">
      <s-form :inline="true" class="search_form" style="margin: 10px 0;">
        <div>
          <s-form-item label="提交时间：">
            <s-date-picker
              type="month"
              placeholder="选择开始时间"
              v-model="monthTime"
              :editable="false"
              value-format="yyyy-MM"
              format="yyyy-MM"
              style="width: 100%"
            >
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
      <s-table
        :data="tableDataB"
        max-height="300">
        <s-table-column
          prop="orderCode"
          label="编号">
          <template slot-scope="scope">
            <a @click="goDetail(scope.row.orderUuid)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.orderCode }}</a>
            <span v-else>{{ scope.row.orderCode }}</span>
          </template>
        </s-table-column>
        <s-table-column
          prop="knowledgeTitle"
          label="知识库标题">
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
          prop="knowledgeType"
          label="知识库类别">
        </s-table-column>
        <s-table-column
          prop="knowledgeVersion"
          label="版本">
        </s-table-column>
        <s-table-column
          prop="author"
          label="作者">
        </s-table-column>
        <s-table-column
          prop="knwoledgeStatus"
          label="状态">
        </s-table-column>
        <s-table-column
          prop="citeTimes"
          label="引用次数">
        </s-table-column>
        <s-table-column
          prop="createTime"
          label="提交时间">
        </s-table-column>
      </s-table>
    </section>
    <div class="down-content print_field noShow">
      <section ref="print">
        <h1>知识库趋势统计</h1>
        <s-card ref="card" style="margin-bottom: 20px">
          <div>
            <s-chart :chart="chart2"></s-chart>
          </div>
        </s-card>
        <s-table
          :data="tableDataB"
          max-height="300">
          <s-table-column
            prop="orderCode"
            label="编号">
            <template slot-scope="scope">
              <a @click="goDetail(scope.row.orderUuid)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.orderCode }}</a>
              <span v-else>{{ scope.row.orderCode }}</span>
            </template>
          </s-table-column>
          <s-table-column
            prop="knowledgeTitle"
            label="知识库标题">
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
            prop="knowledgeType"
            label="知识库类别">
          </s-table-column>
          <s-table-column
            prop="knowledgeVersion"
            label="版本">
          </s-table-column>
          <s-table-column
            prop="author"
            label="作者">
          </s-table-column>
          <s-table-column
            prop="knwoledgeStatus"
            label="状态">
          </s-table-column>
          <s-table-column
            prop="citeTimes"
            label="引用次数">
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
        monthTime: `${new Date().getFullYear()}-${1 + new Date().getMonth()}`,
        value: '',
        chart1: {
          name: 'chart',
          type: 'rainbowBarChart',
          width: '100%',
          height: '300px',
          data: []
        },
        chart2: {
          name: 'chart2',
          type: 'rainbowBarChart',
          width: '700px',
          height: '300px',
          data: []
        },
        tableDataB: []
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
    },
    methods: {
      print() {
        this.$refs.printTaskIframe.contentWindow.document.body.appendChild(this.$refs.print)
        this.$refs.printTaskIframe.contentWindow.print()
      },
      generate() {
        if (!this.monthTime) {
          this.$message({
            message: '请先选择时间',
            type: 'error'
          })
        } else {
          this.getData()
        }
      },
      getData() {
        let monthTime = parseInt(new Date(this.monthTime).getTime() / 1000)
        $axios.post(`/itilReportCenter/getKnowledgeReport/10`, {monthTime: monthTime}).then((res) => {
          this.chart1.data = res.data.countTrendChart || []
          this.chart2.data = res.data.countTrendChart || []
          this.tableDataB = res.data.countTrendList
        })
      },
      exportButton(name) {
        if (!this.monthTime) {
          this.$message({
            message: '请先选择时间',
            type: 'error'
          })
        } else {
          let monthTime = parseInt(new Date(this.monthTime).getTime() / 1000)
          let param = {
            reportType: 10,
            exportType: 'excel',
            monthTime: monthTime
          }
          this.$confirm('确定将知识库趋势统计总数报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/itilReportCenter/exportItilReport`, param).then(res => {
              if (res.data === 'success') {
                Download(`/itilReportCenter/downItilReport/10/excel`)
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
  .change1
    .Changebutton
      margin-right: 10px

  @media print {
  width: 1000px
  }
</style>
