<template>
  <s-table-page
    :data="ruleList"
    :show-header-checkbox="true"
    :header-search="getHeaderSearch()"
    :row-actions="getRowActions()"
    ref="authLinkRules"
    @selection-change="handleRuleSelectionChange">
    <s-table-column type="selection" width="45"></s-table-column>
    <s-table-column prop="ruleName" label="规则名称"></s-table-column>
    <s-table-column label="规则类型">
      <template slot-scope="scope">
        {{ipType[scope.row.ipType]}}
      </template>
    </s-table-column>
    <s-table-column label="IP规则" prop="ipRule"></s-table-column>
  </s-table-page>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    props: {
      data: Object
    },

    data() {
      return {
        ruleList: [],
        selectedRule: [],
        ipType: ['禁止', '允许']
      }
    },

    methods: {
      getList() {
        $axios.post('/loginRule/getLoginRuleInfoList').then((res) => {
          if (res.data && res.data.ruleInfoList) {
            this.ruleList = res.data.ruleInfoList;
            for (let i = 0; i < this.ruleList.length; i++) {
              this.ruleList[i].ipTypeStr = this.ipType[this.ruleList[i].ipType];
            }
            if (this.data) {
              this.$nextTick(() => {
                this.autoSelect();
              });
            }
          }
        });
      },

      handleRuleSelectionChange(val) {
        this.selectedRule = val;
      },

      getHeaderSearch() {
        return {
          searchProps: ['ruleName', 'ipRule']
        }
      },

      getRowActions() {
        let vm = this;
        return [
          {
            name: '详情',
            icon: 'eye',
            click: function(row) {
              vm.$emit('showRules', row);
            }
          }
        ]
      },

      autoSelect() {
        for (let i = 0; i < this.data.loginRuleHaveAuthLists.length; i++) {
          for (let j = 0; j < this.ruleList.length; j++) {
            if (this.data.loginRuleHaveAuthLists[i].ruleUuid === this.ruleList[j].uuid) {
              this.$refs.authLinkRules.toggleRowSelection(this.ruleList[j]);
              break;
            }
          }
        }
      }
    },

    created() {
      this.getList();
    }
  }
</script>
