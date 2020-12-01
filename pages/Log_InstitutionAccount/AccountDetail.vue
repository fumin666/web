<template>
  <section class="logInstitutionAccountDetail">
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table
        :data="asseDetailtLists">
        <s-table-column
          label="账号名称"
          prop="userLoginName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="真实姓名"
          prop="userRealName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="机构名称"
          prop="departName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="账号状态"
          prop="statusName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="账号登录状态"
          prop="loginstatus"
          width="120px">
        </s-table-column>
      </s-table>
    </s-scrollbar>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  // import {batchUuid} from 'sunflower-common-utils'

  export default {
    data() {
      return {
      }
    },
    props: {
      asseDetailtLists: Array
    },
    mounted() {
      // console.log(this.asseDetailtLists)
    }
  }
</script>
