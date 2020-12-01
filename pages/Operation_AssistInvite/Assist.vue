<template>
  <section>
    <s-tab type="card" class="oper-subpage-margin" @on-click="chooseTab">
      <s-tab-pane label="运维列表" v-if="judgeRoleBtn('operationCenter_invitedAssistOperationList')">
        <s-table-page :data='lists'
                  :row-actions='getListRowActionsDef()'
                  :header-search='getSearchDefList()'>
          <s-table-column
            prop="itcompName"
            label="资产名称"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="itcompPort"
            label="端口"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="accountName"
            label="账号"
            show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="运维协助" v-if="judgeRoleBtn('operationCenter_invitedAssistOperationAssist')">
        <s-table-page :data='assist'
                  :row-actions='getAssistRowActionsDef()'
                  :header-search='getSearchDefAssist()'>
          <s-table-column
            prop="itcompName"
            label="资产名称"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="itcompPort"
            label="端口"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="accountName"
            label="账号"
            show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="运维邀请" v-if="judgeRoleBtn('operationCenter_invitedAssistOperationInvited')">
        <s-table-page :data='invite'
                  :row-actions='getInviteRowActionsDef()'
                  :header-search='getSearchDefInvite()'>
          <s-table-column
            prop="itcompName"
            label="资产名称"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="itcompPort"
            label="端口"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="accountName"
            label="账号"
            show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <!--运维-->
    <s-dialog
      v-model="assistDialog"
      v-if="assistDialog"
      width="600px"
      title="接受邀请协助">
      <ops-assist :uuid="uuids" :sessionUuid="sessionUuids" ref="getOps"></ops-assist>
      <template slot="footer" class="dialog-footer">
        <s-button @click="startOps">保存</s-button>
        <s-button type="cancel" @click="assistDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--邀请-->
    <s-dialog
      v-model="inviteDialog"
      v-if="inviteDialog"
      width="600px"
      title="邀请">
      <s-form ref="formInvite" :model="inviteForm" :rules="inviteRule" label-width="120px">
        <s-form-item label="邀请人" prop="userUuid">
          <s-select v-model="inviteForm.userUuid" filterable clearable>
            <s-option v-for="item in inviteMan" :key="item.id" :label="item.userRealName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveInviteMan">确定</s-button>
        <s-button type="cancel" @click="inviteDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  import opsAssist from './OpsAssist'
  export default {
    data() {
      return {
        // propList: [],
        lists: [],
        assist: [],
        invite: [],
        inviteForm: {
          userUuid: ''
        },
        inviteDialog: false,
        assistDialog: false,
        inviteMan: [],
        uuids: '',
        sessionUuid: '',
        sessionUuids: '',
        saveInviteManUuid: '',
        inviteRule: {
          userUuid: [
            {required: true, message: '请选择邀请人', trigger: 'blur'}
          ]
        }
      }
    },
    components: {

      opsAssist
    },
    methods: {
      chooseTab(key) {
        switch (key) {
          case 0: this.getLists(); break;
          case 1: this.getAssist(); break;
          case 2: this.getInvite(); break;
        }
      },
      startOps() {
        const formObj = this.$refs['getOps'].$refs['addForm']
        const form = this.$refs['getOps'].form
        formObj.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('/invitHelp/startClient', form).then((res) => {
            if (res.status === 200) {
              if (res.data.status === 'true') {
                this.$message({message: res.data.msg, type: 'success'});
                this.assistDialog = false;
                if (res.data.url !== '' || res.data.url !== null || res.data.url !== undefined) {
                  window.location.href = res.data.url
                }
              } else {
                this.$message({message: res.data.msg, type: 'error'});
              }
            }
          })
        })
      },
      getDynamicColumns() {
        $axios.get(`/checkCmd/getSysOperList/invitHelp`).then(res => {
          this.propList = res.data
        });
      },
      saveInviteMan() {
        let form = this.$refs['formInvite']
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.get(`/invitHelp/doInviter/${this.sessionUuid}/${this.inviteForm.userUuid}/${this.saveInviteManUuid}`).then((res) => {
            if (res.data.status === 'true') {
              this.$message({message: res.data.msg, type: 'success'});
              this.inviteDialog = false;
              this.getLists()
            } else {
              this.$message({message: res.data.msg, type: 'error'});
            }
          })
        })
      },
      getSearchDefList() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['itcompName', 'controlAdderss', 'itcompPort', 'protocolName', 'accountName'] // can be string or Array
        }
      },
      getSearchDefAssist() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['itcompName', 'controlAdderss', 'itcompPort', 'protocolName', 'accountName'] // can be string or Array
        }
      },
      getSearchDefInvite() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['itcompName', 'locationName', 'controlAdderss', 'itcompPort', 'protocolName', 'accountName'] // can be string or Array
        }
      },
      getListRowActionsDef() {
        let vm = this;
        return [{
          name: '邀请',
          icon: 'assist',
          click(row) {
            vm.saveInviteManUuid = row.uuid
            if (row.inviterFlag === 0) {
              vm.$message({
                message: '邀请不可用',
                type: 'error'
              });
              return false
            }
            $axios.get(`/invitHelp/getInviterPerson/${row.itcompUuid}/${row.protocolUuid}/${row.portUuid}/${row.itcompPort}/${row.uuid}`).then(res => {
              vm.inviteDialog = true
              vm.inviteMan = res.data.user
              vm.sessionUuid = res.data.sessionUuid
            });
          }
        }]
      },
      getAssistRowActionsDef() {
        let vm = this;
        return [{
          icon: 'sponsor',
          click(row) {
            if (row.inviterFlag === 0 || row.itcompPort === null || row.itcompPort === '' || row.itcompPort === void 0) {
              vm.$message({
                message: '接受邀请不可用',
                type: 'error'
              });
              return false
            }
            vm.assistDialog = true
            vm.uuids = row.uuid
            vm.sessionUuids = row.sessionUuidA
          },
          name: '接受邀请'
        }]
      },
      getInviteRowActionsDef() {
        let vm = this;
        return [{
          icon: 'assist-cancel',
          click(row) {
            let form = {
              sessionUuidA: row.sessionUuidA,
              sessionUuidB: row.sessionUuidB
            }
            $axios.post('/invitHelp/cancelInvite', form).then((res) => {
              if (res.data.status === 'true') {
                vm.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                vm.getInvite()
              } else {
                vm.$message({
                  message: res.data.msg,
                  type: 'error'
                });
              }
            })
          },
          name: '取消邀请'
        }]
      },
      getLists() {
        $axios.get('/invitHelp/getOperationList').then(res => {
          this.lists = res.data
        });
      },
      getAssist() {
        $axios.get('/invitHelp/getOperationHelpList').then(res => {
          this.assist = res.data
        });
      },
      getInvite() {
        $axios.get('/invitHelp/getOperationInviterList').then(res => {
          this.invite = res.data
        });
      }
    },
    mounted() {
      this.getLists()
      this.getAssist()
      this.getInvite()
      // this.getDynamicColumns()
    },
    watch: {
      inviteDialog(val) {
        if (val === false) {
          this.$refs['formInvite'].resetFields()
        }
      }
    }
  }
</script>
