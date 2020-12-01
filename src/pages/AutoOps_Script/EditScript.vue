<template>
  <section class="createScriptLibrary">
    <codemirror v-model="codes" :options="option" ref="codemirror"></codemirror>
  </section>
</template>
<script>
  // import $axios from 'sunflower-ajax';
  import { codemirror } from 'vue-codemirror-lite'
  export default {
    data() {
      return {
        codes: this.code,
        option: this.options
      };
    },
    components: {
      codemirror
    },
    props: ['code', 'options'],
    mounted() {
    }
  }
</script>

