<template>
  <s-table-page :data='lists'

            :row-actions="getRowActionsDef()"
            :header-search="getSearchDef()">
      <s-table-column
        prop="taskName"
        label="任务名称">
      </s-table-column>
      <s-table-column
        prop="itcompName"
        label="资产名称">
      </s-table-column>
      <s-table-column
        prop="controlAdderss"
        label="IP地址">
      </s-table-column>
      <s-table-column
        prop="accountName"
        label="账号名称">
      </s-table-column>
      <s-table-column
        prop="protocolName"
        label="协议">
      </s-table-column>
      <s-table-column
        prop="port"
        label="端口">
      </s-table-column>
      <s-table-column
        prop="createTime"
        label="创建时间">
      </s-table-column>
      <s-table-column
        prop="fileName"
        label="文件名称"
        show-overflow-tooltip>
      </s-table-column>
    </s-table-page>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  import {Download} from 'sunflower-common-utils';
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
      getRowActionsDef() {
        let vm = this
        return [{
          icon: 'download',
          name: '下载批量执行结果文件',
          click(row) {
            vm.$confirm('确定要下载该批量执行结果文件?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              Download(`/operationBatchExcute/downloadExeLog/${row.uuid}`);
            }).catch(() => {});
          }
        }]
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['taskName', 'itcompName', 'controlAdderss', 'accountName', 'port', 'protocolName', 'createTime', 'fileName'] // can be string or Array
        }
      },
      getList() {
        $axios.get(`/operationBatchExcute/getBatchExeLogDetailList/${this.uuid}`).then(res => {
          this.lists = res.data
        })
      }
    },
    created() {
      this.getList()
    }
  }
</script>
