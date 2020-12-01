<template>
  <div>
    <navs :modelName="'assetsManage'" @openDialog="findAgain" @goto="gotoRouter" @buttonCount='buttonCount' class="contentOpacity" style="opacity:1"></navs>
    <find-again-dialog :findAgainDialogFlag.sync="findAgainDialogFlag" v-if="findAgainDialogFlag">
    </find-again-dialog>
  </div>
</template>
<script type="text/babel">
  import navs from '@/components/navButton/NavButton.vue';
  import mixin from '@/common/mixins/portletUtil'
  import FindAgainDialog from '@/pages/Assets_FindAgain/FindAgainDialog';
  export default {
    mixins: [mixin],
    name: 'assetsNavs',
    data () {
      return {
        findAgainDialogFlag: false
      }
    },
    components: {
      navs,
      FindAgainDialog
    },
    methods: {
      findAgain() {
        let chartDiv = document.getElementById('assetsStatisticsChartN');
        if (chartDiv != null) {
          let childDiv = chartDiv.childNodes;
          if (childDiv[1]) {
            childDiv[1].style.display = 'none';
          }
        }
        this.findAgainDialogFlag = true;
      },
      gotoRouter(path) {
        this.$router.push('/AssetsAll/' + path)
      },
      buttonCount(count) {
        this.$emit('buttonCount', count)
      }
    },
    mounted() {
    }
  }
</script>
