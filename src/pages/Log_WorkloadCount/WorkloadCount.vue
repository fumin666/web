<template>
  <section class="log-alarm-more content">
    <s-tab type="card" @on-click="showTab">
      <s-tab-pane label="组织机构运维工作量" v-if="judgeRoleBtn('logCenter_orgOperationWorkload')">
        <department-work :show1="show1"></department-work>
      </s-tab-pane>
      <s-tab-pane label="员工运维工作量" v-if="judgeRoleBtn('logCenter_userOperationWorkload')">
        <person-work :show2="show2"></person-work>
      </s-tab-pane>
      <s-tab-pane label="资产运维工作量" v-if="judgeRoleBtn('logCenter_assetOperationWorkload')">
        <device-work :show3="show3"></device-work>
      </s-tab-pane>
      <s-tab-pane label="特殊运维申请工作量" v-if="judgeRoleBtn('logCenter_specialOperationApplyWorkload')">
        <special-apply :show4="show4"></special-apply>
      </s-tab-pane>
      <s-tab-pane label="特殊运维审批工作量" v-if="judgeRoleBtn('logCenter_specialOperationApproveWorkload')">
        <special-audit :show5="show5"></special-audit>
      </s-tab-pane>
      <s-tab-pane label="双人协作运维工作量" v-if="judgeRoleBtn('logCenter_doubleCooperationOperationWorkload')">
        <double-operate :show6="show6"></double-operate>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'

  import DepartmentWork from './DepartmentWork'
  import PersonWork from './PersonWork'
  import DeviceWork from './DeviceWork'
  import SpecialApply from './SpecialApply'
  import SpecialAudit from './SpecialAudit'
  import DoubleOperate from './DoubleOperate'

  export default {
    components: {

      DepartmentWork,
      PersonWork,
      DeviceWork,
      SpecialApply,
      SpecialAudit,
      DoubleOperate
    },
    data() {
      return {
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false
      }
    },
    methods: {
      showTab(val) {
        let vm = this;
        let vals = 1 + val;
        vm.show1 = false;
        vm.show2 = false;
        vm.show3 = false;
        vm.show4 = false;
        vm.show5 = false;
        vm.show6 = false;
        this['show' + vals] = true;
      }
    },
    created() {

    }
  }
</script>

<style>
.log-alarm-more{margin-top:20px}
</style>
