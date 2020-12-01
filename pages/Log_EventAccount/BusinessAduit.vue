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
        <page-infinite-table
            ref="infiniteTable"
            loading-text="正在加载中"
            @filter-change="selectFilter"
            :ajax-obj="axiosHistoryObj"
            :startAjax="getHistoryFlag">
            <s-table-column label="事件级别" prop="alarm_name" width="170px" :filters="filters" column-key="alarm_name" show-overflow-tooltip></s-table-column>
            <s-table-column label="时间" prop="createTimeStr" width="170px"></s-table-column>
            <s-table-column label="规则名称" prop="policy_name"></s-table-column>
            <s-table-column label="中间件系统名称" prop="app_name"></s-table-column>
            <s-table-column label="服务器IP" prop="server_ip"></s-table-column>
            <s-table-column label="用户" prop="account_name"></s-table-column>
            <s-table-column label="客户端IP" prop="client_ip"></s-table-column>
            <s-table-column label="事件内容" prop="alarm_value"></s-table-column>
        </page-infinite-table>
    </s-row>
</section>
</template>

<script>
import $axios from 'sunflower-ajax'
import {Download} from 'sunflower-common-utils'
import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
import SelectTime from '@/components/selectTime/SelectTime.vue'
export default {
    components: {
        SelectTime,
        pageInfiniteTable
    },
    data() {
        return {
            filterArr: [],
            filters: [
                {text: '未知', value: '0'},
                {text: '正常', value: '1'},
                {text: '提示', value: '2'},
                {text: '警告', value: '3'},
                {text: '次要', value: '4'},
                {text: '主要', value: '5'},
                {text: '严重', value: '6'}],
            levelLists: [],
            getHistoryFlag: false,
            axiosHistoryObj: {
                type: 'post',
                url: '/businessAuditEventCount/getBusinessAuditEventList',
                params: {
                    condition: {}
                }
            },
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
            start: 0,
            end: 0
        }
    },
    methods: {
        selectFilter(filters) {
            this.filterArr = filters.alarm_name.map(function(val) {
            return parseInt(val)
            });
            this.getList();
        },
        // filterTag(value, row) {
        //     return row.alarm_level === value
        // },
        getList() {
            var vm = this;
            let period = this.$refs.selecttime
            if (period.beginTimes) {
                this.start = new Date(period.beginTimes).getTime() / 1000;
            } else {
                this.start = 0;
            }
            if (period.endTimes) {
                this.end = new Date(period.endTimes).getTime() / 1000;
            } else {
                this.end = 0;
            }
            $axios.get(`/businessAuditEventCount/businessAuditEventLevelCount/${this.start}/${this.end}`).then((res) => {
                vm.chart2.data = res.data;
            });
            let arr = this.filterArr.length ? this.filterArr : null;
            let period2 = {start_time: Number.isNaN(new Date(period.beginTimes).getTime()) ? 0 : new Date(period.beginTimes).getTime() / 1000, end_time: Number.isNaN(new Date(period.endTimes).getTime()) ? 0 : new Date(period.endTimes).getTime() / 1000, alarm_level: arr}
            this.axiosHistoryObj.params.condition = Object.assign({}, period2)
            this.getHistoryFlag = true;
        },
        ExcelDownloadHandle() {
            Download(`businessAuditEventCount/exportBusinessAuditEventReport/${this.start}/${this.end}/excel`);
        },
        PdfDownloadHandle() {
            Download(`businessAuditEventCount/exportBusinessAuditEventReport/${this.start}/${this.end}/pdf`);
        },
        WordDownloadHandle() {
            Download(`businessAuditEventCount/exportBusinessAuditEventReport/${this.start}/${this.end}/word`);
        }
    },
    mounted() {
        this.getList();
    }
}
</script>
