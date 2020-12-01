<template>
  <div class="taskWorker">
    <div class="details" style="font-size:14px">
        <s-row style="padding:10px 20px">
            <s-col span='6'>
                <s-col class="title" span='6'>工单编号：</s-col>
                <s-col span='18'>{{detailsData.taskId}}</s-col>
            </s-col>
            <s-col span='6'>
                <s-col class="title" span='6'>标题：</s-col>
                <s-col span='18'>{{detailsData.taskTitle}}</s-col>
            </s-col>
            <s-col span='6'>
                <s-col class="title" span='6'>内容</s-col>
                <s-col span='18'>{{detailsData.taskContent}}</s-col>
            </s-col>
            <s-col span='6'>
                <s-col class="title" span='6'>工单状态：</s-col>
                <s-col span='18'>{{detailsData.taskStatusName}}</s-col>
            </s-col>
        </s-row>
        <s-row style="padding:10px 20px">
            <s-col span='6'>
                <s-col class="title" span='6'>工单来源：</s-col>
                <s-col span='18'>{{detailsData.bulletinName}}</s-col>
            </s-col>
            <s-col span='6'>
                <s-col class="title" span='6'>关联单号：</s-col>
                <s-col span='18'>{{detailsData.safeId}}</s-col>
            </s-col>
            <s-col span='6'>
                <s-col class="title" span='6'>创建人：</s-col>
                <s-col span='18'>{{detailsData.createUserName}}</s-col>
            </s-col>
            <s-col span='6'>
                <s-col class="title" span='6'>创建时间：</s-col>
                <s-col span='18'>{{detailsData.createTime}}</s-col>
            </s-col>
        </s-row>
    </div>
    <s-tab style="margin-top:20px" v-model="activeTab">
        <s-tab-pane label="工单处理" name='pane1'>
          <Assignment v-if="activeTab === 'pane1'"  :jurisdiction='jurisdiction' @receive='receive' :taskUuid='taskUuid'></Assignment>
        </s-tab-pane>
    </s-tab>
  </div>
</template>
<script>
import Assignment from '@/pages/Safety_BulletinTask/components/Assignment';
import $axios from 'sunflower-ajax'
export default {
  data() {
    return {
      activeTab: 'pane1',
      detailsData: [],
      taskUuid: '',
      jurisdiction: false

    }
  },
  components: {
    Assignment
  },
  created() {
    this.getData()
    this.taskUuid = this.$route.params.tbUuid
  },

  methods: {
    getData() {
      $axios.get(`/safetyPlatform/safeOrderTask/getSafeOrderTaskDetail/${this.$route.params.tbUuid}`).then(res => {
          this.detailsData = res.data
          if (this.detailsData.taskStatus === 2 && this.$store.state.userData.uuid === this.detailsData.assignUser) {
              this.jurisdiction = false
          } else {
              this.jurisdiction = true
          }
      })
    },
    receive() {
      this.getData()
    }
  }
}
</script>
<style lang="stylus">

</style>
