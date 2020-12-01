<template>
  <section id="assetCheckResult">
    <s-dialog v-model="dialogFlag" title="查看稽核结果详情" width="800px" class="checkResultDialog">
      <s-scrollbar wrap-class="checkResultScrollbar">
        <s-tab>
          <s-tab-pane label="资产侧账号列表" name="assets">
            <s-table-page
              :data="assetsSideAccount"
              :header-actions="actionsDef1()"
              :header-search="searchDef1()"
              :row-actions="rowActionsDef1()"
              actions-col-width="100"
              @selection-change="handleSelectChange1">
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="资产账号名称" prop="assetAccountName" show-overflow-tooltip></s-table-column>
              <!--<s-table-column label="账号角色" prop="accountRoleName" show-overflow-tooltip></s-table-column>-->
              <s-table-column label="IP地址" prop="deviceIp" show-overflow-tooltip></s-table-column>
              <s-table-column label="资产名称" prop="deviceName" show-overflow-tooltip></s-table-column>
              <s-table-column label="稽核时间" prop="execTime" show-overflow-tooltip></s-table-column>
              <s-table-column label="备注" prop="remark" show-overflow-tooltip></s-table-column>
            </s-table-page>
          </s-tab-pane>

          <s-tab-pane :label="tabLabel" name="SiCAP">
            <s-table-page
              :data="sicapSideAccount"
              :header-search="searchDef2()"
              :row-actions="rowActionsDef2()"
              actions-col-width="100">
              <s-table-column label="资产账号名称" prop="assetAccountName" show-overflow-tooltip></s-table-column>
              <s-table-column label="账号角色" prop="roleName" show-overflow-tooltip></s-table-column>
              <s-table-column label="IP地址" prop="deviceIp" show-overflow-tooltip></s-table-column>
              <s-table-column label="资产名称" prop="deviceName" show-overflow-tooltip></s-table-column>
              <s-table-column label="稽核时间" prop="execTime" show-overflow-tooltip></s-table-column>
              <s-table-column label="备注" prop="remark" show-overflow-tooltip></s-table-column>
            </s-table-page>
          </s-tab-pane>
        </s-tab>
      </s-scrollbar>
    </s-dialog>

    <!--编辑资产账号-->
    <account-add-dialog
      v-if="editAccountDialogFlag"
      v-model="editAccountDialogFlag"
      :asset-uuid="editAccountAssetUuid"
      :cur-account="rowData"
      :uuid="rowData.uuid"
      @accountSave="accountAddClose">
    </account-add-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import accountAddDialog from './AccountAddDialog';
  import { getConfig } from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        editAccountDialogFlag: false, // 编辑资产账号弹框
        assetsSideAccount: [],        // 资产侧账号列表
        assetsSideSelections: [],     // 资产侧多选
        sicapSideAccount: [],         // SiCAP侧账号列表
        sicapSideSelections: [],      // SiCAP侧多选
        rowData: {},                  // 表格操作的当前行的数据
        editAccountAssetUuid: '',     // 表格操作编辑的当前行账号关联的资产的uuid
        tabLabel: getConfig('systemKeyword') + '侧账号列表'
      }
    },
    props: {
      result: {
        type: Object
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /* *资产侧方法定义* */
      // 资产侧查询定义
      searchDef1() {
        return {
          width: 8,
          offset: 4,
          placeholder: '请输入关键字',
          searchProps: ['assetAccountName', 'accountRoleName', 'deviceIp', 'deviceName', 'remark']
        }
      },
      // 资产侧表头按钮定义
      actionsDef1() {
        let _this = this
        return {
          width: 12,
          actions: [{
            name: '账号同步',
            icon: 'union',
            click() {
              _this.synsAssetSide(_this.assetsSideSelections);
            }
          }]
        }
      },
      // 资产侧操作列定义
      rowActionsDef1() {
        let _this = this;
        return [/* {
          name: '编辑',
          icon: 'edit',
          click(row) {
            _this.rowData = row;
            _this.editAccountDialogFlag = true;
          }
        }, */{
          name: '同步',
          icon: 'union',
          click(row) {
            _this.synsAssetSide([row]);
          }
        }]
      },
      // 资产侧多选
      handleSelectChange1(val) {
        this.assetsSideSelections = val;
      },
      // 资产侧同步
      synsAssetSide(assetAccounts) {
        if (assetAccounts && assetAccounts.length > 0) {
          let sendData = {};
          // 稽核结果中选中的资产账号(有可能是同一资产的多个账号，需要去重)
          let syncAssetUuidsTemp = assetAccounts.map(item => item.deviceUuid);
          // 去重，去除重复资产uuid
          let syncAssetUuids = Array.from(new Set(syncAssetUuidsTemp));
          // 构造上传map
          syncAssetUuids.forEach(item => {
            sendData[item] = [];
          });
          // 构造最终上传数据
          assetAccounts.forEach(list => {
            if (syncAssetUuids.indexOf(list.deviceUuid) !== -1) {
              sendData[list.deviceUuid].push(list.assetAccountName)
            }
          });
          $axios.post('/collectTask/synchronizedAccount', sendData).then(({data}) => {
            if (data && data.state) {
              /* ***资产侧同步至SiCAP侧, 意味着两侧都有了，所以不会在任何一侧看到该数据 */
              let accountUuids = assetAccounts.map(account => account.uuid);  // 所有同步的资产账号
              this.assetsSideAccount = this.assetsSideAccount.filter(list => !(accountUuids.includes(list.uuid)));  // 资产侧移除上面同步的账号
              this.$message.success('同步成功！');
            } else {
              this.$message.error('同步失败，请重试！');
            }
          });
        } else {
          this.$message.warning('请至少选择一项资产侧账号信息！')
        }
      },
      /* *SiCAP侧方法定义* */
      // SiCAP侧查询定义
      searchDef2() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入关键字',
          searchProps: ['assetAccountName', 'roleName', 'deviceIp', 'deviceName', 'remark']
        }
      },
      // SiCAP侧操作列定义
      rowActionsDef2() {
        let _this = this;
        return [{
          name: '编辑',
          icon: 'edit',
          click(row) {
            _this.sicapEditAccount(row);
          }
        }/* , {
          name: '同步',
          icon: 'union',
          click(row) {
          }
        } */]
      },
      // SiCAP侧多选
      handleSelectChange2(val) {
        this.sicapSideSelections = val;
      },
      // SiCAP侧编辑稽核结果中的资产账号
      sicapEditAccount(row) {
        this.editAccountAssetUuid = row.deviceUuid;
        $axios.get(`/assetsAccountInfo/viewAssetsAccountInfo/${row.deviceUuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            data.forEach(item => {
              if (item.uuid === row.assetAcountUuid) {
                this.rowData = item;
                // 传到"编辑资产账号"弹框时，"账号类型"字段默认为"收集账号"
                this.$set(this.rowData, 'attribute', 1);
              }
            });
            this.editAccountDialogFlag = true;
          }
        });
      },
      // 资产账号编辑弹框关闭
      accountAddClose(param, isEdit, assetInfo, accountForm) {
        let logParam = {
          data: [Object.assign({}, assetInfo, accountForm)],
          logTemplate: '编辑|资产(#controlAdderss#/#itcompName#)>资产账号>账号(#accountName#)'
        };
        $axios.post('/assetsAccountInfo/editAssetsAccountInfo', param, logParam).then(({ data }) => {
          if (data.state) {
            this.$message.success('保存成功！');
            this.editAccountDialogFlag = false;
            // 如何刷新"稽核结果列表"??
          } else {
            this.$message.error('保存失败，请重试！');
          }
        })
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
    components: {
      accountAddDialog
    },
    created() {
      this.assetsSideAccount = this.result.noSysLogList.concat([]);
      this.sicapSideAccount = this.result.sysLogList.filter(item => {
        return !(item.snmpCWordOr || item.snmpCWordRw);
      })
    }
  }
</script>

<style lang="stylus">
  /* .checkResultDialog
     .checkResultScrollbar
       padding-right 17px
       max-height 500px
       .secondPart
         margin-top 20px
       .title
         color: #2db0fb;
         height: 36px;
         line-height: 36px;
         padding-left: 10px;
         margin-bottom: 10px; */
</style>
