<template>
    <div>
        <s-button icon='add' style="margin-bottom:10px" @click="addWork">添加工作信息</s-button>
        <s-table-page :data='tableData'>
          <s-table-column prop="workInfo" label="工作信息"></s-table-column>
          <s-table-column prop="files" label="文件"></s-table-column>
          <s-table-column prop="userName" label="提交人"></s-table-column>
          <s-table-column prop="createTime" label="提交日期"></s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="eyes(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
        <div style="margin-top:10px">
          <s-button :disabled='flag' @click="achieve">完成</s-button>
          <s-button :disabled='flag' @click="repair">委派</s-button>
        </div>
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
            <s-button @click="addWorkInfo">添加</s-button>
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
        <Appoint-task-dialog v-model="appointDialog" v-if="appointDialog" :orderUuid='taskUuid' @receives='receive'></Appoint-task-dialog>
    </div>
</template>
<script>
import $axios from 'sunflower-ajax'
import AppointTaskDialog from '@/pages/Safety_BulletinTask/components/dialog/AppointTaskDialog';
import workInfoDetail from '@/pages/Safety_BulletinTask/components/dialog/EyeTaskWorkDetails'
export default {
    data() {
        return {
            tableData: [
            ],
            workDialog: false,
            addWorkinfoFlag: false,
            workInfoForm: {
              content: ''

            },
            workInfoFormRules: {},
            workInfoUrl: `${$axios.basePath()}/safetyPlatform/fileUpload/uploadOrderFile/2`,  // 附件列表上传地址
            fileList: [],
            fileListUpload: [],
            workInfoDetailData: {},
            appointDialog: false,
            flag: false
        }
    },
    created() {
        this.getData()
        console.log(this.jurisdiction)
    },
    props: {
        orderUuid: String,
        taskUuid: String,
        jurisdiction: Boolean
    },
    watch: {
      jurisdiction: {
        immediate: true,
        handler(val) {
          this.flag = val
        }
      }
    },
    components: {
      workInfoDetail,
      AppointTaskDialog
    },
    methods: {
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
        eyes(row) {
            this.workInfoDetailData = row
            this.workDialog = true
        },
        addWork() {
          this.addWorkinfoFlag = true
        },
        achieve() {
            $axios.get(`/safetyPlatform/safeOrderTask/finishOrderTask/${this.taskUuid}`).then(res => {
              if (res.data.state) {
                this.$message({message: '处理完成!', type: 'success'});
                this.getData()
                this.$emit('receive', true)
              }
            })
        },
        repair() {
          this.appointDialog = true
        },
        receive() {
          this.$emit('receive', true)
          this.getData()
        },
        getData() {
            $axios.get(`/safetyPlatform/safeOrderTask/getSafeOrderTaskWorkFlow/${this.taskUuid}`).then(res => {
                this.tableData = res.data
                this.tableData.map((val, i) => {
                  this.tableData[i].files = val.fileList.length
                  if (val.workInfo === '') {
                    this.tableData[i].workInfo = '上传附件'
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
        },
        // 移除上传对列
        uploadRemove(file, fileList) {
          this.fileList.forEach((itemFile, indexFile) => {
            if (itemFile.fileUuid === file.response.fileUuid) {
              this.fileList.splice(indexFile, 1)
            }
          })
          // this.deleteFile(file.response.fileUuid, file.response.filePath)
        },
        // 添加工作信息
        addWorkInfo() {
          if (this.workInfoForm.content || this.fileList.length > 0) {
            let uuid = this.fileList.map((item) => {
              return item.fileUuid
            })
            let param = {
              workInfo: this.workInfoForm.content,
              taskUuid: this.taskUuid,
              fileUuids: uuid.join(',')
            }
            $axios.post(`/safetyPlatform/safeOrderTask/saveOrderTaskWorkFlow`, param).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.fileList = []  // 添加工作信息的uuid参数
                this.fileListUpload = []  // 上传显示列表绑定的List
                this.workInfoForm.content = ''
                this.addWorkinfoFlag = false
                this.getData()
              } else {
                this.$message({
                  type: 'error',
                  message: '添加失败！'
                })
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
        // 删除附件接口
        // deleteFile(deleteUuid, path) {
        //   let parms = {
        //     type: 2,
        //     fileUuid: deleteUuid,
        //     fielPath: path
        //   }
        //   $axios.post(`/safetyPlatform/fileUpload/deleteOrderFile`, parms).then(({data}) => {
        //     if (data.state === true) {
        //       this.$message({
        //         type: 'success',
        //         message: '删除成功！'
        //       })
        //     } else {
        //       this.$message({
        //         type: 'error',
        //         message: '删除失败，请重试！'
        //       })
        //     }
        //   })
        // }
    }
}
</script>
