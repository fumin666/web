<template>
  <!--自定义首页 服务请求-->
  <div class="diy-process-serviceRequest">
    <s-card-diy
      title="服务请求"
      :show-more="false"
      show-scrollbar
    >
      <ServiceRequest></ServiceRequest>
    </s-card-diy>
  </div>
</template>

<script>
  import ServiceRequest from '@/pages/Process_ServiceRequest/Console'
  export default {
    name: 'process-serviceRequest',

    components: {
      ServiceRequest
    }
  }
</script>
