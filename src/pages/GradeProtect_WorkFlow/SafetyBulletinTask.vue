<!--
 * @Author: fumin
 * @Date: 2020-3-12
 * @LastEditors: fumin
 * @Description: 等级保护-等保工作流
 -->
<template>
  <div class="safe-bulletin" style="margin:0;">
    <s-row :gutter="10">
      <s-col span="4" class="left-menu-box" style="margin-left: -20px;margin-top: 15px;">
        <s-tab>
          <s-tab-pane label="工作类型" name="0">
            <s-scrollbar wrap-style="maxHeight:calc(100vh - 200px);">
              <s-menu v-if="isShow" :active-name="currentView" @on-select="selection" style="margin-top:16px;font-size:14px">
                <s-menu-item v-for="item in menuData" :name="item.bulletinName" :title="item.bulletinName" :key="item.uuid">
                 <!-- <i class="icon iconfont icon-nav-account-manage"></i>-->
                  {{item.bulletinName}}
                </s-menu-item>
              </s-menu>
            </s-scrollbar>
          </s-tab-pane>
        </s-tab>
      </s-col>
      <s-col span="20">
        <safety-bulletin-task-list :bulletinType="bulletinType"></safety-bulletin-task-list>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash';
  import safetyBulletinTaskList from './components/SafetyBulletinTaskList';

  export default {
    data() {
      return {
        currentView: '等保工作-简化版',
        menuData: [],
        isShow: false,
        bulletinType: {} // 通报类型
      }
    },
    mounted() {
      this.getMenu();
    },
    methods: {
      selection(key) {
        let mentArr = cloneDeep(this.menuData)
        this.currentView = key
        mentArr.map(v => {
          if (v.bulletinName === key) {
            this.bulletinType = v
          }
        })
      },
      getMenu() {
        $axios.get(`/safetyPlatform/safetyBulletin/getAll`).then(({data}) => {
          this.menuData = data.filter(v => {
            if (v.bulletinName === '等保工作-简化版' || v.bulletinName === '等保工作-最佳实践') {
              return v
            }
          })
          this.currentView = '等保工作-简化版';
          if (this.menuData) {
            this.bulletinType = this.menuData[0]
          }
          this.isShow = true
        })
      }
    },
    components: {
      safetyBulletinTaskList
    }
  }
</script>
<style lang="stylus">
  .safe-bulletin
    .left-menu-box
      .s-tabs-header
        padding-left 20px
        margin 0
      .s-menu-light
        padding-top 0!important
        .s-menu-item
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
</style>
