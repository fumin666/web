/**
* Created by alex on 2019/2/21.
*/
<template>
  <section id="auto-ops-collect-menu" class="content">
    <s-row :gutter="10">
      <s-col id="level-protect">
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
  import viewDialog from './ViewLevelDetail'
  export default {
    data() {
      return {
        viewDialog: false,
        dialogData: ''
      }
    },
    created() {
    },
    props: ['tabIndex', 'currentData', 'activeName'],
    methods: {
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

