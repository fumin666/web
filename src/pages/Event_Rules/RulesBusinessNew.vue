<template>
  <div class="rules-db-new">
    <s-form label-width="100px">
      <s-form-item label="规则类型">
        <s-select v-model="currentInfo" @change="handleChange" value-key="id">
          <s-option v-for="item in typeArr" :label="item.name" :value="item" :key="item.id"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
    <s-table :data="list">
      <s-table-column label="逻辑">
        <template slot-scope="scope">
          <s-select v-model="scope.row.logicValue" v-if="scope.row.multiplicity">
            <s-option v-for="item in scope.row.logicArr" :label="item.name" :value="item.id" :key="item.id"></s-option>
          </s-select>
        </template>
      </s-table-column>
      <s-table-column label="比较">
        <template slot-scope="scope">
          <s-select v-model="scope.row.compareValue">
            <s-option v-for="item in scope.row.compareArr" :label="item.name" :value="item.id" :key="item.id"></s-option>
          </s-select>
        </template>
      </s-table-column>
      <s-table-column label="值">
        <template slot-scope="scope">
          <template v-if="currentInfo.name === '访问模式'">
            <s-select v-model="scope.row.value1">
              <s-option
                v-for="(item, index) in valueList"
                :label="item.name"
                :value="item.value"
                :key="index"></s-option>
            </s-select>
          </template>
          <template v-else-if="currentInfo.name === '请求内容类型' || currentInfo.name === '响应内容类型'">
            <s-select v-model="scope.row.value1" allow-create filterable>
              <s-option v-for="item in ajaxOpt" :label="item.type" :value="item.type" :key="item.type"></s-option>
            </s-select>
          </template>
          <template v-else>
            <div class="double-input col-unit" v-if="scope.row.compareValue === betweenIndex">
              <s-input v-model="scope.row.value1"></s-input>-<s-input v-model="scope.row.value2"></s-input>
            </div>
            <s-input v-model="scope.row.value1" v-else></s-input>
          </template>
        </template>
      </s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont" :class="[scope.$index === 0 ? 'icon-add' : 'icon-cancel']" @click="action(scope.$index)" v-if="scope.row.multiplicity"></i>
        </template>
      </s-table-column>
    </s-table>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {numTransToArr, Validaters} from 'sunflower-common-utils'
  let {isIp, isMac} = Validaters

  export default {
    data() {
      return {
        compareArr: [],
        logicArr: [],
        typeArr: [],
        list: [],
        currentInfo: {},
        betweenIndex: 9,
        rule: {},
        ajaxOpt: [],
        valueList: []
      }
    },
    methods: {
      getCompareType() {
        $axios.get('/auditPolicyRule/getAllCompareType').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.compareArr = res.data;
            this.getLogicType();
            this.getBetween();
          }
        });
        $axios.get('/sessionCmd/getObjectListByTableName/t_dic_dbaudit_contenttype').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.ajaxOpt = res.data;
          }
        });
      },
      getLogicType() {
        $axios.get('/auditPolicyRule/getAllLogicType').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.logicArr = res.data;
            this.getTypeOption();
          }
        });
      },
      getTypeOption() {
        $axios.get('/auditPolicyRule/getAuditPolicyTypeByUsed/2').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.typeArr = res.data;
          }
        });
      },
      handleChange(val) {
        if (val) {
          this.list = [];
          val.value1 = '';
          val.value2 = '';
          val.compareArr = numTransToArr(this.compareArr, val.compare);
          val.compareValue = val.compareArr[0].id;
          if (val.multiplicity) {
            val.logicArr = numTransToArr(this.logicArr, val.logic);
            val.logicValue = val.logicArr[0].id;
          }
          this.currentInfo = val;
        }
        let list = JSON.parse(JSON.stringify(this.currentInfo));
        this.list.push(list);
      },
      action(index) {
        if (index === 0) {
          this.handleChange();
        } else {
          this.list.splice(index, 1);
        }
      },
      getBetween() {
        for (let i = 0; i < this.compareArr.length; i++) {
          if (this.compareArr[i].name === '范围') {
            this.betweenIndex = this.compareArr[i].id;
            return;
          }
        }
      },
      beforeOk() {
        if (this.list.length > 0) {
          this.list[0].logicValue = '';
          this.rule = {
            relation: 1,
            type: this.list[0].id,
            auditPolicyRuleItemList: []
          };
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].value1 === '' || (this.list[i].compareValue === this.betweenIndex && this.list[i].value2 === '')) {
              this.$message({type: 'error', message: '请设置规则的值'});
              return false;
            } else if (this.rule.type === 4 && !isIp(this.list[i].value1)) {
              this.$message({type: 'error', message: '请输入正确的IP'});
              return false;
            } else if (this.rule.type === 5 && !isMac(this.list[i].value1)) {
              this.$message({type: 'error', message: '请输入正确的MAC，例c6:0a:45:66:5b:97'});
              return false;
            } else {
              this.rule.auditPolicyRuleItemList.push({
                index: i + 1,
                relation: this.list[i].logicValue,
                compare: this.list[i].compareValue,
                value1: this.list[i].value1,
                value2: this.list[i].value2
              });
            }
          }
          this.$emit('newBeforeOk', this.rule);
        } else {
          this.$message({type: 'error', message: '请设置规则'});
        }
      },
      // 获取'值'下拉选项列表
      getValueList() {
        $axios.get('/auditPolicyRule/getAccessModeSelect').then(({data}) => {
          if (data && data instanceof Array) {
            this.valueList = data
          }
        })
      }
    },
    created() {
      this.getValueList();      // 获取'值'下拉选项列表
      this.getCompareType();
    }
  }
</script>

<style>
  .rules-db-new .s-table-body .s-table-row:nth-child(1) td:nth-child(1) .s-select {
    display: none;
  }
  .rules-db-new .double-input .s-input {
    width: calc(50% - 8px);
  }
</style>
