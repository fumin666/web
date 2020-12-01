<template>
    <div class="container box org-graph org-graph-container">
      <s-row v-if="!model">
        <org-list @change="showModel"></org-list>
      </s-row>
      <div v-if="model">
        <org-graph @change="showModel"></org-graph>
      </div>
    </div>
</template>
<script>
  import orgList from './OrganList'
  import orgGraph from './OrganGraph'

  export default {
    data () {
      return {
        model: true
      };
    },
    components: {
      orgList,
      orgGraph
    },
    methods: {
      showModel(model) {
        model === 'list' ? this.model = false : this.model = true
      }
    }
  }
</script>

<style lang="stylus">
  .org-graph-container
    .graph-container
      overflow hidden
      cursor default
      height 100%
      width 100%
      background url('/static/images/orggraph/org_bg.png') repeat
    .org-level1-cell
      background-image url('/static/images/orggraph/org-level1-normal.png')
    .org-level1-cell:hover,.org-cell-current .org-level1-cell
      background-image url('/static/images/orggraph/org-level1-hover.png')
    .org-level2-cell
      background-image url('/static/images/orggraph/org-level2-normal.png')
    .org-level2-cell:hover,.org-cell-current .org-level2-cell
      background-image url('/static/images/orggraph/org-level2-hover.png')
    .org-level3-cell
      background-image url('/static/images/orggraph/org-level3-normal.png')
    .org-level3-cell:hover,.org-cell-current .org-level3-cell
      background-image url('/static/images/orggraph/org-level3-hover.png')
  .org-graph
    .s-table-body-wrapper
      overflow-x hidden
</style>
