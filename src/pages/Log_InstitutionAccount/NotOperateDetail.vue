<template>
  <section class="logInstitutionOperateDetail">
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table
        :data="notOperateData">
        <s-table-column
          label="账号名称"
          prop="userName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="真实名称"
          prop="realName"
          show-overflow-tooltip>
        </s-table-column>
      </s-table>
    </s-scrollbar>
  </section>
</template>

<script>

  export default {
    data() {
      return {
      }
    },
    props: {
      notOperateData: Array
    }
  }
</script>
