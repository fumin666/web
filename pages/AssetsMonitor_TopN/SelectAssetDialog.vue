<template>
  <s-dialog v-model="dialogFlag" title="选择资产" width="800px" class="selectAssetDialog">
      <s-table-page :data="assetList"
                    :header-search="getHeaderSearch()"
                   @selection-change="selectionChange"
                    ref="tableGroup"
                    :show-header-checkbox="true"
                    height="450">
        <s-table-column type="selection" width="45" align="center"></s-table-column>
        <s-table-column label="资产名称" prop="itcompName"></s-table-column>
        <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
        <s-table-column label="资产类别" prop="citypeName"></s-table-column>
      </s-table-page>
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
        assetList: [],
        selections: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      selectAsset: {
        type: String
      },
      citypeUuid: {
        type: Array,
        default() {
          return []
        }
      }
    },
    created() {
      $axios.post(`/monitorStat/getKpiMonitorItcompList`, this.citypeUuid).then(({data}) => {
        let list = data || [];
        this.assetList = list.map(item => {
          item.pingStatusName = this.filterStatus(item.pingStatus);
          return item;
        });
        this.$nextTick(() => {
          let arr = this.selectAsset ? this.selectAsset : [];
          let tableVM = this.$refs['tableGroup'];
          arr.forEach(item => {
            let row = this.getSelectRow(this.assetList, item);
            tableVM.toggleRowSelection(row);
          });
        });
      });
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入关键字',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'businessName', 'pingStatusName']
        }
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      getSelectRow(list, itcompUuid) {
        return list.filter(item => {
          return item.uuid === itcompUuid;
        })[0];
      },
      filterStatus(val) {
        switch (val) {
          case 0:
            return '宕机';
          case 1:
            return '正常';
          case 2:
            return '告警';
          default:
            return '正常';
        }
      },
      dialogOk() {
        this.$emit('select', this.selections);
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
    }
  }
</script>
