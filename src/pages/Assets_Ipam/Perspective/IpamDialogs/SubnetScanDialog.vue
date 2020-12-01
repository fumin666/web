<!--
 * @Author: 高建鹏
 * @Version: //Q4IP台账
 * @LastEditors: 高建鹏
 * @Description: 子网扫描
 * @Position: ipam -》 ip地址管理-》子网视角-子网扫描
 * @Date: 2019-04-22 16:05:09
 * @LastEditTime: 2019-11-07 11:12:48
 -->
 <template>
  <div class="step findAgainDialogFlag_main" v-if="subnetscandialog">
    <component :is="currentStep" :ref="currentStep" @close='close'></component>
  </div>
</template>

<script>
// import $axios from 'sunflower-ajax'
import {
  mapState
} from 'vuex'
import {
  step1,
  step2,
  step3,
  step4
} from '../ScanningSteps'
export default {
  props: {
    subnetscandialog: {
      type: Boolean
    }
  },
  components: {
    step1,
    step2,
    step3,
    step4
  },
  computed: {
    ...mapState('scanningSteps', [
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
  // watch: {
  //   subnetscandialog(val) {
  //     if (!val) {
  //       store.commit('reset');
  //     }
  //   }
  // },
  methods: {
    close() {
      if (this.$refs.step2) {
        clearTimeout(this.$refs.step2.recodeTimer);
      }
      this.$store.commit('scanningSteps/reset');
      this.$emit('update:subnetscandialog', false);
    }
  }
}
</script>

<style scoped>

</style>
