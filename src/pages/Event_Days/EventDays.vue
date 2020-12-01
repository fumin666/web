<template>
  <section class="event-days">
    <s-row>
      <s-col span="12" style="padding-right: 20px">
        <s-table :data="arr">
          <s-table-column label="时间" prop="date"></s-table-column>
          <s-table-column label="监控" v-if="ImpAuth">
            <template slot-scope="scope">
              <span v-if="scope.row.imp > 0 && scope.row.date != '总数'" class="event-days-clickable" @click="showDetail(scope.row, 'IMP')">{{scope.row.imp}}</span>
              <span v-else>{{scope.row.imp}}</span>
            </template>
          </s-table-column>
          <s-table-column label="业务审计" v-if="DbaAuth">
            <template slot-scope="scope">
              <span v-if="scope.row.dba_url > 0 && scope.row.date != '总数'" class="event-days-clickable" @click="showDetail(scope.row, 'DBA1')">{{scope.row.dba_url}}</span>
              <span v-else>{{scope.row.dba_url}}</span>
            </template>
          </s-table-column>
          <s-table-column label="数据库审计" v-if="DbaAuth">
            <template slot-scope="scope">
              <span v-if="scope.row.dba_sql > 0 && scope.row.date != '总数'" class="event-days-clickable" @click="showDetail(scope.row, 'DBA')">{{scope.row.dba_sql}}</span>
              <span v-else>{{scope.row.dba_sql}}</span>
            </template>
          </s-table-column>
          <s-table-column label="运维审计" v-if="OmaAuth">
            <template slot-scope="scope">
              <span v-if="scope.row.oma > 0 && scope.row.date != '总数'" class="event-days-clickable" @click="showDetail(scope.row, 'OMA')">{{scope.row.oma}}</span>
              <span v-else>{{scope.row.oma}}</span>
            </template>
          </s-table-column>
          <s-table-column label="日志审计" v-if="SiemAuth">
            <template slot-scope="scope">
              <span v-if="scope.row.siem > 0 && scope.row.date != '总数'" class="event-days-clickable" @click="showDetail(scope.row, 'SIEM')">{{scope.row.siem}}</span>
              <span v-else>{{scope.row.siem}}</span>
            </template>
          </s-table-column>
          <s-table-column label="登录重要资产" v-if="OmaAuth">
            <template slot-scope="scope">
              <span v-if="scope.row.majorAsset > 0 && scope.row.date != '总数'" class="event-days-clickable" @click="showDetail(scope.row, 'IMPO')">{{scope.row.majorAsset}}</span>
              <span v-else>{{scope.row.majorAsset}}</span>
            </template>
          </s-table-column>
          <s-table-column label="总数" prop="count"></s-table-column>
        </s-table>
      </s-col>
      <s-col span="12">
        <div class="event-days-chart-title">{{curTitle}}</div>
        <s-chart :chart="chart"></s-chart>
      </s-col>
    </s-row>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import authCheck from '@/common/mixins/auth.js'

  export default {
    mixins: [authCheck],
    data() {
      return {
        curTitle: '当天事件走势',
        curUrl: 'day',
        curUnit: '点',
        title: ['当天事件走势', '本周事件走势', '本月事件走势'],
        url: ['day', 'week', 'month'],
        unit: ['点', '', '号'],
        arr: [],
        chart: {
          name: 'chart',
          type: 'multilineChart',
          width: '100%',
          height: '500px',
          data: {},
          option: {
            legend: {
              left: 'center',
              bottom: 0
            },
            yAxis: [{
              minInterval: 1
            }]
          }
        },
        week: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      }
    },
    props: {
      trendtType: {
        type: String,
        require: true,
        default: '0'
      }
    },
    methods: {
      getInfo() {
        $axios.get(`/eventCount/getEventCountByDate/${this.curUrl}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            if (this.$route.params.type === '0') {
              for (let i = 0; i < res.data.length - 1; i++) {
                res.data[i].date = `${res.data[i].date.split('-')[0]}${this.curUnit}-${res.data[i].date.split('-')[1]}${this.curUnit}`;
              }
            } else if (this.$route.params.type === '2') {
              for (let i = 0; i < res.data.length - 1; i++) {
                res.data[i].date = `${res.data[i].date}${this.curUnit}`;
              }
            }
            this.arr = res.data;
            this.chartData();
          }
        });
      },
      chartData() {
        let _arr = [];
        let __arr = [];
        for (let i = 0; i < this.arr.length - 1; i++) {
          let obj = {
            date: this.arr[i].date
          };
          if (this.ImpAuth) {
            obj.imp = this.arr[i].imp;
          }
          if (this.DbaAuth) {
            obj.dba_sql = this.arr[i].dba_sql;
            obj.dba_url = this.arr[i].dba_url
          }
          if (this.SiemAuth) {
            obj.siem = this.arr[i].siem
          }
          if (this.OmaAuth) {
            obj.majorAsset = this.arr[i].majorAsset
          }
          _arr.push(obj);
          let obj2 = {
            date: this.arr[i].date
          };
          if (this.ImpAuth) {
            obj2['监控'] = this.arr[i].imp;
          }
          if (this.DbaAuth) {
            obj2['业务审计'] = this.arr[i].dba_url;
            obj2['数据库审计'] = this.arr[i].dba_sql;
          }
          if (this.SiemAuth) {
            obj2['日志审计'] = this.arr[i].siem;
          }
          if (this.OmaAuth) {
            obj2['运维审计'] = this.arr[i].oma;
          }
          if (this.OmaAuth) {
            obj2['登录重要资产'] = this.arr[i].majorAsset;
          }
          __arr.push(obj2);
        }
        this.chart.data = {
          data: __arr
        };
      },
      showDetail(row, tab) {
        if (this.trendtType === '0') { // 当天事件走势
          let hour = parseInt(row.date.split('-')[0]);
          let start = new Date();
          let end = new Date();
          start.setHours(hour);
          end.setHours(hour);
          start.setMinutes('0');
          end.setMinutes('59');
          start.setSeconds('0');
          end.setSeconds('59');
          this.$router.push(`/EventCenter/event_list/${tab}/${start}/${end}`);
        } else if (this.trendtType === '1') { // 本周事件走势
          let idx = this.week.indexOf(row.date);
          let milli = Date.now() - 24 * 60 * 60 * 1000 * (new Date().getDay() - idx);
          let start = new Date(milli);
          let end = new Date(milli);
          start.setHours('0');
          start.setMinutes('0');
          start.setSeconds('0');
          end.setHours('23');
          end.setMinutes('59');
          end.setSeconds('59');
          this.$router.push(`/EventCenter/event_list/${tab}/${start}/${end}`);
        } else { // 本月事件走势
          let day = parseInt(row.date);
          let start = new Date();
          let end = new Date();
          start.setHours('0');
          start.setMinutes('0');
          start.setSeconds('0');
          start.setMonth(start.getMonth(), day);
          end.setHours('23');
          end.setMinutes('59');
          end.setSeconds('59');
          end.setMonth(end.getMonth(), day);
          this.$router.push(`/EventCenter/event_list/${tab}/${start}/${end}`);
        }
      }
    },
    created() {
      let tmp = this.trendtType;
      if (tmp) {
        this.curTitle = this.title[tmp];
        this.curUrl = this.url[tmp];
        this.curUnit = this.unit[tmp];
        this.getInfo();
      }
    }
  }
</script>
