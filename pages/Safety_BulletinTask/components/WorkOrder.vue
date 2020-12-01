<template>
    <div>
        <s-button icon='plus' style="margin-bottom:10px" :disabled='noButton' @click="addWork">添加工作信息</s-button>
        <s-table-page :data='tableData'>
          <s-table-column prop="workInfo" label="工作信息"></s-table-column>
          <s-table-column prop="fileLength" label="文件"></s-table-column>
          <s-table-column prop="userName" label="提交人"></s-table-column>
          <s-table-column prop="nodeName" label="节点名称"></s-table-column>
          <s-table-column prop="createTime" label="提交日期"></s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="eyes(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
        <s-dialog
          title="添加工作信息" top="10%" width="600px"
          v-if="addWorkinfoFlag"
          v-model="addWorkinfoFlag">
          <s-form ref="workInfoForm" :model="workInfoForm" :rules="workInfoFormRules" label-width="120px">
            <s-form-item label="工作信息" prop="content">
              <s-input type="textarea" :rows="3" v-model="workInfoForm.content"></s-input>
            </s-form-item>
            <s-form-item label="附件信息">
              <s-row>
                <s-upload class="upload"
                          ref="upload"
                          :action="workInfoUrl"
                          multiple
                          :limit=10
                          :on-exceed="uploadLimit"
                          :before-upload="beforeUpload"
                          :on-success="uploadSuccess"
                          :on-remove="uploadRemove"
                          :file-list="fileListUpload"
                          :with-credentials="true">
                  <s-button slot="trigger" icon="export">上传</s-button>
                </s-upload>
              </s-row>
            </s-form-item>
          </s-form>
          <template slot="footer" class="dialog-footer">
            <s-button :disabled="flag" @click="addWorkInfo">添加</s-button>
          </template>
        </s-dialog>
        <!--工作信息详情-->
        <s-dialog
          title="工作信息详情"
          width="700px"
          ref="workDialog"
          v-if="workDialog"
          v-model="workDialog">
          <work-info-detail :detailData="workInfoDetailData" @deleteAttachment="deleteAttachment"></work-info-detail>
        </s-dialog>
    </div>
</template>
<script>
import $axios from 'sunflower-ajax'
import workInfoDetail from '@/pages/Safety_BulletinTask/components/dialog/EyeWorkDetails'
export default {
    data() {
        return {
            tableData: [
            ],
            flag: false,
            workDialog: false,
            noButton: false,
            addWorkinfoFlag: false,
            workInfoForm: {
              content: ''

            },
            workInfoFormRules: {},
            workInfoUrl: `${$axios.basePath()}/safetyPlatform/fileUpload/uploadOrderFile/1`,  // 附件列表上传地址
            fileList: [],
            fileListUpload: [],
            workInfoDetailData: {}
        }
    },
    mounted() {
      this.$nextTick(function() {
        if (this.orderUuid) {
          this.getData()
        }
      })
    },
    props: {
        orderUuid: String,
        curNodeUuid: String,
        disButton: Boolean
    },
    components: {
      workInfoDetail
    },
    watch: {
      immediate: true,
      orderUuid: {
        handler(val) {
          this.getData()
        }
      },
      disButton: {
        immediate: true,
        handler(val) {
          this.noButton = val
        }
      }
    },
    methods: {
        eyes(row) {
            this.workInfoDetailData = row
            this.workDialog = true
        },
        deleteAttachment(parms) {
          this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post(`/safetyPlatform/fileUpload/deleteOrderFile`, parms).then(res => {
              if (res.data.state) {
                let index = 0
                this.workInfoDetailData.fileList.map((item, key) => {
                  if (item.fileUuid === parms.fileUuid) {
                    index = parseInt(key)
                  }
                })
                this.workInfoDetailData.fileList.splice(index, 1)
                this.getData()
                this.$message({message: '删除成功!', type: 'success'});
              } else {
                this.$message({message: '删除失败!', type: 'error'});
              }
            })
          }).catch(() => {});
        },
        addWork() {
          this.addWorkinfoFlag = true
        },
        getData() {
            $axios.get(`/safetyPlatform/safeOrder/getCurOrderWorkFlow/${this.orderUuid}/${this.curNodeUuid}`).then(res => {
                this.tableData = res.data
                this.tableData.map((val, index) => {
                  this.tableData[index].fileLength = val.fileList.length
                  if (val.workInfo === '') {
                    this.tableData[index].workInfo = '上传附件'
                  }
                })
            })
        },
        uploadSuccess(res) {
          if (res.state === 'false') {
            this.$message({message: res.errormsg, type: 'warning'});
          } else {
            this.fileList.push(res)
          }
        },
        // 移除上传对列
        uploadRemove(file, fileList) {
          this.fileList.forEach((itemFile, indexFile) => {
            if (itemFile.fileUuid === file.response.fileUuid) {
              this.fileList.splice(indexFile, 1)
            }
          })
          this.deleteFile(file.response.fileUuid, file.response.filePath)
        },
        uploadLimit(files, fileList) {
          if (files.length > 9 || fileList.length > 9 || (files.length + fileList.length) > 9) {
            this.$message({type: 'warning', message: '上传文件个数不能超过10个！'});
            return false;
          }
        },
        beforeUpload(file) {
          if (file.size > 100 * 1024 * 1024) {
            this.$message({type: 'warning', message: '单个文件大小不能超过100M！'});
            return false;
          }
          if (this.fileList.length > 0) {
            for (let i in this.fileList) {
              if (file.name === this.fileList[i].name) {
                this.$message({type: 'error', message: '请勿上传重复文件!'});
                return false;
              }
            }
          }
        },
        // 添加工作信息
        addWorkInfo() {
          this.flag = true
          if (this.fileList.length > 10) {
            this.$message({type: 'warning', message: '上传文件个数不能超过10个！'});
          } else {
            if (this.workInfoForm.content || this.fileList.length > 0) {
              let uuid = this.fileList.map((item) => {
                return item.fileUuid
              })
              let param = {
                workInfo: this.workInfoForm.content,
                orderUuid: this.orderUuid,
                itilNodeUuid: this.curNodeUuid,
                fileUuids: uuid.join(',')
              }
              this.fileList = []  // 添加工作信息的uuid参数
              this.fileListUpload = []  // 上传显示列表绑定的List
              $axios.post(`/safetyPlatform/safeOrder/saveOrderWorkFlow`, param).then(({data}) => {
                if (data.state === true) {
                  this.$message({
                    type: 'success',
                    message: '上传成功！'
                  })
                  this.flag = false
                  this.fileList = []  // 添加工作信息的uuid参数
                  this.fileListUpload = []  // 上传显示列表绑定的List
                  this.workInfoForm.content = ''
                  this.addWorkinfoFlag = false
                  this.getData()
                } else {
                  this.$message({
                    type: 'error',
                    message: '上传失败！'
                  })
                  this.flag = false
                }
              })
            } else {
              this.$message({
                type: 'warning',
                message: '请填写"工作信息"内容或上传"附件信息"！'
              })
              return false
            }
          }
        },
        // 删除附件接口
        deleteFile(deleteUuid, path) {
          let parms = {
            type: 1,
            fileUuid: deleteUuid,
            filePath: path
          }
          $axios.post(`/safetyPlatform/fileUpload/deleteOrderFile`, parms).then(({data}) => {
            if (data.state === true) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败，请重试！'
              })
            }
          })
        }
    }
}
</script>
