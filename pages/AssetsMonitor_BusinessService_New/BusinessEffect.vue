/*
create by YOU
*/
<template>
  <div class="businessEffect" style="display: flex;">
    <!-- <div class="selectField">
      <s-form label-width="100px">
        <s-form-item label="服务名称">
          <s-select v-model="business" placeholder="请选择" filterable>
            <s-option v-for="item in businessServiceList" :label="item.name" :value="item.uuid"
                      :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
    </div> -->
    <div
      class="leftRule"
      style="height: calc(100vh - 208px - 50px); min-height: 500px; margin-top: 50px;">
      <div v-for="(item, index) in swims"
        :style="index === 0 ? `calc(100% / ${swims.length} - 50px);` : `height: calc((100% + 50px) / ${swims.length});`"
        :key="item.name">
        <span>{{item.name}}</span>
      </div>
    </div>
    <effectGraph :busRow='busRow' v-loading="loading" :data="data"></effectGraph>
  </div>
</template>

<script>
  import effectGraph from './components/EffectGraph'
  import $axios from 'sunflower-ajax'

  export default {
    name: 'e33',
    components: {
      effectGraph
    },
    data() {
      return {
        loading: false,
        business: '',
        options: {},
        swims: [
          {name: '业务服务', type: 1},
          {name: '应用系统', type: 2},
          {name: '服务器', type: 3},
          {name: '网络/存储', type: 4}
        ],
        data: {
          assets: [],
          rel: []
        },
        businessServiceList: []
      }
    },
    props: {
      busUuid: {
        type: String
      },
      BuseyeUuid: {
        type: String
      },
      busRow: {
        type: Object
      }
    },
    created() {
        this.getDate()
      // this.data = this.parseData(this.data2)
      // $axios.get('/businessservice/getBusinessInfoList').then(({data}) => {
      //   if (data) {
      //     this.businessServiceList = data
      //     if (this.businessServiceList.length) {
      //       // console.log('do!')
      //       // this.business = this.businessServiceList[0].uuid
      //     }
      //   }
      // })
    },
    mounted() {
    },
    watch: {
      busUuid: {
        immediate: true,
        handler(val) {
          this.loading = true
          if (val) {
            $axios.get(`/businessservice/getBusinessServiceEffect/${val}`).then(({data}) => {
              this.loading = false
              if (data) {
                this.data = this.parseData(data)
              }
            })
          }
      }
      }
    },
    methods: {
      getDate() {
        this.loading = true
        if (this.BuseyeUuid) {
          $axios.get(`/businessservice/getBusinessServiceEffect/${this.BuseyeUuid}`).then(({data}) => {
            this.loading = false
            if (data) {
              this.data = this.parseData(data)
            }
          })
        } else {
            this.loading = false
        }
    },
      parseData(data) {
        let newData = {
          assets: [],
          rel: []
        }
        if (!(data && data.itcomp)) {
          return newData
        }
        // 业务服务层
        newData.assets.push({
          id: data.itcomp[1].uuid,
          name: data.itcomp[1].name,
          icon: './static/images/topologyicon/default/businessService.svg',
          type: 1
        })
        // 其他层
        for (let k = 2; k <= 4; k++) {
          if (data.itcomp[k] && data.itcomp[k].length) {
            data.itcomp[k].map(item => {
              newData.assets.push({
                id: item.uuid,
                name: item.itcompName,
//                icon: item.cmdbCitype ? item.cmdbCitype.iconThumb : null,
                icon: item.cmdbCitype ? item.cmdbCitype.iconThumb.replace('relationship', 'topologyicon/default') : null,
                type: k
              })
            })
          }
        }
        // 关系
        if (data.relation && data.relation.length) {
          data.relation.map(item => {
            newData.rel.push({
              from: item.ciUuid,
              to: item.relCiUuid,
              text: item.relationTypeName
            })
          })
        }
        /*
         * 转化后数据格式
         * {
         *   assets: [
         *     {id: '1', name: '黑猩猩队长', type: 1}
         *   ],
         *   rel: [
         *     {from: '1', to: '2', text: '喜欢'}
         *   ]
         * }
         */
        return newData
      }
    }
  }
</script>
