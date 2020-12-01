/**
* Created by alex on 2017/4/1.
 */

<template>
  <div class="sc-checkbox-group" style="float: left">
    <s-select v-model="checkList" clearable @change="changeHandler">
      <s-option v-for="(check,index) in checks" :value="check.code" :label="check.name"
                :key="index"></s-option>
    </s-select>
    <!--<s-checkbox-group v-model="checkList" @change="changeHandler">
      <s-checkbox v-for="check in checks" :key="check.id" :label="check.code">{{check.name}}</s-checkbox>
    </s-checkbox-group>-->
  </div>
</template>

<script type="text/babel">
  export default {
    props: {
      checks: [Array]
    },

    data() {
      return {
        checkList: []
      }
    },

    methods: {
      changeHandler() {
        this.$emit('checkChange', this.checkList)
      }
    }
  }
</script>
