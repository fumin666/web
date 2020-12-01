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
      <s-row>
        <s-button icon="printer" @click="print()">打印</s-button>
        <s-button icon="excel" @click="exportButton()">Excel报表</s-button>
      </s-row>
      <div style="display: flex;">
        <div style="display: flex;flex: 1;border-right: 1px dashed rgba(0, 0, 0, 0.1);padding: 0 10px;">
          <s-card ref="card" style="margin-bottom: 20px;width: 100%;">
            <s-chart :chart="chart1" :click-fun="filterTableData1"></s-chart>
          </s-card>
        </div>
        <div style="display: flex;flex: 1;">
          <s-card ref="card" style="margin-bottom: 20px;width: 100%;border-right: 1px dashed rgba(0, 0, 0, 0.1);padding: 0 10px;">
            <s-chart :chart="chart2" :click-fun="filterTableData2"></s-chart>
          </s-card>
        </div>
        <div style="display: flex;flex: 1;">
          <s-card ref="card" style="margin-bottom: 20px;width: 100%;padding-left: 10px;">
            <s-chart :chart="chart3" :click-fun="filterTableData3"></s-chart>
          </s-card>
        </div>
      </div>
      <s-table
        :data="tableData"
        max-height="300">
        <s-table-column prop="serialCode" label="发布单号" show-overflow-tooltip>
          <template slot-scope="scope">
            <a @click="goDetail(scope.row)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.serialCode }}</a>
            <span v-else>{{ scope.row.serialCode }}</span>
          </template>
        </s-table-column>
        <s-table-column prop="briefDesc" label="简要描述" show-overflow-tooltip></s-table-column>
        <s-table-column prop="categoryFirstName" label="分类一级" show-overflow-tooltip></s-table-column>
        <s-table-column prop="categorySecondName" label="分类二级" show-overflow-tooltip></s-table-column>
        <s-table-column prop="categoryThirdName" label="分类三级" show-overflow-tooltip></s-table-column>
        <s-table-column prop="publishLevelName" label="发布分级" show-overflow-tooltip></s-table-column>
        <s-table-column prop="publishTypeName" label="发布类型" show-overflow-tooltip></s-table-column>
        <s-table-column prop="businessReasonName" label="业务理由" show-overflow-tooltip></s-table-column>
        <s-table-column prop="benefitPersonName" label="受益人姓名" show-overflow-tooltip></s-table-column>
        <s-table-column prop="createTime" label="提交时间" show-overflow-tooltip></s-table-column>
      </s-table>
    </section>
    <div class="down-content print_field noShow">
      <section ref="print" class="down-content print_field">
        <div style="display: flex;">
          <div style="display: flex;flex: 1;border-right: 1px dashed rgba(0, 0, 0, 0.1);padding: 0 10px;">
            <s-card ref="card" style="margin-bottom: 20px;width: 100%;">
              <s-chart :chart="chart4" :click-fun="filterTableData1"></s-chart>
            </s-card>
          </div>
          <div style="display: flex;flex: 1;">
            <s-card ref="card" style="margin-bottom: 20px;width: 100%;border-right: 1px dashed rgba(0, 0, 0, 0.1);padding: 0 10px;">
              <s-chart :chart="chart5" :click-fun="filterTableData2"></s-chart>
            </s-card>
          </div>
          <div style="display: flex;flex: 1;">
            <s-card ref="card" style="margin-bottom: 20px;width: 100%;padding-left: 10px;">
              <s-chart :chart="chart6" :click-fun="filterTableData3"></s-chart>
            </s-card>
          </div>
        </div>
        <s-table
          :data="tableData"
          max-height="300">
          <s-table-column width="160px" prop="serialCode" label="发布单号" show-overflow-tooltip>
            <template slot-scope="scope">
              <a @click="goDetail(scope.row)" href="javascript:;" v-if="hasProcessCenter" class="score-td">{{ scope.row.serialCode }}</a>
              <span v-else>{{ scope.row.serialCode }}</span>
            </template>
          </s-table-column>
          <s-table-column prop="briefDesc" label="简要描述" show-overflow-tooltip></s-table-column>
          <s-table-column prop="categoryFirstName" label="分类一级" show-overflow-tooltip></s-table-column>
          <s-table-column prop="categorySecondName" label="分类二级" show-overflow-tooltip></s-table-column>
          <s-table-column prop="categoryThirdName" label="分类三级" show-overflow-tooltip></s-table-column>
          <s-table-column prop="publishLevelName" label="发布分级" show-overflow-tooltip></s-table-column>
          <s-table-column prop="publishTypeName" label="发布类型" show-overflow-tooltip></s-table-column>
          <s-table-column prop="businessReasonName" label="业务理由" show-overflow-tooltip></s-table-column>
          <s-table-column prop="benefitPersonName" label="受益人姓名" show-overflow-tooltip></s-table-column>
          <s-table-column prop="createTime" label="提交时间" show-overflow-tooltip></s-table-column>
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
        publishStatus: {
          0: '草稿',
          1: '启动审批',
          2: '计划审批',
          3: '开发审批',
          4: '测试审批',
          5: '部署审批',
          6: '关闭审批',
          7: '进行中',
          8: '待决',
          9: '已完成',
          10: '已拒绝',
          11: '已取消',
          12: '已关闭'
        },
        chart1: {
          name: '重大发布',
          type: 'colorfulBarChart',
          width: '100%',
          height: '300px',
          option: {
            title: {
              text: '重大发布',
              x: 'center',
              textStyle: {
                color: '#000'
              }
            },
            grid: {
              left: '0%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: false
            },
            dataZoom: {
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 25, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 100 // 结束位置（共100等份）
            }
          },
          data: []
        },
        chart2: {
          name: '常规发布',
          type: 'colorfulBarChart',
          width: '100%',
          height: '300px',
          option: {
            title: {
              text: '常规发布',
              x: 'center',
              textStyle: {
                color: '#000'
              }
            },
            grid: {
              left: '0%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: false
            },
//            series: [
//              {
//                name: '常规发布',
//                type: 'bar',
//                barWidth: '40%'
//              }
//            ],
            dataZoom: {
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 25, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 100 // 结束位置（共100等份）
            }
          },
          data: []
        },
        chart3: {
          name: '紧急发布',
          type: 'colorfulBarChart',
          width: '100%',
          height: '300px',
          option: {
            title: {
              text: '紧急发布',
              x: 'center',
              textStyle: {
                color: '#000'
              }
            },
            grid: {
              left: '0%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: false
            },
            dataZoom: {
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 25, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 100 // 结束位置（共100等份）
            }
          },
          data: []
        },
        chart4: {
          name: '重大发布1',
          type: 'colorfulBarChart',
          width: '200px',
          height: '300px',
          option: {
            title: {
              text: '重大发布',
              x: 'center',
              textStyle: {
                color: '#000'
              }
            },
            grid: {
              left: '0%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: false
            },
            dataZoom: {
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 25, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 100 // 结束位置（共100等份）
            }
          },
          data: []
        },
        chart5: {
          name: '常规发布1',
          type: 'colorfulBarChart',
          width: '200px',
          height: '300px',
          option: {
            title: {
              text: '常规发布',
              x: 'center',
              textStyle: {
                color: '#000'
              }
            },
            grid: {
              left: '0%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: false
            },
//            series: [
//              {
//                name: '常规发布',
//                type: 'bar',
//                barWidth: '40%'
//              }
//            ],
            dataZoom: {
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 25, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 100 // 结束位置（共100等份）
            }
          },
          data: []
        },
        chart6: {
          name: '紧急发布1',
          type: 'colorfulBarChart',
          width: '200px',
          height: '300px',
          option: {
            title: {
              text: '紧急发布',
              x: 'center',
              textStyle: {
                color: '#000'
              }
            },
            grid: {
              left: '0%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            },
            legend: {
              show: false
            },
            dataZoom: {
              realtime: true, // 拖动滚动条时是否动态的更新图表数据
              height: 25, // 滚动条高度
              start: 0, // 滚动条开始位置（共100等份）
              end: 100 // 结束位置（共100等份）
            }
          },
          data: []
        }
      }
    },
    mounted() {
      let mainTheme = localStorage.getItem('theme') || 'fanta'
      this.getTheme(mainTheme)
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
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    methods: {
      getTheme(val) {
        let vm = this
        if (val === 'dark') {
          vm.chart1.option.title.textStyle.color = '#fff'
          vm.chart2.option.title.textStyle.color = '#fff'
          vm.chart3.option.title.textStyle.color = '#fff'
          vm.chart4.option.title.textStyle.color = '#fff'
          vm.chart5.option.title.textStyle.color = '#fff'
          vm.chart6.option.title.textStyle.color = '#fff'
        } else {
          vm.chart1.option.title.textStyle.color = '#000'
          vm.chart2.option.title.textStyle.color = '#000'
          vm.chart3.option.title.textStyle.color = '#000'
          vm.chart4.option.title.textStyle.color = '#000'
          vm.chart5.option.title.textStyle.color = '#000'
          vm.chart6.option.title.textStyle.color = '#000'
        }
      },
      getData() {
        let params = {
          startTime: parseInt(new Date(this.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.endTime).getTime() / 1000)
        }
        $axios.post(`/itilReportCenter/getPublishReport1/${13}`, params).then((res) => {
          let chartData = res.data.charData;
          this.tableData = res.data.orderList;
          this.filterData = res.data.orderList;
          for (let i in chartData) {
            switch (i) {
              case '重大发布':
                let arrOne = [];
                for (let j in chartData[i]) {
                  let param = {};
                  param.name = j;
                  param.value = chartData[i][j];
                  arrOne.push(param);
                }
                this.chart1.data = arrOne;
                this.chart4.data = arrOne;
                break;
              case '常规发布':
                let arrTwo = [];
                for (let j in chartData[i]) {
                  let param = {};
                  param.name = j;
                  param.value = chartData[i][j];
                  arrTwo.push(param);
                }
                this.chart2.data = arrTwo;
                this.chart5.data = arrTwo;
                break;
              case '紧急发布':
                let arrThree = [];
                for (let j in chartData[i]) {
                  let param = {};
                  param.name = j;
                  param.value = chartData[i][j];
                  arrThree.push(param);
                }
                this.chart3.data = arrThree;
                this.chart6.data = arrThree;
                break;
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
            reportType: 13,
            exportType: 'excel',
            startTime: startTime,
            endTime: endTime
          }
          this.$confirm('确定将发布管理详细信息报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/itilReportCenter/exportItilReport`, param).then(res => {
              if (res.data === 'success') {
                Download(`/itilReportCenter/downItilReport/13/excel`)
              }
            })
          }).catch(() => {});
        }
      },
      filterTableData1(obj) {
        let publishTypeName = this.chart1.name;
        let publishStatus = obj.name;
        for (let i in this.publishStatus) {
          if (this.publishStatus[i] === publishStatus) {
            publishStatus = i;
          }
        }
       this.tableData = this.filterData.filter(item => {
         if (item.publishLevelName === publishTypeName && item.publishStatus === parseInt(publishStatus)) {
           return item;
         }
       })
      },
      filterTableData2(obj) {
        let publishTypeName = this.chart2.name;
        let publishStatus = obj.name;
        for (let i in this.publishStatus) {
          if (this.publishStatus[i] === publishStatus) {
            publishStatus = i;
          }
        }
        this.tableData = this.filterData.filter(item => {
          if (item.publishLevelName === publishTypeName && item.publishStatus === parseInt(publishStatus)) {
            return item;
          }
        })
      },
      filterTableData3(obj) {
        let publishTypeName = this.chart3.name;
        let publishStatus = obj.name;
        for (let i in this.publishStatus) {
          if (this.publishStatus[i] === publishStatus) {
            publishStatus = i;
          }
        }
        this.tableData = this.filterData.filter(item => {
          if (item.publishLevelName === publishTypeName && item.publishStatus === parseInt(publishStatus)) {
            return item;
          }
        })
      },
      goDetail(row) {
        this.$router.push('/ProcessCenter/publishDetail/' + row.orderUuid);
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
