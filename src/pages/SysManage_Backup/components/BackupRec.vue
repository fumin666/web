<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @Date: 2019-02-14 10:42:43
 * @LastEditors: 高建鹏
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-06-14 17:05:23
 * @Description: 备份恢复tab
 -->

<template>
  <div class="backup-rec">
    <s-row class="topRow" style="float:left;">
      <s-button @click="localDialogFlag=true" icon="plus">本地恢复</s-button>
      <s-button @click="remoteDialogFlag=true" icon="batch-del">远程恢复</s-button>
    </s-row>
    <s-table-page :data="backupRecList"  :header-search="searchDef()" >
      <s-table-column label="文件名" prop="fileName"></s-table-column>
      <s-table-column label="大小" prop="fileSize"></s-table-column>
      <s-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <i class="iconfont icon-back-square" @click="rowRec(scope.row)" title="恢复"></i>
          <div v-if="!BackUping && scope.row.uuid === nowId" style="float: left;margin: 2px 22px 0 0">
            <s-spin color="#30a6fd" type="clip" size="12px"></s-spin>
          </div>
          <!--<i v-if="!BackUping && scope.row.uuid !== nowId" title='禁止还原' class="iconfont icon-ban"></i>-->
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!-- 本地恢复弹框 -->
    <LocalRecDialog v-if="localDialogFlag" v-model="localDialogFlag" @reload="getBackupRecList"></LocalRecDialog>

    <!-- 远程恢复弹框 -->
    <RemoteRecDialog v-if="remoteDialogFlag" v-model="remoteDialogFlag" @reload="getBackupRecList"></RemoteRecDialog>

  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';

// import {Validaters} from 'sunflower-common-utils';
// import {Download} from 'sunflower-common-utils'
import LocalRecDialog from '../dialog/LocalRecDialog.vue';   // 本地恢复弹框
import RemoteRecDialog from '../dialog/RemoteRecDialog.vue'; // 远程恢复弹框

export default {
  components: {
    LocalRecDialog,  // 本地恢复弹框
    RemoteRecDialog  // 远程恢复弹框
  },
  data() {
    return {
      backupRecList: [], // 恢复文件列表
      localDialogFlag: false,   // 本地恢复弹框控制
      remoteDialogFlag: false,   // 远程恢复弹框控制
      BackUping: true
    }
  },
  created() {
    this.getBackupRecList();
  },
  methods: {
    searchDef() {
      return {
        width: 4,
        offset: 20,
        placeholder: '请输入关键字',
        searchProps: ['fileName'],
        nowId: ''
      }
    },
    getBackupRecList() {
      $axios.get(`/systemmanager/sysBackupLog/restoreList`).then(({data}) => {
        this.backupRecList = data;
      })
    },
    rowRec(row) {
      // 还原成功状态码500，前端无法处理，所以成功日志后台添加
      let vm = this
      vm.$confirm('确定恢复？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.BackUping = false;
        vm.nowId = row.fileName;
        $axios.get(`/systemmanager/sysBackupLog/uptSysBackupLog/${row.fileName}`, {
          data: [row],
          logTemplate: '恢复|备份恢复>文件(#fileName#备份包)'
        }, {
          timeout: 0
        }).then((res) => {
          if (res.data === true) {
            vm.$message({
              type: 'success',
              message: '还原成功,服务正在重启!'
            });
          } else if (res.data === false) {
            vm.$message({
              type: 'error',
              message: '还原失败!'
            });
          } else {
            vm.$message('服务正在重启!');
          }
          vm.getBackupRecList();
          vm.BackUping = true
        });
        vm.$message('服务正在重启，请稍候访问!');
      }).catch(() => {});
    },
    rowDel(row) {
      let vm = this
      vm.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.get(`systemmanager/sysBackupLog/delSysBackupFile/${row.fileName}`, {
          data: [row],
          logTemplate: '删除|备份恢复>文件(#fileName#备份包)'
        }).then((res) => {
          if (res.data.state === true) {
            vm.$message({type: 'success', message: '删除成功'});
            vm.getBackupRecList();
          } else {
            vm.$message({type: 'error', message: '删除失败'});
          }
        });
      }).catch(() => {});
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
