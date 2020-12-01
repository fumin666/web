<template>
  <s-dialog
    v-model="dialogFlag"
    v-if="dialogFlag"
    width="750px"
    append-to-body
    title="查看详情">
      <s-scrollbar wrap-style="max-height: 600px;">
        <s-row class="monitor-card-line">
          <div style="height:30px;width:100%;">
            <s-button type='transparent' style="float: right;" icon="export" @click="exportInfo">导出</s-button>
          </div>
            <div class="headline">
              <s-row>
                <s-col span='3'>
                  <div>基本信息</div>
                </s-col>
                <s-col span='21'>
                  <div class="head_boxline"></div>
                </s-col>
              </s-row>
            </div>
            <div class="serve-check">
              <s-row>
                <s-col :span="8" class="header">名称: <span>{{ basic.serviceName }}</span> </s-col>
                <s-col :span="8" class="header">服务状态: <span>{{ basic.serviceStatusName ? basic.serviceStatusName : '未知' }}</span> </s-col>
                <s-col :span="8" class="header">可用率: <span>{{ basic.serviceAvailable}}</span> </s-col>
              </s-row>
              <s-row>
                <s-col :span="8" class="header">关键程度: <span>{{ basic.serviceCriticalityName }}</span> </s-col>
                <s-col :span="8" class="header">影响度: <span>{{ basic.serviceEffectName }}</span> </s-col>
                <s-col :span="8" class="header">负责人: <span>{{ basic.serviceMaintenanceName }}</span> </s-col>
              </s-row>
              <s-row>
                <s-col :span="8" class="header">业务个数: <span>{{ basic.businessSystemCount }}</span></s-col>
                <s-col :span="8" class="header">服务器个数: <span>{{ basic.serverCount }}</span></s-col>
                <s-col :span="8" class="header">存储/网络个数: <span>{{ basic.storageAndNetworkCount }}</span></s-col>
              </s-row>
            </div>
        </s-row>
        <s-row class="monitor-card-line">
          <s-col>
            <div class="headline">
              <s-row>
                <s-col span='3'>
                  <div>可用率趋势</div>
                </s-col>
                <s-col span='21'>
                  <div class="head_boxline"></div>
                </s-col>
              </s-row>
            </div>
            <s-chart :chart="chart"></s-chart>
          </s-col>
        </s-row>
        <s-row class="monitor-card-line">
          <s-col>
            <div class="headline">
              <s-row>
                <s-col span='3'>
                  <div>根本原因分析</div>
                </s-col>
                <s-col span='21'>
                  <div class="head_boxline"></div>
                </s-col>
              </s-row>
            </div>
              <s-table-page
                :data="tableList">
                <s-table-column
                  prop="serviceStatus"
                  label="级别"
                  width="120"></s-table-column>
                <s-table-column
                  prop="createTime"
                  label="发生时间"
                  width="180"></s-table-column>
                <s-table-column prop="reason" label="事件摘要"></s-table-column>
              </s-table-page>
          </s-col>
        </s-row>
      </s-scrollbar>
  </s-dialog>
</template>
<style lang="stylus" scoped>
.monitor-card-line
  .headline
    font-weight bold
    .head_boxline
      height 10px
      width 100%
      border-bottom 1px dashed #DCDEE2
  .serve-check
    .s-row
      margin 15px 10px
      .s-col
        span
          opacity: 0.65;

</style>
<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        dialogFlag: false,
        basic: {},
        chart: {
          name: 'chart',
          type: 'multilineChart',
          width: '100%',
          height: '300px',
          option: {
            dataZoom: {show: false, start: 0, end: 100},
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
                ]
            },
          data: {}
        },
        tableList: [],
        inspectUuid: ''
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      eyeRow: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    methods: {
      init () {
        if (!this.eyeRow.rowUuid) {
          this.chart.data = this.eyeRow.serviceAvailableInfoObj
          this.basic = this.eyeRow.serviceBaseInfoObj
          this.tableList = this.eyeRow.serviceStatusInfoObj
          this.inspectUuid = this.eyeRow.uuid
        } else {
          $axios.post(`/businessinspect/getLastInspectHis/${this.eyeRow.rowUuid}/${this.eyeRow.uuid}`).then(({data}) => {
            this.chart.data = data.serviceAvailableInfoObj
            this.basic = data.serviceBaseInfoObj
            this.tableList = data.serviceStatusInfoObj
            this.inspectUuid = data.uuid
          })
        }
      },
      exportInfo() {
        Download(`/businessinspect/exportInspectHisDetail/${this.inspectUuid}`)
      }
    },
    created() {
      this.init()
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

