/**
* Created by dgunzi on 2019/02/25.
* 账号状态统计
*/
<template>
  <s-card class="box-card" style="height: 350px;">
    <div slot="header" class="clearfix">
      <span class="card-title">
        账号状态统计
      </span>
    </div>
    <div style="padding-top: 5px">
      <s-charts :chart="chart"></s-charts>
    </div>
  </s-card>
</template>

<script>
    import $axios from 'sunflower-ajax'
    export default {
      name: 'AccountStatusChart',
      data() {
        let options = {
          title: {
            text: '账号总数',
            subtext: '',
            x: '49.5%',
            y: '45%',
            icon: 'circle',
            textAlign: 'center',
            textStyle: {
              fontSize: 12,
              fontWeight: 'normal',
              color: ['#ccc']
            },
            subtextStyle: {
              fontWeight: 'bold',
              verticalAlign: 'middle',
              align: 'center',
              width: '100%',
              fontSize: 14
            }
          },
          legend: {
            right: 0,
            data: []
          },
          tooltip: {},
          color: ['#00df7c', '#b6e28f', '#ff7549', '#e2e2ee'],
          series: [
            {
              type: 'pie',
              // radius: '45%',
              radius: ['35%', '50%'],
              label: {
                normal: {
                  formatter: '{d}%',
                  color: '#919191'
                }
              },
              data: []
            }
          ]
        };
        return {
          assetUuid: this.$route.params.assetUuid,
          chart: {
            el: 'accountStatusChart',
            type: 'baseChart',
            width: '100%',
            height: '340px',
            opt: options
          }
        }
      },
      created() {
        this.getDetailData()
          // this.axiosCitypeTree()
      },
      methods: {
        getDetailData() {
          let assetUuid = this.assetUuid;
          $axios.get(`/assetsRelationPage/statisticAccountByStatus/${assetUuid}`).then(res => {
            if (res.data instanceof Array) {
              let subtext = 0;
              for (let i in res.data) {
                this.chart.opt.legend.data.push(res.data[i].name);
                let newObj = {
                  value: parseInt(res.data[i].valueInt),
                  name: res.data[i].name
                }
                subtext = subtext + parseInt(res.data[i].valueInt);
                this.chart.opt.series[0].data.push(newObj)
              }
              this.chart.opt.title.subtext = subtext;
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>
