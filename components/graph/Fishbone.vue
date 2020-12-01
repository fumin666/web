<template>
  <div class="fishbone">
    <div class="fish-head">
      <div class="triangle-up" @click="panTop" title="向上平移"><!--向上的三角--></div>
      <div class="triangle-down" @click="panDown" title="向下平移"><!--向下的三角--></div>
      <div class="triangle-left" @click="panLeft" title="向左平移"><!--向左的三角--></div>
      <div class="triangle-right" @click="panRight" title="向右平移"><!--向右的三角--></div>
      <div class="circle-center"><!--居中圆--></div>
    </div>
    <div class="fish-headbg"><div class="head-h-line"></div><div class="head-v-line"></div></div>
    <div class="fish-body">
      <div class="fish-zoom-add" @click="addAction" title="放大一级"><span><i class="icon iconfont icon-plus-bold"></i></span></div>
      <div class="fish-zoom-cline" :style="{ top : sTop + 'px',height :sHight + 'px'}">
        <div v-for="n in (currentLevel + 1) " class="f-scale-item"></div>
      </div>
      <div class="fish-zoom-line">
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
        <div class="f-scale-item"></div>
      </div>
      <div class="fish-zoom-minus" @click="minusAction" title="缩小一级"><span><i class="icon iconfont icon-minus-bold"></i></span></div>
      <div class="fish-zoom-slider" v-bind:style="{ top : sliderTop + 'px'}">
        <div class="point-circle"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'sFishbone',
    data: function () {
      return {
        totalTop: 90,
        sliderHeight: 8,
        currentLevel: 8,
        ranges: [{
          min: 3,
          max: 3.6
        }, {
          min: 2.5,
          max: 3
        }, {
          min: 2.08,
          max: 2.5
        }, {
          min: 1.73,
          max: 2.08
        }, {
          min: 1.44,
          max: 1.73
        }, {
          min: 1.2,
          max: 1.44
        }, {
          min: 1,
          max: 1.2
        }, {
          min: 0.83,
          max: 1
        }, {
          min: 0.69,
          max: 0.83
        }, {
          min: 0.57,
          max: 0.69
        }, {
          min: 0.48,
          max: 0.57
        }, {
          min: 0.4,
          max: 0.48
        }, {
          min: 0.33,
          max: 0.4
        }, {
          min: 0.28,
          max: 0.33
        }, {
          min: 0.23,
          max: 0.28
        }, {
          min: 0.19,
          max: 0.23
        }]
      }
    },
    props: {
      graph: {
        type: Object,
        required: true
      },
      scale: {
        type: Number
      }
    },
    watch: {
      scale: function (val, oldVal) {
        this.initSlider(val);
      }
    },
    computed: {
      sTop: function () {
        return 20 + this.totalTop - (this.sliderHeight / 2 + 5 + this.currentLevel * 4);
      },
      sHight: function () {
        return 5 + this.currentLevel * 4;
      },
      sliderTop: function () {
        return 13 + this.totalTop - (this.sliderHeight / 2 + 5 + this.currentLevel * 4);
      }
    },
    methods: {
      panTop: function() {
        var translate = this.graph.view.getTranslate();
        this.graph.view.setTranslate(translate.x, translate.y + 120);
      },
      panDown: function() {
        var translate = this.graph.view.getTranslate();
        this.graph.view.setTranslate(translate.x, translate.y - 120);
      },
      panLeft: function() {
        var translate = this.graph.view.getTranslate();
        this.graph.view.setTranslate(translate.x + 120, translate.y);
      },
      panRight: function() {
        var translate = this.graph.view.getTranslate();
        this.graph.view.setTranslate(translate.x - 120, translate.y);
      },
      minusAction: function() {
        this.graph.zoomOut();
        if (this.currentLevel !== 0) {
          this.currentLevel = this.currentLevel - 1;
        }
      },
      addAction: function() {
        this.graph.zoomIn();
        if (this.currentLevel !== 17) {
          this.currentLevel = this.currentLevel + 1;
        }
      },
      _getSliderLevel: function(scale) {
        var level = 17;
        var _max = 3.6;
        var _min = 0.2;
        if (scale >= _max) {
          level = 1;
        } else if (scale <= _min) {
          level = 17;
        } else {
          level = this._getLevel(scale);
        }
        return level;
      },
      _getLevel: function(scale) {
        for (var i = 0; i < this.ranges.length; i++) {
          if (this.ranges[i].min <= scale && scale < this.ranges[i].max) {
            return i + 2;
          }
        }
        return 17;
      },
      initSlider (scale) {
        this.currentLevel = 17 - this._getSliderLevel(scale);
      }
    }
  }
</script>

