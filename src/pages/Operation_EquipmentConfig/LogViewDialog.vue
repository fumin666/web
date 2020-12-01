<template>
  <s-scrollbar wrap-class="scrollMaxheight">
    <s-table-page :data='logDetailsList'
              :header-search='getSearchDef()'>
      <s-table-column prop="taskName" label="任务名称">
      </s-table-column>
      <s-table-column prop="itcompName" label="资产名称">
      </s-table-column>
      <s-table-column prop="ipaddr" label="IP地址">
      </s-table-column>
      <s-table-column prop="protocolName" label="协议">
      </s-table-column>
      <s-table-column prop="port" label="端口">
      </s-table-column>
      <s-table-column prop="backupTime" label="备份时间">
      </s-table-column>
      <s-table-column prop="fileName" label="备份文件名称" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="操作" width="120">
        <template slot-scope="scope">
          <i class="iconfont icon-download" title="下载" @click="downloadHandler(scope.row.uuid)"></i>
          <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row.uuid)"></i>
        </template>
      </s-table-column>
    </s-table-page>
  </s-scrollbar>
</template>

<script type="text/babel">
    import $axios from 'sunflower-ajax'
    import {Download} from 'sunflower-common-utils'
    export default {
      data() {
        return {
          logDetailsList: []
        }
      },
      components: {
        // Download
      },
      props: {
        deviceUuid: {
          type: String
        }
      },
      methods: {
        getLists() {
          $axios.get(`deviceConf/getDetailTaskLog/${this.deviceUuid}`).then((res) => {
            this.logDetailsList = res.data
          });
        },
        getSearchDef() {
          return {
            width: 3,
            offset: 21,
            placeholder: '查询条件',
            searchProps: ['taskName', 'protocolName', 'port', 'backupTime', 'fileName', 'itcompName', 'ipaddr']
          }
        },
        downloadHandler(uuid) {
          Download(`/deviceConf/downloadTasklog/${uuid}`)
        },
        delHandler(uuid) {
          this.$confirm('确定删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`deviceConf/deleteTaskLog/${uuid}`).then((res) => {
              if (res.data) {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                })
                this.getLists()
                this.$emit('refreshParent')
              } else {
                this.$message({
                  type: 'error',
                  message: '删除失败，请重试！'
                })
              }
            })
          }).catch(() => {});
        }
      },
      mounted() {
        this.getLists()
      }
    }
</script>

