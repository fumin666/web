<template>
    <div class='AgreeAssociateForm'>
        <s-dialog
            v-model="dialogFlag"
            v-if="dialogFlag"
            width="700px"
            title="工单详情">
            <template slot="footer" class="dialog-footer">
                <s-button @click="Save">保存</s-button>
                <s-button type="cancel" @click="dialogFlag = false">关闭</s-button>
            </template>
        </s-dialog>
    </div>
</template>
<style>
</style>
<script>
import $axios from 'sunflower-ajax'
export default {
    data() {
        return {
            dialogFlag: false,
            userData: [{userRealName: '123', id: 1}, {userRealName: '456', id: 2}],
            radio: '',
            userUuid: ''
        }
    },
    props: {
        orderUuid: String,
        currentNodeUuid: String,
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getSearchDef() {
            return {
            width: 12,
            offset: 12,
            placeholder: '请输入文档名称、文档类型查询',
            searchProps: ['docName', 'docType']
            }
        },
        // 获取用户列表
        getUsers() {
          if (this.$route.name === 'gradeProtect') {
            $axios.get('/safetyPlatform/safeOrder/getGradeProtectUserList').then(res => {
              // this.userData = res.data
            })
          } else {
            $axios.get('/safetyPlatform/safeOrder/getSafeUserInfoList').then(res => {
              // this.userData = res.data
            })
          }
        },
        // 新增工单
        Save() {
            $axios.post(`/safetyPlatform/safeOrder/assignSafeOrder/${this.orderUuid}/${this.userUuid}`).then(res => {
                if (res.data.state) {
                    this.$message({message: '保存成功!', type: 'success'});
                    this.dialogFlag = false
                } else {
                    this.$message({message: res.data.errormsg, type: 'error'});
                }
            })
        },
        getCurrentRow(row) { // 获取单选框选中行的data
            this.userUuid = row.id
        },
        handleSelectionChange(val) {

        },
        isSelectable(val) {

        }
    },
    created() {
        this.getUsers()
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
