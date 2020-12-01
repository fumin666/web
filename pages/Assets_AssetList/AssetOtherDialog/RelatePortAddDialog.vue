<template>
  <s-dialog v-model="dialogFlag" title="关联端口" width="600px" class="portAddDialog">
    <s-scrollbar wrap-class="portAddScrollbar">
      <s-row class="title">端口列表</s-row>
      <s-table-page :data="filterPortList"
                   @selection-change="selectionChange">
        <s-table-column type="selection" :selectable=hasRelate width="45" align="center"></s-table-column>
        <s-table-column label="协议名称" prop="protocolName"></s-table-column>
        <s-table-column label="端口" prop="port"></s-table-column>
      </s-table-page>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        dialogFlag: false,
        portList: [],
        selections: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      assetUuid: {
        type: String,
        require: true
      },
      accountUuid: {
        type: String,
        require: true
      }
    },
    computed: {
      filterPortList() {
        return this.portList.filter(item => {
          return item.protocolName.indexOf('SNMP') === -1 && item.protocolName.indexOf('VNC') === -1;
        })
      }
    },
    created() {
      $axios.get(`/assetsAccountInfo/getTAssetsPortInfoItUuid/${this.assetUuid}`).then(({data}) => {
        this.portList = data;
      });
    },
    methods: {
      hasRelate(row, index) {
        let hasRelateList = this.$parent.portData.monitorPortInfoList;
        return !hasRelateList.find(item => item.uuid === row.uuid);
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      dialogOk() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择协议', type: 'info'});
          return;
        }
        let param = this.selections.map(item => {
          return {
            deviceUuid: this.assetUuid,
            accountUuid: this.accountUuid,
            portUuid: item.uuid
          }
        });
        let assetAccountVM = this.$parent.$parent;
        $axios.post(`/assetsAccountInfo/saveTAssetsPortInfoItUuid`, param, {
          data: this.selections.map(item => Object.assign({}, assetAccountVM.assetInfo, assetAccountVM.curAccount, item)),
          logTemplate: '关联端口|资产(#controlAdderss#/#itcompName#)>资产账号>账号(#accountName#)>协议(#protocolName#/#port#)'
        }).then(({data}) => {
          this.$emit('reload');
          this.dialogFlag = false;
        });
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
    }
  }
</script>

<style lang="stylus">
 /* .portAddDialog
    .portAddScrollbar
      padding-right 17px
      max-height 500px
    .title
      font-weight 700
      height 36px
      line-height 36px
      color: #5781AD
      font-size 16px
      margin-bottom 5px
      padding-left 5px */

</style>

