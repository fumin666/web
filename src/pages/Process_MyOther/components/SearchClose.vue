<template>
  <div class="closeDialog">
    <s-form :model="Searchcloseform" label-width="100px" ref="Searchcloseform">
      <s-form-item label="关闭代码" prop="reason">
        <!--<s-select v-model="Searchcloseform.reason" style="width: 300px">
          <s-option label="成功解决" :value="0"></s-option>
          <s-option label="变通解决" :value="1"></s-option>
          <s-option label="不成功" :value="2"></s-option>
          <s-option label="转交成功" :value="3"></s-option>
          <s-option label="误报" :value="4"></s-option>
          <s-option label="用户撤销" :value="5"></s-option>
          <s-option label="自动关闭" :value="6"></s-option>
          <s-option label="其他" :value="7"></s-option>
        </s-select>-->
        <s-select v-if="orderType === 0" v-model="Searchcloseform.reason" style="width: 300px">
          <s-option v-for="(item, index) in reasonData" :key="item.index" :label="item" :value="index"></s-option>
        </s-select>
        <s-select v-else v-model="Searchcloseform.reason" style="width: 300px">
          <s-option v-for="(item, index) in reasonData" :key="item.index" :label="item" :value="index + 1"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        Searchcloseform: {
          reason: 0
        },
        reasonData: []
      }
    },
    props: {
      orderType: {
        type: Number,
        default () {
          return 0
        }
      }
    },
    created() {
      switch (this.orderType) {
        case 0:
          this.reasonData = ['成功解决', '变通解决', '不成功', '转交成功', '误报', '用户撤销', '自动关闭', '其他']
          break;
        case 1:
          this.getWTData()
          this.Searchcloseform.reason = 1
          break;
        case 2:
          this.getBGData()
          this.Searchcloseform.reason = 1
          break;
        case 3:
          this.getRWData()
          this.Searchcloseform.reason = 1
          break;
        case 5:
          this.getFBData();
          this.Searchcloseform.reason = 1
          break;
        case 6:
          this.getREData();
          this.Searchcloseform.reason = 1
          break;
      }
    },
    methods: {
      getWTData() {
        $axios.get('/itilProblemOrder/getProblemOrderBasicData').then(({data}) => {
          this.reasonData = data.closeCode.map(item => {
          return item.name
          })
        })
      },
      getBGData() {
        $axios.get('/itilChangeOrder/getChangeOrderSelectData').then(({data}) => {
          for (let i in data.changeCloseCodeMap) {
           this.reasonData.push(data.changeCloseCodeMap[i])
          }
        })
      },
      getRWData() {
        $axios.get('/itilChangeOrder/getChangeTaskSelectData').then(({data}) => {
          for (let i in data.taskCloseCodeMap) {
            this.reasonData.push(data.taskCloseCodeMap[i])
          }
        })
      },
      getFBData() {
        $axios.get('/itilPublishOrder/getPublishCloseCode').then(({data}) => {
          for (let i in data) {
            this.reasonData.push(data[i])
          }
        })
      },
      getREData() {
        $axios.get('/itilServiceRequest/getResourceEnumMap').then(({data}) => {
          for (let i in data) {
            this.reasonData.push(data[i])
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
