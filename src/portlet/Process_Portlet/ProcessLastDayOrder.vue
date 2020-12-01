<template>
  <!--自定义首页 最近24小时工单-->
  <div class="diy-process-lastDay-order">
    <s-card-diy
      title="最近24小时工单"
      :show-more="false">
      <s-chart :chart="chart4"></s-chart>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { sortBy, filter, forOwn } from 'lodash';
  export default {
    name: 'process-lastDay-order',

    data() {
      return {
        chart4: {
          name: 'chartProcessLastDayOrder',
          type: 'areaChart',
          width: '100%',
          height: '100%',
          unit: '个',
          data: []
        }
      }
    },

    created() {
      this.getData();
    },

    methods: {
      getData() {
        $axios.post('/itilWorkflowCenter/getCreateAndComplteOrderStatChart').then(res => {
          this.chart4.data = sortBy(res.data, function (item) {
            return item.date
          });
          this.chart4.data = filter(res.data, function (item) {
            forOwn(item, function (value, key) {
              let key1 = '创建';
              let key2 = '完成';
              switch (key) {
                case 'create':
                  item[key1] = item[key];
                  delete item[key];
                  break;
                case 'complete':
                  item[key2] = item[key];
                  delete item[key];
                  break;
              }
            })
            return item;
          })
        })
      }
    }
  }
</script>
