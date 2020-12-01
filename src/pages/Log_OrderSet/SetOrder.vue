<template>
  <section>
    <s-scrollbar wrap-style="max-height:400px;">
      <s-table-page
        :data="importList"

        :header-search="getSearchDef()"
        :pagination-show = false
        :hasActionCol = false
        @selection-change="handleSelectionChange"
        ref="table">
        <s-table-column type="selection" width="50" :reserve-selection="true"></s-table-column>
        <s-table-column label="名称" prop="key_command_name" show-overflow-tooltip></s-table-column>
        <s-table-column label="内容" prop="key_command_cont" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>
<script>
  // import $axios from 'sunflower-ajax'

  export default {
    components: {

    },
    data() {
      return {
        selectionUuid: [],
        selection: [] // 重点命令设置回显
      }
    },
    props: {
      importList: Array
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['key_command_name', 'key_command_cont']
        }
      },
      handleSelectionChange(val) {
        let vm = this;
        vm.selectionUuid.length = 0;
        vm.selection = [];
        val.map((item) => {
          vm.selectionUuid.push(item.uuid);
        });
        vm.$emit('getUuid', vm.selectionUuid)
      }
    }
  }
</script>

