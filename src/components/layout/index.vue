<template>
  <s-grid :direction="portlet.direction">
    <s-grid-item
      v-for="(size, index) in portlet.size"
      :key="index"
      :flex="size">
      <template v-if="portlet.content[index].size">
        <s-layout :portlet="portlet.content[index]"></s-layout>
      </template>
      <template v-else>
        <component :is="portlet.content[index]"></component>
      </template>
    </s-grid-item>
  </s-grid>
</template>

<script>
  export default {
    name: 'SLayout',
    props: {
      portlet: Object
    }
    // data () {
    //   return {
    //     portlet: {
    //       direction: 'row',
    //       size: [8, 8, 8],
    //       content: [
    //         {
    //           direction: 'column',
    //           size: [12, 12],
    //           content: ['11', '12']
    //         },
    //         '2',
    //         '3'
    //       ]
    //     }
    //   }
    // }
  }
</script>
