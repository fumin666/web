/**
* Created by alex on 2019/2/21.
*/
<template>
  <section id="auto-ops-collect-menu" class="content">
    <s-row :gutter="10">
      <s-col :span="4">
        <ul class="menuList">
          <li :key="index" :class="{current: tabIndex === index}" v-for="(item, index) in menuList" @click="switchData(item.childList, index)">
            <span><i class="iconfont icon-info"></i></span>
            <span>{{item.name}}</span>
          </li>
        </ul>
      </s-col>
      <s-col :span="20" id="level-protect">
        <s-collapse v-model="activeName">
          <s-collapse-item v-for="(item, index) in currentData" :title="item.value.keyName" :name="index" :key="index">
            <ul class="item-list">
              <li v-for="(item, index) in item.children" :key="index"><span @click="openDetail(item)"><i class="iconfont icon-link"></i>{{item.keyName}}</span></li>
            </ul>
          </s-collapse-item>
        </s-collapse>
      </s-col>
    </s-row>
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      width="800px"
      title="查看">
      <view-dialog :data="dialogData"></view-dialog>
    </s-dialog>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax'
  import viewDialog from './components/ViewLevelDetail'
  export default {
    data() {
      return {
        tabIndex: 0,
        menuList: [],
        currentData: '',
        activeName: [],
        viewDialog: false,
        dialogData: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        $axios.get('/strategyInfo/getProtectInfo/1').then((res) => {
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
        })
      },
      switchData(data, index) {
        this.tabIndex = index
        this.currentData = data
      },
      openDetail(data) {
        this.dialogData = data
        this.viewDialog = true
      }
    },
    components: {
      viewDialog
    }
  }
</script>
<style lang="stylus">
  #level-protect
    margin-top 5px
    .item-list li
      float left
      color #1675cb
      margin-right 20px
      font-size 14px
      cursor pointer
</style>

