<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表->报表配置->查看生成报表
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="generateReportDialog" class="log_custom" title="查看生成报表" width="800px" :before-close="cancel" append-to-body>
    <s-scrollbar wrap-style="max-height: 600px;">
      <s-table-page
        :data="list"
        :header-search="getHeaderSearch()"
        ref="myUserList">
        <s-table-column label="报表名称" prop="reportTaskName"></s-table-column>
        <s-table-column label="报表文件" prop="reportName"></s-table-column>
        <s-table-column label="报表类型" prop="typeStr"></s-table-column>
        <s-table-column label="输出格式" prop="fileTypeStr"></s-table-column>
        <s-table-column label="生成时间" prop="createTime" width="200"></s-table-column>
      </s-table-page>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="cancel">关 闭</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    props: {
      rowUuid: String,
      generateReportDialog: Boolean
    },
    data() {
      return {
        list: []
      }
    },

    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询内容',
          searchProps: ['reportTaskName', 'reportName']
        }
      },
      cancel() {
        this.$emit('update:generateReportDialog', false);
      }
    },
    created() {
      $axios.get(`/dbaCustomReport/getRecords/${this.rowUuid}`).then(res => {
        this.list = res.data || [];
      })
    }
  }
</script>
