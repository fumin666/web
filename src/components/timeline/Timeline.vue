<template>
  <ul :class="classes" :style="ulStyle">
    <li class="timeline-date" v-if="type=='oneway'"><span>2017-05-08</span></li>
    <li class="timeline-icon" v-if="type=='equalTwoway'">
      <i class="iconfont icon-clock"></i>
      <div></div>
    </li>
    <slot></slot>
  </ul>
</template>
<script>
  const prefixCls = 's-timeline';

  export default {
    name: 'sTimeline',
    data() {
      return {
        ulPaddingTop: 0,
        ulPaddingBottom: 0
      }
    },
    props: {
      type: {
        type: String,
        default: 'oneway'
      },
      shape: {
        type: String,
        default: ''
      }
    },
    computed: {
      classes () {
        return [
          `${prefixCls}`,
          this.type,
          this.shape
        ];
      },
      ulStyle() {
        if (this.type !== 'twoway') {
          return '';
        }
        return {
          // 'padding-top': this.ulPaddingTop,
          'padding-bottom': this.ulPaddingBottom
        };
      }
    },
    methods: {
      getUlPaddingTop() {
        if (this.$slots instanceof Array && this.$slots.length > 0) {
          let item = this.$slots.default[0];
          let top = item.elm.children[item.elm.children.length - 1].offsetTop
          return Math.abs(top) + 'px';
        } else {
          return '110px';
        }
      },
      getUlPaddingBottom() {
        if (this.$slots instanceof Array && this.$slots.length > 0) {
          let item = this.$slots.default[this.$slots.default.length - 1];
          let bottom = Math.ceil(item.elm.children[item.elm.children.length - 1].offsetHeight / 2);
          // 8是中点向上偏移的值，20是s-timeline-item的高度，12是s-timeline-item的padding-bottom
          return bottom + 8 - 20 - 12 + 'px';
        } else {
          return '13px';
        }
      }
    },
    mounted() {
      if (this.type === 'twoway') {
        this.$nextTick(() => {
          this.ulPaddingTop = this.getUlPaddingTop();
          this.ulPaddingBottom = this.getUlPaddingBottom();
        })
      }
    }
  };
</script>
