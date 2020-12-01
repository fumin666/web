<template>
  <s-dialog v-model="dialogFlag" :title="'查看资产'" width="800px" class="operationRespAddDialog">
    <s-table-page max-height="500" ref="assetListTable" :data="currentListCache" :header-search="getSearchDef()">
      <s-table-column prop="itcompName" label="资产名称">
      </s-table-column>
      <s-table-column prop="controlAdderss" label="IP地址">
      </s-table-column>
      <s-table-column prop="citypeName" label="资产类型">
      </s-table-column>
      <s-table-column prop="cmdbOrgName" label="使用部门">
      </s-table-column>
    </s-table-page>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      dialogFlag: false,
      assetList: [],
      currentListCache: [],
      selectedData: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    operationResp: {
      type: Object
    }
  },
  created() {
    $axios.get(`/operationDeviceGroup/getTdeviceGroupInfoByUuid/${this.operationResp.uuid}`).then(({data}) => {
      this.selectedData = [...data.itcompUuidList];
      if (this.selectedData.length === 0) {
        return null;
      }
      $axios.get('/operationDeviceGroup/getAllMonitorItcomp').then(({data}) => {
        if (data && data instanceof Array) {
          this.assetList = data;
          this.currentListCache = data;
          if (this.selectedData.length > 0) {
            let targetList = [];
            let arr = [];
            this.selectedData.forEach(uuid => {
              this.assetList.forEach(item => {
                if (uuid === item.uuid) {
                  targetList.push(item);
                }
              });
            });
            targetList.forEach(list => {
              this.assetList.forEach(item => {
                if (list.uuid === item.uuid) {
                  arr.push(item)
                }
              });
            });
            this.currentListCache = arr;
          }
        }
      });
    })
  },
  methods: {
    getSearchDef() {
      return {
        width: 12,
        offset: 12,
        placeholder: '请输入资产名称、IP地址、资产类型、使用部门查询',
        searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'cmdbOrgName']
      };
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
.operationRespAddDialog-checkbox {
  float: left;

  .operationRespAddDialog-checkbox-wrap {
    padding-top: 5px;
  }
}
</style>
