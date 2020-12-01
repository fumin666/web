<!--
 * @Author: songyf
 * @Date: 2020-4-16
 * @LastEditors: songyf
 * @Description: 配置文件管理-备份详情
 -->
<template>
  <s-dialog v-model="dialogFlag" title="备份详情" width="830px" append-to-body class="backup-details">
    <s-scrollbar wrap-class="default-dialog-scroll" v-dialogclose="{id:'.default-dialog-scroll'}">
      <s-row class="title">
        <span>基线</span>
      </s-row>
      <s-table-page :data="baselineList" class="baseline-table" style="margin-bottom: 15px">
        <s-table-column label="设置时间" prop="baseTime"></s-table-column>
        <s-table-column label="文件名称" prop="backupFileName"></s-table-column>
        <s-table-column label="操作" width="150">
          <template slot-scope="scope">
            <i class="iconfont icon-config-audit" title="查看基线" v-if="scope.row.status === 1" @click="viewBaseline(scope.row)"> </i>
            <i class="iconfont icon-set-configure" title="设为当前配置" @click="setConfig(scope.row)"> </i>
            <i class="iconfont icon-export" v-if="scope.row.status === 1" title="导出" @click="exportBaseline(scope.row)"> </i>
          </template>
        </s-table-column>
      </s-table-page>

      <s-row class="title">
        <span>备份历史</span>
      </s-row>
      <s-table-page :data="historyList" id="historyList">
        <s-table-column prop="createTime" label="备份时间" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="backUpTypeStr" label="备份来源" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="backUpRsultStr" label="备份结果" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="backupFileName" label="文件名称" show-overflow-tooltip>
        </s-table-column>
        <s-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
          </template>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>

    <!--查看基线-->
    <view-baseline v-if="viewBaselineFlag" v-model="viewBaselineFlag" :baselineData="baselineData" :viewType="viewType"></view-baseline>
    <!--与基线对比-->
    <compare-with-baseline v-if="compareWithBaselineFlag" v-model="compareWithBaselineFlag" :compareBaselineData="compareBaselineData"></compare-with-baseline>
  </s-dialog>
</template>

<script>
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import buttonSet from '@/components/tableHandleHidden/buttonSet';
  import viewBaseline from './ViewBaseline'
  import compareWithBaseline from './CompareWithBaseline'
  import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils'
  export default {
    components: {
      RealPageTable,
      compareWithBaseline,
      viewBaseline,
      buttonSet
    },
    data() {
      return {
        viewBaselineFlag: false,
        compareWithBaselineFlag: false,
        dialogFlag: false,
        baselineList: [],
        historyList: [],
        baselineData: null,
        compareBaselineData: null,
        tableOption: {// 操作栏配置项
          isHidden: true, // 是否开启隐藏
          appendId: '#historyList',
          showNum: 3// 超过3ge隐藏
        },
        viewType: 1 // 1 基线 2 历史
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      rowData: {
        type: Object,
        default: null
      }
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
    },
    created() {
      this.getBackUpHisListByItcomp()
    },
    methods: {
      getBackUpHisListByItcomp() {
        $axios.get(`/netConfigManage/getBackUpHisListByItcomp/${this.rowData.uuid}`).then(({data}) => {
          if (data.backUpBase) {
            this.baselineList = [data.backUpBase]
          } else {
            this.baselineList = []
          }
          this.historyList = data.backUpHis || [];
        })
      },
      btnData() { // 按钮权限
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看',
            v_if: function (row, scope) {
              return row.status === 1
            },
            handler: function (row, scope) {
              vm.viewHisFile(row)
            }
          },
          {
            icon: 'command-review',
            name: '与基线对比',
            v_if: function (row, scope) {
              return row.status === 1
            },
            handler: function (row, scope) {
              vm.compareWithBaseline(row)
            }
          },
          {
            icon: 'set',
            name: '设为基线',
            v_if: function (row, scope) {
              return row.status === 1
            },
            handler: function (row, scope) {
              vm.setBaseline(row)
            }
          },
          {
            icon: 'set-configure',
            name: '设为当前配置',
            v_if: function (row, scope) {
              return row.status === 1
            },
            handler: function (row, scope) {
              vm.setConfig(row)
            }
          },
          {
            icon: 'export',
            name: '导出',
            v_if: function (row, scope) {
              return row.status === 1
            },
            handler: function (row, scope) {
              vm.exportBaseline(row)
            }
          }
        ]
      },
      viewBaseline (row) {
        if (row.fileContent !== null) {
          this.viewType = 1
          this.baselineData = row
          this.viewBaselineFlag = true
        } else {
          this.$message({type: 'warning', message: '此设备当前无基线文件，请先进行配置备份或在备份详情中进行设置！'});
        }
      },
      viewHisFile (row) {
        if (row.fileContent !== null) {
          this.viewType = 2
          this.baselineData = row
          this.viewBaselineFlag = true
        } else {
          this.$message({type: 'warning', message: '当前配置文件备份失败，无法查看！'});
        }
      },
      setConfig(row) {
        this.$confirm('配置回退会重启交换机，确定回退？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/netConfigManage/netWorkBack/${row.uuid}`).then(({data}) => {
            if (data.state) {
              this.$message({type: 'success', message: data.errormsg});
            } else {
              this.$message({type: 'error', message: data.errormsg});
            }
          })
        }).catch(() => {});
      },
      exportBaseline(row) {
        Download(`/netConfigManage/downloadBackUpFile/${row.uuid}`);
      },
      setBaseline(row) {
        $axios.post(`/netConfigManage/changeBackUpToBase`, {uuid: row.uuid, itcompUuid: row.itcompUuid}).then(({data}) => {
          if (data.state) {
            this.getBackUpHisListByItcomp()
            this.$message({type: 'success', message: data.errormsg});
          } else {
            this.$message({type: 'error', message: data.errormsg});
          }
        })
      },
      compareWithBaseline(row) {
        let vm = this
        if (vm.baselineList.length !== 0) {
          vm.$message({
            type: 'warning',
            message: '正在对比，请稍等！',
            onClose: function () {
              vm.compareBaselineData = {
                baselineContent: vm.baselineList,
                historyContent: row
              }
              vm.compareWithBaselineFlag = true
            }
          });
        } else {
          this.$message({type: 'warning', message: '请先设置基线'});
        }
      }
    }
  }
</script>
<style lang="stylus">
  .backup-details
    .title
      font-size 16px
      font-weight 600
      margin-bottom 15px
    .baseline-table
      .s-pagination
        display: none
    .buttonSet_style
       left 630px!important
</style>

