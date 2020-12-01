<template>
  <div class="diy-auto-ops">
    <s-card-diy
      title="脚本库概况"
      :more-click="more" :show-more="true" show-scrollbar>
        <script-rough></script-rough>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import ScriptRough from './ScriptRough';

  export default{
    data() {
      return {}
    },
    components: {
      ScriptRough
    },
    methods: {
      more() {
        this.$router.push('/AutoOpsCenter/script')
      }
    },
    created() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .diy-auto-ops
    h2
      font-size 14px
      height 20px
      line-height 20px
</style>
