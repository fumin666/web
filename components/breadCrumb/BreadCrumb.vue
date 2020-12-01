<!--
 * @Description: In User Settings Edit
 * @Author: songyf
 * @Date: 2019-10-14
 * @LastEditTime: 2019-10-14
 * @LastEditors: Please set LastEditors
 -->
/*
create by YOU
*/
<template>
  <div>
    <div class="breadcrumb-box">
      <div class="breadcrumb-des"><i class="iconfont icon-home"></i></div>
      <s-breadcrumb separator="/">
        <s-breadcrumb-item v-for="(item, index) in bread" :to="item.to" :key="index">{{item.title}}
        </s-breadcrumb-item>
        <!--<s-breadcrumb-item>事件中心</s-breadcrumb-item>-->
      </s-breadcrumb>
    </div>
    <s-socket v-if="showSocket()"></s-socket>
  </div>
</template>

<script type="text/babel">
  import Socket from '@/components/socket/Socket'
  import {sysAdminUserName} from 'sunflower-common-utils'
  export default {
    name: 'sBreadCrumb',
    components: {
      's-socket': Socket
    },
    computed: {
      bread: function () {
        return this.$store.getters.bread
      }
    },
    methods: {
      showSocket() {
        return sysAdminUserName !== this.$store.getters.userName;
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .breadcrumb-box
    display flex
    padding-left 30px
    height 36px
    line-height 36px
    .breadcrumb-des
      padding-right 3px
    .s-breadcrumb
      line-height 36px

</style>
