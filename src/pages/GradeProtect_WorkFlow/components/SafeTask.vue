<template>
    <div>
        <s-dialog
            v-model="dialogFlag"
            v-if="dialogFlag"
            width="600px"
            :title="titleLine + '任务单'">
            <s-form :model="safetaskForm" :rules="safetaskRule" ref="safetaskForm" label-width='100px'>
                <s-form-item label="任务ID：" prop='taskId'>
                    <s-input v-model="safetaskForm.taskId" disabled></s-input>
                </s-form-item>
                <s-form-item label="任务标题：" prop='taskTitle'>
                    <s-input v-model="safetaskForm.taskTitle"></s-input>
                </s-form-item>
                <s-form-item label="任务内容：" prop='taskContent'>
                    <s-input type='textarea' v-model="safetaskForm.taskContent"></s-input>
                </s-form-item>
                <s-form-item label="任务执行人" prop='assignUser'>
                    <s-select v-model="safetaskForm.assignUser">
                      <s-option v-for='val in userData' :key='val.uuid' :value='val.uuid' :label='val.userRealName'>{{val.userRealName}}</s-option>
                    </s-select>
                </s-form-item>
            </s-form>
            <template slot="footer" class="dialog-footer">
                <s-button @click="Save">保存</s-button>
                <s-button type="cancel" @click="dialogFlag = false">关闭</s-button>
            </template>
        </s-dialog>
    </div>
</template>
<script>
import $axios from 'sunflower-ajax'
export default {
    data() {
        return {
            safetaskRule: {
                taskTitle: [{required: true, message: '不能为空', trigger: 'blur'}],
                taskContent: [{required: true, message: '不能为空', trigger: 'blur'}, {max: 120, message: '最大长度为120', trigger: 'blur'}],
                assignUser: [{required: true, message: '不能为空', trigger: 'blur'}]
            },
            safetaskForm: {
                orderUuid: '',
                currentNodeUuid: '',
                taskId: '',
                taskTitle: '',
                taskContent: '',
                assignUser: '',
                typeUuid: ''
            },
            dialogFlag: false,
            titleLine: '',
            userData: []
        }
    },
    props: {
        orderUuid: String,
        currentNodeUuid: String,
        typeUuid: String,
        value: {
            type: Boolean,
            default: false
        },
        title: String,
        editData: Array
    },
    methods: {
        // 获取人员列表信息
        getUsers() {
            $axios.get('/safetyPlatform/safeOrder/getGradeProtectUserList').then(res => {
                this.userData = res.data
            })
        },
        // 获取任务单编号
        getOrderOrTaskId() {
            $axios.get('/safetyPlatform/safeOrder/getOrderOrTaskId/2').then(res => {
                this.safetaskForm.taskId = res.data
            })
        },
        // 新增工单
        Save() {
            this.safetaskForm.orderUuid = this.orderUuid
            this.safetaskForm.currentNodeUuid = this.currentNodeUuid
            this.safetaskForm.typeUuid = this.typeUuid
            this.$refs['safetaskForm'].validate((valid) => {
              if (valid) {
                if (this.editData) {
                  let parms = {
                    taskTitle: this.safetaskForm.taskTitle,
                    taskContent: this.safetaskForm.taskContent,
                    assignUser: this.safetaskForm.assignUser,
                    uuid: this.editData.uuid
                  }
                  $axios.post('/safetyPlatform/safeOrderTask/updateSafeOrderTask', parms).then(res => {
                      if (res.data.state) {
                          this.$message({message: '编辑成功!', type: 'success'});
                          this.$emit('safeTask', true)
                          this.dialogFlag = false
                      } else {
                          this.$message({message: res.data.errormsg, type: 'error'});
                      }
                  })
                } else {
                  $axios.post('/safetyPlatform/safeOrderTask/saveSafeOrderTask', this.safetaskForm).then(res => {
                      if (res.data.state) {
                          this.$message({message: '保存成功!', type: 'success'});
                          this.dialogFlag = false
                      } else {
                          this.$message({message: res.data.errormsg, type: 'error'});
                      }
                  })
                }
               }
            })
        }
    },
    created() {
        if (this.editData) {
            this.titleLine = '编辑'
            this.safetaskForm.taskId = this.editData.taskId
            this.safetaskForm.taskTitle = this.editData.taskTitle
            this.safetaskForm.taskContent = this.editData.taskContent
            this.safetaskForm.assignUser = this.editData.assignUser
        } else {
            this.titleLine = '创建'
        }
        this.getUsers()
        this.getOrderOrTaskId()
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
    }
}
</script>
