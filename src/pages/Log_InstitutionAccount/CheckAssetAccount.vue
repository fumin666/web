<template>
  <section class="checkAssetAccount">
    <s-scrollbar wrap-class="scrollHeight">
      <s-table
        :data="assetAccountsDetail">
        <s-table-column
          label="资产账号名称"
          prop="accountName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="账号角色"
          prop="accountRoleName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="账号类型"
          prop="accountTypeStr"
          show-overflow-tooltip>
        </s-table-column>
      </s-table>
    </s-scrollbar>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  // import {batchUuid} from 'sunflower-common-utils'

  export default {
    components: {
    },
    data() {
      return {
      }
    },
    props: ['assetAccountsDetail'],
    created() {

    }
  }
</script>
