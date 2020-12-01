<template>
  <section class="logInstitutionOperateDetail">
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table-tree :data="tree.data" :config="tree.config" :treeIndex="4"  :defaultExpand="false">
      </s-table-tree>
    </s-scrollbar>
  </section>
</template>

<script>
  export default {
    props: ['treeData'],
    data() {
      return {
        tree: {
          data: [],
          config: [
            {
              title: '序号',
              property: 'index',
              width: 80
            },
            {
              title: '账号名称',
              property: 'userName'
            },
            {
              title: '真实姓名',
              property: 'realName'
            },
            {
              title: '运维资产IP',
              property: 'deviceIp'
            },
            {
              title: '创建时间',
              property: 'createTime',
              width: 180
            }
          ]
        }
      }
    },
    mounted() {
    },
    created() {
      if (this.treeData) {
        this.tree.data = this.treeData
      }
    }
  }
</script>
