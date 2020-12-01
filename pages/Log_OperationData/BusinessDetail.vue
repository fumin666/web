<template>
  <section class="">
    <s-row>
      <s-col :span="5">
        <div class="grid-content bg-purple">URL</div>
      </s-col>
      <s-col :span="19">
        <s-tooltip :content="detailsObj.url" v-if="detailsObj.url !== ''">
          <div class="grid-content bg-purple-light overFlowTip">{{detailsObj.url}}</div>
        </s-tooltip>
        <div class="grid-content bg-purple-light" v-else></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="5">
        <div class="grid-content bg-purple">参数类型</div>
      </s-col>
      <s-col :span="19">
        <div class="grid-content bg-purple-light overFlowTip">{{detailsObj.action_type}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="5">
        <div class="grid-content bg-purple">参数</div>
      </s-col>
      <s-col :span="19">
        <s-tooltip :content="detailsObj.post_arg" v-if="detailsObj.post_arg">
          <div class="grid-content bg-purple-light overFlowTip">{{detailsObj.post_arg}}</div>
        </s-tooltip>
        <div class="grid-content bg-purple-light" v-else></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="5">
        <div class="grid-content bg-purple">cookie值</div>
      </s-col>
      <s-col :span="19">
        <s-tooltip :content="detailsObj.cookie" v-if="detailsObj.cookie !==''">
          <div class="grid-content bg-purple-light overFlowTip">{{detailsObj.cookie}}</div>
        </s-tooltip>
        <div class="grid-content bg-purple-light" v-else></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="5">
        <div class="grid-content bg-purple">浏览器</div>
      </s-col>
      <s-col :span="19">
        <div class="grid-content bg-purple-light overFlowTip">{{detailsObj.browser_type || '未识别'}}</div>
      </s-col>
    </s-row>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  // import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'

  export default {
    components: {
      // pageInfiniteTable
    },
    data() {
      return {
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbsqlUrl/sqllist',
          params: {
            condition: {}
          }
        }
      }
    },
    props: ['detailsObj', 'biz_id'],
    methods: {
      search() {
        var vm = this;
        vm.axiosHistoryObj.params.condition = Object.assign({}, {biz_id: vm.biz_id});
        vm.getHistoryFlag = true;
      }
    },
    created() {
      this.search()
    },
    // 每次传回的id不一样，则重新请求
    watch: {
      biz_id: {
        immediate: true,
        handler() {
          this.search();
        }
      }
    }
  }
</script>
