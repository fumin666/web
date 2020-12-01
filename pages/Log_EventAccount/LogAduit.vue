<template>
<section class="content eventAccount">
    <s-row>
        <s-col :span="24">
            <s-form :inline="true">
                <select-time ref="selecttime">
                  <template slot="searchBtn">
                    <div class="search_btn">
                      <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
                    </div>
                  </template>
                </select-time>
                <s-form-item>
                  <s-button icon="excel" title="EXCEL报表" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
                </s-form-item>
                <s-form-item>
                  <s-button icon="word" title="WORD报表" @click="WordDownloadHandle()">WORD报表</s-button>
                </s-form-item>
                <s-form-item>
                  <s-button icon="pdf" title="PDF报表" @click="PdfDownloadHandle()">PDF报表</s-button>
                </s-form-item>
            </s-form>
        </s-col>
    </s-row>
    <s-row>
        <s-row>
            <span class="title">
              <i class="iconfont icon-tag"></i>事件级别分布
            </span>
        </s-row>
        <s-chart :chart="chart2"></s-chart>
        <s-row>
            <span class="title">
              <i class="iconfont icon-trophy"></i>事件详情
            </span>
        </s-row>
        <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag" @filter-change="filterChangeHandler" v-if="hackReset">
            <s-table-column label="事件级别" prop="eventLevelLabel" column-key="eventLevel" width="170px" :filters="filters" show-overflow-tooltip></s-table-column>
            <s-table-column label="时间" prop="createTime" width="170px"></s-table-column>
            <s-table-column label="规则名称" prop="strategyName"></s-table-column>
            <s-table-column label="资产类别" prop="citypeName"></s-table-column>
            <s-table-column label="事件内容" prop="eventMessage"></s-table-column>
        </page-infinite-table>
    </s-row>
</section>
</template>

<script>
import $axios from 'sunflower-ajax'
import {Download} from 'sunflower-common-utils'

import SelectTime from '@/components/selectTime/SelectTime'
import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
export default {
    components: {
        SelectTime,
        pageInfiniteTable
    },
    data() {
        return {
            filters: [{
                    text: '未知',
                    value: '0'
                },
                {
                    text: '正常',
                    value: '1'
                },
                {
                    text: '提示',
                    value: '2'
                },
                {
                    text: '警告',
                    value: '3'
                },
                {
                    text: '次要',
                    value: '4'
                },
                {
                    text: '主要',
                    value: '5'
                },
                {
                    text: '严重',
                    value: '6'
                }
            ],
            levelLists: [],
            topLists: [],
            chart2: {
                name: 'chart2',
                type: 'colorfulBarChart',
                width: '90%',
                height: '300px',
                data: [],
                option: {
                  series: [{
                    barWidth: 30
                  }]
                }
            },
            getHistoryFlag: false,
            hackReset: true,
            axiosHistoryObj: {
                type: 'post',
                url: '/syslogReport/getEventReportList',
                params: {
                    condition: {}
                }
            }
        }
    },
    methods: {
        // 无限分页，筛选功能
        filterChangeHandler(val) {
          var vm = this;
          let params = {
            startTime: vm.$refs.selecttime.beginTimes,
            endTime: vm.$refs.selecttime.endTimes,
            eventLevel: val['eventLevel'].join(',')
          };
          this.axiosHistoryObj.params.condition = Object.assign({}, params);
        },
        getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        },
        getList() {
            var vm = this;
            let params = {
                startTime: vm.$refs.selecttime.beginTimes,
                endTime: vm.$refs.selecttime.endTimes
            };
            $axios.post('/syslogReport/auditEventReportChart', params).then((res) => {
                vm.chart2.data = res.data.chartData;
            });
            this.getHistoryFlag = true;
            this.axiosHistoryObj.params.condition = Object.assign({}, params)
            // 为了筛选框弹出，强制刷新无限分页组件
            this.hackReset = false;
            this.$nextTick(() => {
              this.hackReset = true;
            })
        },
        ExcelDownloadHandle() {
            $axios.post('/syslogReport/auditEventReportExport', {
                startTime: this.$refs.selecttime.beginTimes,
                endTime: this.$refs.selecttime.endTimes,
                type: 1
            }).then((res) => {
              Download(`/syslogReport/downLoadLogReport/${res.data}`);
            });
        },
        PdfDownloadHandle() {
            $axios.post('/syslogReport/auditEventReportExport', {
                startTime: this.$refs.selecttime.beginTimes,
                endTime: this.$refs.selecttime.endTimes,
                type: 2
            }).then((res) => {
              Download(`/syslogReport/downLoadLogReport/${res.data}`);
            });
        },
        WordDownloadHandle() {
            $axios.post('/syslogReport/auditEventReportExport', {
                startTime: this.$refs.selecttime.beginTimes,
                endTime: this.$refs.selecttime.endTimes,
                type: 3
            }).then((res) => {
              Download(`/syslogReport/downLoadLogReport/${res.data}`);
            });
        }
    },
    mounted() {
        this.getList();
    }
}
</script>
