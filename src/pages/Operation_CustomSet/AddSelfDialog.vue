<template>
  <div id="oper-custom-add">
    <s-steps :current="current" type="arrow" step-width="177px">
      <s-step title="添加脚本"></s-step>
      <s-step title="脚本配置"></s-step>
      <s-step title="账号关联"></s-step>
      <s-step title="脚本校验测试"></s-step>
    </s-steps>
    <div class="step-content">
      <template v-if="current === 0">
        <add-script ref="addScript"></add-script>
      </template>
      <template v-else-if="current === 1">
        <script-config ref="scriptConfig" :pwdData="pwdData" :scriptType="type"></script-config>
      </template>
      <template v-else-if="current === 2">
        <account-relation ref="accountRel" :checkType="type"></account-relation>
      </template>
      <template v-else-if="current === 3">
        <test-list :checkType="type" @doCheck="doCheck" ref="addTestComponent"></test-list>
      </template>
    </div>
  </div>
</template>

<script>

  import addScript from './AddScript'
  import scriptConfig from './ScriptConfig'
  import accountRelation from './AccountRelation'
  import testList from './TestList'
  export default {
    data() {
      return {
        scriptProtocol: []
      }
    },
    components: {

      scriptConfig,
      accountRelation,
      testList,
      addScript
    },
    computed: {
      pwdData() {
        let flag
        (this.type === 2) ? flag = true : flag = false
        return flag
      }
    },
    props: {
      current: {
        type: Number,
        default: 0
      },
      scriptUuid: {
        type: String
      },
      type: {
        type: Number
      }
    },
    methods: {
      getTestList() {
        this.$refs['addTestComponent'].getAccountAssDevice()
      },
      doCheck(row) {
        this.$emit('doCheck', row);
      }
    }
  }
</script>
