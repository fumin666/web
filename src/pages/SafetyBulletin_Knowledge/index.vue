<!--
 * @Author: mybells
 * @Version://Q1知识库
 * @Description:安全通报-》知识库
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <section class="safetybulletin_knowledge" style="padding-top:15px;padding-left: 5px; padding-right: 5px; margin-left: -20px;">
    <s-col span="4">
      <s-tab v-model="paneName">
        <s-tab-pane label="知识分类" name="knowledgeType">
          <s-scrollbar wrap-style="maxHeight:calc(100vh - 220px);margin-right:-17px;">
            <s-menu :active-name="typeTab" @on-select="typeSelection" style="font-size:14px;margin-top:15px;">
              <s-menu-item :name="item.uuid" v-for="(item, index) in typeTabArr" :key="index">
                {{item.bulletinName}}
              </s-menu-item>
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
      <s-scrollbar wrap-style="maxHeight:calc(100vh - 170px);">
        <knowledgeType v-if="paneName === 'knowledgeType'" :key="typeTab" :tabKey="typeTab"></knowledgeType>
        <myAttention v-if="paneName === 'myAttention'"></myAttention>
      </s-scrollbar>
    </s-col>
  </section>
</template>
<script>
import $axios from 'sunflower-ajax';
import myAttention from './MyAttention'
import knowledgeType from './KnowledgeType'

export default {
  data() {
    return {
      paneName: 'knowledgeType',
      typeTab: '',
      typeTabArr: []
    }
  },
  created() {
    this.getTypeTab();
  },
  methods: {
    // 获取知识分类tab列表
    getTypeTab() {
      $axios.get('safetyPlatform/safetyBulletin/getUndeleteSafeType').then(res => {
        this.typeTabArr = res.data || [];
        if (this.typeTabArr.length) {
          this.$nextTick(() => {
            this.typeTab = this.typeTabArr[0].uuid;
          })
        }
      })
    },
    typeSelection(key) {
      this.typeTab = key;
    }
  },
  components: {
    myAttention,
    knowledgeType
  }
}
</script>
<style lang="stylus">
  .safetybulletin_knowledge .s-tabs-header {
    padding-left: 20px;
    margin: 0;
  }
</style>
