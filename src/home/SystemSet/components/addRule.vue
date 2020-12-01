/*
create by YOU
*/
<template>
  <div>
    <s-table
      :data="scoreSet.addRules"
      style="width: 100%">
      <s-table-column
        label="比较">
        <template slot-scope="scope">
          <!--scoreSet.compare-->
          <s-select v-model="scope.row.compareUuid" placeholder="请选择">
            <s-option
              v-for="(item,index) in compare"
              :label="item.compareModeName"
              :value="item.uuid"
              :key="index">
            </s-option>
          </s-select>
        </template>
      </s-table-column>
      <s-table-column
        width="200px"
        :label="ruleItem.targetName + ((unit.indexOf('|') !== -1) ? '' : `(${unit})`)">
        <template slot-scope="scope">
          <s-select v-if="condition.length > 0" v-model="scope.row.compareValue" placeholder="请选择">
            <s-option
              v-for="(item,index) in condition"
              :label="item.value"
              :value="item.name"
              :key="index">
            </s-option>
          </s-select>
          <s-input-number v-else-if="unit.indexOf('%') !== -1" :min="0" :max="100" v-model="scope.row.compareValue"
                          style="vertical-align: middle;width:150px"></s-input-number>
          <s-input-number v-else :min="0" :step="0.1" v-model="scope.row.compareValue"
                          style="vertical-align: middle;width:150px"></s-input-number>
        </template>
      </s-table-column>
      <s-table-column
        label="操作">
        <template slot-scope="scope">
          <i v-if="scope.$index === 0" class="iconfont icon-plus" @click="addRuleItem"></i>
          <i v-else class="iconfont icon-delete" @click="deleteRuleItem(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table>
    <s-form label-width="80px" style="margin-top: 20px">
      <s-form-item label="分值">
        <s-input-number v-model="scoreSet.ruleScore" :min="0" :max="100"></s-input-number>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/babel">
  export default {
    data () {
      return {
        scoreSet: {
          // 数据
          addRules: [],
          ruleScore: 0,
          addRuleTemplate (compare, condition) {
            return {
              compareUuid: compare !== undefined ? compare : '',
              compareValue: condition !== undefined ? condition : ''
            }
          }
        }
      }
    },
    mounted () {
      this.scoreSet.addRules = [this.scoreSet.addRuleTemplate()]
      this.init()
    },
    methods: {
      init () {
        if (Object.keys(this.data).length > 0) {
          this.scoreSet.ruleScore = this.data.scoure
          this.scoreSet.addRules = this.data.kpiMiRuleList && this.data.kpiMiRuleList.map ? this.data.kpiMiRuleList.map(function (item) {
            return {
              compareUuid: item.compareUuid,
              compareValue: item.compareName
            }
          }) : [this.scoreSet.addRuleTemplate()]
        }
      },
      handleDeleteRule () {},
      addRuleItem () {
        if (this.scoreSet.addRules.length < 2) {
          this.scoreSet.addRules.push(this.scoreSet.addRuleTemplate())
        } else {
          this.$message('只可以添加两个规则条件！')
        }
      },
      deleteRuleItem (row) {
        this.scoreSet.addRules = this.scoreSet.addRules.filter(function (item) {
          return item !== row
        })
      }
    },
    props: {
      ruleItem: {
        required: true,
        type: Object
      },
      unit: {
        type: String,
        default: ''
      },
      compare: {
        type: Array,
        default: function () {
          return []
        }
      },
      condition: {
        type: Array,
        default: function () {
          return []
        }
      },
      data: {
        type: Object,
        default: function () {
          return {}
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .s-input-number-increase
    i.iconfont
      margin: 0 !important

  .s-input-number-decrease
    i.iconfont
      margin: 0 !important
</style>
