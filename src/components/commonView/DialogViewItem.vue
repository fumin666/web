/*
create by YOU
*/
<template>
  <s-row>
    <s-col :span="10">
      <div class="grid-content bg-purple">
        {{ title }}
      </div>
    </s-col>
    <s-col :span="14">
      <div class="grid-content bg-purple-light">
        {{ content }}
      </div>
    </s-col>
  </s-row>
</template>

<script type="text/babel">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      }
    }
  };
</script>

