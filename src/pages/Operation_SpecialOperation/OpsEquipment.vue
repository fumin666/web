<template>
  <section class="opsTable">
    <s-row class="oper-suppage-title">
      <i class="iconfont icon-tag"></i>
      审批后运维
    </s-row>
    <s-table-page :data='lists'


              :header-search='getDataSearchDef()'>
      <s-table-column
        prop="device_name"
        label="资产名称">
      </s-table-column>
      <s-table-column
        prop="device_ip"
        label="IP地址">
      </s-table-column>
      <s-table-column
        prop="device_protocol"
        label="协议">
      </s-table-column>
      <s-table-column
        prop="device_port"
        label="端口">
      </s-table-column>
      <s-table-column
        prop="device_account"
        label="账号">
      </s-table-column>
      <s-table-column label="操作" width="120">
        <template slot-scope="scope">
          <i class="iconfont icon-special-oper" @click="toOperation(scope.row)" title="运维"></i>
        </template>
      </s-table-column>
    </s-table-page>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default {
    data() {
      return {
        lists: []
      }
    },
    props: {
      uuid: {
        type: String
      }
    },

    methods: {
      toOperation(row) {
        this.$emit('showOperation', row);
      },
      getDataSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['device_name', 'device_port', 'device_protocol', 'device_account', 'device_ip'] // can be string or Array
        }
      },
      getList() {
        $axios.get(`/specialOperationApply/getOperationDeviceInfo/${this.uuid}`).then(res => {
          this.lists = res.data
        })
      }
    },
    created() {
      this.getList()
    }
  }
</script>
