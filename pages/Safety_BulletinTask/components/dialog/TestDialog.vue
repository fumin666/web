<template>
  <s-dialog v-model="dialogFlag" title="下发通报" width="730px" append-to-body>
    test
  </s-dialog>
</template>
<script>
  export default {
    components: {
      // customForm
    },
    data() {
      return {
        dialogFlag: false
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    watch: {
    },
    created() {
    },
    methods: {
    }
  }
</script>
