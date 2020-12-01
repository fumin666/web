<!--
 * @Author: 高建鹏
 * @LastEditors: 高建鹏
 * @Description: IP地址分配
 * @Position: ipam -》 ip地址管理-》子网视角-》this
 * @Date: 2019-04-22 16:05:09
 * @LastEditTime: 2019-06-03 16:00:25
 -->
<template>
<s-dialog v-model="allocationDialog" title="IP地址分配" width="900px" key="addressallocation" :before-close="dialogClose">
  <div class="discover">
    <div class="step-bar">
      <s-steps :current="current" type="arrow" step-width="270px">
        <s-step title="请求信息"></s-step>
        <s-step title="IP地址分配"></s-step>
        <s-step title="分配结果"></s-step>
      </s-steps>
    </div>
    <div class="step">
      <component :is="currentStep" :ref="currentStep"></component>
    </div>
  </div>
  <template slot="footer" class="dialog-footer">
    <div>
      <s-button @click="prev" class="prev" v-show="current > 0">上一步</s-button>
      <s-button @click="next" class="next" v-show="current < 2">下一步</s-button>
      <s-button @click="scanOk" v-show="current === 2">确定</s-button>
    </div>
  </template>
</s-dialog>
</template>

<script>
// import $axios from 'sunflower-ajax'
import {
  mapState
} from 'vuex'
import {
  step1,
  step2,
  step3
} from '../AddressAllocationSteps'
export default {
  props: {
    allocationDialog: {
      type: Boolean
    }
  },
  components: {
    step1,
    step2,
    step3
  },
  computed: {
    ...mapState('addressAllocationSteps', [
      'current'
    ]),
    currentStep() {
      return 'step' + (this.current + 1)
    }
  },
  data() {
    return {

    }
  },
  methods: {
    prev() {
      this.$store.commit('addressAllocationSteps/prev');
    },
    next() {
      this.$refs[this.currentStep].next();
    },
    scanOk() {
      this.$store.commit('addressAllocationSteps/reset');
      this.$emit('reload');
      this.$emit('update:allocationDialog', false);
    },
    dialogClose() {
      this.$store.commit('addressAllocationSteps/reset');
      this.$emit('update:allocationDialog', false);
    }
  }
}
</script>

<style scoped>

</style>
