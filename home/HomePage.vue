<!--
 * @Author: mybells
 * @Description:默认首页
 * @Date: 2019-12-30 11:20:41
 * @LastEditors: mybells
 -->
<template>
  <div style="height:100%; min-width: 1200px">
    <s-header></s-header>
    <div id="home-content">
      <s-row type="flex" class="main-content">
        <s-col :span="4" v-for="(item,index) in menu" :key="index" class="item-content" style="margin-bottom:50px;"
               @click.native="goNext(item.to)">
          <div class="detail-content">
            <div class="page-wq">
              <s-badge :value="item.sub">
                <div :style={background:item.background} class="page-yq">
                  <img :src=item.url class="icon-text"/>
                </div>
              </s-badge>
            </div>
            <p class="name-text">{{item.title}}</p>
            <p class="msg-text">{{item.msg}}</p>
          </div>
        </s-col>
      </s-row>
    </div>
    <footer class="home-fooer">
      <p class="footer-text" v-copyright></p>
    </footer>
  </div>
</template>

<script type="text/babel">
  import Header from '../components/header/Header';
  import {mapGetters} from 'vuex'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin.js'
  export default {
    name: 'HomePage',
    mixins: [roleCheckMixin],
    data() {
      return {
        homeData: [
          {
            name: '账号管理',
            icon: 'nav-account-manage',
            msg: '组织机构、授权策略、机构、改密',
            background: '#368',
            sub: 0
          },
          {
            name: '资产管理',
            icon: 'nav-asset-manage',
            msg: '资产发现、资产管理、配置管理',
            sub: 0
          },
          {
            name: '资产监控',
            icon: 'nav-asset-monitor',
            msg: '资产监控、拓扑视图、业务服务',
            sub: 0
          },
          {
            name: '运维中心',
            icon: 'nav-oper-center-t',
            msg: '运维、双人协作、客户端下载',
            sub: 0
          },
          {
            name: '事件中心',
            icon: 'nav-event-center',
            msg: '告警、异常事件、规则、知识库',
            sub: 0
          },
          {
            name: '流程中心',
            icon: 'nav-process-center',
            msg: '工单创建、处理、流程设置',
            sub: 0
          },
          {
            name: '报表中心',
            icon: 'nav-log-center',
            msg: '统计、审计总数、监控排行',
            sub: 0
          },
          {
            name: '系统设置',
            icon: 'nav-system-set',
            msg: '自检、备份、公告、注册升级',
            sub: 0
          }
        ]
      }
    },
    components: {
      's-header': Header
    },
    computed: {
      ...mapGetters(['menu'])
    },
    created() {
    },
    methods: {
      goNext(url) {
        this.$router.push(url)
      }
    }
  }
</script>
<style lang="stylus">
#home-content{
  .page-yq{
    width:80px;height:80px;border-radius:50%;text-align:center;line-height:80px;margin-bottom:20px;
    position: relative;
    margin: 10px 0 0 10px;
  }
  .page-wq{
    width:100px;height:100px;border-radius:50%;margin-bottom:10px;
    transition:all 1s
    .s-badge .is-fixed{
      top:15px;
      right:20px;
    }
  }
}
</style>
