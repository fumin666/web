/**
* Created by alex on 2017/5/6.
*/

<template>
  <div class="tool-bar" style="margin-bottom: 12px">
    <s-row class="handler-btns" type="flex" justify="between">
      <s-col>
        <slot name="leftBtn"></slot>
      </s-col>
      <s-col v-show="showRightBtn">
        <s-button icon="inquire" @click="hideHandler"></s-button>
        <slot name="rightBtn"></slot>
      </s-col>
    </s-row>
    <s-row v-show="boxShow">
      <s-search-group ref="searchBox" :searchHandler="getSearchFun">
        <slot name="form"></slot>
        <template slot="btn-pre">
          <slot name="btn-pre"></slot>
        </template>
        <template slot="btn-next">
          <slot name="btn-next"></slot>
        </template>
      </s-search-group>
    </s-row>
  </div>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus'
  export default {
    data() {
      return {
        boxShow: true
      }
    },
    props: {
      searchAction: {
        type: Function
      },
      show: {
        type: Boolean,
        default: false
      },
      showRightBtn: {
        type: Boolean,
        default: true
      }
    },
    created() {
      Bus.$on('event', function () {
        console.log('公共汽车来了...嘟嘟嘟')
      })
    },
    mounted() {
      this.boxShow = this.show
      if (this.boxShow) {
        this.$nextTick(() => {
          this.$refs.searchBox.bottomArrowHandler()
        })
      }
    },
    methods: {
      getSearchFun() {
        this.searchAction()
      },
      hideHandler() {
        this.boxShow = !this.boxShow;
      }
    },
    watch: {
      boxShow(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.searchBox.getOriginHeight()
          })
        }
      }
    }
  }
</script>

<style>
  .handler-btns {
    margin-bottom: 10px;
  }

  .handler-btns .icon-inquire {
    font-weight: bold;
  }
</style>
