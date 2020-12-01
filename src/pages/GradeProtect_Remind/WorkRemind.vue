<template>
  <s-tab v-model="activeName" type="card" style="margin-top: 15px;">
    <s-tab-pane label="我的待办" name="mywilldone">
      <my-willdone v-if="activeName === 'mywilldone'"></my-willdone>
    </s-tab-pane>
    <s-tab-pane label="我的审批" name="myapproval">
      <my-approval v-if="activeName === 'myapproval'"></my-approval>
    </s-tab-pane>
    <s-tab-pane label="我的已办" name="myhavedone">
      <my-havedone v-if="activeName === 'myhavedone'"></my-havedone>
    </s-tab-pane>
    <s-tab-pane label="我的关注" name="myattention">
      <my-attention v-if="activeName === 'myattention'"></my-attention>
    </s-tab-pane>
  </s-tab>
</template>

<script>
  import myWilldone from './MyWillDone'
  import myHavedone from './MyHaveDone'
  import myApproval from './MyApproval'
  import myAttention from './MyAttention'
    export default {
      data() {
        return {
          activeName: 'mywilldone'
        }
      },
      components: {
        myWilldone,
        myHavedone,
        myApproval,
        myAttention
      }
    }
</script>

<style scoped>

</style>
