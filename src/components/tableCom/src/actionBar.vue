/**
* Created by alex on 2017/4/1.
 */

<template>
  <div style="float: left">
    <s-button style="margin-right: 4px" v-for="action in actions" :key="action.id" @click="action.handler" :icon="action.icon"  v-if="action.btnName ? judgeRoleBtn(action.btnName) : true">{{action.name}}</s-button>
  </div>
</template>

<script type="text/babel">
  export default {
    props: {
      actions: [Array]
    }
  }
</script>

