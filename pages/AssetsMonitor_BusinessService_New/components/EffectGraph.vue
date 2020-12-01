/*
create by YOU
*/
<template>
  <div class="businessEffectSvgWrapper"
       :style="`height: ${height};min-height: ${minHeight}`">
    <svg v-show="flag" :id="name" class="businessEffectSvg"></svg>
    <div v-show='!flag' v-nodata='!flag'>
      <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, 300%)">需开启业务服务监控
      </div>
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3'

  export default {
    name: 'e33',
    data() {
      let colorMap = {
        '连接': '#55d5d7',
        '属于': '#ff9c61',
        '依赖': '#ff5151',
        '运行于': '#99d181',
        '指向': '#d358e5',
        '包含': '#55d5d7',
        'other': '#55d5d7'
      }
      let colorList = []
      for (let i in colorMap) {
        colorList.push({
          name: i,
          color: colorMap[i]
        })
      }
      return {
        parentNode: {
          offsetWidth: 0,
          offsetHeight: 0
        },
        field: null,
        swims: [
          {name: '业务服务', type: 1},
          {name: '应用系统', type: 2},
          {name: '服务器', type: 3},
          {name: '网络/存储', type: 4}
        ],
        colorMap: colorMap,
        colorList: colorList,
        options: {},
        flag: false
      }
    },
    props: {
      height: {
        type: String,
        default: 'calc(100vh - 208px)'
      },
      minHeight: {
        type: String,
        default: '550px'
      },
      name: {
        type: String,
        default: 'effect' + Date.now()
      },
      busRow: {
        type: Object
      },
      data: {
        type: Object,
        default() {
          return {
            assets: [],
            rel: []
          }
        }
      }
    },
    created() {

    },
    watch: {
      data: {
        immediate: true,
        handler(data) {
          this.$nextTick(() => {
            this.doDraw()
          })
        }
      },
      busRow: {
        immediate: true,
        handler(data) {
          if (data.isMonitor === 1) {
            this.flag = true
          } else {
            this.flag = false
          }
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.parentNode = document.querySelector('#' + this.name).parentNode
        this.field = d3.select('#' + this.name)
        this.field.append('g')
        window.addEventListener('resize', this.resizeHandler);
      })
    },
    destroyed() {
      window.removeEventListener('resize', this.resizeHandler);
    },
    methods: {
      resizeHandler() {
        let _self = this;
        _self.options = _self.graphResizeData(_self.parentNode.offsetWidth, _self.parentNode.offsetHeight)
        _self.draw(_self.field, _self.options);
      },
      doDraw() {
        this.options = this.makeData(this.data, this.parentNode.offsetWidth, this.parentNode.offsetHeight)
        this.draw(this.field, this.options)
      },
      makeData(data, w = 600, height = 600, margin = 40) {
        if (!(data.assets && data.assets.length)) {
          data.assets = []
        }
        let boxes = this.swims
        let nodes = {}
        data.assets.map(item => {
          nodes[item.id] = item
        })
        let indexMap = {
          1: 1,
          2: 2,
          3: 3,
          4: 4
        }
        height -= 2
        let swimHeight = height / boxes.length

        // 计算资产位置...
        let lengths = {}
        let maxAssetsLength = 0
        data.assets.map(item => {
          // 计算每行最大资产数
          if (lengths[item.type]) {
            lengths[item.type]++
          } else {
            lengths[item.type] = 1
          }
          item.index = lengths[item.type]
          if (item.index > maxAssetsLength) {
            maxAssetsLength = item.index
          }
        })
        // 资产间距
        let assetDistence = 150
        // 根据每行最大资产数计算最小宽度
        w = w < maxAssetsLength * assetDistence ? maxAssetsLength * assetDistence : w
        let width = w - margin
        // 防止元素超出
        let containerWidth = width
        // 左侧空出距离
        let leftTextWidth = 0
        // 中心距离
        let computedFieldMiddle = leftTextWidth + (containerWidth - leftTextWidth) / 2
        data.assets.map(item => {
          let begin = computedFieldMiddle - assetDistence * (lengths[item.type] + 1) / 2
          item.cx = begin + item.index * assetDistence
          item.cy = swimHeight * (indexMap[item.type] - 0.5)
        })
        // 资产图标大小
        let assetRound = 40
        // 数据过滤
        data.rel && data.rel.filter ? data.rel = data.rel.filter(d => nodes[d.from] && nodes[d.to]) : data.rel = []
        // 计算线条位置
        data.rel.map(d => {
          d.x1 = nodes[d.from].cx
          d.y1 = nodes[d.from].cy
          d.x2 = nodes[d.to].cx
          d.y2 = nodes[d.to].cy
          let dx = d.x2 - d.x1
          let dy = d.y2 - d.y1
          let ab = (assetRound / 2 + 5) / Math.sqrt(dx * dx + dy * dy)
          d.dx = dx * ab
          d.dy = dy * ab
        })
        return {
          data, boxes, swimHeight, w, width, height, margin, indexMap, nodes, assetRound
        }
      },
      graphResizeData(w, height) {
        w = this.options.w > w ? this.options.w : w
        let width = w - this.options.margin
        let yScale = height / this.options.height
        let xTranslate = (width - this.options.width) / 2
        this.options.data.assets.map(item => {
          item.cx = item.cx + xTranslate
          item.cy = item.cy * yScale
        })
        this.options.data.rel && this.options.data.rel.map ? this.options.data.rel.map(d => {
          d.x1 = d.x1 + xTranslate
          d.y1 = d.y1 * yScale
          d.x2 = d.x2 + xTranslate
          d.y2 = d.y2 * yScale
        }) : ''
        return Object.assign(this.options, {
          w: w,
          width: width,
          height: height,
          swimHeight: height / this.swims.length
        })
      },
      draw(field, options) {
        /* ----------数据部分---------- */
        let {
          data, boxes, swimHeight, w, width, height, margin, indexMap, nodes, assetRound
        } = options

        /* ----------页面拖动部分,仅拖动x轴---------- */
        // 记录当前页面最小left
        let minLeft = document.querySelector('.businessEffectSvgWrapper').offsetWidth - w
        // 记录当前页面位置
        let x = 0
        let drag = d3.drag()
        drag.on('start', function () {
          x = d3.event.x + Math.abs(parseInt(d3.select(this).style('left')))
        })
        drag.on('drag', function () {
          let left = d3.event.x - x
          d3.select(this)
            .style('left', left > 0 ? 0 : left < minLeft ? minLeft : left)
        })
        field.call(drag)

        /* ----------绘图部分---------- */
        // 箭头
        let defs = field.selectAll('.arrowField').data([1])
        defs.enter().append('defs').attr('class', 'arrowField')
        let arrows = field.select('.arrowField').selectAll('maker').data(this.colorList)
        arrows.enter().append('marker')
          .attr('id', d => d.name)
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', '12')
          .attr('markerHeight', '12')
          .attr('viewBox', '0 0 12 12')
          .attr('refX', '6')
          .attr('refY', '6')
          .attr('orient', 'auto')
          .append('path')
          .attr('fill', d => d.color)
          .attr('d', 'M2,2 L10,6 L2,10 L6,6 L2,2')

        // 绘制chart尺寸
        let chart = field.attr('width', w)
          .attr('height', height + margin).select('g')
        chart.attr('width', width)
          .attr('height', height + margin)
          .attr('transform', `translate(${margin / 2}, 0)`)

        // 绘制swim
        let swim = chart.selectAll('.swimLine').data(boxes)
        swim.enter()
          .append('line')
          .attr('class', 'swimLine')
        chart.selectAll('.swimLine').attr('x1', 0)
          .attr('y1', (d, i) => swimHeight * indexMap[d.type])
          .attr('x2', width)
          .attr('y2', (d, i) => swimHeight * indexMap[d.type])

        // 资产拖拽
        let assetGrag = d3.drag()
        assetGrag.on('drag', function () {
          let {x, y} = d3.event
          x = x < 30 ? 30 : x > width - 30 ? width - 30 : x
          let node = nodes[d3.select(this).attr('node-id')]
          node.assetData.cx = x
          node.assetDom
            .attr('x', x)
          node.assetDesDom
            .attr('x', x)
          if (node.from) {
            node.from.map(item => {
              let {node, text} = item
              let {x2, y2, y1} = item.data
              let data = getMx(x, y, x2, y2, y1, y2)
              Object.assign(item.data, data)
              node
                .attr('x1', data.x1 + data.dx)
                .attr('y1', data.y1 + data.dy)
                .attr('x2', data.x2 - data.dx)
                .attr('y2', data.y2 - data.dy)
              text
                .attr('x', (data.x2 + data.x1 + data.dx) / 2)
                .attr('y', (data.y1 + data.y2 + data.dy) / 2)
            })
          }
          if (node.to) {
            node.to.map(item => {
              let {node, text} = item
              let {x1, y1, y2} = item.data
              let data = getMx(x1, y1, x, y, y1, y2)
              Object.assign(item.data, data)
              node
                .attr('x1', data.x1 + data.dx)
                .attr('y1', data.y1 + data.dy)
                .attr('x2', data.x2 - data.dx)
                .attr('y2', data.y2 - data.dy)
              text
                .attr('x', (data.x2 + data.x1 + data.dx) / 2)
                .attr('y', (data.y1 + data.y2 + data.dy) / 2)
            })
          }
        })
        function getMx(x1, y1, x2, y2, oy1, oy2) {
          // 仅y轴拖动
          let dx = x2 - x1
          let dy = oy2 - oy1
          let ab = (assetRound / 2 + 5) / Math.sqrt(dx * dx + dy * dy)
          dx *= ab
          dy *= ab
          return {
            x1,
            y1: oy1,
            x2,
            y2: oy2,
            dx,
            dy
          }
        }

        // 绘制资产
        let assets = chart.selectAll('.asset').data(data.assets)
        assets.enter().append('image')
          .attr('class', 'asset')
        assets.exit().remove()
        chart.selectAll('.asset').attr('xlink:href', d => d.icon)
          .attr('node-id', d => d.id)
          .each(function (d) {
            d.assetDom = d3.select(this)
            d.assetData = d
          })
          .attr('width', assetRound)
          .attr('height', assetRound)
          .attr('x', (d) => d.cx)
          .attr('y', (d) => d.cy)
          .attr('transform', `translate(-${assetRound / 2}, -${assetRound / 2})`)
          .call(assetGrag)

        // 绘制资产文本
        let textes = chart.selectAll('.assetDes').data(data.assets)
        textes.enter().append('text')
          .attr('class', 'assetDes')
        textes.exit().remove()
        chart.selectAll('.assetDes')
          .each(function (d) {
            d.assetDesDom = d3.select(this)
          })
          .attr('x', (d) => d.cx)
          .attr('y', (d) => d.cy + assetRound / 2 + 12)
          .attr('text-anchor', 'middle')
          .text(d => d.name)

        // 绘制线条
        let lines = chart.selectAll('.rel').data(data.rel)
        lines.enter().append('line')
          .attr('class', 'rel')
          .attr('stroke-dashoffset', 200)
        lines.exit().remove()
        chart.selectAll('.rel')
          .each(function (d, i) {
            // 把线条加入资产
            if (!nodes[d.from].from) {
              nodes[d.from].from = []
            }
            if (!nodes[d.to].to) {
              nodes[d.to].to = []
            }
            nodes[d.from].from[i] = nodes[d.to].to[i] = {}
            nodes[d.from].from[i].node = nodes[d.to].to[i].node = d3.select(this)
            nodes[d.from].from[i].data = nodes[d.to].to[i].data = d
          })
          .attr('x1', d => d.x1 + d.dx)
          .attr('y1', d => d.y1 + d.dy)
          .attr('x2', d => d.x2 - d.dx)
          .attr('y2', d => d.y2 - d.dy)
          .attr('stroke', d => this.colorMap[d.text] || this.colorMap['other'])
          .attr('marker-end', d => `url(#${d.text || 'other'})`)

        // 绘制线条文本
        let lineTextes = chart.selectAll('.relDes').data(data.rel)
        lineTextes.enter().append('text')
          .attr('class', 'relDes')
        lineTextes.exit().remove()
        chart.selectAll('.relDes')
          .each(function (d, i) {
            // 把线条文本加入资产
            nodes[d.from].from[i].text = d3.select(this)
            nodes[d.to].to[i].text = d3.select(this)
          })
          .attr('x', d => (d.x2 + d.x1 + d.dx) / 2)
          .attr('y', d => (d.y2 + d.y1 + d.dy) / 2)
          .attr('fill', d => this.colorMap[d.text] || this.colorMap['other'])
          .text(d => d.text)
      }
    }
  }
</script>
