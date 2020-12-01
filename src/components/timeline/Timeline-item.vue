<template>
  <li :class="itemClasses" ref="item">
    <div class="s-time-indicater" v-if="type=='oneway'" ref="timeIndicater">
      <span>13:00</span>
    </div>
    <div :class="tailClasses" :style="tailStyle"></div>
    <div :class="headClasses" :style="headStyle" ref="dot">
      <slot name="dot"></slot>
    </div>
    <div :class="contentClasses" v-if="type=='twoway'">
      <slot></slot>
    </div>
    <div :class="contentClasses" v-else-if="type=='equalTwoway'" ref="contentEqual">
      <slot name="left"></slot>
      <div :style="contentStyle">
        <slot name="right" ></slot>
      </div>
    </div>
    <div :class="[contentClasses, {'current': current}]" :style="contentStyle" v-else>
      <slot></slot>
    </div>
  </li>
</template>
<script>
  const prefixCls = 's-timeline';

  export default {
    name: 'sTimelineItem',
    props: {
      color: {
        type: String,
        default: ''
      },
      current: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dot: false,
        contentHeight: '30px',
        tailStyle: '',
        headStyle: '',
        contentStyle: ''
      };
    },
    mounted () {
      this.dot = this.$refs.dot.innerHTML.length || false;
      this.initDivHeight();
      window.addEventListener('resize', this.initDivHeight);
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    methods: {
      initDivHeight() {
        if (this.type === 'oneway') {
          this.$nextTick(() => {
//                this.contentHeight = this.$refs.detail.offsetHeight + this.$refs.detail.offsetTop + 'px';
            let left = this.$refs.timeIndicater.offsetWidth - 0;
            this.headStyle = 'left:' + (left + 5) + 'px;';
            this.tailStyle = 'left:' + (left + 5 + 3) + 'px;';
            this.contentStyle = 'margin-left:' + (left + 5 + 10 + 5) + 'px';
          });
        } else if (this.type === 'equalTwoway') {
          this.$nextTick(() => {
            if (this.$refs.contentEqual) {
              let left = this.$refs.contentEqual.offsetWidth / 2 - 3;
              this.headStyle = 'left:' + (left + 5) + 'px;';
              this.tailStyle = 'left:' + (left + 5 + 4) + 'px;';
              this.contentStyle = 'margin-left:' + (left + 5 + 10 + 5) + 'px';
            }
          });
        } else {
          this.$nextTick(() => {
            let child = this.$refs.item;
            let parent = this.$parent.$el;
            let lastChild = parent.lastElementChild;
            if (child === lastChild) {
              // s-timeline-item-content的高度的一半 + tail相对于顶部的偏移:5px
              let height = Math.ceil(child.lastElementChild.offsetHeight / 2) + 5;
              this.tailStyle = 'height: ' + height + 'px';
            }
          })
        }
      }
    },
    computed: {
      type() {
        return this.$parent.type;
      },
      itemClasses () {
        return `${prefixCls}-item`;
      },
      tailClasses () {
        return `${prefixCls}-item-tail`;
      },
      headClasses () {
        return [
          `${prefixCls}-item-head`,
          {
            [`${prefixCls}-item-head-custom`]: this.dot,
            [`${prefixCls}-item-head-${this.color}`]: this.headColorShow,
            [`${prefixCls}-item-head-bg-${this.color}`]: this.bgColorShow
          }
        ];
      },
      headColorShow () {
        return this.color === 'blue' || this.color === 'red' || this.color === 'green';
      },
      bgColorShow () {
        return this.color === 'yellow' || this.color === 'green' || this.color === 'red';
      },
      contentClasses () {
        return `${prefixCls}-item-content`;
      }
    }
  };
</script>
