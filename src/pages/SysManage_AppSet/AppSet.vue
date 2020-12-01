<template>
  <section class="app-set">
    <s-tab v-model="activeTab" type="card">
      <s-tab-pane label="终端列表" name="all">
        <app-set-all></app-set-all>
      </s-tab-pane>
      <s-tab-pane label="黑名单" name="black">
        <app-set-black></app-set-black>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  import AppSetAll from './AppSetAll';
  import AppSetBlack from './AppSetBlack';

  export default {
    components: {
      AppSetAll,
      AppSetBlack
    },

    data() {
      return {
        activeTab: 'all'
      }
    }
  }
</script>

<style>

</style>
