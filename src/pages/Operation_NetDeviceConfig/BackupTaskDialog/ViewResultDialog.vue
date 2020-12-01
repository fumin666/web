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
      width="800px"
      append-to-body
      title="查看结果">
      <s-table-page :data="resuleData">
        <s-table-column label="资产名称" prop='itcompName'></s-table-column>
        <s-table-column label="IP地址" prop='controlAdderss'></s-table-column>
        <s-table-column label="资产类型" prop='citypeName'></s-table-column>
        <s-table-column label="厂商" prop='itManufacturer'></s-table-column>
        <s-table-column label="型号" prop='productName'></s-table-column>
        <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="eyeView(scope.row)"></i>
            </template>
        </s-table-column>
      </s-table-page>
    </s-dialog>
    <view-backup-dialog v-model="viewDialog" :viewData='viewData' v-if="viewDialog"></view-backup-dialog>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax';
  import viewBackupDialog from './ViewbackupDialog'
  export default {
    data() {
      return {
        dialogFlag: false,
        logList: [],
        resuleData: [],
        viewDialog: false,
        viewData: []
      }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        viewResult: Object
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
      viewBackupDialog
    },
    created() {
      $axios.get(`/netConfigTask/getSelectNetItcompInfoList`).then(({data}) => {
        this.logList = data
        let arr = []
        this.viewResult.networkCfgTaskDeviceList.map(val => {
          data.map(ele => {
            if (val.deviceUuid === ele.uuid) {
              arr.push(ele)
            }
          })
        })
        this.resuleData = arr
      })
    },
    methods: {
      eyeView(row) {
        this.viewData = row
        this.viewData.taskId = this.viewResult.taskId
        this.viewDialog = true
      }
    }
  }
</script>
<style lang="stylus">
</style>
