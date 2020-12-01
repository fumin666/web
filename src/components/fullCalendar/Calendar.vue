/**
* Created by alex on 2018/3/19.
*/
<template>
  <div class="comp-full-calendar">
    <!-- header pick month -->
    <fc-header :current-month="currentMonth"
               :first-day="firstDay"
               :locale="locale"
               @change="emitChangeMonth">

      <div slot="header-left">
        <slot name="fc-header-left">
        </slot>
      </div>

      <div slot="header-right">
        <slot name="fc-header-right">
        </slot>
      </div>
    </fc-header>
    <!-- body display date day and events -->
    <div class="full-calendar-body">
      <div class="weeks">
        <strong class="week" v-for="dayIndex in 7" :key="dayIndex">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale)
          }}</strong>
      </div>
      <div class="dates" ref="dates">
        <div class="dates-bg">
          <div class="week-row" v-for="week in currentDates" :key="week.id">
            <div class="day-cell" v-for="day in week"
                 :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth}" :key="day.id">
              <p class="day-number"></p>
            </div>
          </div>
        </div>

        <!-- absolute so we can make dynamic td -->
        <div class="dates-events">
          <div class="events-week" v-for="week in currentDates" :key="week.id">
            <div class="events-day" v-for="day in week" :key="day.id" track-by="$index"
                 :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth}" @click.stop="dayClick(day.date, $event)">
              <p class="day-number">{{day.monthDay}}</p>
              <div class="event-box">
                <event-card :event="event" :date="day.date" :key="event.id" :firstDay="firstDay"
                            :class="colorChange(event)"
                            :title="getTitle(event)"
                            v-for="event in day.events" v-show="event.cellIndex <= eventLimit"
                            @click="eventClick">
                  <template slot-scope="p">
                    <slot name="fc-event-card" :event="p.event"></slot>
                  </template>
                </event-card>
                <p v-if="day.events.length > eventLimit"
                   class="more-link" @click.stop="selectThisDay(day, $event)">
                   更多工单
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- full events when click show more -->
        <div class="more-events" v-show="showMore"
             :style="{left: morePos.left + 'px', top: morePos.top + 'px'}">
          <div class="more-header">
            <span class="title">{{ moreTitle(selectDay.date) }}</span>
            <span class="close" @click.stop="showMore = false">x</span>
          </div>
          <div class="more-body">
            <s-scrollbar wrap-style="height: 170px;">
            <ul class="body-list">
              <li v-for="event in selectDay.events"
                  v-show="event.isShow"
                  class="body-item"
                  :class="colorChange(event)"
                  @click="eventClick(event, $event)"
                  :key="event.id">
                {{event.title}}
              </li>
            </ul>
            </s-scrollbar>
          </div>
        </div>
        <slot name="body-card">

        </slot>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import dateFunc from './dateFunc'
  import moment from 'moment'
  import EventCard from './EventCard.vue'
  import Header from './DateChooseHeader'

  export default {
    name: 'sCalendar',
    props: {
      events: { // events will be displayed on calendar
        type: Array,
        default: []
      },
      locale: {
        type: String,
        default: 'en'
      },
      firstDay: {
        type: Number | String,
        validator (val) {
          let res = parseInt(val)
          return res >= 0 && res <= 6
        },
        default: 0
      }
    },
    components: {
      'event-card': EventCard,
      'fc-header': Header
    },
    mounted () {
      this.emitChangeMonth(this.currentMonth)
    },
    data () {
      return {
        currentMonth: moment().startOf('month'),
        isLismit: true,
        eventLimit: 5,
        showNumber: '',
        showMore: false,
        morePos: {
          top: 0,
          left: 0
        },
        selectDay: {}
      }
    },
    computed: {
      currentDates () {
        return this.getCalendar()
      }
    },
    methods: {
      eventNumber(e) {
        let eventTotal = 0
        let hasShowEvent = 0
        for (let i = 0; i < e.length; i++) {
          if (e[i].type === undefined && i < 5) { hasShowEvent++ }
          if (e[i].type === undefined) { eventTotal++ }
        }
        return eventTotal - hasShowEvent
      },
      colorChange(flag) {
        switch (flag.changePathV) {
          case 1 :
            return 'blueItem'
          case 2 :
            return 'redItem'
          case 3 :
            return 'greenItem'
          case 4 :
            return 'yellowItem'
        }
      },
      getTitle(e) {
        let title
        e.type === 1 ? title = '' : title = `${e.title} 开始时间：${e.start}`
        return title
      },
      emitChangeMonth (firstDayOfMonth) {
        this.currentMonth = firstDayOfMonth

        let start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay)
        let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay)

        this.$emit('changeMonth', start, end, firstDayOfMonth)
      },
      moreTitle (date) {
        if (!date) return ''
        return moment(date).format('ll')
      },
      getCalendar () {
        // calculate 2d-array of each month
        let monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay)
        let calendar = []

        for (let perWeek = 0; perWeek < 6; perWeek++) {
          let week = []

          for (let perDay = 0; perDay < 7; perDay++) {
            week.push({
              monthDay: monthViewStartDate.date(),
              isToday: monthViewStartDate.isSame(moment(), 'day'),
              isCurMonth: monthViewStartDate.isSame(this.currentMonth, 'month'),
              weekDay: perDay,
              date: moment(monthViewStartDate),
              events: this.slotEvents(monthViewStartDate)
            })

            monthViewStartDate.add(1, 'day')
          }

          calendar.push(week)
        }

        return calendar
      },
      slotEvents (date) {
        // find all events start from this date
        let thisDayEvents = this.events.filter(day => {
          let st = moment(day.start)
          let ed = moment(day.end ? day.end : st)

          return date.isBetween(st, ed, null, '[]')
        })

        // sort by duration
        thisDayEvents.sort((a, b) => {
          if (!a.cellIndex) return 1
          if (!b.cellIndex) return -1
          return a.cellIndex - b.cellIndex
        })

        // mark cellIndex and place holder
        for (let i = 0; i < thisDayEvents.length; i++) {
          thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1)
          thisDayEvents[i].isShow = true
          if (thisDayEvents[i].cellIndex === i + 1 || i > 4) continue
          thisDayEvents.splice(i, 0, {
            type: 1,
            cellIndex: i + 1,
            start: date.format(),
            end: date.format(),
            isShow: false
          })
        }
        return thisDayEvents
      },
      selectThisDay (day, jsEvent) {
        this.selectDay = day
        this.showMore = true
        this.morePos = this.computePos(event.target)
        this.morePos.left += 10
        this.morePos.top -= 200
        let events = day.events.filter(item => {
          return item.isShow === true
        })
        this.$emit('moreClick', day.date, events, jsEvent)
      },
      computePos (target) {
        let eventRect = target.getBoundingClientRect()
        let pageRect = this.$refs.dates.getBoundingClientRect()
        return {
          left: eventRect.left - pageRect.left,
          top: eventRect.top + eventRect.height - pageRect.top
        }
      },
      dayClick (day, jsEvent) {
        this.$emit('dayClick', day, jsEvent)
      },
      eventClick (event, jsEvent) {
        if (!event.isShow) return
        jsEvent.stopPropagation()
        let pos = this.computePos(jsEvent.target)
        this.$emit('eventClick', event, jsEvent, pos)
      }
    },
    filters: {
      localeWeekDay (weekday, firstDay, locale) {
        firstDay = parseInt(firstDay)
        const localMoment = moment().locale(locale)
        return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7].replace('周', '星期')
      }
    }
  }
</script>
