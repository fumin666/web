<template>
  <div>
    <moreselect v-model="value" :data="selectData" :defaultProps="defaultProps" @change="change"></moreselect>
  </div>
</template>

<script>
  import moreselect from '../MoreLocalSelect';
  import { selectData } from '@/common/utils/mockData.js';
  export default {
    components: {
      moreselect
    },
    data() {
      return {
        value: '100000',
        selectData: [],
        defaultProps: {
          label: 'label',
          value: 'uuid'
        }
      }
    },
    created() {
      setTimeout(() => {
        this.selectData = selectData.data;
      }, 1000);
    },
    methods: {
      change(val) {

      }
    }
  }
</script>

<style>

</style>
