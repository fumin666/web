<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 18:20:20
 * @LastEditTime : 2020-01-01 01:49:35
 * @LastEditors  : mybells
 -->
/**
* Created by songyf on 2019/5/7.
* 资产管理详情-协议设置-关联资产账号弹窗
*/
<template>
  <s-dialog v-model="dialogFlag" title="关联资产账号" id="associatedAssets" width="700px" append-to-body>
    <div>
      <s-row class="topRow" style="float:left;">
        <s-button icon="plus" @click="addAssetAccount" v-show="isShowSnmpv" v-if="permission&&!assetName">添加资产账号</s-button>
      </s-row>
      <s-table-page
        max-height="600"
        :data="tableData"
        :header-search="getHeaderSearch()"
        :row-class-name="tableRowClassName"
      >
        <s-table-column prop="accountName" label="账号名称"></s-table-column>
        <s-table-column prop="accountTypeStr" label="账号角色"></s-table-column>
        <s-table-column label="账号类型">
          <template slot-scope="scope">
            {{scope.row.attribute | filterAttr}}
          </template>
        </s-table-column>
        <s-table-column label="操作" v-if="handleBtnShow && permission">
          <template slot-scope="scope">
            <i class="iconfont icon-data-base" @click="association(scope.row)" title="关联数据库/实例"></i>
            <i class="iconfont icon-not-pass" @click="checkCredence(scope.row)" title="检测凭证"></i>
            <i class="iconfont icon-bind-remove" @click="removeAssociate(scope.row)" title="取消关联"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogCancel">取消</s-button>
    </template>
    <!-- 协议关联弹框 -->
    <s-dialog v-model="agreeAssociatedDialogFlag" v-if="agreeAssociatedDialogFlag" title="添加数据库/实例" width="700px"
              ref="agreeAssociatedDialog" append-to-body>
      <agreeAssociateDialogNew :agreeAssociated="protocoSetRow" :associateRow="associateRow" @cancelDb="cancelDb" @saveDb="saveDb">
      </agreeAssociateDialogNew>
    </s-dialog>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import AgreeAssociateDialogNew from '@/pages/Assets_AssetList/AssetAddTabs/dialog/AgreeAssociateDialogNew';

  export default {
    data() {
      return {
        handleBtnShow: true,
        dialogFlag: false,
        selectUserDialogFlag: true,
        agreeAssociatedDialogFlag: false,
        tableData: [],
        filterValue: '',
        selectionList: [],
        associateRow: {},
        isShowSnmpv: true
      }
    },
    components: {
      AgreeAssociateDialogNew
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      isOma: {
        type: Boolean,
        default: false
      },
      assetName: {
        type: Boolean,
        default: false
      },
      protocoSetRow: Object,
      curAsset: {
        type: Object,
        default() {
          return {}
        }
      },
      permission: {   // 表示是否有操作按钮的权限
        type: Boolean,
        default: false
      }
    },
    created() {
      if (this.assetName) { // 隐藏操作按钮-判断是否是单注册OMA
        this.handleBtnShow = false
      } else {
        if (!this.permission) { // 隐藏操作按钮-判断是否是系统管理员
          this.handleBtnShow = false
        }
      }
      if (this.protocoSetRow.protocolName === 'SNMPV1' || this.protocoSetRow.protocolName === 'SNMPV2') {
        this.isShowSnmpv = false;
      } else {
        this.isShowSnmpv = true;
      }
      this.getAssociatedAssetsList();
    },
    methods: {
      association(row) {
        this.associateRow = row;
        this.agreeAssociatedDialogFlag = true;
      },
      tableRowClassName() { // 操作按钮是否显示
        let className = '';
        if (!this.protocoSetRow.addDbname) {
          className += 'dis-association ';
        }
        if (!this.protocoSetRow.checkPass) {
          className += 'dis-not-pass ';
        }
        if (!this.isShowSnmpv) {
          className += 'dis-bind-remove';
        }
        return className;
      },
      removeAssociate (row) { // 取消关联
        let self = this;
        let checkArr = [row.relId];
        let removeParam = [`${row.assetsUuid},${row.relUuid},${self.protocoSetRow.uuid}`];
        $axios.post(`/resourcemanager/assetmanager/itasset/judgeBeforeDisassociatePortAndAccount`, checkArr).then(({data}) => {
          if (data.state === false) {
            let vm = this
            let arr = [{
                'IP地址': vm.curAsset.controlAdderss ? vm.curAsset.controlAdderss : '无',
                '资产名称': vm.curAsset.itcompName,
                '协议名称': vm.protocoSetRow.protocolName,
                '端口': vm.protocoSetRow.port,
                '账号名称': row.accountName
              }]
            // self.$confirm(data.errormsg, '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
              $axios.post('/resourcemanager/assetmanager/itasset/batchDeleteCredenceByItcomp', removeParam, {
                data: arr,
                logTemplate: '取消关联|资产(#IP地址#/#资产名称#)>资产协议(#协议名称#/#端口#)关联账号(#账号名称#)'
              }).then(({data}) => {
                if (data.status) {
                  this.$nextTick(() => {
                    self.$message({message: '取消关联成功', type: 'success'});
                  })
                  self.getAssociatedAssetsList();
                  self.$emit('remove-Associate', self.protocoSetRow);
                } else {
                  this.$nextTick(() => {
                    self.$message({message: '取消关联失败', type: 'error'});
                  })
                }
              })
            // }).catch(() => {
            // });
          } else {
            $axios.post('/resourcemanager/assetmanager/itasset/batchDeleteCredenceByItcomp', removeParam).then(({data}) => {
              if (data.status) {
                this.$nextTick(() => {
                  self.$message({message: '取消关联成功', type: 'success'});
                })
                self.getAssociatedAssetsList();
                self.$emit('remove-Associate', self.protocoSetRow);
              } else {
                this.$nextTick(() => {
                  self.$message({message: '取消关联失败', type: 'error'});
                })
              }
            })
          }
        });
      },
      checkCredence(row) { // 检测凭证，必须有用户名才有意义
        if (!this.curAsset.controlAdderss) {
          this.$message({message: '该资产没有IP', type: 'warning'});
          return
        }
        if (this.curAsset.defCompId) {
          // if (this.curProtocol.uuid === '00000000000000000000000000000137' || this.curProtocol.uuid === '00000000000000000000000000000125') {
          //   this.row.accountRoleUuid = 'bf45d38aecdf4b9eafb7288adc74da8d'
          // }
          let param = {
            ipAddress: this.curAsset.controlAdderss,
            monitorTemplateUuid: this.curAsset.defCompId,
            assetsPortInfo: this.protocoSetRow,
            assetsAccountInfo: row
          }
          $axios.post('/resourcemanager/assetmanager/itasset/checkCredence', param).then(({data}) => {
            if (data.flag) {
              this.$message.success(data.message)
            } else {
              this.$message.error(data.message)
            }
          })
        } else {
          this.$message({message: '该资产没有模板', type: 'warning'});
        }
      },
      getAssociatedAssetsList() {
        $axios.get(`/assetsAccountInfo/getAssetsAccountListByPort/${this.protocoSetRow.uuid}`).then(({data}) => {
          this.tableData = data
        });
      },
      saveDb (row) { // 保存数据库实例
        let param = {
          deviceUuid: row.deviceUuid,
          accountUuid: this.associateRow.uuid,
          portUuid: row.portUuid,
          dbnameUuid: row.uuid
        };
        $axios.post(`/databaseDbname/savePortAccountAndDbname/`, param).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.agreeAssociatedDialogFlag = false;
            this.getAssociatedAssetsList()
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      },
      cancelDb () { // 关闭数据库/实例
        this.agreeAssociatedDialogFlag = false
      },
      // 选择资产账号
      addAssetAccount() {
        this.$emit('add-asset-account', this.protocoSetRow);
      },
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '账号名称、账号角色',
          searchProps: ['accountName', 'accountTypeStr']
        }
      },
      dialogOk() {
        this.$emit('select-user', this.selectionList, this.ConfigUuid);
        this.dialogFlag = false;
      },
      dialogCancel() {
        this.dialogFlag = false;
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    filters: {
      filterAttr(val) {
        return val === 1 ? '托管账号' : '收集账号';
      }
    }
  }
</script>

<style lang="stylus">
  /*不显示改按钮*/
  .dis-association .icon-data-base {
    display: none;
  }
  .dis-not-pass .icon-not-pass {
    display: none;
  }
  .dis-bind-remove .icon-bind-remove {
    display: none;
  }
  #associatedAssets
    .titleRow
      margin-bottom 10px
      .title
        line-height 30px
        padding-left 10px
        font-weight: bold
</style>
