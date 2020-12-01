<template>
<s-dialog v-model="dialogFlag" v-if="dialogFlag" title="IP地址分配" top="10vh" width="900px" id="ipAllocationDialog" append-to-body>
  <div>
    <s-scrollbar wrap-class="dialogScrollHeight">
      <div style="font-weight:bold">可用的IP地址</div>
      <s-table-page
        style="margin:10px auto"
        :header-search="defSearch()"
        :data="tableData"
        maxHeight="300">
        <s-table-column width="70">
          <template slot-scope="scope">
            <s-radio v-model="radioid" :label="scope.row.ipAddress" :key="scope.$index">&nbsp;</s-radio>
          </template>
        </s-table-column>
        <s-table-column prop="ipAddress" label="IP地址"></s-table-column>
        <s-table-column prop="subnetAddress" label="子网地址"></s-table-column>
        <s-table-column prop="departName" label="所在组织机构"></s-table-column>
      </s-table-page>
    </s-scrollbar>
  </div>
  <template slot="footer" class="dialog-footer">
    <s-button @click="dialogOk">确定</s-button>
    <s-button type="cancel" @click="dialogCancel">取消</s-button>
  </template>
</s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      dialogFlag: false,
      radioid: '',
      tableData: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
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
  methods: {
    defSearch() {
      return {
        offset: 14,
        width: 10,
        placeholder: '请输入IP地址、子网地址、所在组织机构查询',
        searchProps: ['ipAddress', 'subnetAddress', 'departName']
      }
    },
    dialogOk() {
      if (this.radioid) {
        this.$emit('allocation', this.radioid);
      }
      this.dialogFlag = false;
    },
    dialogCancel() {
      this.dialogFlag = false;
    }
  },
  created() {
    $axios.get('/ipamNetsegment/getAllFreeIpAddress').then((res) => {
      if (res.status === 200) {
        this.tableData = res.data;
      }
    })
  }
}
</script>

<style lang="stylus">
.s-pagination__sizes .s-select {
    width: auto !important;
}
</style>
