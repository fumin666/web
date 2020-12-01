<!--
 * @Author: 高建鹏
 * @Date: 2019-06-05 14:52:39
 * @LastEditors: 高建鹏
 * @Description: 自定义首页资产管理中的IPAM展示页面
 * @Position:
 -->
<template>
  <div class="diy-second-mod">
    <s-card-diy
      title="IP台账"
      show-scrollbar
      :show-more="false">
      <asset-ipam></asset-ipam>
    </s-card-diy>
  </div>
</template>

<script>
  import assetIpam from '@/pages/Assets_Ipam/Ipam.vue';

  export default {
    components: {
      assetIpam
    }
  }
</script>
