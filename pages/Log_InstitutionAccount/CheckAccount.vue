<template>
  <section class="checkAccount">
    <s-scrollbar wrap-class="scrollHeight">
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
          label="组织名称"
          prop="departName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="角色"
          prop="roleName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="状态"
          prop="statusName">
        </s-table-column>
      </s-table>
    </s-scrollbar>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  // import {batchUuid} from 'sunflower-common-utils'

  export default {
    components: {},
    data() {
      return {}
    },
    props: ['asseDetailtLists'],
    created() {

    }
  }
</script>
