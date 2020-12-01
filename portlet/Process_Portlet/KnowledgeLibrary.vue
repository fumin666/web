<template>
  <!--自定义首页 知识库-->
  <div class="diy-process-knowledgeLibrary">
    <s-card-diy
      title="知识库"
      :show-more="false"
      show-scrollbar
    >
      <KnowledgeLibrary></KnowledgeLibrary>
    </s-card-diy>
  </div>
</template>

<script>
  import KnowledgeLibrary from '@/pages/Process_Knowledge/Knowledge'

  export default {
    name: 'process-knowledgeLibrary',

    components: {
      KnowledgeLibrary
    }
  }
</script>
