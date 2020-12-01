<template>
    <div>
        <!--<s-tab v-model="activeTab">
            <s-tab-pane label="我的代办" name="myWillDone">
                <my-WillDone v-if="activeTab === 'myWillDone'"></my-WillDone>
            </s-tab-pane>
            <s-tab-pane label="我的审批" name="myApproval">
                <my-Approval v-if="activeTab === 'myApproval'"></my-Approval>
            </s-tab-pane>
            <s-tab-pane label="信息回执" name="myInformationReceipt">
                <my-Information-Receipt v-if="activeTab === 'myInformationReceipt'"></my-Information-Receipt>
            </s-tab-pane>
            <s-tab-pane label="我的已办" name="myHavedone">
                <my-Havedone v-if="activeTab === 'myHavedone'"></my-Havedone>
            </s-tab-pane>
            <s-tab-pane label="我的关注" name="myAttention">
                <my-Attention v-if="activeTab === 'myAttention'"></my-Attention>
            </s-tab-pane>
        </s-tab>-->
    </div>
</template>
<script>
// import myWillDone from '@/pages/SafetyBulletin/myWillDone'
// import myApproval from '@/pages/SafetyBulletin/myWillDone'
// import myInformationReceipt from '@/pages/SafetyBulletin/myWillDone'
// import myHavedone from '@/pages/SafetyBulletin/myWillDone'
// import myAttention from '@/pages/SafetyBulletin/myWillDone'
export default {
    data() {
        return {
            activeTab: 'myWillDone'
        }
    },
    components: {
    }
}
</script>
