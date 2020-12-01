<!--
 * @Author: 高建鹏
 * @Version: //Q4IP台账
 * @LastEditors: 高建鹏
 * @Description: IP地址扫描
 * @Position: ipam -》 ip地址管理-》子网视角-IP地址扫描
 * @Date: 2019-04-22 16:05:09
 * @LastEditTime: 2019-12-03 13:52:08
 -->
<template>
  <div class="step findAgainDialogFlag_main" v-if="scandialog">
    <component :is="currentStep" :ref="currentStep" @close='close'  v-on="$listeners"></component>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex';
import {
  step1,
  step2
} from '../AddressScanSteps'
export default {
  props: {
    scandialog: {
      type: Boolean
    },
    ipsubnetobj: {
      type: Object
    }
  },
  components: {
    step1,
    step2
  },
  computed: {
    ...mapState('addressScanSteps', [
      'current'
    ]),
    currentStep() {
      return 'step' + (this.current + 1)
    }
  },
  created() {
    this.$store.commit('addressScanSteps/ipsubnetobj', this.ipsubnetobj);
  },
  data() {
    return {

    }
  },
  methods: {
    close() {
      if (this.$refs.step1) {
        clearTimeout(this.$refs.step1.recodeTimer);
      }
      this.$store.commit('addressScanSteps/reset');
      this.$emit('update:scandialog', false);
    }
  }
}
</script>
