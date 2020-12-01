<template>
  <div class="manageConfigDialog">
    <s-dialog v-model="dialogFlag" title="添加协议设置" :close-on-click-modal="false">
      <manage-config ref="manageConfig"
                  :curTab2Data="tab2Data"
                  :curTableData="tableData"
                  @add-proto="addProto"
                  @refresh="refresh"
      ></manage-config>
      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogOk">确定</s-button>
        <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
      </template>
    </s-dialog>
    <config-add-dialog v-model="configDialogFlag" v-if="configDialogFlag" :options="selectOptionsObj" :data="configData"
                       :asset-uuid="curAsset.uuid"
                       :already-proto-list="tab2Data"
                       :curAsset="curAsset"
                       @config-save="tab2ConfigSave">
    </config-add-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import configAddDialog from './ConfigAddDialog';
  import manageConfig from './ManageConfig.vue';
  import ManageConfigMixin from './ManageConfigMixin';

  export default {
    mixins: [ManageConfigMixin],
    data() {
      return {
        dialogFlag: false,
        selectOptionsObj: {
          protocolList: [], // 配置弹框中的协议名称
          accountType: [] // 配置弹框中的角色名称
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curAsset: {
        type: Object
      }
    },
    computed: {
      tab1Form() { // 供ConfigAddDialog的测试按钮调用
        let obj = JSON.parse(JSON.stringify(this.curAsset));
        obj.citypeUuid = obj.citypeuuid;
        obj.controlAdderss = obj['IP地址'];
        obj.modelNumber = obj['型号'];
        obj.defCompId = obj.monitorItcomp.defCompId;
        return obj;
      }
    },
    created() {
      // 协议名称、角色名称 下拉框
      $axios.post('/resourcemanager/assetmanager/itasset/findAddSelect').then(({data}) => {
        this.selectOptionsObj = data;
      });
      // 获取配置管理列表
      this.axiosConfigList(this.curAsset.uuid);
    },
    methods: {
      dialogOk() {
        this.dialogFlag = false;
        this.$emit('reload');
//        let arr = [];
//        this.tab2Data.forEach(item => {
//          arr.push(this.filterConfigParam(item));
//        });
//        this.delRepeatPro(arr);
//        this.delRepeatAccount(arr);
//        let delStr = this.tab2Data.filter(item => item.id).map(item => item.id).join(',');
//        let delStrs = this.$refs.manageConfig.tab2DeledList.map(item => {
//          return item.id;
//        }).concat(this.repeatIdArr).join(',');
//        let logParam = {
//          data: [JSON.parse(JSON.stringify(this.curAsset))],
//          logTemplate: '修改管理配置|资产(#IP地址#/#资产名称#)'
//        };
//        $axios.post(`/resourcemanager/assetmanager/itasset/updateMonitorCredence?itCompUuid=${this.curAsset.uuid}&delStr=${delStr}&delStrs=${delStrs}`, arr, logParam).then(({data}) => {
//          this.$message({showClose: true, message: data ? '更新成功' : '已经被授权，无法更新', type: data ? 'success' : 'error'});
//          if (data) {
//            this.dialogFlag = false;
//            this.$emit('reload');
//          }
//        });
      },
      refresh(val) {
        this.axiosConfigList(val);
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
      configAddDialog,
      manageConfig
    }
  }
</script>

<style lang="stylus">
  .manageConfigDialog .s-dialog
    .headFunRow
      margin-bottom 10px
    .tabTable
      .s-table-body-wrapper
        overflow-x hidden
      .cell
        white-space nowrap
        padding-left 10px
        padding-right 10px
        i
          margin-right: 5px
          &:last-child
            margin-right 0
</style>
