<!--
 * @Author: 高建鹏
 * @Version: //Q4资产发现
 * @Description:资产发现
 * @Position:资产发现
 * @Date: 2019-06-05 16:37:35
 * @LastEditors: 高建鹏
 -->
<template>
  <div v-if="findAgainDialogFlag" class="findAgainDialogFlag_main">
    <component :is="currentStep" :ref="currentStep" @close="close"></component>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import findMixin from './FindMixin';
import FindAginMain from './Dialog/FindAginMain';
import StartScan from './Dialog/StartScan';
import ResultDialog from './Dialog/ResultDialog';
  export default {
    components: {
      FindAginMain,
      StartScan,
      ResultDialog
    },
    mixins: [findMixin],
    props: {
      findAgainDialogFlag: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        step: 0
      }
    },
    computed: {
      ...mapState({
        current: state => state.assetFindAgain.current
      }),
      currentStep () {
        let com = ['FindAginMain', 'StartScan', 'ResultDialog'];// 资产发现主组件，扫描组件，结果组件
        return com[this.current];
      }
    },
    created() {
    },
    methods: {
      // 关闭资产发现
      close() {
        this.$store.commit('reset');// 重置
        this.$emit('update:findAgainDialogFlag', false)
      },
      next(n) {
        this.step = n;
      }
    }
  }
</script>

<style>

</style>