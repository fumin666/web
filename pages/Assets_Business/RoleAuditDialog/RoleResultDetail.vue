<!--
 * @Author: 高建鹏
 * @Date: 2019-05-16 12:20:26
 * @LastEditors: 高建鹏
 * @Description: 稽核结果详情
 * @Position:
 -->
<template>
  <section class="fileList">
    <s-table-page
      :header-search="defSearch()"
      :header-actions="defAction()"
      @selection-change="handleSelection"
      :data="resultData">
      <s-table-column type="selection"></s-table-column>
      <s-table-column label="角色名称" prop="bRoleName"></s-table-column>
      <s-table-column label="业务名称" prop="bSystemName"></s-table-column>
      <s-table-column label="稽核时间" prop="time"></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-union" title="同步" @click="scan(scope.row)"> </i>
        </template>
      </s-table-column>
    </s-table-page>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        resultData: [{bRoleName: '角色1', bSystemName: '名称1', time: '2019-05-22'}],
        selectionList: []
      }
    },
    methods: {
      // 表格查询
      defSearch() {
        return {
          width: 10,
          offset: 14,
          placeholder: '请输入角色名称、业务名称查询',
          searchProps: ['bRoleName', 'bSystemName']
        }
      },
      // 定义稽核对象表格表头操作
      defAction() {
        let _this = this
        return {
          width: 8,
          actions: [{
            name: '账号同步',
            icon: 'union',
            click: function() {
              _this.handleObject()
            }
          }]
        }
      },
      handleSelection (selection) {
        this.selectionList = selection
      },
      /* 获取列表数据 */
      getList() {
        // $axios.post('/collectTask/getTaskList', {}).then((res) => {
        //   this.resultData = res.data;
        // });
      },
      handleObject() {
        if (this.selectionList.length) {
          this.$message({
            type: 'success',
            message: '同步成功！'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '选择要同步的数据！'
          })
        }
      },
      scan(row) {
        this.$message({
          type: 'success',
          message: '同步成功！'
        })
      }
    },
    created() {
      this.getList()
    }
  }
</script>
