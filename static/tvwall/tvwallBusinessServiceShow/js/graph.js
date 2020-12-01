/**
 * Created by YOU on 2018/6/1.
 */
// /businessservice/getBusinessServiceEffect/
define(function (require, exports, module) {
  var suninfo = require('../../js/ajax.interface.js');
  require('../../js/d3.v5.js');
  var colorMap = {
    '连接': '#55d5d7',
    '属于': '#ff9c61',
    '依赖': '#ff5151',
    '运行于': '#99d181',
    '指向': '#d358e5',
    '包含': '#55d5d7',
    'other': '#55d5d7'
  }

  var colorList = []
  for (var i in colorMap) {
    colorList.push({
      name: i,
      color: colorMap[i]
    })
  }

  var that = {
    data: {},
    parentNode: null,
    field: null,
    colorMap: colorMap,
    colorList: colorList,
    swims: [
      {name: '业务服务', type: 1},
      {name: '应用系统', type: 2},
      {name: '服务器', type: 3},
      {name: '网络/存储', type: 4}
    ],
    options: {}
  }

  that.init = function(uuid, GraphId, smallId) {
    if (uuid) {
      suninfo.get('/businessservice/getBusinessServiceEffect/' + uuid).done(function (response) {
        // 初始化
        that.data = that.formatData(response)
        that.name = 'svg_' + GraphId
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('id', that.name)
        svg.setAttribute('class', 'businessEffectSvg')
        that.parentNode = document.querySelector('#' + GraphId)
        that.parentNode.className += ' businessEffectSvgWrapper'
        that.parentNode.appendChild(svg)
        console.log('init Graph Graph')
        // ----
        that.field = d3.select('#' + that.name);
        that.field.append('g');
        that.doDraw(function() {
          // w:112;h:77
          var graph = that.parentNode
          var width = graph.offsetWidth;
          var height = graph.offsetHeight;
          console.log(that.parentNode)
          var littleGraph = graph.cloneNode(true);
          console.log(littleGraph)
          littleGraph.style.transformOrigin = '0 0';
          littleGraph.style.transform = 'scale(' + 112 / width + ',' + 77 / height + ')';
          littleGraph.style.width = width + 'px';
          littleGraph.style.height = height + 'px';
          littleGraph.id = '';
          document.getElementById(smallId).appendChild(littleGraph);
        })
        // window.onresize = () => {
        //   that.options = that.graphResizeData(that.parentNode.offsetWidth, that.parentNode.offsetHeight)
        //   that.draw(that.field, that.options)
        // }
      })
    }
  }

  that.doDraw = function(cb) {
    var height = parseInt(document.querySelector('#large_list').offsetHeight * 0.8)
    var width = parseInt(document.querySelector('#large_list').offsetWidth)
    that.options = that.makeData(that.data, width, height)
    that.draw(that.field, that.options)
    setTimeout(function() {
      cb()
    })
  },
  that.formatData = function (data) {
    let newData = {
      assets: [],
      rel: []
    }
    if (!(data && data.itcomp)) {
      return newData
    }
    // 业务服务层
    newData.assets.push({
      id: data.itcomp[1].uuid,
      name: data.itcomp[1].name,
      icon: '/static/images/topologyicon/default/businessService.svg',
      type: 1
    })
    // 其他层
    for (let k = 2; k <= 4; k++) {
      if (data.itcomp[k] && data.itcomp[k].length) {
        data.itcomp[k].map(item => {
          newData.assets.push({
            id: item.uuid,
            name: item.itcompName,
//                icon: item.cmdbCitype ? item.cmdbCitype.iconThumb : null,
            icon: item.cmdbCitype ? ('/' + item.cmdbCitype.iconThumb.replace('relationship', 'topologyicon/default')) : null,
            type: k
          })
        })
      }
    }
    // 关系
    if (data.relation && data.relation.length) {
      data.relation.map(item => {
        newData.rel.push({
          from: item.ciUuid,
          to: item.relCiUuid,
          text: item.relationTypeName
        })
      })
    }
    /*
     * 转化后数据格式
     * {
     *   assets: [
     *     {id: '1', name: '黑猩猩队长', type: 1}
     *   ],
     *   rel: [
     *     {from: '1', to: '2', text: '喜欢'}
     *   ]
     * }
     */
    return newData
  }
  // 创建图数据
  that.makeData = function (data, w = 600, height = 600, margin = 40) {
    if (!(data.assets && data.assets.length)) {
      data.assets = []
    }
    var boxes = that.swims
    var nodes = {}
    data.assets.map(item => {
      nodes[item.id] = item
    })
    var indexMap = {
      1: 1,
      2: 2,
      3: 3,
      4: 4
    }
    height -= 2
    var swimHeight = height / boxes.length

    // 计算资产位置...
    var lengths = {}
    var maxAssetsLength = 0
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
    var assetDistence = 150
    // 根据每行最大资产数计算最小宽度
    w = 80 + (w < maxAssetsLength * assetDistence ? maxAssetsLength * assetDistence : w)
    var width = w - margin
    // 防止元素超出
    var containerWidth = width
    // 左侧空出距离
    var leftTextWidth = 120
    // 中心距离
    var computedFieldMiddle = leftTextWidth + (containerWidth - leftTextWidth) / 2
    data.assets.map(item => {
      var begin = computedFieldMiddle - assetDistence * (lengths[item.type] + 1) / 2
      item.cx = begin + item.index * assetDistence
      item.cy = swimHeight * (indexMap[item.type] - 0.5)
    })
    // 资产图标大小
    var assetRound = 40
    // 数据过滤
    data.rel && data.rel.filter ? data.rel = data.rel.filter(d => nodes[d.from] && nodes[d.to]) : data.rel = []
    // 计算线条位置
    console.log(data.rel)
    data.rel.map(d => {
      d.x1 = nodes[d.from].cx
      d.y1 = nodes[d.from].cy
      d.x2 = nodes[d.to].cx
      d.y2 = nodes[d.to].cy
      var dx = d.x2 - d.x1
      var dy = d.y2 - d.y1
      var ab = (assetRound / 2 + 5) / Math.sqrt(dx * dx + dy * dy)
      d.dx = dx * ab
      d.dy = dy * ab
    })
    return {
      data, boxes, swimHeight, w, width, height, margin, indexMap, nodes, assetRound, leftTextWidth
    }
  },
  // 更新图大小
  that.graphResizeData = function(w, height) {
    var width = w - that.options.margin
    var yScale = height / that.options.height
    var xTranslate = (width - that.options.width) / 2
    that.options.data.assets.map(item => {
      item.cx = item.cx + xTranslate
      item.cy = item.cy * yScale
    })
    that.options.data.rel && that.options.data.rel.map ? that.options.data.rel.map(d => {
      d.x1 = d.x1 + xTranslate
      d.y1 = d.y1 * yScale
      d.x2 = d.x2 + xTranslate
      d.y2 = d.y2 * yScale
    }) : ''
    return Object.assign(that.options, {
      width: width,
      w: w,
      height: height,
      swimHeight: height / that.swims.length
    })
  },
  // 画图
  that.draw = function (field, options) {
    /* ----------数据部分---------- */
    var {
      data, boxes, swimHeight, w, width, height, margin, indexMap, nodes, assetRound, leftTextWidth
    } = options

    /* ----------页面拖动部分,仅拖动x轴---------- */
    // 记录当前页面最小left
    var minLeft = that.parentNode.offsetWidth - w
    // 记录当前页面位置
    var x = 0
    var drag = d3.drag()
    drag.on('start', function () {
      x = d3.event.x + Math.abs(parseInt(d3.select(this).style('left')))
    })
    drag.on('drag', function () {
      var left = d3.event.x - x
      d3.select(this)
        .style('left', left > 0 ? 0 : left < minLeft ? minLeft : left)
    })
    field.call(drag)

    /* ----------绘图部分---------- */
    // 箭头
    var defs = field.selectAll('.arrowField').data([1])
    defs.enter().append('defs').attr('class', 'arrowField')
    var arrows = field.select('.arrowField').selectAll('maker').data(that.colorList)
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
    var chart = field.attr('width', w)
      .attr('height', height + margin).select('g')
    chart.attr('width', width)
      .attr('height', height + margin)
      .attr('transform', `translate(${margin / 2}, 0)`)

    // 绘制swim
    var swim = chart.selectAll('.swimLine').data(boxes)
    swim.enter()
      .append('line')
      .attr('class', 'swimLine')
    chart.selectAll('.swimLine').attr('x1', 0)
      .attr('y1', (d, i) => swimHeight * indexMap[d.type])
      .attr('x2', width)
      .attr('y2', (d, i) => swimHeight * indexMap[d.type])

    // 绘制swim文本
    chart.selectAll('.swimName').data(boxes).enter()
      .append('text')
      .attr('class', 'swimName')
      .attr('x', 20)
      .attr('y', (d, i) => swimHeight * (indexMap[d.type] - 0.5))
      .text(d => d.name)
      .style('font-size', '20px')
      .attr('fill', '#3333ff')
    // 资产拖拽
    var assetGrag = d3.drag()
    assetGrag.on('drag', function () {
      var {x, y} = d3.event
      var leftWidth = leftTextWidth + 30
      x = x < leftWidth ? leftWidth : x > width - 30 ? width - 30 : x
      var node = nodes[d3.select(this).attr('node-id')]
      node.assetData.cx = x
      node.assetDom
        .attr('x', x)
      node.assetDesDom
        .attr('x', x)
      if (node.from) {
        node.from.map(item => {
          var {node, text} = item
          var {x2, y2, y1} = item.data
          var data = getMx(x, y, x2, y2, y1, y2)
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
          var {node, text} = item
          var {x1, y1, y2} = item.data
          var data = getMx(x1, y1, x, y, y1, y2)
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
      var dx = x2 - x1
      var dy = oy2 - oy1
      var ab = (assetRound / 2 + 5) / Math.sqrt(dx * dx + dy * dy)
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
    var assets = chart.selectAll('.asset').data(data.assets)
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
    var textes = chart.selectAll('.assetDes').data(data.assets)
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
    var lines = chart.selectAll('.rel').data(data.rel)
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
    var lineTextes = chart.selectAll('.relDes').data(data.rel)
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
  module.exports = that.init
});
