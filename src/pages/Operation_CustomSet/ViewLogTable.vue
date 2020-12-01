
<template>
  <div id="viewlog">
    <s-scrollbar wrap-class="scrollMaxheight">
      <s-table-page :data='lists'
                :row-actions='getRowDef()'>
        <s-table-column
          prop="deviceName"
          label="资产">
        </s-table-column>
        <s-table-column
          prop="accountName"
          label="执行账号">
        </s-table-column>
        <s-table-column
          prop="assistAccountName"
          label="协助账号">
        </s-table-column>
        <s-table-column
          prop="reserveAccountName"
          label="备用账号">
        </s-table-column>
        <s-table-column
          prop="execTimeView"
          label="测试时间">
        </s-table-column>
        <s-table-column
          prop="result"
          label="测试结果"
          :formatter="formatterStatus">
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      :modal="false"
      width="700px"
      title="查看详情"
      append-to-body>
      <s-scrollbar wrap-class="scrollheight">
        <div v-html="viewContent"></div>
      </s-scrollbar>
    </s-dialog>
  </div>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        viewDialog: false,
        viewContent: ''
      }
    },
    props: {
      lists: [Array]
    },

    methods: {
      formatterStatus(item) {
        return item.result === 0 ? '成功' : '失败';
      },
      getRowDef() {
        let vm = this
        return [{
          icon: 'eye',
          click(row) {
            $axios.get(`/operationSettings/testLogMoreDetail/${row.uuid}`).then((res) => {
              vm.viewDialog = true
              vm.viewContent = res.data.detail
            });
          },
          name: '查看'
        }]
      }
    }
  }
</script>

