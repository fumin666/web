<template>
    <div>
    <!-- 添加编辑Db弹出框 -->
        <s-scrollbar wrap-class="addAccountScrollbar">
          <s-row class="title">资产信息</s-row>
          <s-row>
            <s-col span="10">
              <div class="grid-content bg-purple">资产名称</div>
            </s-col>
            <s-col span="14">
              <div class="grid-content bg-purple-light">{{assetInfo.itcompName}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col span="10">
              <div class="grid-content bg-purple">IP地址</div>
            </s-col>
            <s-col span="14">
              <div class="grid-content bg-purple-light">{{assetInfo.controlAdderss}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col span="10">
              <div class="grid-content bg-purple">资产类型</div>
            </s-col>
            <s-col span="14">
              <div class="grid-content bg-purple-light">{{assetInfo.citypeName}}</div>
            </s-col>
          </s-row>
          <s-row class="title">数据库实例关联账号、协议/端口信息</s-row>
          <s-form :model="manageForm"  ref="manageForm" label-width="160px" class="formPadding" :rules="accountRules">
            <s-form-item label="协议/端口" prop="protocolName">
              <s-select v-model="manageForm.protocolName" class="formwidth"  @change='portname'>
                <s-option v-for='item in protocolNameArr' :key='item.value' :value='item.value' :label="item.name">
                </s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="账号名" prop="accountName" >
              <s-select v-model="manageForm.accountName" @change='accountchange' class="formwidth">
                <s-option v-for='item in AccountName' :key='item.value' :value='item.value' :label="item.name">
                </s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="账号角色" prop="accontRoleName">
              <s-input v-model="manageForm.accontRoleName" :maxlength="30" class="inputwidth" :disabled="true"></s-input>
            </s-form-item>
            <s-form-item label="账号类型" prop="accountTypeName">
              <s-input v-model="manageForm.accountTypeName" :maxlength="30" class="inputwidth" :disabled="true"></s-input>
            </s-form-item>
          </s-form>
        </s-scrollbar>
        <s-row class="footerRow">
          <s-button  @click="dialogOk('manageForm')">确定</s-button>
          <s-button type="cancel" @click="dialogFlag">取消</s-button>
        </s-row>
    </div>
</template>
<script>
import $axios from 'sunflower-ajax'
export default {
    data () {
        return {
          AssetUuid: '',
          assetInfo: {},
          manageForm: {
            protocolName: '',
            accountName: '',
            accontRoleName: '',
            accountTypeName: ''
          },
          protocolNameArr: [],
          AccountName: [],
          portId: '',
          accountId: '',
          accountRules: {
            protocolName: [
              {required: true, message: '不能为空', trigger: 'blur'}
            ]
          }
        }
    },
    props: {
      addDbDialog: {
        type: Object
      },
      addAssetUuid: {
        type: String,
        required: true
      },
      associated: {
        type: String,
        required: true
      },
      flag: {
        type: String,
        required: true
      }

    },
    methods: {
        // 保存
        dialogOk(manageForm) {
        this.$refs[manageForm].validate((valid) => {
          if (valid) {
            if (this.flag === '1') {
              let account = {
                deviceUuid: this.addAssetUuid,
                portUuid: this.portId,
                accountUuid: this.accountId,
                dbnameUuid: this.associated
              }
              $axios.post(`/databaseDbname/saveDbnameAccountProtoclRel`, account).then(({ data }) => {
                if (data.state === true) {
                  this.$message('添加成功')
                  this.$emit('closeaddDbDialog', '添加成功')
                } else {
                  this.$message('添加失败,' + data.errormsg)
                  this.$emit('closeaddDbDialog')
                }
                })
            } else {
              let account = {
                deviceUuid: this.addAssetUuid,
                portUuid: this.portId,
                accountUuid: this.accountId,
                dbnameUuid: this.associated,
                relUuid: this.addDbDialog.relUuid
              }
              $axios.post(`/databaseDbname/saveDbnameAccountProtoclRel`, account).then(({ data }) => {
                if (data.state === true) {
                  this.$message('编辑成功')
                  this.$emit('closeaddDbDialog', '编辑成功')
                } else {
                  this.$message('编辑失败,' + data.errormsg)
                  this.$emit('closeaddDbDialog')
                }
                })
              }
            }
          })
        },
        // 取消按钮
        dialogFlag() {
            this.$emit('closeaddDbDialog')
        },
        portname(val) {
          $axios.get(`/linkAccount/getAccountListByPortFilterByRole/${val}`).then(({ data }) => {
              this.AccountName = data
              this.portId = val
          })
        },
        accountchange(val) {
          $axios.get(`/assetsAccountInfo/getAssetsAccountInfoByUuid/${val}`).then(({ data }) => {
            this.accountId = val
            this.manageForm.accontRoleName = data.accountRoleName
            this.manageForm.accountTypeName = data.attributeName
          })
        }
    },
    created () {
      // 当前资产的uuid
      this.AssetUuid = this.addAssetUuid
      $axios.get(`/assetsAccountInfo/getAssetsInfo/${this.AssetUuid}`).then(({ data }) => {
        if (data) {
         this.assetInfo = Object.assign({}, data.assetsInfo)
        }
      })
      // 查询下拉框数据
      $axios.get(`/databaseDbname/getDatabaseProtocolPortByItcompUuid/${this.AssetUuid}`).then(({ data }) => {
        if (data !== null) {
          this.protocolNameArr = data
        }
      })
      if (this.flag === '2') {
        console.log(this.addDbDialog)
        this.manageForm.protocolName = this.addDbDialog.portUuid
        this.portname(this.addDbDialog.portUuid)
        this.manageForm.accountName = this.addDbDialog.accountUuid
        this.accountchange(this.addDbDialog.accountUuid)
        this.manageForm.accontRoleName = this.addDbDialog.accontRoleName
        this.manageForm.accountTypeName = this.addDbDialog.accountTypeName
      }
      if (this.flag === '1') {
          this.manageForm = {
            protocolName: '',
            accountName: '',
            accontRoleName: '',
            accountTypeName: ''
          }
      }
    }
}
</script>
<style lang="stylus" scoped>
.footerRow{
    text-align : right;
    margin : 15px 0 5px 0
    }
.formPadding{
    padding :10px;
}
.formwidth{
    width :90%
}
.inputwidth{
    width :50%
}
</style>

