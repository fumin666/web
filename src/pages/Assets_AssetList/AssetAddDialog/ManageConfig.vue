<template>
  <div>
    <s-row class="headFunRow">
      <s-col class="left-float">
        <s-button @click="tab2Add" icon="plus">添加</s-button>
        <!--<s-button @click="tab2Del" icon="delete">删除</s-button>-->
      </s-col>
      <s-col class="right-float">
        <s-input
          placeholder="请输入"
          icon="magnifier"
          v-model="tab2SearchValue">
        </s-input>
      </s-col>
    </s-row>
    <s-table height="300" border :data="tab2FilterData" style="width: 100%;" class="tabTable" @selection-change="tab2SelectionChange">
      <!--<s-table-column type="selection" width="45" align="center"></s-table-column>-->
      <s-table-column label="协议名称" prop="assetsPortInfo.protocolName" show-overflow-tooltip></s-table-column>
      <s-table-column label="端口" prop="assetsPortInfo.port" width="60" show-overflow-tooltip></s-table-column>
      <s-table-column label="资产账号名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{(scope.row.assetsPortInfo.protocolName === 'SNMPV1' || scope.row.assetsPortInfo.protocolName === 'SNMPV2') ?
            scope.row.assetsAccountInfo.snmpCWordOr : scope.row.assetsAccountInfo.accountName}}
        </template>
      </s-table-column>
      <s-table-column label="资产账号角色" prop="assetsAccountInfo.accountTypeName" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" width="120" align="left">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" @click="tableRowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-bangding" v-if="!showCurrentBtn(scope.row)" @click="addAccount(scope.row)" title="添加资产账号"></i>
          <i class="iconfont icon-delete" @click="tableRowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table>
    <!--添加资产账号-->
    <select-user-dialog v-model="selectUserDialogFlag" v-if="selectUserDialogFlag" @select-user="selectUser" :ConfigUuid="ConfigUuid" :asset-uuid="assetUuid" :portUuid="portUuid">
    </select-user-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import ManageConfigMixin from './ManageConfigMixin';
  import selectUserDialog from './SelectUserDialogNew';

  export default {
    mixins: [ManageConfigMixin],
    data() {
      return {
        tab2SearchValue: '',
        tab2Selections: [],
        tab2DeledList: [],
        selectUserDialogFlag: false,
        assetUuid: '',
        portUuid: '',
        ConfigUuid: ''
      }
    },
    props: {
      curTab2Data: {
        type: Array
      },
      curTableData: {
        type: Array
      }
    },
    computed: {
      tab2FilterData() {
        return this.curTab2Data.filter(item => {
          let arr = [item.assetsPortInfo.protocolName, item.assetsPortInfo.port, item.assetsAccountInfo.accountName || item.assetsAccountInfo.snmpCWordOr, item.assetsAccountInfo.accountTypeName];
          return arr.some(str => {
            return (str + '').indexOf(this.tab2SearchValue) !== -1;
          });
        });
      },
      tab2StringData() {
        return this.curTab2Data.map(item => {
          return JSON.stringify(item)
        });
      }
    },
    components: {
      selectUserDialog
    },
    methods: {
      // 是否显示资产账号按钮
      showCurrentBtn(row) {
        return row.assetsPortInfo.protocolName === 'SNMPV2' || row.assetsPortInfo.protocolName === 'SNMPV1' || row.assetsPortInfo.protocolName === 'VNC';
      },
      // 添加资产账号
      addAccount(row) {
        this.selectUserDialogFlag = true;
        this.ConfigUuid = row.uuid;
        this.assetUuid = row.assetsPortInfo.assetsUuid;
        this.portUuid = row.assetsPortInfo.uuid;
      },
      selectUser(selectionList, ConfigUuid) {
        let param = {
          assetUuid: this.assetUuid,
          portUuid: this.portUuid,
          accountUuidList: selectionList.map(item => item.uuid),
          relUuid: ConfigUuid
        };
        // 先进行校验
        $axios.post('/assetsAccountInfo/judgeSaveAccountPortRel', param).then(({data}) => {
          if (data.state) {
            this.ajaxSaveUser(param);
          } else {
            this.$confirm(data.errormsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.ajaxSaveUser(param);
            }).catch(() => {});
          }
        });
      },
      // 保存资产账号
      ajaxSaveUser(param) {
        $axios.post('/assetsAccountInfo/saveOntPortToManyAccount', param).then(({data}) => {
          if (data.state) {
            this.$emit('refresh', this.assetUuid);
            this.$message.success(data.errormsg);
          } else {
            this.$message.error(data.errormsg);
          }
        });
      },
      divideAccountProto(newObj, oldObj) {
        newObj.assetsAccountInfo = oldObj.assetsAccountInfo || {};
        newObj.assetsPortInfo = oldObj.assetsPortInfo || {};
        let accountFied = ['accountName', 'accountPasswd', 'accountRoleUuid', 'accountTypeName', 'snmpCWordOr', 'snmpCWordRw', 'uuid'];
        for (let i in oldObj) {
          if (oldObj[i] !== '' && typeof oldObj[i] !== 'object') {
            if (accountFied.some(item => { return item === i })) {
              newObj.assetsAccountInfo[i] = oldObj[i];
            } else if (newObj.assetsPortInfo.hasOwnProperty(i)) {
              newObj.assetsPortInfo[i] = oldObj[i];
            }
          }
        }
      },
      tab2SelectionChange(rows) {
        this.tab2Selections = rows;
      },
      tab2Add() {
        this.$emit('add-proto', {});
      },
//      tab2Del() {
//        this.axiosCanDel(this.tab2Selections);
//      },
      tableRowEdit(row) {
        this.$emit('add-proto', row);
      },
      tableRowDel(row) {
        this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          this.axiosCanDel(row);
        }).catch(() => {});
      },
      axiosCanDel(row) { // 去除批量删除
        let param = {
          accuuid: row.assetsAccountInfo.accountName ? row.assetsAccountInfo.uuid : '',
          portuuid: row.assetsPortInfo.uuid
        };
        $axios.post('/assetsAccountInfo/deleteValidate', param).then(({data}) => {
          if (!data) {
            this.delAction(row);
          } else {
            this.$message({message: '该协议和账号已被关联，请检查稽核、改密或授权!'});
          }
        })
      },
      delAction(delArr) {
        let inDex = delArr.index;
        let itCompUuid = delArr.assetsPortInfo.assetsUuid;
        let proRelUuid = this.curTableData[inDex].uuid;
        let protUuid = delArr.assetsPortInfo.uuid;
        $axios.post('/resourcemanager/assetmanager/itasset/deleteCredenceByItcomp/' + itCompUuid + '/' + proRelUuid + '/' + protUuid).then(res => {
         if (res.data.status === true) {
           this.$message({
             message: res.data.err,
             type: 'success'
           })
           this.$emit('refresh', itCompUuid);
         } else {
           this.$message({
             message: res.data.err,
             type: 'error'
           })
         }
        })
      }
    }
  }
</script>

