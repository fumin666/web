<template>
  <div class="satisfaction-survey-log">
    <div class="satisfaction-survey-log-header">
      <i class="iconfont icon-event"/>
      <h2>问卷发送历史记录</h2>
      <div style="flex: 1;"></div>
      <s-button
        icon="arrow-left"
        title="返回"
        @click="goHistory"/>
    </div>
    <s-table-page
      :data="logList"
      :header-search="getHeaderSearch()"
      :row-actions="getRowActions()">
      <s-table-column
        label="问卷编号"
        prop="id"/>
      <s-table-column
        label="问卷名"
        prop="paperTitle"/>
      <s-table-column
        label="问卷所属流程"
        prop="orderTypeStr"/>
      <s-table-column
        label="接收人"
        prop="recieverName"/>
      <s-table-column
        label="发送时间"
        prop="sendTimeStr"/>
    </s-table-page>
  </div>
</template>

<script>

  export default {
    props: {
      logList: {
        type: Array,
        require: true
      }
    },

    data() {
      return {
        data: []
      }
    },

    methods: {
      getHeaderSearch() {
        return {
          width: 6,
          searchProps: ['id', 'paperTitle', 'orderTypeStr', 'recieverName']
        }
      },

      getRowActions() {
        let vm = this;
        return [
          {
            name: '查看',
            icon: 'eye',
            click: (row) => {
              vm.$emit('view', {
                paperUuid: row.paperUuid,
                recieverUuid: row.recieverUuid,
                historyUuid: row.uuid,
                viewMode: 'question'
              });
            }
          }
        ]
      },

      goHistory() {
        this.$emit('go', 'history');
      }
    }
  }
</script>

<style>

</style>
