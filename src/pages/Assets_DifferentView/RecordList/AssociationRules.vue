/**
* Created by liushupeng on 2019/2/21.
*/
<template>
  <!--关联规则-->
  <s-table-page
    style="margin-bottom: 20px;"
    :data="rulesList"
    :header-search="getHeaderSearch()">
    <s-table-column label="规则名" prop="ruleName" />
    <s-table-column label="规则来源" prop="ruleSource" />
    <s-table-column label="规则内容" prop="ruleContent" />
    <s-table-column label="状态" prop="ruleStatus" />
  </s-table-page>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        rulesList: [],
        uuid: this.$route.params.assetUuid
      }
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询内容',
          searchProps: ['ruleName', 'ruleSource', 'ruleContent', 'ruleStatus']
        }
      },
      getList() {
        let vm = this
          $axios.get(`/assetsRelationPage/getAllRelationEventRuleByItcomp/${vm.uuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            vm.rulesList = res.data;
          }
        })
      }
    },
    created() {
      this.getList()
    }
  }
</script>

<style>
</style>
