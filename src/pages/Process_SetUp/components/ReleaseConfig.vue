<template>
  <s-table :data="dataList" style="width: 100%" >
    <s-table-column label="发布分级" prop="publishLevel">
      <template slot-scope="scope">
        {{scope.row.publishLevel | filterLevel}}
      </template>
    </s-table-column>
    <s-table-column label="启动审批" prop="column1">
      <template slot-scope="scope">
        <s-switch v-model="scope.row.column1" size="small" :active-value="'1'" :inactive-value="'0'" @change="changeSwitch(scope.row)"></s-switch>
      </template>
    </s-table-column>
    <s-table-column label="计划审批" prop="column2">
      <template slot-scope="scope">
        <s-switch v-model="scope.row.column2" size="small" :active-value="'1'" :inactive-value="'0'" @change="changeSwitch(scope.row)"></s-switch>
      </template>
    </s-table-column>
    <s-table-column label="开发审批" prop="column3">
      <template slot-scope="scope">
        <s-switch v-model="scope.row.column3" size="small" :active-value="'1'" :inactive-value="'0'" @change="changeSwitch(scope.row)"></s-switch>
      </template>
    </s-table-column>
    <s-table-column label="测试审批" prop="column4">
      <template slot-scope="scope">
        <s-switch v-model="scope.row.column4" size="small" :active-value="'1'" :inactive-value="'0'" @change="changeSwitch(scope.row)"></s-switch>
      </template>
    </s-table-column>
    <s-table-column label="部署审批" prop="column5">
      <template slot-scope="scope">
        <s-switch v-model="scope.row.column5" size="small" :active-value="'1'" :inactive-value="'0'" @change="changeSwitch(scope.row)"></s-switch>
      </template>
    </s-table-column>
    <s-table-column label="关闭审批" prop="column6">
      <template slot-scope="scope">
        <s-switch v-model="scope.row.column6" size="small" :active-value="'1'" :inactive-value="'0'" @change="changeSwitch(scope.row)"></s-switch>
      </template>
    </s-table-column>
  </s-table>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        dataList: [],
        value1: 0
      }
    },
    methods: {
      // 获取 发布分级与阶段设置
      getData() {
        $axios.get('/itilWorkflowConfig/getItilPublishLevel').then((res) => {
          this.dataList = res.data;
        })
      },
      changeSwitch(row) {
        $axios.post('/itilWorkflowConfig/updateItilPublishLevel', row, {
          data: [],
          logTemplate: '编辑|发布分级和阶段审批'
        }).then((res) => {
          if (res.data.state === true) {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '更新失败'
            })
          }
        })
      }
    },
    created() {
      this.getData();
    },
    filters: {
      filterLevel(val) {
        switch (val) {
          case '4':
            return '重大发布';
          case '5':
            return '常规发布';
          case '6':
            return '紧急发布';
        }
      }
    }
  }
</script>

<style>

</style>
