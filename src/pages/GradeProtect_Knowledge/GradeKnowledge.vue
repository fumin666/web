<!--
 * @Author: mybells
 * @Description:安全通报-》知识库
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <section class="grade-menu-box">
    <s-col span="4">
      <s-tab v-model="paneName">
        <s-tab-pane label="知识分类" name="knowledgeType">
          <s-scrollbar wrap-style="maxHeight:calc(100vh - 220px);">
            <s-menu :active-name="typeTab" accordion @on-select="typeSelection" :open-names=[activeOpen] style="margin-left: -20px;font-size:14px">
              <s-submenu name="gradeBase">
                <template slot="title">
                  <i class="iconfont icon-nav-dengjibaohu"></i>
                  等保基本要求
                </template>
                <s-menu-item :key="index" :name="'gradeBase' + item.name" v-for="(item, index) in menuList">
                  <div @click="switchData(item.childList, index)"><span class="menu-dot"></span>{{item.name}}</div>
                </s-menu-item>
              </s-submenu>
              <s-submenu name="knowledgeBase">
                <template slot="title">
                  <i class="iconfont icon-nav-anquantongbao"></i>
                  等保工作
                </template>
                <s-menu-item :name="item.uuid" v-for="item in typeTabArr" :key="item.uuid"><span class="menu-dot"></span>{{item.bulletinName}}</s-menu-item>
              </s-submenu>
            </s-menu>
          </s-scrollbar>
        </s-tab-pane>
        <s-tab-pane label="我的关注" name="myAttention">
          <s-scrollbar wrap-style="maxHeight:calc(100vh - 220px);">
          </s-scrollbar>
        </s-tab-pane>
      </s-tab>
    </s-col>
    <s-col span="20" style="padding-left:20px;">
      <s-scrollbar wrap-style="maxHeight:calc(100vh - 220px);">
        <levelProtect v-if="paneName === 'knowledgeType' && typeTab.indexOf('gradeBase') !== -1" :activeName="activeName" :currentData="currentData" :tabIndex="tabIndex"></levelProtect>
        <knowledgeType v-if="paneName === 'knowledgeType' && typeTab.indexOf('gradeBase') === -1" :key="typeTab" :tabKey="typeTab"></knowledgeType>
        <myAttention v-if="paneName === 'myAttention'"></myAttention>
      </s-scrollbar>
    </s-col>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax';
  import myAttention from './MyAttention'
  import knowledgeType from './KnowledgeType'
  import levelProtect from './LevelProtect'

  export default {
    data() {
      return {
        paneName: 'knowledgeType',
        typeTab: '',
        typeTabArr: [],
        attentionTab: '',
        menuList: [],
        activeName: [],
        activeOpen: 'gradeBase',
        tabIndex: 0,
        currentData: '',
        attentionTabArr: []
      }
    },
    created() {
      this.getTypeTab();
      this.getList()
    },
    methods: {
      // 获取知识分类tab列表
      getTypeTab() {
        $axios.get('safetyPlatform/safetyBulletin/getAll').then(res => {
          if (this.$route.meta.name === '等保知识库') {
            this.typeTabArr = res.data.filter(v => {
              if (v.bulletinName === '等保工作-简化版' || v.bulletinName === '等保工作-最佳实践') {
                return v
              }
            })
          }
        })
      },
      getList() {
        $axios.get('/strategyInfo/getProtectInfo/0').then((res) => {
          this.menuList = res.data.map(item => {
            return {
              childList: item.children,
              name: item.value.typeName
            }
          })
          this.currentData = this.menuList[0].childList
          this.currentData.map((item, idx) => {
            this.activeName.push(idx)
          })
          this.$nextTick(() => {
            this.typeTab = 'gradeBase' + this.menuList[0].name
          })
        })
      },
      switchData(data, index) {
        this.tabIndex = index
        this.currentData = data
      },
      typeSelection(key) {
        this.typeTab = key;
      }
    },
    components: {
      myAttention,
      knowledgeType,
      levelProtect
    }
  }
</script>
<style lang="stylus" scoped>
  .grade-menu-box
    padding-top 15px
    .s-menu-item
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      .menu-dot
        vertical-align middle
        width 4px
        height 4px
        margin-right 10px
        display inline-block
        border-radius 50%
</style>
