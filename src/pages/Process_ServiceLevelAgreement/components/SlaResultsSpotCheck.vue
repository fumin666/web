<template>
  <div class="slaResultsSpotCheck">
    <s-row class="slaResultsSpotCheck-row">
      <s-col>
        <div class="listChunk">
          <s-card>
            <div slot="header" class="tableTitle">
              <span class="card-title">
                流程单据列表
              </span>
            </div>
            <s-row class="list-top-btn">
              <s-button @click="batchUpdate" icon="backup">批量更新SLA状态</s-button>
              <s-button @click="batchExport" icon="export">导出</s-button>
            </s-row>
            <s-row>
              <s-form :inline="true" :model="criteria.condition" class="search_form searchFormChunk">
                <div>
                  <s-form-item label="流程：">
                    <s-select v-model="criteria.condition.itilType" clearable placeholder="请选择">
                      <s-option :label="'事件'" :value="0"></s-option>
                      <s-option :label="'服务请求'" :value="6"></s-option>
                    </s-select>
                  </s-form-item>
                  <s-form-item label="单号：">
                    <s-input @keyup.enter.native="listSearch" v-model="criteria.condition.serialCode"></s-input>
                  </s-form-item>
                  <s-form-item label="简单描述：">
                    <s-input @keyup.enter.native="listSearch" v-model="criteria.condition.briefDesc"></s-input>
                  </s-form-item>
                </div>
                <div class="search_btn">
                  <s-button icon="magnifier" @click="listSearch">查询</s-button>
                  <!-- 暂时隐藏动态列功能 -->
                  <!--<s-button icon="set" @click="dynamicCol"></s-button>-->
                </div>
              </s-form>
            </s-row>
            <s-table-page :data="workflowOrderList" :height="tableHeight" border style="width:100%;" @selection-change="selection1Change" ref="slaListTable" v-loading="loading1" >
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="单号" prop="serialCode" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="link-title" @click="axiosServerTargetListByWorkflowOrder(scope.row.uuid)">{{scope.row.serialCode}}</span>
                </template>
              </s-table-column>
              <s-table-column label="简要描述" prop="briefDesc" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.briefDesc||'无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="流程" prop="itilType" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="parseInt(scope.row.itilType) === 0 ">{{'事件'}}</span>
                  <span v-if="parseInt(scope.row.itilType) === 6 ">{{'服务请求'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="处理组" prop="handlerGroup" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.handlerGroup||'无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="处理人" prop="handler" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.handler||'无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="单据状态" prop="orderStatus" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.orderStatus||'无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="提交时间" prop="createTime" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{!scope.row.createTime?'无':dateFormat(scope.row.createTime)}}</span>
                </template>
              </s-table-column>
              <s-table-column label="提交人" prop="createUser" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.createUser||'无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="响应SLA目标时间" prop="responseEndtime" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{!scope.row.responseEndtime?'无':dateFormat(scope.row.responseEndtime)}}</span>
                </template>
              </s-table-column>
              <s-table-column label="解决SLA目标时间" prop="solveEndtime" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{!scope.row.solveEndtime?'无':dateFormat(scope.row.solveEndtime)}}</span>
                </template>
              </s-table-column>
              <s-table-column label="响应SLA状态" prop="response" show-overflow-tooltip width="80px">
                <template slot-scope="scope">
                  <span>{{scope.row.response || '无'}}</span>
                </template>
              </s-table-column>
              <s-table-column label="解决SLA状态" prop="solve" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.solve || '无'}}</span>
                </template>
              </s-table-column>
            </s-table-page>
          </s-card>
        </div>
      </s-col>
    </s-row>
    <s-row class="slaResultsSpotCheck-row">
      <s-col>
        <div class="listChunk">
          <s-card>
            <div slot="header" class="tableTitle">
              <span class="card-title">
                流程单据对应SLA数据列表
              </span>
            </div>
            <s-table-page :data="serverTargeByWorkflowList" :height="tableHeight" border style="width:100%;" ref="slaListTable" v-loading="loading2" >
              <s-table-column label="ID" prop="slaCode" width="240px"></s-table-column>
              <s-table-column label="标题" prop="slaTitle"></s-table-column>
              <s-table-column label="目标类型" prop="slaTargetType">
                <template slot-scope="scope">
                  <span v-if="scope.row['slaTargetType'] === 1">事件响应</span>
                  <span v-if="scope.row['slaTargetType'] === 2">事件解决</span>
                  <span v-if="scope.row['slaTargetType'] === 3">服务请求响应</span>
                  <span v-if="scope.row['slaTargetType'] === 4">服务请求解决</span>
                </template>
              </s-table-column>
              <s-table-column label="小时" prop="targetHour" show-overflow-tooltip></s-table-column>
              <s-table-column label="分钟" prop="targetMininute"></s-table-column>
              <s-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <s-switch v-model="scope.row['slaStatus']" size="small" :active-value="1" :inactive-value="0" @change="slaStatusEnable(scope.row)"></s-switch>
                </template>
              </s-table-column>
              <s-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <i class="iconfont icon-eye" @click="rowSee(scope.row)" title="查看"></i>
                </template>
              </s-table-column>
            </s-table-page>
          </s-card>
        </div>
      </s-col>
    </s-row>
    <ServerTargeByWorkflowDialog v-if="serverTargeByWorkflowDialogFlag" v-model="serverTargeByWorkflowDialogFlag" :row="serverTargeByWorkflowRow" :parentUuid="orderuuid"></ServerTargeByWorkflowDialog>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Download} from 'sunflower-common-utils'

import ServerTargeByWorkflowDialog from '../dialog/ServerTargeByWorkflowDialog'

export default {
  data() {
    return {
      operationRespList: [],
      loading1: false,
      loading2: false,
      serviceTimeList: [],
      holidaysList: [],
      selections1: [],
      selections2: [],
      searchForm: {},
      tableHeight: 0,
      criteria: { // 根据分页、查询条件查询列表的参数
        condition: {
          serialCode: null,
          briefDesc: null,
          itilType: null
        },
        currentPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      workflowOrderList: [],
      serverTargeByWorkflowList: [],
      serverTargeByWorkflowDialogFlag: false,
      serverTargeByWorkflowRow: {},
      orderuuid: ''
    }
  },
  methods: {
    selection1Change(selections) {
      this.selections1 = selections;
    },
    selection2Change(selections) {
      this.selections2 = selections;
    },
    listSearch() {
      this.axiosWorkflowOrderList();
    },
    doLayout() {
      this.$nextTick(() => {
        let totalHeihgt = document.body.offsetHeight;
        let headHeight = document.querySelector('#headBar').offsetHeight;
        let footHeight = document.querySelector('.s-footer').offsetHeight;
        let tabsHeaderHeight = document.querySelector('.s-tabs-header').offsetHeight + 15 + 5    // tabs头部加15的marginbottom
        let bodyHeight = totalHeihgt - headHeight - footHeight - tabsHeaderHeight - 20;
        let listTopBtnHeight = document.querySelector('.slaResultsSpotCheck .list-top-btn').offsetHeight + 8;
        let tableTitleHeight = document.querySelector('.slaResultsSpotCheck .tableTitle').offsetHeight + 8;
        let pageHeight = document.querySelector('.slaResultsSpotCheck .s-pagination').offsetHeight + 8 + 8;
        let searchBoxHeight = document.querySelector('.slaResultsSpotCheck .searchFormChunk').offsetHeight + 8;
        // 表格的高度等于tabs内容高度减去从上到下元素高度 最后20是下边框
        let tableHeight = (bodyHeight - listTopBtnHeight - searchBoxHeight - pageHeight * 2 - tableTitleHeight * 2 - 20) / 2;
        this.tableHeight = tableHeight < 180 ? 180 : tableHeight;
      });
    },
    /* **************  流程单据列表部分  start *************** */
    // 批量更新sla操作
    batchUpdate() {
      if (this.selections1.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据'
        })
      } else {
        this.$confirm('确定更新?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/itilSla/batchUpdateSlaStatus`, [...this.selections1.map(item => item.uuid)]).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: data.errormsg, type: 'success'});
              this.axiosWorkflowOrderList();
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    batchExport() {
      if (this.selections1.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据'
        })
      } else {
        this.$confirm('确定导出?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post(`/itilSla/exportWorkflowOrderList`, [...this.selections1.map(item => item.uuid)]).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: '批量导出成功!', type: 'success'});
              Download(data.errormsg, {logTemplate: '导出|流程单据列表(workflowOrderList.xls)'});
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        }).catch(() => {});
      }
    },
    axiosWorkflowOrderList() {
      let params = {...this.criteria}
      for (let key in params.condition) {
        if (params.condition[key] === '') {
          params.condition[key] = null
        }
      }
      this.loading1 = true
      $axios.post(`/itilSla/workflowOrderList`, params).then(({status, data}) => {
        this.loading1 = false
        if (!!data && Array.isArray(data.list)) {
          this.workflowOrderList = data.list
        }
      })
    },
    handleSizeChange(curPageSize) {
      this.criteria.currentPage = 1;
      this.criteria.pageSize = curPageSize;
      this.axiosWorkflowOrderList();
    },
    handleCurrentChange(current) {
      if (current === this.criteria.currentPage) return;
      this.criteria.currentPage = current;
      this.axiosWorkflowOrderList();
    },
    dateFormat(timeStamp, format) {
      const date = new Date(parseInt(timeStamp) * 1000)
      let fmt = format || 'yyyy-MM-dd hh:mm:ss'
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
      }
      return fmt
    },
    /* **************  流程单据列表部分  end *************** */
    /* **************  流程单据对应的服务目标  start *************** */
    // 获取流程单据对应的服务目标
    axiosServerTargetListByWorkflowOrder(uuid) {
      if (!uuid) return null
      this.loading2 = true;
      this.orderuuid = uuid;
      $axios.get(`/itilSla/workflowRelationSla/${uuid}`).then(({status, data}) => {
        this.loading2 = false;
        if (!!data && Array.isArray(data)) {
          this.serverTargeByWorkflowList = data
        }
      })
    },
    rowSee(row) {
      this.serverTargeByWorkflowRow = {}
      this.serverTargeByWorkflowRow = row;
      this.serverTargeByWorkflowDialogFlag = true;
    },
    slaStatusEnable(row) {
      if (row.slaStatus === 1) {
        $axios.get(`/itilSla/enableSlaAgreement/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.axiosServerTargetListByWorkflowOrder();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      } else {
        $axios.get(`/itilSla/disenableSlaAgreement/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.axiosServerTargetListByWorkflowOrder();
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      }
    }
    /* **************  流程单据对应的服务目标  end *************** */
  },
  created() {
    this.doLayout();
    this.axiosWorkflowOrderList()
  },
  components: {
    ServerTargeByWorkflowDialog
  }
}
</script>

<style lang="stylus">
.slaResultsSpotCheck {
  display: flex;
  flex-direction: column;

  .s-card {
    padding: 0;
  }

  .listChunk {
    padding: 5px 0;
  }

  .list-top-btn {
    padding: 5px 0;
  }

  .slaResultsSpotCheck-row {
    flex: 1;
  }
}
</style>
