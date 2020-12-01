/**
* Created by alex on 2018/3/19.
*/
<template>
      <p class="event-item" :class="cssClasses"
         @click="$emit('click', event, $event)">
          <slot :event="event" v-if="showTitle">
            {{ event.title }}
          </slot>
      </p>
</template>

<script type="text/babel">
  import moment from 'moment'

  export default {
    props: ['event', 'date', 'firstDay'],
    computed: {
      cssClasses () {
        let cssClasses = this.event.cssClass;

        if (!Array.isArray(cssClasses)) {
          cssClasses = [cssClasses];
        } else {
          cssClasses = Array.from(cssClasses);
        }

        if (this.start.isSame(this.date, 'day')) {
          cssClasses.push('is-start');
        }

        if (this.end.isSame(this.date, 'day')) {
          cssClasses.push('is-end');
        }

        if (!this.event.isShow) {
          cssClasses.push('is-opacity');
        }

        return cssClasses.join(' ');
      },
      showTitle() {
        return (this.date.day() === parseInt(this.firstDay) || this.start.isSame(this.date, 'day'));
      },
      start () {
        return moment(this.event.start);
      },
      end () {
        return moment(this.event.end);
      }
    }
  }
</script>
