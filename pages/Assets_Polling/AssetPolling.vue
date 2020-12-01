<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-20 15:38:50
 * @LastEditTime : 2019-12-27 15:18:01
 * @LastEditors  : mybells
 -->
<template>
  <div class="assetPollingStyles">
    <s-tab type="card" class="assetPolling">
      <s-tab-pane label="巡检任务">
        <s-button icon="plus" @click="add">添加</s-button>
        <s-button icon="batch-del" @click="del">批量删除</s-button>
        <s-button icon="refresh-circle" @click="axiosTaskList">刷新</s-button>
        <s-form :inline="true" ref="form" :model="searchForm" label-width="110px" class="search_form" style="margin: 10px 0;">
          <div>
            <s-form-item label="巡检名称：" prop="inspectName">
              <s-input @keyup.enter.native="search" v-model="searchForm.inspectName"></s-input>
            </s-form-item>
            <s-form-item label="巡检周期：" prop="circleType">
              <s-select v-model="searchForm.circleType" style="width:185px;" clearable>
                <s-option label="日" value="1"></s-option>
                <s-option label="周" value="2"></s-option>
                <s-option label="月" value="3"></s-option>
                <s-option label="年" value="4"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="创建者：">
              <s-input @keyup.enter.native="search" v-model="searchForm.creater"></s-input>
            </s-form-item>
            <s-form-item label="上次执行时间：" prop="excuteTime.value">
              <!-- <s-date-picker
                v-model="searchForm.excuteTime.value"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </s-date-picker> -->
              <date-range v-model="searchForm.excuteTime.value" :value-format-flag="true"></date-range>
            </s-form-item>
            <s-form-item label="下次执行时间：" prop="nextExcutetime.value">
              <!-- <s-date-picker
                v-model="searchForm.nextExcutetime.value"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </s-date-picker> -->
              <date-range v-model="searchForm.nextExcutetime.value" :value-format-flag="true"></date-range>
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon="magnifier" title="统计" @click="search()">查询</s-button>
          </div>
        </s-form>
        <s-table-page :data="tableData" @selection-change="selectionChange" >
          <s-table-column type="selection" width="45" align="center" :selectable="rowSelectable"></s-table-column>
          <s-table-column label="巡检名称" prop="inspectName">
            <template slot-scope="scope">
              <a @click="axiosObjectData(scope.row)" class="assetName" style="cursor: pointer">{{scope.row.inspectName}}</a>
            </template>
          </s-table-column>
          <s-table-column label="巡检周期" prop="circleTypeStr">
            <template slot-scope="scope">
              <span>{{scope.row.isPeriod === 0 ? '-' : scope.row.circleTypeStr}}</span>
            </template>
          </s-table-column>
          <s-table-column v-if="!isAssets" label="状态" prop="statusStr">
            <template slot-scope="scope">
              <s-tag :type="statusFilter(scope.row.status)">{{scope.row.statusStr}}</s-tag>
            </template>
          </s-table-column>
          <s-table-column label="上次执行时间" prop="excuteTime"></s-table-column>
          <s-table-column label="下次执行时间" prop="nextExcutetime">
            <template slot-scope="scope">
              <span>{{scope.row.status === 3 ? '-' : scope.row.nextExcutetime}}</span>
            </template>
          </s-table-column>
          <s-table-column label="创建者" prop="creater"></s-table-column>
          <s-table-column label="创建时间" prop="createTime"></s-table-column>
          <s-table-column label="操作" width="120">
            <template slot-scope="scope">
              <i v-if="IsEdit(scope.row)" class="iconfont icon-edit" @click="rowEdit(scope.row)"></i>
              <i v-if="IsDel(scope.row)" class="iconfont icon-delete" @click="rowDel(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <s-tab type="card" style="margin: 10px 20px 10px;">
      <s-tab-pane label="巡检对象">
        <s-row style="font-weight: 600;font-size: 14px;opacity: 0.65;">
          <div style="float: left;margin-right: 30px;"><span>巡检任务名称：</span> <span>{{ inspectName }}</span></div>
          <div style="float: left;"><span>最新执行时间：</span> <span>{{ excuteTime }}</span></div>
        </s-row>
        <s-table-page :data="inspectingObjectData"  @row-click="axiosHistoryData">
          <s-table-column label="资产名称"  prop="assetName" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="assetName" style="cursor: pointer">{{scope.row.assetName}}</span>
            </template>
          </s-table-column>
          <s-table-column label="IP地址" prop="ipAddress"></s-table-column>
          <s-table-column label="资产类别" prop="assetType" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{isAssets === true ? scope.row.assetType : scope.row.modelNumber}}</span>
            </template>
          </s-table-column>
          <s-table-column label="资产状态" prop="assetStatus" show-overflow-tooltip></s-table-column>
          <s-table-column v-if="isAssets"  label="安全性得分" prop="securityScore" show-overflow-tooltip></s-table-column>
          <s-table-column v-if="!isAssets" label="配置变更数" :formatter='filterRow' prop="baseline" show-overflow-tooltip></s-table-column>
          <s-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="safetyScoreSee(scope.row)" v-if="isShow(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <s-tab type="card" style="margin: 10px 20px 10px;">
      <s-tab-pane label="历史记录">
        <s-row style="font-weight: 600;font-size: 14px;opacity: 0.65;">
          <span>资产名称：</span> <span>{{ assetName }}</span>
        </s-row>
        <s-table-page :data="historyTableData" >
          <s-table-column label="执行时间" prop="excutetime" show-overflow-tooltip></s-table-column>
          <s-table-column label="资产状态" prop="assetStatus"></s-table-column>
          <s-table-column v-if="isAssets"  label="安全性得分" prop="securityScore" show-overflow-tooltip></s-table-column>
          <s-table-column v-if="!isAssets" label="配置变更数" :formatter='filterRow' prop="baseline" show-overflow-tooltip></s-table-column>
          <s-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="rowSee(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <polling-task-add-dialog v-if="addDialogFlag" v-model="addDialogFlag" :cur-table-data="curTableData"
                             :cur-polling-task="curPollingTask" @reload="axiosTaskList">
    </polling-task-add-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import DateRange from '@/components/tableCom/src/DateRange';
  import PollingTaskAddDialog from './AssetPollingDialog/PollingTaskAddDialog.vue';
  import {multiSearch} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';
  // import SearchBox from '@/components/tableCom/src/SearchBox';

  export default {
    data() {
      return {
        addDialogFlag: false,
        searchForm: {
          inspectName: '',
          circleType: '',
          excuteTime: {
            type: 'datetimerange',
            value: []
          },
          nextExcutetime: {
            type: 'datetimerange',
            value: []
          },
          creater: ''
        },
        tableData: [],
        tempTableData: [],
        curTableData: [],
        selections: [],
        curPollingTask: {},
        inspectingObjectData: [],
        historyData: [],
        historyTableData: [],
        inspectName: '',
        excuteTime: '',
        assetName: '',
        isAssets: true
      }
    },
    created() {
      this.axiosTaskList();
    },
    methods: {
      // 已删除的不能够选中
      rowSelectable(row, index) {
        return row.status !== 3;
      },
      IsEdit(row) {
        if (row.status === 5 || row.status === 4 || row.status === 3) {
          return false
        }
        return true
      },
      IsDel(row) {
        if (row.status === 5 || row.status === 3) {
          return false
        }
        return true
      },
      statusFilter(status) {
        const statusMap = ['primary', 'success', 'gray', 'warning']
        return statusMap[status - 1]
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      isShow(row) {
        if (row.baseline === null || row.baseline === '' || row.baseline === '0') {
          return false;
        } else {
          return true
        }
      },
      filterRow(val) {
        if (val.baseline === null || val.baseline === '' || val.baseline === '0') {
          return '-';
        } else {
          return val.baseline
        }
      },
      search() {
        let form = Object.assign({}, {}, this.searchForm);
        this.tableData = multiSearch(form, this.tempTableData);
      },
      add() {
        this.curPollingTask = {};
        this.addDialogFlag = true;
      },
      del() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择要删除的巡检任务!', type: 'warning'});
          return;
        }
        let uuidList = this.selections.filter(item => item.status !== 5);
        this.axiosDel(uuidList);
      },
      rowEdit(row) {
        this.curPollingTask = row;
        this.addDialogFlag = true;
      },
      rowDel(row) {
        this.axiosDel([row]);
      },
      axiosTaskList() {
        let params = {}
        if (this.$route.path === '/AssetsAll/assets_polling') {
          this.isAssets = true
          params = {inspectType: 0}
        } else {
          this.isAssets = false
          params = {inspectType: 1}
        }
        $axios.post('/assetInspectTask/list', params).then(({data}) => {
          for (let i in data) {
            if (data[i].isFinish) {
              data[i].nextExcutetime = '已结束'
            }
          }
          this.$refs['form'].resetFields();
          this.tempTableData = data
          this.tableData = data;
          this.curTableData = data;
          this.search()
        });
      },
      axiosDel(param) {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          let uuid = param.map(item => item.uuid)
          $axios.post('/assetInspectTask/delete', uuid, {
            data: param,
            logTemplate: '删除|巡检任务(#inspectName#)'
          }).then(({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '删除成功', type: 'success'});
              this.axiosTaskList();
            } else {
              this.$message({showClose: true, message: '删除失败', type: 'error'});
            }
          });
        }).catch(() => {});
      },
      axiosObjectData(row) {
        this.inspectName = row.inspectName;
        this.excuteTime = row.excuteTime;
        $axios.get('/assetInspectTask/getAssetList/' + row.uuid).then(res => {
          this.inspectingObjectData = res.data;
          this.historyData = [];
          this.historyTableData = [];
          this.assetName = '';
        })
      },
      axiosHistoryData(row) {
        this.assetName = row.assetName;
        $axios.get('/assetInspectHistory/getResultList/' + row.inspectUuid + '/' + row.assetUuid).then(res => {
          this.historyData = res.data;
          this.historyTableData = cloneDeep(res.data);
        })
      },
      rowSee(row) {
        if (this.$route.path === '/diy') {
          this.$router.push('/AutoOpsCenter/autoOps_polling/pollingResultDetail/' + row.uuid);
        } else {
          this.$router.push(this.$route.path + '/pollingResultDetail/' + row.uuid)
        }
      },
      safetyScoreSee(row) {
        let uuid = row.lastRoutingInspectAssetHistoryUuid;
        if (this.$route.path === '/diy') {
          this.$router.push('/AutoOpsCenter/autoOps_polling/pollingResultDetail/' + uuid + '?safetyScoreSee=0');
        } else {
          this.$router.push(this.$route.path + '/pollingResultDetail/' + uuid + '?safetyScoreSee=0');
        }
      }
    },
    components: {
      DateRange,
      PollingTaskAddDialog
      // SearchBox
    },
    watch: {
      'searchForm.excuteTime.value': {
        handler: function (val) {
          if (val === null) {
            this.searchForm.excuteTime.value = [];
          }
        },
        deep: true
      },
      'searchForm.nextExcutetime.value': {
        handler: function (val) {
          if (val === null) {
            this.searchForm.nextExcutetime.value = [];
          }
        },
        deep: true
      }
    }
  }
</script>

<style lang="stylus">
  .assetPolling
    margin:0 20px
</style>
