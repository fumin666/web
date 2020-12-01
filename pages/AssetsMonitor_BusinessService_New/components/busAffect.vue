<template>
  <div>
    <Business-Effect :busRow='busRow' :BuseyeUuid='BuseyeUuid'></Business-Effect>
  </div>
</template>
<script>
 import BusinessEffect from '../BusinessEffect'
export default {
  data() {
    return {}
  },
  props: {
    BuseyeUuid: {
      type: String
    },
    busRow: {
      type: Object
    }
  },
  created() {
    console.log(this.busRow)
  },
  components: {
    BusinessEffect
  }
}
</script>
