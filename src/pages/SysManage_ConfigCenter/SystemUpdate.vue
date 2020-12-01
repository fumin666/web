/**
* Created by dgunzi on 2019/02/27.
* 升级弹出框
*/
<template>
  <section class="sys-upgrade">
    <div class="s-loading-mask loadingClass" v-if="showLoading">
      <div class="s-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
        </svg>
        <p class="s-loading-text">正在上传{{uploadProcess.fileName}}...</p>
        <p class="s-loading-text">{{uploadProcess.percent}}%</p>
      </div>
    </div>
    <s-row type="flex" justify="center">
      <s-upload
        ref="upload"
        class="upload-demo"
        drag
        :show-file-list="false"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :accept="'.pub'"
        :on-progress="uploadProgress"
        :before-upload="handleChange"
        :action="`${upLoadUrl}configcenter/upgrade/uploadFile`"
        mutiple>
        <i class="iconfont icon-cloud"></i>
        <div class="s-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="s-upload__tip" slot="tip">只能上传.pub文件</div>
        <div class="s-upload__tip" slot="tip">内部版本：<span style="font-size: 16px;color:#e33535">{{innerVersion}}</span>
        </div>
      </s-upload>
    </s-row>
    <s-row class="title">
      <i class="iconfont icon-tag"></i>
      升级列表
    </s-row>
    <s-scrollbar wrap-class="scrollMiniheight">
      <s-row>
        <s-table-page :data='upgradeList'
                  :hasActionCol='false'
                  :pagination-def="getPaginationDef()">
          <s-table-column
            prop="updateTime"
            label="时间"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="userName"
            label="操作人"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="operationIp"
            label="客户端IP"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="fileName"
            label="升级包名称"
            show-overflow-tooltip
            width="320">
          </s-table-column>
          <s-table-column
            prop="newVersion"
            label="升级包版本"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="oldVersion"
            label="前置版本"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="state"
            label="状态">
            <template slot-scope="scope">
              <s-tag :type="scope.row.state | statusFilter">{{scope.row.state | wordFilter}}</s-tag>
            </template>
          </s-table-column>
          <s-table-column
            label="操作">
            <template slot-scope="scope">
              <i v-if="isShowUpgrade(scope.row)" @click="upgradeHandler(scope.row)" title="升级" class="iconfont icon-update"></i>
              <i v-if="!isShowUpgrade(scope.row)">已升级</i>
              <i v-if="scope.row.state !==3" class="iconfont icon-delete" @click="deleteProduct(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        upLoadUrl: '',
        upgradeList: [],
        innerVersion: '',
        showLoading: false,
        uploadProcess: {
          fileName: '',
          percent: 0
        }
      }
    },
    components: {},
    created() {
      $axios.get('/configcenter/sysconfig/getInnerVersion').then((res) => {
        if (res.data) {
          this.innerVersion = res.data;
        }
      });
      this.upLoadUrl = $axios.basePath();
      this.getList()
    },
    filters: {
      statusFilter(status) {
        const statusMap = ['success', 'danger', 'success', 'danger']
        return statusMap[status - 1]
      },
      wordFilter(status) {
        switch (status) {
          case 1:
            return '上传成功'
          case 2:
            return '上传失败'
          case 3:
            return '升级成功'
          case 4:
            return '升级失败'
        }
      }
    },
    methods: {
      isShowUpgrade(row) {
        switch (row.state) {
          case 1:
            return true
          case 2:
            return false
          case 3:
            return false
          case 4:
            return true
        }
      },
      deleteProduct(row) {
        this.$confirm('确定要删除？', '提示', {
          confirmButonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/configcenter/upgrade/deleteUpgradeLog/${row.logUuid}`, {
            data: [row],
            logTemplate: '删除|系统升级(#fileName#升级包)'
          }).then(({data}) => {
            if (data.result === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.getList();
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {});
      },
      upgradeHandler(row) {
        this.$confirm('确认升级系统？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let Loading = this.$loading({
            text: '正在升级，请稍候...',
            customClass: 'checkLoading'
          });
          $axios.get(`/configcenter/upgrade/upgradeSys/${row.logUuid}`, {
            data: [row],
            logTemplate: '升级|系统升级(#fileName#升级包)'
          }).then((res) => {
            if (res.data.result) {
              this.$message({
                type: 'success',
                message: res.data.errormsg
              });
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.errormsg
              });
              this.getList()
            }
            Loading.close()
          });
        }).catch(() => {});
      },
      uploadProgress(event, file, fileList) {
        this.showLoading = true;
        this.uploadProcess.fileName = file.name;
        this.uploadProcess.percent = Number.parseInt(event.percent);
      },
      uploadSuccess(res, file) {
        this.showLoading = false;
        this.$message({type: 'success', message: '上传成功'});
        this.getList()
        $axios.log({
          logTemplate: `上传|系统升级(${file.name})`,
          result: '成功'
        });
      },
      uploadError() {
        this.showLoading = false;
        this.$message({type: 'error', message: '上传失败'});
      },
      getPaginationDef() {
        return {
          layout: 'prev, pager, next',
          pageSize: 5
        }
      },
      getList() {
        $axios.get('/configcenter/upgrade/getUpgradeLog').then((res) => {
          if (res.data) {
            this.upgradeList = res.data;
          }
        });
      },
      handleChange(file) {
        let arr = file.name.split('.')
        let num = arr.length - 1
        if (arr[num] !== 'pub') {
          this.$message.error('文件类型必须是pub')
          return false
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .sys-upgrade
    .title
      font-size 14px
      font-weight 600
    .scrollMiniheight
      height 180px
      padding-right 8px
</style>
