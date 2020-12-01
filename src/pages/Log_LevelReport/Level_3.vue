<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-01 09:00:23
 * @LastEditTime: 2019-09-06 18:11:08
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <section class="reportTop noPrint">
      <s-row style="margin: 15px 0 10px;">
        <s-col :span="24">
          <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
          <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
          <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
        </s-col>
      </s-row>
    </section>
    <s-table-page
      :data="tableData">
      <s-table-column prop="user.userRealName" label="姓名"></s-table-column>
      <s-table-column prop="user.userLoginName" label="登录名"></s-table-column>
      <s-table-column prop="itcompCount" label="可管理设备数"></s-table-column>
      <s-table-column prop="assetCount" label="可登录设备账号数"></s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    data () {
      return {
        tableData: []
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        $axios.post(`/hierarchyProtection/accessControl`).then((res) => {
          this.tableData = res.data || []
        })
      },
      DownloadHandle(exportType) {
        this.$confirm(`确定将访问控制统计报表以${exportType}格式导出？`, '提示', { confirmButtonText: '确定', cancelButtListonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportAccessControl/${exportType}`)
        }).catch(() => {});
      }
    }
  }
</script>
<style lang="stylus">
</style>
