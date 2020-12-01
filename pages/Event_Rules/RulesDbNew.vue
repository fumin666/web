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
          <template v-if="currentInfo.name === '登录状态'">
            <s-select v-model="scope.row.value1">
              <s-option label="成功" value="1"></s-option>
              <s-option label="失败" value="0"></s-option>
            </s-select>
          </template>
          <template v-else-if="currentInfo.name === '操作指令'">
            <s-select v-model="scope.row.value1" filterable>
              <s-option v-for="item in cmdOptions" :label="item.dbo_expand ? (item.dbo_key + ' ' + item.dbo_expand) : item.dbo_key" :value="item.dbo_id" :key="item.dbo_id"></s-option>
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
  import { numTransToArr, Validaters } from 'sunflower-common-utils'
  let {isIp, isMac, isPosInt} = Validaters

  export default {
    props: {
      cmdOptions: Array
    },
    data() {
      return {
        compareArr: [],
        logicArr: [],
        typeArr: [],
        list: [],
        currentInfo: {},
        betweenIndex: 9,
        rule: {}
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
        $axios.get('/auditPolicyRule/getAuditPolicyTypeByUsed/1').then((res) => {
          if (res.data && res.data instanceof Array) {
            // for (let i = 0; i < res.data.length; i++) {
            //   if (res.data[i].name === '结果集行数') {
            //     res.data[i].name = '结果集行数(条)';
            //   } else if (res.data[i].name === '查询频率') {
            //     res.data[i].name = '查询频率(次/分)';
            //   } else if (res.data[i].name === 'SQL执行时长') {
            //     res.data[i].name = 'SQL执行时长(秒)';
            //   } else if (res.data[i].name === '会话时长') {
            //     res.data[i].name = '会话时长(秒)';
            //   }
            // }
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
            } else if ((this.rule.type === 3 || this.rule.type === 6 || this.rule.type === 7 || this.rule.type === 8) && !isPosInt(this.list[i].value1)) {
              this.$message({type: 'error', message: '请输入正整数'});
              return false;
            } else if (this.rule.type === 4 && !isIp(this.list[i].value1)) {
              this.$message({type: 'error', message: '请输入正确的IP'});
              return false;
            } else if (this.rule.type === 5 && !isMac(this.list[i].value1)) {
              this.$message({type: 'error', message: '请输入正确的MAC，例c6:0a:45:66:5b:97'});
              return false;
            } else if (this.rule.type === 9) {
                let __reg = /^(([a-zA-Z\d\-\+]){1,32})$/;
                if (!__reg.test(this.list[i].value1)) {
                  this.$message({type: 'error', message: '请输入合法的SQL返回码,1~32个+-、数字、字母或其组合'});
                  return false;
                }
            }
            this.rule.auditPolicyRuleItemList.push({
              index: i + 1,
              relation: this.list[i].logicValue,
              compare: this.list[i].compareValue,
              value1: this.list[i].value1,
              value2: this.list[i].value2
            });
          }
          this.$emit('newBeforeOk', this.rule);
        } else {
          this.$message({type: 'error', message: '请设置规则'});
        }
      }
    },
    created() {
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
