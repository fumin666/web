<template>
  <s-dialog
    class="mont"
    v-model="dialogFlag"
    v-if="dialogFlag"
    width="800px"
    append-to-body
    title="业务服务分析">
    <s-scrollbar wrap-style="max-height: 600px;">
      <s-form :inline='true' class="search_form"  :model="analyForm" ref="analyForm" label-width='75px'>
        <div>
          <s-form-item label='业务服务：'>
            <s-select v-model="analyForm.businessUuidList" multiple collapse-tags>
              <s-option v-for='item in businessServiceList' :key='item.uuid' :label='item.name' :value='item.uuid'></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label='KPI指标：'>
            <s-select v-model="analyForm.analysisType" placeholder="请选择" style="width: 100%">
              <s-option label="可用率" value="available">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="查询时间：">
            <s-select v-model="analyForm.timeboundary" placeholder="请选择" style="width: 100%">
              <s-option label="近7天" value="7"></s-option>
              <s-option label="近14天" value="14"></s-option>
              <s-option label="近30天" value="30"></s-option>
              <s-option label="自定义" value=""></s-option>
            </s-select>
          </s-form-item>
          <s-form-item v-if="analyForm.timeboundary === ''" label="时间范围：">
            <s-date-picker
              v-model="analyForm.startTime"
              type="date"
              format="yyyy-MM-dd HH:mm:ss"
              @change="getDateRangeStart"
              placeholder="开始日期">
            </s-date-picker>
          </s-form-item>
          <s-form-item v-if="analyForm.timeboundary === ''" label=" ">
            <s-date-picker
              v-model="analyForm.endTime"
              type="date"
              format="yyyy-MM-dd HH:mm:ss"
              @change="getDateRangeEnd"
              placeholder="结束日期">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="search">查询</s-button>
        </div>
      </s-form>
      <div style="position:relative; width: 100%; height: 300px;">
        <!--echart Bug 待修复-->
        <s-chart :chart="chart" :clickFun="echartClick"></s-chart>
      </div>
      <s-table :data="assetData" style="margin-top:10px;" max-height=500>
        <s-table-column type="index" width="70" label="序号">
        </s-table-column>
        <s-table-column prop="businessName" show-overflow-tooltip label="业务服务名称">
        </s-table-column>
        <s-table-column prop="createTime" show-overflow-tooltip label="发生时间">
        </s-table-column>
        <s-table-column prop="status" show-overflow-tooltip label="级别">
          <template slot-scope="scope">
              <span v-if="scope.row.status === 3">正常</span>
              <span v-if="scope.row.status === 2">告警</span>
              <span v-if="scope.row.status === 1">异常</span>
              <span v-if="scope.row.status === 4">未知</span>
          </template>
        </s-table-column>
        <s-table-column prop="reason" show-overflow-tooltip label="根本原因">
        </s-table-column>
      </s-table>
      <s-row class="pageRow">
        <s-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="criteria1.currentPage"
          :page-size="criteria1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="criteria1.totalCount">
        </s-pagination>
      </s-row>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">保存</s-button>
      <s-button type="cancel" @click="dialogFlag = false">取消</s-button>
    </template>
  </s-dialog>
</template>
<style lang="stylus">
.mont
  .is-vertical
      margin-right: -15px;
</style>
<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        analyForm: {
          startTime: '',
          endTime: '',
          analysisType: 'available',
          timeboundary: '7',
          businessUuidList: []
        },
        dialogFlag: false,
        chart: {
          name: 'chart',
          type: 'multilineChart',
          width: '100%',
          height: '300px',
          data: {
            data: [],
            relation: {}
          },
          option: {
              yAxis: [
                    {
                      splitLine: {
                          lineStyle: {
                              type: 'dashed',
                              color: 'rgba(135,140,147,0.8)'
                          }
                      },
                      axisLine: {
                          show: false
                      }
                    }
                ],
              xAxis: [
                    {
                      'axisLabel': {
                          interval: 0,
                          rotate: '45'
                      }
                    }
                ]
          }
        },
        chartShow: false,
        criteria1: {                 // 真分页分页数据
          condition: {

            },
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        assetData: [],
        dataState: ''
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      businessServiceList: {
        type: Array,
        default: function () {
          return []
        }
      },
      busUuid: {
        type: Array
      }
    },
    methods: {
      echartClick(data) {
        this.dataState = data
        // 转换成当日的开始时间和结束时间
        function startUnix($date) {
            return (new Date(Date.parse($date.replace(/-/g, '/')))).getTime() / 1000;
        }
        function endUnix($date) {
            return new Date().setTime(Date.parse($date.replace(/-/g, '/')) / 1000 + 24 * 60 * 60 - 1);
        }
        this.criteria1.condition = Object.assign({}, this.analyForm)
        this.criteria1.condition.startTime = startUnix(data.name)
        this.criteria1.condition.endTime = endUnix(data.name)
        this.criteria1.condition.timeboundary = ''
        $axios.post('/businessservice/multyBusinessServiceAnalysisHis', this.criteria1).then(res => {
            if (res.data) {
              this.assetData = res.data.pageList
              this.criteria1.totalCount = res.data.totalCount
            }
          })
  },
      getDateRangeStart(value) {
        let start = this.analyForm.startTime ? new Date(this.analyForm.startTime).getTime() / 1000 : 0
        let end = this.analyForm.endTime ? new Date(this.analyForm.endTime).getTime() / 1000 : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.analyForm.startTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.analyForm.startTime ? new Date(this.analyForm.startTime).getTime() / 1000 : 0
        let end = this.analyForm.endTime ? new Date(this.analyForm.endTime).getTime() / 1000 : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.analyForm.endTime = '';
          }
        }
      },
      search() {
        if (this.analyForm.businessUuidList.length > 0) {
          let condition = Object.assign({}, this.analyForm)
          // condition.startTime = (new Date(this.analyForm.startTime).getTime()) / 1000
          // condition.endTime = (new Date(this.analyForm.endTime).getTime()) / 1000
          this.chartShow = true
          $axios.post('/businessservice/multyBusinessServiceAnalysis', condition).then(res => {
            if (res.data) {
              this.chart.data.data = res.data.data
              this.chart.data.relation = res.data.relation
            }
          })
        } else {
          this.$message({type: 'error', message: '请至少选择一个业务服务!'});
        }
    },
      dialogOk() {
        this.dialogFlag = false
      },
      getData() {
        this.criteria1.condition = Object.assign({}, this.analyForm)
        $axios.post('/businessservice/multyBusinessServiceAnalysisHis', this.criteria1).then(res => {
            if (res.data) {
              this.assetData = res.data.pageList
              this.criteria1.totalCount = res.data.totalCount
            }
          })
      },
      handleSizeChange1(curPageSize) {
        this.criteria1.currentPage = 1;
        this.criteria1.pageSize = curPageSize;
        this.echartClick(this.dataState)
      },
      handleCurrentChange1(current) {
        if (current === this.criteria1.currentPage) return;
        this.criteria1.currentPage = current;
        this.echartClick(this.dataState)
      }

    },
    created() {
      this.analyForm.businessUuidList = this.busUuid
      this.search()
    },
    computed: {

    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="stylus">

</style>
