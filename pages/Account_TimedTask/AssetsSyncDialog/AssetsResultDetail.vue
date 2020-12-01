<!--
 * @Author: 高建鹏
 * @Date: 2019-05-16 12:20:26
 * @LastEditors: 高建鹏
 * @Description: 同步结果详情
 * @Position:
 -->
<template>
  <section class="fileList">
    <s-table-page


      :header-search="defSearch()"
      :data="resultData">
      <s-table-column label="账号名称" prop="name"></s-table-column>
      <s-table-column label="账号角色" prop="bRoleName"></s-table-column>
      <s-table-column label="账号分类" prop="classify"></s-table-column>
      <s-table-column label="账号类型" prop="accountType"></s-table-column>
      <s-table-column label="资产名称" prop="bSystemName"></s-table-column>
      <s-table-column label="IP地址" prop="IPaddress"></s-table-column>
      <s-table-column label="资产类型" prop="assetType"></s-table-column>
      <s-table-column label="结果" prop="result"></s-table-column>
    </s-table-page>
  </section>
</template>

<script>

  // import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        resultData: [{name: 'root', bRoleName: '超级管理员', classify: '有效账号', accountType: '托管账号', bSystemName: 'pc', IPaddress: '192.168.212.35', assetType: 'PC服务器', result: '成功'}]
      }
    },
    methods: {
      // 表头查询
      defSearch() {
        return {
          width: 10,
          offset: 14,
          placeholder: '请输入账号名称、IP地址查询',
          searchProps: ['name', 'IPaddress']
        }
      },
      /* 获取列表数据 */
      getList() {
        // $axios.post('/collectTask/getTaskList', {}).then((res) => {
        //   this.resultData = res.data;
        // });
      }
    },
    created() {
      this.getList()
    }
  }
</script>
