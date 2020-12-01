<template>
  <section>
    <s-row>
      <s-col :span="24">重点命令集信息</s-col>
    </s-row>
    <s-row>
      <s-col :span="5">
        <div class="grid-content bg-purple">命令集名称：</div>
      </s-col>
      <s-col :span="5">
        <s-tooltip :content="List.info.name" v-if="List.info.name !== ''">
          <div class="grid-content bg-purple-light overFlowTip">{{List.info.name}}</div>
        </s-tooltip>
        <div class="grid-content bg-purple-light" v-else></div>
      </s-col>
      <s-col :span="3">
        <div class="grid-content bg-purple">备注</div>
      </s-col>
      <s-col :span="11">
        <s-tooltip :content="List.info.remark" v-if="List.info.remark !== ''">
          <div class="grid-content bg-purple-light overFlowTip">{{List.info.remark}}</div>
        </s-tooltip>
        <div class="grid-content bg-purple-light" v-else></div>
      </s-col>
    </s-row>
    <s-row style="margin-top: 20px">
      <s-col :span="24">已关联重点命令列表</s-col>
    </s-row>
    <s-scrollbar wrap-style="max-height:300px;">
      <s-table-page
        :data="List.rels"
        :header-search="getSearchDef()">
        <s-table-column label="名称" prop="key_command_name" show-overflow-tooltip></s-table-column>
        <s-table-column label="内容" prop="key_command_cont" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>
<script>
  export default {
    data() {
      return {}
    },
    props: {
      List: Object
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['key_command_name', 'key_command_cont']
        }
      }
    },
    mounted() {

    }
  }
</script>

