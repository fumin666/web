<template>
  <s-table-page
    class="auth-link-res"
    :data="list"
    :row-actions="getResRowActionsDef()"
    :header-search="getSearchDef()"
    key="tableTepLinkRes"
    ref="authLinkRes"
    :row-class-name="tableRowClassName"
    actions-col-width="50">
    <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
    <s-table-column label="IP地址" prop="controlAdderss" width="150"></s-table-column>
    <s-table-column
      prop="citypeName"
      label="资产类型"
      show-overflow-tooltip>
    </s-table-column>
    <s-table-column
      label="协议"
      prop="protocolName">
    </s-table-column>
    <s-table-column label="端口" prop="port" width="80"></s-table-column>
  </s-table-page>
</template>

<script>

  export default {
    props: {
      data: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        list: this.data.authHaveDeviceLists
      }
    },

    methods: {
      getResRowActionsDef() {
        let vm = this;
        return [{
          icon: 'set',
          name: '设置',
          click(row) {
            vm.showDeviceAccount(row.deviceUuid, row.portUuid, row.protocolUuid);
          }
        }]
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询内容',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'protocolName', 'port']
        }
      },
      showDeviceAccount(deviceuuid, portuuid, protocolUuid) {
        this.$emit('showDeviceAccount', deviceuuid, portuuid, protocolUuid);
      },
      tableRowClassName(row) {
        if (row.protocolName === 'VNC') {
          return 'row-vnc';
        }
      }
    },

    watch: {
      data(val) {
        this.list = val.authHaveDeviceLists;
      }
    }
  }
</script>

<style>
  .auth-link-res .row-vnc .icon-set {
    display: none;
  }
</style>
