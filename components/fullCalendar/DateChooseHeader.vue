/**
* Created by alex on 2018/3/19.
*/
<template>
    <div class="full-calendar-header">
        <div class="header-left">
            <slot name="header-left">
            </slot>
        </div>
        <div class="header-center" onselectstart="return false">
          <span class="prev-month" @click.stop="goPrevYear"><i class="iconfont icon-double-left"></i></span>
            <span class="prev-month" @click.stop="goPrev"><i class="iconfont icon-left"></i></span>
            <span class="title">{{title}}</span>
            <span class="next-month" @click.stop="goNext"><i class="iconfont icon-right"></i></span>
            <span class="next-month" @click.stop="goNextYear"><i class="iconfont icon-double-right"></i></span>
        </div>
        <div class="header-right">
            <slot name="header-right">
            </slot>
        </div>
    </div>
</template>
<script type="text/babel">
  import moment from 'moment';
  export default {
    props: {
      currentMonth: {},
      titleFormat: {},
      firstDay: {},
      monthNames: {},
      locale: {}
    },
    computed: {
      title () {
        if (!this.currentMonth) return;
        return this.currentMonth.locale(this.locale).format('YYYY' + '年' + 'M' + '月')
      }
    },
    methods: {
      goPrev () {
        var newMonth = moment(this.currentMonth).subtract(1, 'months').startOf('month');
        this.$emit('change', newMonth);
      },
      goNext () {
        var newMonth = moment(this.currentMonth).add(1, 'months').startOf('month');
        this.$emit('change', newMonth);
      },
      goPrevYear () {
        var newMonth = moment(this.currentMonth).subtract(1, 'years');
        this.$emit('change', newMonth);
      },
      goNextYear () {
        var newMonth = moment(this.currentMonth).add(1, 'years');
        this.$emit('change', newMonth);
      }
    }
  }
</script>
