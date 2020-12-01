<template>
  <div>
   <s-tab v-model="activeTab">
     <s-tab-pane label="我的待办" name="pane1">
       <my-WillDone v-if="activeTab === 'pane1'"></my-WillDone>
     </s-tab-pane>
     <s-tab-pane label="我的审批" name="pane2">
       <my-Approval v-if="activeTab === 'pane2'"></my-Approval>
     </s-tab-pane>
     <s-tab-pane label="信息回执" name="pane3">
       <my-Information-Receipt v-if="activeTab === 'pane3'"></my-Information-Receipt>
     </s-tab-pane>
     <s-tab-pane label="我的已办" name="pane4">
       <my-Havedone v-if="activeTab === 'pane4'"></my-Havedone>
     </s-tab-pane>
     <s-tab-pane label="我的关注" name="pane5">
       <my-Attention v-if="activeTab === 'pane5'"></my-Attention>
     </s-tab-pane>
   </s-tab>
  </div>
</template>
<script>
 import myWillDone from '@/pages/Safety_BulletinTask/MyWillDone';
 import myApproval from '@/pages/Safety_BulletinTask/MyApproval';
 import myInformationReceipt from '@/pages/Safety_BulletinTask/MyInformationReceipt';
 import myHavedone from '@/pages/Safety_BulletinTask/MyHaveDone';
 import myAttention from '@/pages/Safety_BulletinTask/MyAttention';
export default {
  data() {
    return {
      activeTab: 'pane1'
    };
  },
  created() {
    this.activeTab = this.$route.params.tbUuid
  },
  components: {
    myWillDone,
    myApproval,
    myInformationReceipt,
    myHavedone,
    myAttention
  }
};
</script>
