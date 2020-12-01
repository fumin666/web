<template>
<div id="findAgain" class="step1" style="margin-top:20px">
  <s-scrollbar wrap-style="max-height: 500px;">
    <s-form :model="step1Form" :rules="rules" ref="step1Form" class="demo-ruleForm" label-width="110px">
      <s-form-item label="申请数量" prop="applyNum">
        <s-input-number v-model="applyNum" :min="1"></s-input-number>
      </s-form-item>
      <s-form-item label="是否选择子网" prop="SFXZZW">
        <s-radio-group v-model="SFXZZW" @change="change">
          <s-radio class="radio" :label="0">否</s-radio>
          <s-radio class="radio" :label="1">是</s-radio>
        </s-radio-group>
      </s-form-item>
      <!-- <s-form-item label="备注" prop="BZ">
        <s-input type="textarea" v-model="step1Form.BZ"></s-input>
      </s-form-item> -->
    </s-form>
    <div style="font-weight:bold;position:relative;top:15px;" v-if="step1Form.SFXZZW===1">子网选择</div>
        <s-table-page
      ref="multipleTable"
      :data="tableData"
      :header-search="getSearchDef()"
      style="margin:15px auto"
      v-if="step1Form.SFXZZW===1"
      :show-header-checkbox="true"
      @selection-change="selectionChange">
      <s-table-column type="selection" width="45"/>
      <s-table-column prop="subNetAddress" label="子网地址"/>
      <s-table-column prop="subNetName" label="子网名称"/>
      <s-table-column prop="subNetMask" label="子网掩码"/>
      <s-table-column prop="departName" label="组织机构名称"/>
      <s-table-column prop="mxHostCount" label="IP地址数"/>
      <s-table-column prop="available" label="可用IP数">
        <template slot-scope="scope">
          <span>{{scope.row.available?scope.row.available:0}}</span>
        </template>
      </s-table-column>
    </s-table-page>
  </s-scrollbar>
</div>
</template>

<script>
import {cloneDeep} from 'lodash'
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      rules: {
        applyNum: [Validaters.NotNull],
        SFXZZW: [Validaters.NotNull]
        // BZ: [Validaters.Max(30)]
      }
    }
  },
  computed: {
    applyNum: {
      get() {
        return this.$store.state.addressAllocationSteps.step1.step1Form.applyNum;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep1applyNum', cloneDeep(val));
      }
    },
    SFXZZW: {
      get() {
        return this.$store.state.addressAllocationSteps.step1.step1Form.SFXZZW;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep1SFXZZW', cloneDeep(val));
      }
    },
    step1Form: {
      get() {
        return this.$store.state.addressAllocationSteps.step1.step1Form;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep1FormList', cloneDeep(val));
      }
    },
    tableData: {
      get() {
        return this.$store.state.addressAllocationSteps.step1.tableData;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep1Table', cloneDeep(val));
      }
    },
    selections1: {
      get() {
        return this.$store.state.addressAllocationSteps.step1.selections;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep1Selections', cloneDeep(val));
      }
    }
  },
  methods: {
    // 列表表头查询
    getSearchDef() {
      return {
        width: 10,
        placeholder: '请输入子网地址、子网名称、组织机构名称进行查询',
        searchProps: ['subNetAddress', 'subNetName', 'departName']
      }
    },
    selectionChange(rows) {
      this.selections1 = rows;
    },
    change(val) {
      if (val === 0) {
        this.selections1 = [];
      }
    },
    getTableData() {
      let vm = this
      $axios.get('/ipamNetsegment/getAllIpamNetSegmentList').then((response) => {
        let {
          data
        } = response;
        this.tableData = data;
        if (vm.selections1.length) {
          vm.$nextTick(function() {
            vm.selections1.forEach(row => {
              vm.tableData.forEach(obj => {
                if (obj.uuid === row.uuid) {
                  vm.$refs.multipleTable.toggleRowSelection(obj, true);
                }
              })
            });
          })
        }
      })
    },
    next() {
      let _this = this;
      this.$refs.step1Form.validate(vaild => {
        if (!vaild) {
          return false;
        }
        if (this.step1Form.SFXZZW) {
          if (this.selections1.length === 0) {
            this.$message({type: 'warning', message: '子网至少选择一条数据！'})
            return;
          }
        }
        _this.$store.commit('addressAllocationSteps/next');
      });
    }
  },
  created() {
    this.getTableData();
  },
  mounted() {

  }
}
</script>
