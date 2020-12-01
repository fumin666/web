<template>
    <div class='AgreeAssociateForm'>
        <s-dialog
            v-model="dialogFlag"
            v-if="dialogFlag"
            width="700px"
            append-to-body
            title="工单指派">
            <s-table-page :data='userData' :header-search="getSearchDef()" @selection-change="handleSelectionChange">
                <s-table-column width="100" center label="单选">
                    <template slot-scope="scope">
                      <s-radio class="radioType" v-model="userUuid" :label="scope.row.uuid" @change="getCurrentRow(scope.row)"></s-radio>
                    </template>
                </s-table-column>
                <s-table-column prop="userRealName" label="真实姓名"></s-table-column>
                <s-table-column prop="userLoginName" label="账号名称"></s-table-column>
                <s-table-column prop="departName" label="所属机构"></s-table-column>
            </s-table-page>
            <template slot="footer" class="dialog-footer">
                <s-button @click="Save">保存</s-button>
                <s-button type="cancel" @click="dialogFlag = false">关闭</s-button>
            </template>
        </s-dialog>
    </div>
</template>
<style>
  .radioType .s-radio__label{
    display: none;
  }
  .AgreeAssociateForm .minHeightScrollbar{
      max-height: 300px;
  }
  .AgreeAssociateForm .footerRow{
      text-align : right;
      margin : 15px 0 5px 0
  }
</style>
<script>
import $axios from 'sunflower-ajax'
export default {
    data() {
        return {
            dialogFlag: false,
            userData: [],
            radio: '',
            userUuid: ''
        }
    },
    props: {
        orderUuid: String,
        currentNodeUuid: String,
        taskName: String,
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
            placeholder: '请输入真实姓名、账号名称、所属机构',
            searchProps: ['userRealName', 'userLoginName', 'departName']
            }
        },
        // 获取用户列表
        getUsers() {
          if (this.$route.name === 'gradeProtect') {
            $axios.get('/safetyPlatform/safeOrder/getGradeProtectUserList').then(res => {
              this.userData = res.data
            })
          } else {
            $axios.get('/safetyPlatform/safeOrder/getSafeUserInfoList').then(res => {
              this.userData = res.data
            })
          }
        },
        // 指派工单
        Save() {
          let str = ''
          if (this.$route.name === 'gradeProtect') {
            str = `指派|我的待办>等保工作(${this.taskName})`
          } else {
            str = `指派|通报(${this.taskName})`
          }
          $axios.get(`/safetyPlatform/safeOrder/assignSafeOrder/${this.orderUuid}/${this.userUuid}`, {
              data: [],
              logTemplate: str
            }).then(res => {
                if (res.data.state) {
                    this.$message({message: '指派成功!', type: 'success'});
                    this.dialogFlag = false
                    this.$emit('receive', true)
                } else {
                    this.$message({message: res.data.errormsg, type: 'error'});
                }
            })
        },
        getCurrentRow(row) { // 获取单选框选中行的data
            this.userUuid = row.uuid
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
