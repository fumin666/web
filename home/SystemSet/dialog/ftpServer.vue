<template>
  <div>
    <s-table-page :data='ftpList'  :header-actions='getListActionsDef()'
                  :row-actions='getRowActionsDef()'
                  :header-search='getSearchDef()' :hasActionCol='true'>
      <s-table-column prop="archiveDeviceType" label="服务器类型" :formatter="formatterStatus" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="archiveDeviceName" label="服务器名称" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="archiveDeviceIp" label="服务器IP" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="archiveDevicePort" label="服务器端口" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="archiveDeviceAccount" label="服务器账号名" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="archiveDeviceDir" label="归档路径" show-overflow-tooltip>
      </s-table-column>
    </s-table-page>
    <!--添加备份服务器-->
    <s-dialog v-model="backupServerDialog" v-if="backupServerDialog" title="添加备份服务器">
      <backup-server ref="addServer"></backup-server>
      <template slot="footer">
        <s-button @click="backupServerSave">保存</s-button>
        <s-button type="cancel" @click="backupServerDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看备份服务器-->
    <s-dialog v-model="eyeServerDialog" v-if="eyeServerDialog" title="查看备份服务器">
      <eye-server ref="editServer" :editData="editData"></eye-server>
    </s-dialog>
    <!--编辑备份服务器-->
    <s-dialog v-model="editServerDialog" v-if="editServerDialog" title="编辑备份服务器">
      <backup-server ref="editServer" :editData="editData"></backup-server>
      <template slot="footer">
        <s-button @click="editServerSave">保存</s-button>
        <s-button type="cancel" @click="editServerDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>

</template>
<script type="text/babel">
  // import SelectAsset from '../components/SelectAsset.vue'

  import BackupServer from '../BackupServer'
  import eyeServer from '../eyeServer'
  // import addRule from '../components/addRule.vue'
  import $axios from 'sunflower-ajax'
  import {cloneDeep} from 'lodash'
  import {decryptPwd, encryptPwd} from 'sunflower-common-utils'
  // import AddIpRule from '../components/AddIpRule.vue'
  // import EyeManage from '../components/EyeManage.vue'
  // import AdvanceProxySet from '../components/AdvanceProxySet.vue'
  import authCheck from '@/common/mixins/auth.js'
  // import EditManage from '../components/EditManage.vue'
  // import ApproveEditManage from '../components/ApproveEditManage.vue'

  export default {
    mixins: [authCheck],
    components: {
      BackupServer,

      // addRule,
      // SelectAsset,
      // AddIpRule,
      // EyeManage,
      // AdvanceProxySet,
      // EditManage,
      // ApproveEditManage,
      eyeServer
    },
    data() {
      return {
        editServerDialog: false,
        backupServerDialog: false,
        eyeServerDialog: false,
        ajaxObj: {
          type: 'post',
          url: '/archiveDevice/getList',
          params: {
            condition: {
              ip: ''
            }
          }
        },
        searchForm: {
          assetName: '',
          ip: '',
          citypeUuid: ''
        },
        ftpList: []
      }
    },
    mounted() {
    },
    created() {
      this.getFtpList()
    },
    methods: {
      getSearchDef() {
        return {
          width: 4,
          offset: 14,
          placeholder: '查询条件',
          searchProps: ['archiveDeviceType', 'archiveDeviceAccount', 'archiveDeviceDir', 'archiveDeviceIp', 'archiveDeviceName', 'archiveDevicePort'] // can be string or Array
        }
      },
      // 添加备份服务器
      backupServerSave() {
        const form = this.$refs['addServer'].$refs['serverForm']
        const addForm = this.$refs['addServer'].serverForm
        let afterForm = cloneDeep(addForm)
        afterForm.archiveDevicePasswd = encryptPwd(afterForm.archiveDevicePasswd)
        form.validate(valid => {
          if (!valid) return;
          // 服务器名称的长度判断
          if (afterForm.archiveDeviceName.length > 50) {
            this.$message({
              type: 'error',
              message: '服务器名称长度不超过50个字'
            });
            return;
          }
          $axios.post('/archiveDevice/save', afterForm, {
            logTemplate: '设置|FTP服务器配置'
          }).then((res) => {
            if (res.data === true) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.backupServerDialog = false
              this.getFtpList()
            } else {
              this.$message({
                message: '服务器名称或者IP地址/端口不可重复!',
                type: 'error'
              });
            }
          })
        })
      },
      editServerSave() {
        const form = this.$refs['editServer'].$refs['serverForm']
        const addForm = this.$refs['editServer'].serverForm
        let afterForm = cloneDeep(addForm)
        afterForm.archiveDevicePasswd = encryptPwd(afterForm.archiveDevicePasswd)
        form.validate(valid => {
          if (!valid) return;
          // 服务器名称的长度判断
          if (afterForm.archiveDeviceName.length > 50) {
            this.$message({
              type: 'error',
              message: '服务器名称长度不超过50个字'
            });
            return;
          }
          $axios.post('/archiveDevice/update', afterForm).then((res) => {
            if (res.data === true) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.editServerDialog = false
              this.getFtpList()
            } else {
              this.$message({
                message: '服务器名称或者IP地址/端口不可重复!',
                type: 'error'
              });
            }
          })
        })
      },
      showBackupServer() {
        this.backupServerDialog = true
      },
      //
      showEditServer(row) {
        this.editServerDialog = true
        this.editData = row
        this.editData.archiveDevicePasswd = decryptPwd(this.editData.archiveDevicePasswd)
      },
      eyeServer(row) {
        this.eyeServerDialog = true
        this.editData = row
        this.editData.archiveDevicePasswd = decryptPwd(this.editData.archiveDevicePasswd)
      },
      //
      formatterStatus(item) {
        return item.archiveDeviceType === 1 ? 'FTP服务器' : 'SFTP服务器';
      },

      //
      getFtpList() {
        $axios.get('/archiveDevice/getList').then((res) => {
          if (res.data) {
            this.ftpList = res.data
          } else {
            this.ftpList = [];
          }
        })
      },
      getRowActionsDef() {
        let vm = this;
        return [ {
          icon: 'eye',
          name: '查看',
          click(row) {
            vm.eyeServer(row)
          }
        }, {
          icon: 'edit',
          name: '修改',
          click(row) {
            vm.showEditServer(row)
          }
        }, {
          icon: 'delete',
          name: '删除',
          click(row) {
            vm.$confirm('确定删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              $axios.post(`/archiveDevice/delete/${row.uuid}`).then((res) => {
                if (res.data.result === true) {
                  vm.$message({type: 'success', message: '删除成功'});
                  vm.getFtpList();
                } else if (res.data.result === false) {
                  vm.$message({type: 'error', message: res.data.msg});
                }
              });
            }).catch(() => {
            });
          }
        }]
      },
      getListActionsDef() {
        let self = this
        return {
          width: 6,
          actions: [{
            name: '添加备份服务器',
            click() {
              self.showBackupServer()
            },
            icon: 'plus'
          }]
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .high-level-set {
    margin: 0 20px;

    .params-list {
      .iconfont {
        cursor: pointer;
        margin-left: 5px;
      }
    }
    .bussiness-title{
      padding 10px 0
    }
    .s-form-wrapper {
      width: 800px;
    }

  }

  .setScore-box-card {
    border: none;
  }

  .card-title {

    .grade-title {
      font-weight: 700;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      margin-bottom: 5px;
    }

  }

  @keyframes loading-diandiandian {
    from {
      width: 0;
    }

    to {
      width: 20px;
    }
  }

  @keyframes animation1 {
    0% {
      transform: translate(-10px, 0) scale(1, 1);
    }

    25% {
      transform: translate(0, 0) scale(1.5, 1.5);
    }

    50% {
      transform: translate(10px, 0) scale(1, 1);
    }

    75% {
      transform: translate(0, 0) scale(0.2, 0.2);
    }

    100% {
      transform: translate(-10px, 0) scale(1, 1);
    }
  }

  @keyframes animation2 {
    0% {
      transform: translate(10px, 0) scale(1, 1);
    }

    25% {
      transform: translate(0, 0) scale(0.2, 0.2);
    }

    50% {
      transform: translate(-10px, 0) scale(1, 1);
    }

    75% {
      transform: translate(0, 0) scale(1.5, 1.5);
    }

    100% {
      transform: translate(10px, 0) scale(1, 1);
    }
  }

  .network-test-loading2 {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 10px;
    margin-left: 10px;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .network-test-loading2:before, .network-test-loading2:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 14px;
    height: 14px;
    margin-left: -7px;
    margin-top: -7px;
    border-radius: 7px;
    border-bottom: 1px solid #fff;
  }

  .network-test-loading2:before {
    animation: rotate 0.8s ease-out infinite;
  }

  .network-test-loading2:after {
    animation: rotate 0.8s linear infinite;
  }

  #index-body {

    .s-card.app-center {

      .s-card-header {
        padding-left: 10px !important;
        padding-right: 10px;
      }

      .s-card-body {
        padding-left: 10px;
        padding-right: 10px;
      }

    }
  }
</style>
