<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表->报表配置->发送状态
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="sendStatusDialog" class="log_custom" title="发送状态" width="600px" :before-close="cancel" append-to-body>
    <s-scrollbar wrap-style="max-height: 500px;">
      <s-table-page :data="list">
        <s-table-column label="发送时间" prop="sendTime" width="170px"></s-table-column>
        <s-table-column label="状态" prop="sendStatusStr"></s-table-column>
        <s-table-column label="状态信息" prop="sendFailureReason"></s-table-column>
        <s-table-column label="操作">
          <template slot-scope="scope">
            <i class="iconfont icon-chongfa" @click="reSend(scope.row)" title="重发"></i>
          </template>
        </s-table-column>
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
      sendStatusDialog: Boolean
    },
    data() {
      return {
        list: []
      }
    },
    methods: {
      getList() {
        $axios.get(`/dbaCustomReport/getSendLogs/${this.rowUuid}`).then(res => {
          this.list = res.data || [];
        })
      },
      reSend(row) {
        $axios.post(`/dbaCustomReport/againSend`, {taskUuid: row.taskUuid}).then(res => {
          if (res.data) {
            this.$message({ message: '已重发', type: 'success' });
            this.getList();
          } else {
            this.$message({ message: '重发失败', type: 'error' });
          }
        })
      },
      cancel() {
        this.$emit('update:sendStatusDialog', false);
      }
    },
    created() {
      this.getList();
    }
  }
</script>
