/*
create by YOU
*/
<template>
  <div class="monitor-kpi">
    <div class="monitor-kpi-left">
      <h2
        class="monitor-kpi-title">
        业务服务</h2>
      <s-form v-model="form" class="demo-form-inline" label-width="80px">
        <s-form-item label="服务选择">
        </s-form-item>
        <s-form-item label-width="0">
          <s-scrollbar wrap-class="kpi-left-scroll">
            <s-tree
              :props="props"
              :data="businessServiceList"
              show-checkbox
              @check-change="handleCheckChange">
            </s-tree>
          </s-scrollbar>
        </s-form-item>
        <s-form-item label="KPI指标">
          <s-select v-model="form.analysisType" placeholder="请选择" style="width: 100%">
            <s-option label="可用率" value="available">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="查询时间:">
          <s-select v-model="form.timeboundary" placeholder="请选择" style="width: 100%">
            <s-option label="近7天" value="7"></s-option>
            <s-option label="近14天" value="14"></s-option>
            <s-option label="近30天" value="30"></s-option>
            <s-option label="自定义" value=""></s-option>
          </s-select>
        </s-form-item>
        <s-form-item v-if="form.timeboundary === ''" label="时间范围">
          <s-date-picker
            style="width: 100%"
            v-model="form.startTime"
            type="date"
            :picker-options="disableAfterToday1"
            @change="getDateRangeStart"
            placeholder="开始日期">
          </s-date-picker>
        </s-form-item>
        <s-form-item v-if="form.timeboundary === ''" label=" ">
          <s-date-picker
            style="width: 100%"
            v-model="form.endTime"
            type="date"
            :picker-options="disableAfterToday2"
            @change="getDateRangeEnd"
            placeholder="结束日期">
          </s-date-picker>
        </s-form-item>
        <s-form-item label-width="0">
          <s-button @click="search" style="width: 100%;">查询</s-button>
        </s-form-item>
      </s-form>
    </div>
    <div class="monitor-kpi-content">
      <s-scrollbar wrap-class="monitor-kpi-content-scroll">
        <div>
          <s-card class="kpi-box-card" style="margin-bottom: 20px">
            <div style="position:relative; width: 100%; height: 300px;">
              <!--echart Bug 待修复-->
              <s-chart v-if="chartShow" :chart="chart" :click-fun="handleChartClick"></s-chart>
              <div v-if="!chartShow" class="kpi-chart-noData">
                暂无数据
              </div>
            </div>
          </s-card>
          <s-table-page
            style="width: 100%"
            :data="tableData"
            :show-overflow-tooltip="true"
            >
            <s-table-column
              prop="controlAdderss"
              show-overflow-tooltip
              width="70px"
              label="序号">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </s-table-column>
            <s-table-column
              prop="businessName"
              width="180px"
              show-overflow-tooltip
              label="业务服务名称">
            </s-table-column>
            <s-table-column
              prop="createTime"
              show-overflow-tooltip
              width="180px"
              label="发生时间">
            </s-table-column>
            <s-table-column
              prop="statusName"
              show-overflow-tooltip
              width="100px"
              label="级别">
            </s-table-column>
            <s-table-column
              prop="reason"
              show-overflow-tooltip
              label="根本原因">
            </s-table-column>
          </s-table-page>
        </div>
      </s-scrollbar>
    </div>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default {

    data () {
      return {
        props: {
          label: 'name'
        },
        form: {
          timeboundary: '7',
          analysisType: 'available',
          businessUuidList: [],
          startTime: null,
          endTime: null
        },
        chartShow: false,
        chart: {
          name: 'chart',
          type: 'multilineChart',
          width: '100%',
          height: '300px',
          option: {dataZoom: {show: true, realtime: true, start: 0, end: 100}},
          data: {
            data: [],
            relation: {}
          }
        },
        disableAfterToday1: {
          disabledDate(time) {
            return false
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return false
          }
        },
        tableData: []
      }
    },
    watch: {
      form(val) {
        console.log(val)
      }
    },
    methods: {
      getDateRangeStart(val) {
        let self = this
        console.log(val, self.form.startTime)
        self.form.startTime = val
        self.disableAfterToday2 = {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < new Date(self.form.startTime)
          }
        }
      },
      getDateRangeEnd(val) {
        let self = this
        self.form.endTime = val
        self.disableAfterToday1 = {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() > new Date(self.form.endTime)
          }
        }
      },
      search () {
        let data = {}
        let url = ''
        let _self = this
        let complete = true
        this.inited = true
        if (_self.single) {
          url = '/businessservice/businessServiceAnalysis'
        } else {
          url = '/businessservice/multyBusinessServiceAnalysis'
        }
        if (!(_self.form.businessUuidList && _self.form.businessUuidList.length > 0)) {
          this.$message.warning('请选择业务服务')
        }
        if (_self.form.timeboundary === '') {
          data = {
            analysisType: _self.form.analysisType,
            startTime: _self.form.startTime,
            endTime: _self.form.endTime
          }
          !data.startTime ? complete = false : ''
          !data.endTime ? complete = false : ''
          if (_self.single) {
            data.businessUuid = _self.businessUuid
          } else {
            data.businessUuidList = _self.form.businessUuidList
            data.businessUuidList === 0 ? complete = false : ''
          }
        } else {
          data = {
            timeboundary: _self.form.timeboundary,
            analysisType: _self.form.analysisType
          }
          if (_self.single) {
            data.businessUuid = _self.businessUuid
          } else {
            data.businessUuidList = _self.form.businessUuidList
            data.businessUuidList === 0 ? complete = false : ''
          }
        }
        if (complete) {
          this.tableData = []
          $axios.post(url, data).then(function (res) {
            let data = null
            if (_self.single) {
              data = res.data.map(function (item) {
                item.name = item.name.slice(0, 10)
                return item
              })
              if (data.length === 0) {
                data = []
              }
            } else {
              data = res.data
              if (data.data && data.data.length === 0) {
                data = {}
              }
            }
            if (!_self.single && !data.data || _self.single && data.length === 0) {
              _self.chartShow = false
            } else {
              _self.chartShow = true
            }
            _self.chart.data = data
          })
        } else {
          _self.$message.error('请选择完整搜索条件')
        }
      },
      handleCheckChange(data, checked, indeterminate) {
        let index = this.form.businessUuidList.indexOf(data.uuid)
        checked && index === -1 ? this.form.businessUuidList.push(data.uuid) : this.form.businessUuidList.splice(index, 1)
      },
      handleChartClick (obj) {
        let _self = this
        let url = '/businessservice/getBusinessServicesStatus/' + obj.name + '/'
        if (_self.single) {
          url += _self.businessUuid
        } else {
          for (let key in _self.chart.data.relation) {
            if (_self.chart.data.relation[key] === obj.seriesName) {
              url += key
              break
            }
          }
        }
        $axios.post(url).then(function (res) {
          _self.tableData = res.data
        })
      }
    },
    props: {
      businessServiceList: {
        type: Array,
        default: function () {
          return []
        }
      },
      single: false
    }
  };
</script>
