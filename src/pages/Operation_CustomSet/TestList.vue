<template>
  <section id="test-list">
    <s-row class="oper-suppage-title">
      <i class="iconfont icon-tag"></i>
      测试列表
    </s-row>
    <s-row>
      <s-table class="commandTab" :data="testList">
        <s-table-column label="资产名称" prop="itcompName"></s-table-column>
        <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
        <s-table-column :label="accountName" prop="accountName"></s-table-column>
        <s-table-column label="协助账号" prop="assistAccountName"></s-table-column>
        <s-table-column label="备用账号" prop="reserveAccountName"></s-table-column>
        <s-table-column label="测试结果" prop="result" :formatter="formatterStatus"></s-table-column>
        <s-table-column label="操作">
          <template slot-scope="scope">
            <i v-if="!isChange && showLoadBtn" class="iconfont icon-info-read" title="测试" @click="checkHandler(scope.row)"></i>
            <i v-if="isChange" class="iconfont icon-info-read" title="测试" @click="newCheckHandler(scope.row)"></i>
            <div v-if="!showLoadBtn && scope.row.uuid === nowId" style="float: left;margin: 2px 22px 0 0">
              <s-spin color="#30a6fd" type="clip" size="12px"></s-spin>
            </div>
          </template>
        </s-table-column>
      </s-table>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        testList: [],
        showLoadBtn: true,
        nowId: '',
        accountName: (this.checkType === 3) ? '校验账号' : (this.checkType === 2) ? '改密账号' : '运维账号'
      }
    },
    created() {
      this.getAccountAssDevice()
    },
    props: {
      uuid: {
        type: String
      },
      checkType: {
        type: Number
      },
      testData: {
        type: Array
      }
    },
    computed: {
      isChange() {
        let flag
        (this.checkType === 2) ? flag = true : flag = false
        return flag
      }
    },
    methods: {
      formatterStatus(item) {
        return item.result === 0 ? '成功' : (item.result === 1) ? '失败' : '';
      },
      getAccountAssDevice() {
        let uuid = this.$parent.scriptUuid || this.uuid
        $axios.get(`/operationSettings/getScriptTestList/${uuid}`).then((res) => {
          this.testList = res.data
        })
      },
      checkHandler(row) {
        this.showLoadBtn = false
        this.nowId = row.uuid
        $axios.get(`/operationSettings/scriptTestExe/${row.uuid}`).then((res) => {
          this.$message({
            message: '测试完成',
            type: 'success'
          });
          this.showLoadBtn = true
          this.getAccountAssDevice()
        })
      },
      newCheckHandler(row) {
        this.$emit('doCheck', row);
      }
    }
  }
</script>
