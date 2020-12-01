<!--
 * @Description: 备份任务管理
 * @Author: songyf
 * @Date: 2020-4-14
 * @LastEditTime : 2020-4-14
 * @LastEditors  : LaMando
 -->
<template>
  <div class="backup-task">
    <s-dialog
      v-model="dialogFlag"
      v-if="dialogFlag"
      width="700px"
      append-to-body
      title="查看备份详情">
      <s-table-page :data="logList">
        <s-table-column label="备份时间" prop='createTime'></s-table-column>
        <s-table-column label="备份结果" prop='backUpRsultStr'></s-table-column>
        <s-table-column label="文件名称" prop='backupFileName'></s-table-column>
        <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" v-if="scope.row.status === 1" @click="eyeView(scope.row)"></i>
              <i class="iconfont icon-command-review" v-if="scope.row.status === 1" title="与基线对比" @click="comparison(scope.row)"></i>
            </template>
        </s-table-column>
      </s-table-page>
    </s-dialog>
    <view-baseline v-if="viewBaselineFlag" v-model="viewBaselineFlag" :baselineData="baselineData"></view-baseline>
    <compare-with-baseline v-if="compareWithBaselineFlag" v-model="compareWithBaselineFlag" :compareBaselineData="compareBaselineData"></compare-with-baseline>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax';
  import compareWithBaseline from '../ConfigFileDialog/CompareWithBaseline'
  import viewBaseline from '../ConfigFileDialog/ViewBaseline'
  export default {
    data() {
      return {
        dialogFlag: false,
        logList: [],
        viewBaselineFlag: false,
        compareWithBaselineFlag: false,
        baselineData: null,
        compareBaselineData: null,
        baselineList: []
      }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        viewData: Object
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val
        }
      },
      dialogFlag(val) {
        this.$emit('input', val)
      }
    },
    components: {
      compareWithBaseline,
      viewBaseline
    },
    created() {
      $axios.get(`/netConfigManage/getBackUpHisListByItcompAndTask/${this.viewData.uuid}/${this.viewData.taskId}`).then(({data}) => {
        this.logList = data.backUpHis
        if (data.backUpBase) {
          this.baselineList = [data.backUpBase]
        } else {
          this.baselineList = []
        }
      })
    },
    methods: {
      eyeView(row) {
        if (row.fileContent !== null) {
          this.baselineData = row
          this.viewBaselineFlag = true
        } else {
          this.$message({type: 'warning', message: '当前配置文件备份失败，无法查看！'});
        }
      },
      comparison(row) {
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
</style>
