/*
create by YOU
*/
<template>
  <div>
    <div style="margin-bottom: 15px">
      <s-button @click="doRecovery" icon="back-square">恢复</s-button>
      <s-button @click="doDelete" icon="delete">删除</s-button>
      <s-button type="transparent">恢复方式: </s-button>
      <s-select v-model="recoveryType">
        <s-option label="本地恢复" :value="0"></s-option>
        <s-option label="远程恢复" :value="1"></s-option>
      </s-select>
      <div v-if="recoveryType === 0" style="display: inline-block; margin-left: 10px">
        <!--<s-upload-->
        <!--ref="upload"-->
        <!--class="upload-archiving"-->
        <!--:action="actionUrl"-->
        <!--:on-success="handleUploadSuccess"-->
        <!--:on-error="uploadError"-->
        <!--:file-list="fileList"-->
        <!--:on-change="handleUploadChange"-->
        <!--:auto-upload="false"-->
        <!--&gt;-->
        <!--<s-button slot="trigger">选择文件</s-button>-->
        <!--<div slot="tip" class="upload-archiving__tip">-->
        <!--仅支持上传后缀为：1.sicapdata.tar.gz;2.sicapdatas.tar.gz;3.omlog.tar.gz;4.omrec.tar.gz的文件-->
        <!--</div>-->
        <!--</s-upload>-->
        <s-upload
          ref="upload"
          :action="actionUrl"
          class="upload-archiving"
          :on-success="handleUploadSuccess"
          :on-change="handleUploadChange"
          :on-error="uploadError"
          :auto-upload="false"
          :file-list="fileList">
          <s-button slot="trigger" icon="folder">浏览</s-button>
          <div slot="tip" class="upload-archiving__tip">
            仅支持上传后缀为：-sicapdatas.tar.gz的文件
          </div>
        </s-upload>
      </div>
      <div v-else style="position: relative; display: inline-block; margin-left: 10px;">
        <span class="spanText">远程服务器：</span>
        <s-select v-model="serverRecovery.uuid" @change="changePath">
          <s-option v-for="item in serversList" :label='`${item.archiveDeviceIp}(${item.archiveDeviceName})`'
                    :value="item.uuid"
                    :key="item.uuid"></s-option>
        </s-select>
        <s-input v-model="serverRecovery.archivePath" style="width: 750px"></s-input>
        <div class="from-server__tip">仅支持上传后缀为：-sicapdatas.tar.gz的文件</div>
      </div>
      <s-button @click="submit" icon="correct">提交</s-button>
    </div>
    <s-table-page
      @selection-change="handleSelectionChange"
      :data="data">
      <s-table-column width="45" type="selection"></s-table-column>
      <s-table-column label="文件名" prop="name"></s-table-column>
      <s-table-column label="文件大小">
        <template slot-scope="scope">
          {{ scope.row.value }}
        </template>
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default {
    data () {
      return {
        data: [],
        selectedList: [],
        recoveryType: 0,
        localRecovery: {
          file: ''
        },
        serverRecovery: {
          uuid: '',
          archivePath: ''
        },
        fileList: [],
        serversList: [],
        serversUuidList: [],
        actionUrl: `${$axios.basePath()}archInfo/uploadRestoreFile`
      }
    },
    created() {
      this.init()
      this.getServerList()
    },
    methods: {
      init() {
        $axios.get('/archInfo/getRestoreList').then(({data}) => {
          this.data = data
        })
      },
      getServerList() {
        $axios.post('/archiveDevice/getList').then(({data}) => {
          this.serversList = data
          this.serverUuidList = data.map(item => item.uuid)
          if (data.length > 0) {
            this.serverRecovery.uuid = data[0].uuid
            this.serverRecovery.archivePath = data[0].archiveDeviceDir
          }
        })
      },
      changePath(uuid) {
        let i = this.serverUuidList.indexOf(uuid)
        if (i !== -1) {
          this.serverRecovery.archivePath = this.serversList[i].archiveDeviceDir
        }
      },
      doRecovery() {
        if (this.selectedList.length > 0) {
          $axios.post('/archInfo/restore/', this.selectedList.map(item => item.name), {
            data: this.selectedList,
            logTemplate: '恢复|归档恢复>文件(#name#)'
          }).then(({data}) => { })
          this.$message.success('正在恢复中...')
        } else {
          this.$message.error('请选择要恢复的列表项!')
        }
      },
      doDelete() {
        if (this.selectedList.length > 0) {
          this.$confirm('确定删除所选文件?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post('/archInfo/deleteRestore/', this.selectedList.map(item => item.name)).then(({data}) => {
              if (data === true) {
                this.$message.success('删除成功!')
                this.init()
              } else {
                this.$message.error('删除失败!')
              }
            })
          }).catch(() => {});
      } else {
          this.$message.error('请选择要删除的列表项!')
        }
      },
      submit() {
        if (this.recoveryType === 0) {
          let file = this.fileList[0]
          if (!file) {
            this.$message('请选择恢复文件')
            return
          }
          // 用（this.fileList = [file]）方式放入的文件，submit调用失败
          this.$refs.upload.$refs['upload-inner'].upload(file.raw, file)
        } else {
          if (this.serverRecovery.uuid && this.serverRecovery.archivePath) {
            if (/sicapdatas\.tar\.gz$/.test(this.serverRecovery.archivePath)) {
              $axios.post('/archInfo/getFtpFile/', this.serverRecovery).then(({data}) => {
                if (data === true) {
                  this.$message.success('提交成功!')
                  this.init()
                } else {
                  this.$message.error('提交失败!')
                }
              })
            } else {
              this.$message.error('只能填写后缀为：-sicapdatas.tar.gz的文件!')
            }
          } else {
            this.$message.error('请填写完整恢复内容!')
          }
        }
      },
      handleUploadSuccess(res, file) {
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.init()
      },
      uploadError() {
        this.$message({
          type: 'error',
          message: '上传失败'
        });
      },
      handleUploadChange(file, fileList) {
        console.log(this.$refs.upload.uploadFiles)
        if (!/sicapdata\.tar\.gz$|sicapdatas\.tar\.gz$/.test(file.name)) {
          this.$message.error('文件类型错误')
          this.fileList = []
        } else {
          this.fileList = [file]
        }
      },
      handleSelectionChange(selection) {
        this.selectedList = selection
      }
    }
  };
</script>
