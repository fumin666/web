/**
* Created by alex on 2017/8/22.
 */

<template>
  <s-form ref="addSpecialForm" :model="form" label-width="130px">
    <s-form-item label="审批领导" prop="leaderUuid">
      <s-select v-model="form.leaderUuid">
        <s-option v-for="(value, key) in leaderNameList" :key="key" :label="value.userRealName" :value="value.uuid"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item :label="labelName" prop="pwd">
      <s-input v-model="form.pwd"></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
export default {
  data() {
    return {
      form: {
        leaderUuid: '',
        pwd: ''
      },
      specType: '',
      leaderNameList: []
    }
  },
  computed: {
    labelName() {
      if (this.specType === 1) {
        return '输入动态口令'
      }
      if (this.specType === 2) {
        return '输入Radius口令'
      }
      if (this.specType === 3) {
        return '输入手机动态口令'
      }
    }
  },
  props: {
    initData: {
      type: Object
    }
  },
  created() {
    this.specType = this.initData.specType
    this.leaderNameList = this.initData.approveUser
  }
}
</script>
