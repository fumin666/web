<template>
  <div>
    <navs :modelName="'autoOperationCenter'" @goto="goto" @buttonCount='buttonCount' class="contentOpacity" style="opacity:1"></navs>
  </div>
</template>
<script type="text/babel">
  import navs from '@/components/navButton/NavButton.vue';
  export default {
    data () {
      return {
      }
    },
    components: {
      navs
    },
    methods: {
      // 路由跳转
      goto(path) {
        this.$router.push('/AutoOpsCenter/' + path)
      },
      buttonCount(count) {
        this.$emit('buttonCount', count)
      }
    },
    mounted() {
    }
  }
</script>
