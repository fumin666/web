/**
* Created by alex on 2018/4/9.
*/
<template>
  <section>
    <s-row>
      <s-col :span="2">
        <div class="calendar-level-Wrapper">
          <dl>
            <dt>风险级别</dt>
            <dd><span class="block color3"></span>Level&nbsp;&nbsp;1</dd>
            <dd><span class="block color2"></span>Level&nbsp;&nbsp;2</dd>
            <dd><span class="block color1"></span>Level&nbsp;&nbsp;3</dd>
          </dl>
          <dl>
            <dt>变更路径</dt>
            <dd><span class="block color1"></span>重大变更</dd>
            <dd><span class="block color2"></span>一般变更</dd>
            <dd><span class="block color3"></span>标准变更</dd>
            <dd><span class="block color4"></span>紧急变更</dd>
          </dl>
        </div>
      </s-col>
      <s-col :span="22">
        <s-calendar ref="calendar" class="test-fc" :events="fcEvents"
                    first-day='1' locale="zh-cn"
                    @eventClick="eventClick"
                    @changeMonth="changeMonth">
          <template slot="fc-event-card" slot-scope="p">
            {{ p.event.title }} 开始时间：{{p.event.start}}
          </template>
        </s-calendar>
      </s-col>
    </s-row>
    <s-dialog
      title="变更详情"
      width="600px"
      v-model="changeItemDialog"
      v-if="changeItemDialog">
      <s-item :data="changeData"></s-item>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import sCalendar from '@/components/fullCalendar';
  import $axios from 'sunflower-ajax'
  import sItem from './DetailDialog/CalendarItem.vue'

  export default {
    data () {
      return {
        name: 'Sunny!',
        changeItemDialog: false,
        changeData: {},
        fcEvents: []
      }
    },
    components: {
      sCalendar,
      sItem
    },
    methods: {
      getEvent(year, month) {
        $axios.get(`/itilWorkflowCenter/getChangeCalendy/${year}/${month}`).then((res) => {
          this.fcEvents = res.data || []
        });
      },
      'changeMonth' (start, end, current) {
        this.getEvent(current.year(), current.month() + 1)
      },
      'eventClick' (event, jsEvent, pos) {
        this.changeData = event
        this.changeItemDialog = true
      }
    }
  }
</script>
