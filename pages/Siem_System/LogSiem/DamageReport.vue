/**
* Created by alex on 2019/2/26.
*/
<template>
  <section class="content" style="margin-top: 20px">
    <s-form :inline="true">
      <select-time ref="selecttime">
        <template slot="serachForm">
          <s-form-item label="危害级别：">
            <s-select v-model="hazardLevel" clearable>
              <s-option v-for="(item, index) in typeList" :label="item.name" :value="item.id" :key="index"></s-option>
            </s-select>
          </s-form-item>
        </template>
        <template slot="searchBtn">
          <div class="search_btn">
            <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
          </div>
        </template>
      </select-time>
    </s-form>
    <s-row style="margin: 15px 0 10px;">
      <s-button title="EXCEL报表" icon="excel" @click="downloadHandle(1)">EXCEL报表</s-button>
      <s-button title="WORD报表" icon="word" @click="downloadHandle(3)">WORD报表</s-button>
      <s-button title="PDF报表" icon="pdf" @click="downloadHandle(2)">PDF报表</s-button>
    </s-row>
    <s-page-infinite-table
      ref="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="axiosObj"
      :startAjax="getFlag">
      <s-table-column label="危害级别" prop="hazardLevel" :formatter="formatterLevel"></s-table-column>
      <s-table-column label="日志级别分类" prop="logInfoLevel"></s-table-column>
      <s-table-column label="重复次数" prop="repeatTimes"></s-table-column>
      <s-table-column label="报告内容" prop="content"></s-table-column>
      <s-table-column label="生成时间" prop="createTime"></s-table-column>
      <s-table-column label="操作" width="65px">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="viewDetail(scope.row)"></i>
        </template>
      </s-table-column>
    </s-page-infinite-table>
    <s-dialog
      v-model="lookDialog"
      v-if="lookDialog"
      width="1000px"
      title="报告详情">
      <lookasr-dialog :data="reportData"></lookasr-dialog>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  
  import SelectTime from '@/components/selectTime/SelectTime'
  import lookasrDialog from './components/lookasrDialog'
  import sPageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    components: {
      SelectTime,
      lookasrDialog,
      sPageInfiniteTable
    },
    data() {
      return {
        hazardLevel: '',
        topLists: [],
        typeList: [
          {
            id: 1,
            name: '紧急'
          },
          {
            id: 2,
            name: '严重'
          },
          {
            id: 3,
            name: '警告'
          },
          {
            id: 4,
            name: '提示'
          }
        ],
        criteria: {                 // 真分页分页数据
          condition: {},
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        lookDialog: false,
        reportData: {},
        axiosObj: {
          type: 'post',
          url: '/syslogReport/hazardReportCount',
          params: {
            condition: {
            }
          }
        },
        getFlag: false
      }
    },
    methods: {
      viewDetail(row) {
        $axios.post(`/syslogReport/getAnalysisDetailByReportUuid/${row.uuid}`).then((res) => {
          this.reportData = res.data
        })
        this.lookDialog = true
      },
      formatterLevel(item) {
        const level = ['紧急', '严重', '警告', '提示']
        return level[item.hazardLevel - 1]
      },
      formatterDefualt(item) {
        const level = ['用户分析报告', '系统默认分析报告']
        return level[item.isDefualt]
      },
      getList() {
        this.axiosObj.params.condition = {
          startTime: this.$refs.selecttime.beginTimes,
          endTime: this.$refs.selecttime.endTimes,
          hazardLevel: this.hazardLevel
        }
        this.getFlag = true
      },
      downloadHandle(type) {
        let form = {
          startTime: this.$refs.selecttime.beginTimes,
          endTime: this.$refs.selecttime.endTimes,
          hazardLevel: this.hazardLevel,
          type: type
        }
        $axios.post('/syslogReport/hazardReportExport', form).then((res) => {
          Download(`/syslogReport/downLoadLogReport/${res.data}`);
        });
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
