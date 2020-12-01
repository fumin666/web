/*
create by YOU
*/
<template>
  <div>
    <s-table-page
      :data="data"


      :header-search="defSearch()"

      @selection-change="onSelectionChange">
      <s-table-column
        type="selection"
        width="45">
      </s-table-column>
      <s-table-column
        prop="userLoginName"
        show-overflow-tooltip
        label="用户名">
      </s-table-column>
      <s-table-column
        prop="userRealName"
        show-overflow-tooltip
        label="真实姓名">
      </s-table-column>
      <s-table-column
        prop="userMail"
        show-overflow-tooltip
        label="Email">
      </s-table-column>
      <s-table-column
        prop="userCellphone"
        show-overflow-tooltip
        label="手机号">
      </s-table-column>
      <s-table-column
        prop="userWechat"
        show-overflow-tooltip
        label="微信号">
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">

  export default {
    components: {

    },
    data () {
      return {
        selected: []
      }
    },
    methods: {
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['userLoginName', 'userRealName', 'userMail', 'userCellphone', 'userWechat']
        }
      },
      onSelectionChange (selection) {
        this.selected = selection
      }
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      }
    }
  };
</script>
