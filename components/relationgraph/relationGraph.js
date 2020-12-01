var $ = window.$;

var TaskDependency = null;
var empty = function() {};

// 字符串截取方法
function truncate(nameStr, truncateVal) {
  return (nameStr.length > truncateVal + 1) ? nameStr.substr(0, truncateVal) + '...' : nameStr;
}

// 重置定时器
function resetTimer(timer) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function createViz(t, config, rootData) {
  var _default = {
    onInit: empty,
    levelsToShow: 2,
    Asset: {
      '$type': 'assetnode',
      '$width': 120,
      '$height': 80
    },
    Relation: {
      '$type': 'stroke-rect',
      '$width': 120,
      '$height': 40
    },
    edgeColor: {
      normal: '#cccccc',
      hover: '#7EAF08',
      selected: '666666',
      disabled: '#adad00'
    },
    InfoContainer: {
      id: '#asset_desc_panel',
      hoverTime: 1000,
      fadeTime: 200,
      onShow: empty,
      onHide: empty,
      hideTime: 40000
    },
    filterRels: true,
    onNodeClick: empty,
    onShowTip: empty,
    onCreateHtmlNode: empty,
    maxScale: 1.5,
    minScale: 0.5,
    preventMousewheel: false,
    plotArrowSize: 5,
    nameTruncateVal: 15,
    beginx: 40
  };
  t = t || 'infovis';
  config = window.$jit.util.extend(_default, config);
  var edgeColor = config.edgeColor;
  var nodeType = {
    asset: 0,
    relation: 1
  };
  var infoProp = config.InfoContainer;
  var beginx = config.beginx;
  var plotArrowSize = config.plotArrowSize;
  var nameTruncateVal = config.nameTruncateVal;
  var $activeNode = null;
  var $replot = false;
  var $infoPanel = $(infoProp.id);
  var $infoData = {
    nodeId: null,
    blocked: false,
    hoverTimer: null,
    fadeTimer: null,
    hideTimer: 5000
  };
  var $attrPanel = $('#CI_ATTRIB_PANEL');
  var $attrInfo = $('#CI_ATTRIB_INFO');
  $attrPanel.find('.ui-close').click(function() {
    hideAttrPanel();
  });
  var r = false;
  var C = 0;
  var l = [];
  var relationFromIdMap = new Map();
  relationFromIdMap.set('tree', []);
  var assetFromIdMap = new Map();
  assetFromIdMap.set('edges', []);
  var U = new Map();
  var d = new Map();
  var relationIdMap = new Map();

  function processData(dataAry) {
    try {
      dataAry.forEach(function(item) {
        if (item.data && !(relationIdMap.get(item.data.relId))) {
          separateData(getRelationAndAsset(item));
          if (config.filterRels) {
            relationIdMap.set(item.data.relId, 1);
          }
        }
      });
    } catch (ex) {
    }
  }

  function doNothing(W) {
    return W;
  }

  function createId(W) {
    return doNothing(W.fromId) + '_' + W.data.relTypeId;
  }

  function getRelationAndAsset(dataObj) {
    var relation = {
      id: createId(dataObj),
      relId: dataObj.data.relId,
      relTypeId: dataObj.data.relTypeId,
      name: dataObj.data.relation,
      fromId: doNothing(dataObj.fromId),
      data: {},
      children: []
    };
    relation.data = window.$jit.util.extend(relation.data, config.Relation);
    relation.data.objType = nodeType.relation;
    var asset = {
      id: doNothing(dataObj.id),
      name: dataObj.name,
      relId: dataObj.data.relId,
      fromId: relation.id,
      data: {
        assetId: dataObj.id
      },
      children: []
    };
    var node = st.graph.getNode(asset.id);
    if (node && node.data.ciAttribute && dataObj && dataObj.data.ciAttribute) {
      node.data.ciAttribute.ciRelId = node.data.ciAttribute.ciRelId + ';' + dataObj.data.ciAttribute.ciRelId;
    }
    asset.data = window.$jit.util.merge(asset.data, config.Asset, dataObj.data);
    asset.data.objType = nodeType.asset;
    if (l.length) {
      J(dataObj.fromId, dataObj.id);
    }
    return [relation, asset];
  }

  function separateData(relationAssetAry) {
    var treeAry = relationFromIdMap.get('tree');
    relationAssetAry.forEach(function(item) {
      if (!l.length) {
        // p = item.id;
      }
      if (d.get(item.id) && !item.data.objType) {
        var fromIdAry = assetFromIdMap.get(item.fromId);
        if (!fromIdAry) {
          assetFromIdMap.set(item.fromId, []);
        }
        assetFromIdMap.get(item.fromId).push(item.id);
      } else {
        // 所有的数据都走这里
        if (l.length) {
          if (!relationFromIdMap.has(item.fromId)) {
            relationFromIdMap.set(item.fromId, []);
          }
          relationFromIdMap.get(item.fromId).push(item);
          treeAry.push(item);
        }
      }
      if (l.length > 1) {
        recordParentsChildren(item.fromId, item.id);
      }
      l.push(item);
    });
  }

  function J(fromId, objId) {
    if (!U.has(fromId)) {
      U.set(fromId, []);
    }
    U.get(fromId).push(objId);
    if (!U.has(objId)) {
      U.set(objId, []);
    }
    U.get(objId).push(fromId);
  }

  function recordParentsChildren(fromId, id) {
    if (!d.has(fromId)) {
      d.set(fromId, {
        parents: new Map(),
        children: new Map()
      });
    }
    d.get(fromId).children.set(id, 1);
    if (!d.has(id)) {
      d.set(id, {
        parents: new Map(),
        children: new Map()
      });
    }
    d.get(id).parents.set(fromId, 1);
  }

  function g(nodeId) {
    nodeId = doNothing(nodeId);
    var W = relationFromIdMap.get(nodeId);
    W.forEach(function(Y) {
      Y.children = relationFromIdMap.get(Y.id);
    });
    return (nodeId) ? {
      id: nodeId,
      children: W
    } : null;
  }

  function G(ab, Y, ae) {
    var X = ab.x;
    var W = ab.y;
    var ad = X - Y;
    var ac = ab.y + Y;
    var aa = X - Y;
    var Z = ab.y - Y;
    ae.beginPath();
    ae.moveTo(X, W);
    ae.lineTo(ad, ac);
    ae.lineTo(aa, Z);
    ae.closePath();
    ae.fill();
  }

  function u(ab, ad, Z) {
    if (ab && ad) {
      Z = Z || 'left';
      var Y = st.canvas.getCtx();
      var W = ab._depth < ad._depth;
      var aa = st.geom.getEdge(ab, 'begin', Z);
      var X = st.geom.getEdge(ad, 'end', Z);
      var dim = (X.x - aa.x);
      if (ab.data.objType) {
        aa.x -= beginx;
      }
      if (!W) {
        X.x += ad.getData('width');
      }
      Y.beginPath();
      Y.strokeStyle = edgeColor.normal;
      Y.fillStyle = edgeColor.normal;
      Y.lineWidth = 1.5;
      var drawArrow = false;
      if (r && !st.busy) {
        if (ab.getData('hover') && ad.getData('hover')) {
          var ac = ad.getData('hover') - ab.getData('hover');
          if (ac === 1) {
            Y.strokeStyle = edgeColor.hover;
            Y.fillStyle = edgeColor.hover;
            Y.lineWidth = 2;
            drawArrow = true;
          }
        }
      }
      Y.moveTo(aa.x, aa.y);
      if (!W) {
        var dimy = X.y - aa.y;
        Y.bezierCurveTo(aa.x - dim / 4, aa.y + dimy / 4, X.x - dim / 2, X.y, X.x, X.y);
      } else {
        Y.bezierCurveTo(aa.x + dim, aa.y, X.x - dim, X.y, X.x, X.y);
      }
      Y.stroke();
      if (ab.data.objType && drawArrow) {
        G(X, (W) ? plotArrowSize : -(plotArrowSize), Y);
      }
    }
  }
  window.$jit.ST.Plot.EdgeTypes.implement({
    groupedbezier: {
      render: function(W, Y) {
        var X = this.getOrientation(W);
        var Z = W.nodeFrom;
        var aa = W.nodeTo;
        u(Z, aa, X);
      }
    }
  });

  window.$jit.ST.Plot.NodeTypes.implement({
    'stroke-rect': {
      render: function(aa, Y) {
        var Z = aa.getData('width');
        var W = aa.getData('height');
        var ad = this.getAlignedPos(aa.pos.getc(true), Z, W);
        var ac = {
          x: ad.x,
          y: (ad.y + W / 2)
        };
        var ab = {
          x: (ad.x + Z / 2) + 20,
          y: (ad.y + W / 2)
        };
        this.edgeHelper.line.render(ac, ab, Y);
        var X = assetFromIdMap.get(aa.id);
        if (X) {
          X.forEach(function(ae) {
            var nodeFrom = aa;
            var nodeTo = st.graph.getNode(ae);
            u(nodeFrom, nodeTo);
          });
        }
      }
    },
    assetnode: {
      render: function(Z, X) {
        var width = Z.getData('width');
        var height = Z.getData('height');
        this.getAlignedPos(Z.pos.getc(true), width, height);
      }
    }
  });
  var CreateAssetHTML = function(ah, Z) {
    var ac = '';
    var ae = '';
    var ab = '';
    var ag = ab + '<div class="jit-assetnode-inner bg_white_node' + ae + '"><span class="jit-ciname">' + truncate(Z.name, nameTruncateVal) + '</span></div>';
    var aa = Z.data.ciType ? '<span class="jit-citype">' + truncate(Z.data.ciType, 18) + '</span>' : '';
    var af = '';
    var X = '';
    if (TaskDependency) {
      X = X + 'top : -40%;';
    }
    var ad = '';
    if (Z.data.imageIcon != null) {
      ad = '<img  src="' + Z.data.imageIcon + '" style="' + X + '" class="icon" />';
    }
    var W = $('<div />').addClass('node-assetContainer').append(ad).append(Z.data.VIP).append('<div class="jit-assetnode ' + ac + '" >' + ag + aa + af + '</div>').mouseover(function(aj) {
      if ($infoData.blocked) {
        return;
      }
      if ($infoData.fadeTimer) {
        resetTimer($infoData.fadeTimer);
      }
      resetTimer($infoData.hoverTimer);
      $infoData.hoverTimer = setTimeout(function() {
        resetTimer($infoData.hoverTimer);
        showInfoPanel(Z);
      }, infoProp.hoverTime);
      if ($infoData.hideTimer) {
        resetTimer($infoData.hideTimer);
      }
      $infoData.hideTimer = setTimeout(function() {
        resetTimer($infoData.hideTimer);
        hideInfoPanel();
      }, 4000);
    }).mouseout(function(aj) {
      if ($infoData.blocked) {
        return;
      }
      if ($infoData.hoverTimer) {
        resetTimer($infoData.hoverTimer);
      }
      if ($infoData.hideTimer) {
        resetTimer($infoData.hideTimer);
      }
      resetTimer($infoData.fadeTimer);
      $infoData.fadeTimer = setTimeout(function() {
        resetTimer($infoData.fadeTimer);
        hideInfoPanel();
      }, infoProp.fadeTime);
    }).click(function(ai) {
      $activeNode = Z.id;
      if (!Z.anySubnode()) {
        st.onClick(Z.id);
      } else {
        config.onNodeClick(Z.id);
      }
    }).appendTo(ah);
    $(ah).addClass('assetElement');
    config.onCreateHtmlNode(ah, W, Z.data);
  };
  var CreateRelationHTML = function(W, X) {
    W.className = 'labelElement';
    W.innerHTML = '<div class="jit-relnode">' + truncate(X.name, 15) + '</div>';
  };
  var L = false;
  config.insertData = function(nodeId, nodeData, onComplete) {
    if (this.isLoadingData() || (this.currentNode() === nodeId)) {
      var pData = this.ProcessData(nodeId, nodeData);
      if (pData) {
        if (onComplete) {
          if (this.replot()) {
            st.addSubtree(pData, 'replot');
            this.clearReplot();
          } else {
            onComplete.onComplete(nodeId, pData);
          }
        } else {
          st.addSubtree(pData, 'animate');
        }
      }
      this.clearActiveNode();
    }
    if (onComplete) {
      onComplete.onComplete();
    }
  };
  config.isLoadingData = function() {
    return L;
  };
  config.currentNode = function() {
    return $activeNode;
  };
  config.ProcessData = function(nodeId, nodeData) {
    processData(nodeData);
    return g(nodeId);
  };
  config.clearActiveNode = function() {
    $activeNode = null;
  };
  config.getAssetId = function(W) {
    return st.graph.getNode(W).data.assetId;
  };
  config.hasNode = function(W) {
    return st.graph.hasNode(W);
  };
  config.getNode = function(W) {
    return st.graph.getNode(W);
  };
  config.replot = function() {
    return $replot;
  };
  config.clearReplot = function() {
    $replot = false;
  };
  config.getConnectedAssets = function(W) {
    return U.get(W);
  };
  var k = 500;
  if (TaskDependency) {
    k = 0;
  }
  var st = new window.$jit.ST({
    injectInto: t,
    orientation: 'left',
    duration: k,
    offsetX: 0,
    offsetY: 0,
    hideLabels: false,
    constrained: false,
    callLeavesReqOnParentCall: false,
    transition: window.$jit.Trans.Quart.easeInOut,
    levelsToShow: 30,
    levelDistance: 30,
    Navigation: {
      enable: false,
      panning: true
    },
    Node: {
      type: 'none',
      color: edgeColor.normal,
      overridable: true,
      lineWidth: 1
    },
    Edge: {
      type: 'groupedbezier',
      overridable: true,
      lineWidth: 1.5,
      color: edgeColor.normal
    },
    Events: {
      enable: true,
      onDragStart: function(Z, aa, ab) {
        this.mPressed = true;
        this.pos = aa.getPos();
        var Y = st.canvas;
        var X = Y.translateOffsetX;
        var W = Y.translateOffsetY;
        var ad = Y.scaleOffsetX;
        var ac = Y.scaleOffsetY;
        this.pos.x *= ad;
        this.pos.x += X;
        this.pos.y *= ac;
        this.pos.y += W;
      },
      onMouseMove: function(Z, ad, ab) {
        if (!this.mPressed) {
          return;
        }
        var aa = this.pos;
        var ac = ad.getPos();
        var X = st.canvas;
        var Y = X.translateOffsetX;
        var W = X.translateOffsetY;
        var ah = X.scaleOffsetX;
        var af = X.scaleOffsetY;
        ac.x *= ah;
        ac.y *= af;
        ac.x += Y;
        ac.y += W;
        var ag = ac.x - aa.x;
        var ae = ac.y - aa.y;
        st.config.offsetX += ag * 1 / ah;
        st.config.offsetY += ae * 1 / af;
        this.pos = ac;
        st.canvas.translate(ag * 1 / ah, ae * 1 / af);
      },
      onClick: function(W, X, Y) {
        this.mPressed = false;
      },
      onMouseWheel: function(Z, event) {
        if (config.preventMousewheel) {
          return;
        }
        var Y = 30 / 1000;
        var W = 1 + Z * Y;
        zoomGraph(W, W);
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
      }
    },
    onBeforeCompute: function(node) {
      hideInfoPanel();
      $('noDataMSG').hide();
      $('Loading').show();
      if (!TaskDependency) {
        if ($('actionMSG')) {
          $('actionMSG').innerHTML = '';
        }
      }
    },
    onAfterCompute: function(node) {
      $('Loading').hide();
      if (!TaskDependency && node && z.length === 0 && d.get(node) && d.get(node).children) {
        $('noDataMSG').show();
        setTimeout(function() {
          $('noDataMSG').hide();
        }, 2000);
      }
    },
    onCreateLabel: function(label, node) {
      label.id = node.id;
      if (!node.data.objType) {
        CreateAssetHTML(label, node);
      } else {
        CreateRelationHTML(label, node);
      }
      lableStyle(node, label);
      $(label).mouseover(function(Z) {
        node.setData('hover', 3);
        r = true;
        C = node.data.objType;
        var Y = [];
        var aa = [];
        if (!C) {
          if (d.get(node.id)) {
            let parentKeys = d.get(node.id).parents.keys();
            for (let key of parentKeys) {
              Y.push(key);
              var pKeys = d.get(key).parents.keys()
              for (let key2 of pKeys) {
                Y.push(key2);
              }
            }
          }
          var nodeObj = {};
          Y.forEach(function(ab) {
            nodeObj = st.graph.getNode(ab);
            nodeObj.setData('hover', 1 + nodeObj.data.objType);
          });
          if (d.has(node.id)) {
            let childKeys = d.get(node.id).children.keys();
            for (let key3 of childKeys) {
              aa.push(key3);
              var cKeys = d.get(key3).children.keys()
              for (let key4 of cKeys) {
                aa.push(key4);
              }
            }
          }
          aa.forEach(function(ab) {
            nodeObj = st.graph.getNode(ab);
            if (nodeObj) {
              nodeObj.setData('hover', 5 - nodeObj.data.objType);
            }
          });
        } else {
          if (d.has(node.id)) {
            let parentKeys = d.get(node.id).parents.keys();
            for (let key of parentKeys) {
              Y.push(key);
              let parentNode = st.graph.getNode(key);
              parentNode.setData('hover', 2);
            }
            let childKeys = d.get(node.id).children.keys();
            for (let key3 of childKeys) {
              aa.push(key3);
              let childNode = st.graph.getNode(key3);
              if (childNode) {
                childNode.setData('hover', 4);
              }
            }
          }
        }
        this.hoverList = Y.concat(aa);
        st.plot();
      }).mouseout(function(Y) {
        node.setData('hover', 0);
        r = false;
        if (this.hoverList) {
          this.hoverList.forEach(function(Z) {
            if (st.graph.getNode(Z)) {
              st.graph.getNode(Z).setData('hover', 0);
            }
          });
        }
        st.plot();
      });
    },
    ProcessData: config.ProcessData,
    getAssetId: config.getAssetId,
    hasNode: config.hasNode,
    isLoadingData: config.isLoadingData,
    currentNode: config.currentNode,
    clearActiveNode: config.clearActiveNode,
    getConnectedAssets: config.getConnectedAssets,
    insertData: config.insertData,
    getNode: config.getNode,
    replot: config.replot,
    clearReplot: config.clearReplot,
    onBeforePlotNode: function(node) {
      if (r && node.getData('hover') && !st.busy) {
        let label = st.labels.getLabel(node.id);
        if (label) {
          $(label).addClass('node-active');
          $(label).removeClass('node-adj');
          if (node.data.objType) {
            node.data.$color = edgeColor.hover;
            node.data.$lineWidth = 2;
          }
        }
      } else {
        delete node.data.$color;
        delete node.data.$lineWidth;
        let label = st.labels.getLabel(node.id);
        if (label) {
          $(label).removeClass('node-active');
          $(label).removeClass('node-adj');
        }
      }
    },
    onAfterPlotNode: function(node) {},
    onBeforePlotLine: function(node) {},
    onAfterPlotLine: function(node) {}
  });
  var z = config.saveList || [];
  var K = [];
  var m = function(aa) {
    if (z.length) {
      var ab = 0;
      var ai = doNothing(z[ab]);
      $activeNode = ai;
      if (st.graph.hasNode(ai)) {
        if (aa) {
          st.onClick(ai, {
            onComplete: function() {
              z.splice(ab, 1);
              m(aa);
            }
          });
        } else {
          st.select(ai);
          z.splice(ab, 1);
          m(aa);
        }
      } else {
        K.push(z[ab]);
        z.splice(ab, 1);
      }
    } else {
      if (TaskDependency) {
        var al = 0;
        var an = 0;
        var ae = 0;
        var ak = 0;
        var ad = 0;
        var ap = 0;
        var ac = $(window).height();
        var ag = $(window).width();
        var X = parent.$('#cmdbViz-label').find('.assetElement');
        for (var am = 0; am < X.length; am++) {
          var ah = X[am];
          var aq = parseInt(ah.style.left, 10);
          var W = parseInt(ah.style.top, 10);
          if (ae === 0) {
            ae = aq;
          }
          if (ad === 0) {
            ad = W;
          }
          if (aq < ae) {
            ae = aq;
          }
          if (aq > ak) {
            ak = aq;
          }
          if (W < ad) {
            ad = W;
          }
          if (W > ap) {
            ap = W;
          }
        }
        an = ak - ae;
        al = ap - ad;
        an = an - ((an * 3) / 10);
        al = al - ((al * 3) / 10);
        if (al < ac) {
          al = ac;
        }
        if (an < ag) {
          an = ag;
        }
        var ao = parseInt(parent.$('#cmdbViz-label').find('#0')[0].style.top, 10);
        var Y = parseInt(parent.$('#cmdbViz-label').find('#0')[0].style.left, 10);
        st.canvas.resize(an, al);
        parent.$('#cmdbViz').css('height', al + 'px');
        parent.$('#cmdbViz').css('width', an + 'px');
        var aj = parseInt(parent.$('#cmdbViz-label').find('#0')[0].style.top, 10);
        var af = parseInt(parent.$('#cmdbViz-label').find('#0')[0].style.left, 10);
        if (al <= ac) {
          aj = 0;
        } else {
          aj = (al - aj) - ((ap - ao) * 0.8);
        }
        if (an <= ag) {
          af = (Y * 0.8) - ag;
        } else {
          af = (an - af) - ((ak - Y) * 0.9);
        }
        st.canvas.translate(af, aj, true);
        zoomGraph(0.6, 0.6);
        $('Loading').hide();
        var Z = '#0';
        if (TaskDependency.baseTask !== null) {
          Z = '#' + TaskDependency.baseTask;
        }
        $(window).scrollTop(parseInt(parent.$('#cmdbViz-label').find(Z)[0].style.top, 10) - 75);
        $(window).scrollLeft(parseInt(parent.$('#cmdbViz-label').find(Z)[0].style.left, 10) - ag / 2);
        // mapRendered = true;
      }
    }
    return;
  };

  // let graphObj = {
  //   'root': [
  //     {
  //       'fromId': 'root',
  //       'name': 'XiAn-Core',
  //       'id': 'a0cd869c5c4c4c4aa97d6dddbffe2bdd',
  //       'data': {
  //         'ciType': '交换机',
  //         'relId': 'root',
  //         'imageIcon': '../../../static/images/relationship/Switch.png',
  //         'relTypeId': 'root',
  //         'canview': true,
  //         'vip': '',
  //         'relation': 'parent',
  //         'cirelationuuid': null,
  //         'currentUpuuid': 'root',
  //         'currentCitypeuuid': 'b5dd62221aef4cbcaf40b898464b4ad0',
  //         'itAsset': true,
  //         'typekey': 'switch'
  //       }
  //     }
  //   ],
  //   'a0cd869c5c4c4c4aa97d6dddbffe2bdd': [
  //     {
  //       'fromId': 'a0cd869c5c4c4c4aa97d6dddbffe2bdd',
  //       'name': 'superadmin',
  //       'id': 'cu2704bbea9847d1b745e9e5d33d8732',
  //       'data': {
  //         'ciType': '用户',
  //         'relId': '7963850c63d340c3975a0117b70aea47',
  //         'imageIcon': '../../../static/images/relationship/user.png',
  //         'relTypeId': 'a083d9a5c28d4d47828a4c226cef2e23',
  //         'canview': true,
  //         'vip': '',
  //         'relation': '被管理',
  //         'cirelationuuid': '7963850c63d340c3975a0117b70aea47',
  //         'currentUpuuid': 'a0cd869c5c4c4c4aa97d6dddbffe2bdd',
  //         'currentCitypeuuid': 'f581e33c7d644a5d9c54e61b3fa1ea3e',
  //         'itAsset': false,
  //         'typekey': 'user'
  //       }
  //     }, {
  //       'fromId': 'a0cd869c5c4c4c4aa97d6dddbffe2bdd',
  //       'name': '顶级机构',
  //       'id': 'c12704bbea9847d1b745e9e5d33d8731',
  //       'data': {
  //         'ciType': '组织机构',
  //         'relId': '147936dc4be748fabdffd8ffc250fa4e',
  //         'imageIcon': '../../../static/images/relationship/department.png',
  //         'relTypeId': 'b55046a9617d4674a95e58fb67e466d6',
  //         'canview': true,
  //         'vip': '',
  //         'relation': '属于',
  //         'cirelationuuid': '147936dc4be748fabdffd8ffc250fa4e',
  //         'currentUpuuid': 'a0cd869c5c4c4c4aa97d6dddbffe2bdd',
  //         'currentCitypeuuid': 'd5c01fbb49574e3c8f48cc82467b26d3',
  //         'itAsset': false,
  //         'typekey': 'organization'
  //       }
  //     }
  //   ],
  //   'cu2704bbea9847d1b745e9e5d33d8732': [
  //     {
  //       'fromId': 'cu2704bbea9847d1b745e9e5d33d8732',
  //       'name': 'shanlin-PC',
  //       'id': '7ee77abe22484e3ca05a5ff796768232',
  //       'data': {
  //         'ciType': 'Windows',
  //         'relId': 'e34357a19ab94409a58e4a3df2b93ea2',
  //         'imageIcon': '../../../static/images/relationship/Server.png',
  //         'relTypeId': 'ba14bbe07e7a40c6956b60c120f66304',
  //         'canview': true,
  //         'vip': '',
  //         'relation': '管理',
  //         'cirelationuuid': 'e34357a19ab94409a58e4a3df2b93ea2',
  //         'currentUpuuid': 'cu2704bbea9847d1b745e9e5d33d8732',
  //         'currentCitypeuuid': '22e21df197c64bc6b7c6eacc1ee418eb',
  //         'itAsset': true,
  //         'typekey': 'windows'
  //       }
  //     }, {
  //       'fromId': 'cu2704bbea9847d1b745e9e5d33d8732',
  //       'name': 'junwei-PC',
  //       'id': '33bfd01493f74f0285f1368d24acbf3c',
  //       'data': {
  //         'ciType': 'Windows',
  //         'relId': 'd74bdee49227436296cc85247fedd533',
  //         'imageIcon': '../../../static/images/relationship/Server.png',
  //         'relTypeId': 'ba14bbe07e7a40c6956b60c120f66304',
  //         'canview': true,
  //         'vip': '',
  //         'relation': '管理',
  //         'cirelationuuid': 'd74bdee49227436296cc85247fedd533',
  //         'currentUpuuid': 'cu2704bbea9847d1b745e9e5d33d8732',
  //         'currentCitypeuuid': '22e21df197c64bc6b7c6eacc1ee418eb',
  //         'itAsset': true,
  //         'typekey': 'windows'
  //       }
  //     }, {
  //       'fromId': 'cu2704bbea9847d1b745e9e5d33d8732',
  //       'name': 'tang-PC',
  //       'id': 'bea8320cd96d4c069f765f7127c6218f',
  //       'data': {
  //         'ciType': 'Windows',
  //         'relId': 'c56745632c814abf9cd769377321f5fb',
  //         'imageIcon': '../../../static/images/relationship/Server.png',
  //         'relTypeId': 'ba14bbe07e7a40c6956b60c120f66304',
  //         'canview': true,
  //         'vip': '',
  //         'relation': '管理',
  //         'cirelationuuid': 'c56745632c814abf9cd769377321f5fb',
  //         'currentUpuuid': 'cu2704bbea9847d1b745e9e5d33d8732',
  //         'currentCitypeuuid': '22e21df197c64bc6b7c6eacc1ee418eb',
  //         'itAsset': true,
  //         'typekey': 'windows'
  //       }
  //     }
  //   ],
  //   'c12704bbea9847d1b745e9e5d33d8731': [
  //     {
  //       'fromId': 'c12704bbea9847d1b745e9e5d33d8731',
  //       'name': 'fanting-PC',
  //       'id': '253a776acb15407ba0d2fc5d85768ac8',
  //       'data': {
  //         'ciType': 'Windows',
  //         'relId': '010916a545e34562a89759a04362cc3b',
  //         'imageIcon': '../../../static/images/relationship/Server.png',
  //         'relTypeId': '86b4b5c3fdb04c019f94484a7fc7370f',
  //         'canview': true,
  //         'vip': '',
  //         'relation': '包含',
  //         'cirelationuuid': '010916a545e34562a89759a04362cc3b',
  //         'currentUpuuid': 'c12704bbea9847d1b745e9e5d33d8731',
  //         'currentCitypeuuid': '22e21df197c64bc6b7c6eacc1ee418eb',
  //         'itAsset': true,
  //         'typekey': 'windows'
  //       }
  //     }, {
  //       'fromId': 'c12704bbea9847d1b745e9e5d33d8731',
  //       'name': 'qingcheng-PC',
  //       'id': '276162d353234f779fc489e22c72fa19',
  //       'data': {
  //         'ciType': 'Windows',
  //         'relId': '559b8365a4a34371b307c7b32608450d',
  //         'imageIcon': '../../../static/images/relationship/Server.png',
  //         'relTypeId': '86b4b5c3fdb04c019f94484a7fc7370f',
  //         'canview': true,
  //         'vip': '',
  //         'relation': '包含',
  //         'cirelationuuid': '559b8365a4a34371b307c7b32608450d',
  //         'currentUpuuid': 'c12704bbea9847d1b745e9e5d33d8731',
  //         'currentCitypeuuid': '22e21df197c64bc6b7c6eacc1ee418eb',
  //         'itAsset': true,
  //         'typekey': 'windows'
  //       }
  //     }, {
  //       'fromId': 'c12704bbea9847d1b745e9e5d33d8731',
  //       'name': 'ldy-PC',
  //       'id': 'f2edb05e04cd48868926c0cf5ad56518',
  //       'data': {
  //         'ciType': 'Windows',
  //         'relId': '83a1eaf621dd475cb29de5c255258f5c',
  //         'imageIcon': '../../../static/images/relationship/Server.png',
  //         'relTypeId': '86b4b5c3fdb04c019f94484a7fc7370f',
  //         'canview': true,
  //         'vip': '',
  //         'relation': '包含',
  //         'cirelationuuid': '83a1eaf621dd475cb29de5c255258f5c',
  //         'currentUpuuid': 'c12704bbea9847d1b745e9e5d33d8731',
  //         'currentCitypeuuid': '22e21df197c64bc6b7c6eacc1ee418eb',
  //         'itAsset': true,
  //         'typekey': 'windows'
  //       }
  //     }
  //   ]
  // };
  let graphObj = rootData;
  let rootObj = {};

  function createJson(graphObj) {
    for (let key in graphObj) {
      processData(graphObj[key]);
    }
    rootObj = relationFromIdMap.get('root_root')[0];
    fillRootAndChildren(rootObj);
    return rootObj;
  }

  function fillRootAndChildren(obj) {
    let children = relationFromIdMap.get(obj.id);
    if (typeof children !== 'undefined') {
      obj.children = Array.from(children);
      for (let i = 0; i < children.length; i++) {
        fillRootAndChildren(obj.children[i])
      }
    }
  }

  var initGraph = function () {
    createJson(graphObj);
    st.loadJSON(rootObj);
    st.compute();
    st.geom.translate(new window.$jit.Complex(-200, 0), 'current');
    $activeNode = st.root;
    st.onClick(st.root, {
      Move: {
        enable: true,
        offsetX: 300,
        offsetY: 0
      },
      onComplete: function () {
        L = true;
        m(config.loadAnimated);
        L = false;
      }
    });
  };

  initGraph();

  $infoPanel.mouseover(function(W) {
    if ($infoData.fadeTimer) {
      resetTimer($infoData.fadeTimer);
    }
    if ($infoData.hoverTimer) {
      resetTimer($infoData.hoverTimer);
    }
  }).mouseout(function(W) {
    if ($infoData.blocked) {
      return;
    }
    if ($infoData.fadeTimer) {
      resetTimer($infoData.fadeTimer);
    }
    if ($infoData.hoverTimer) {
      resetTimer($infoData.hoverTimer);
    }
    $infoData.fadeTimer = setTimeout(function() {
      resetTimer($infoData.fadeTimer);
      hideInfoPanel();
    }, infoProp.fadeTime);
  });

  function hideAttrPanel() {
    if ($attrPanel) {
      $attrPanel.hide();
    }
  }

  function showInfoPanel(X, Z) {
    if (st.busy) {
      return;
    }
    if ($infoData.nodeId === X.id) {
      return;
    }
    if (Z) {
      $infoData.blocked = true;
    }
    $infoData.nodeId = X.id;
    var ad = $(st.labels.getLabel(X.id));
    var ag = X.data.ciType ? X.data.ciType : '';
    $infoPanel.find('.desc_title').html("<img src='./" + X.data.imageIcon + "' width='48px' height='48px'  />" + '<h2>' + ag + "</h2><a class='desc-title-link' href='javascript:void(0)'>" + X.name + '</a>').click(hideInfoPanel);
    var ah = $infoPanel.find('.desc_moreinfo');
    ah.html('');
    if (X.data.ciIncident) {
      var ai = '';
      $.each(X.data.ciIncident, function(aj, ak) {
        ai += '<li>' + ak + '</li>';
      });
      ah.html('<h4>Incidents</h4><ul>' + ai + '</ul>');
    }
    if (X.data.ciAttribute) {
      for (var x in X.data.ciAttribute) {
        $attrInfo.html('<li>' + x + ': ' + X.data.ciAttribute[x] + '</li>');
      }
    }
    var af = $('td.work_viewshade:visible').css('padding-top');
    var Y = -6;
    var ae = af ? ad.position().top + af.substr(0, af.indexOf('px')) + Y : ad.position().top;
    var left = parseInt(ad.css('left'));
    var ac = {
      top: ae + 54 + $('.jit-assetnode-inner').height() - $('#headBar').height() + $('.graphMenu').height(),
      display: 'block',
      left: left,
      marginTop: '20px'
    };
    var ab = {
      opacity: 1
    };
    $infoPanel.show();
    $infoPanel.stop().css(ac);
    $infoPanel.animate(ab, 300, function() {
      $infoData.blocked = false;
    });
    config.onShowTip(X);
  }

  function hideInfoPanel() {
    $infoData.nodeId = null;
    $infoPanel.stop().animate({
      opacity: 0
    }, 300, function() {
      $infoPanel.css('display', 'none');
    });
  }

  var S = 1;
  var R = 1;
  $('#zoomin').click(function() {
    zoomGraph(1.1, 1.1);
  });
  $('#zoomout').click(function() {
    zoomGraph(0.9, 0.9);
  });
  $('#zoomreset').click(function() {
    resetGraph();
  });

  function resetGraph() {
    var canvasContainer = $('#' + t);
    st.config.offsetX = 0;
    st.config.offsetY = 0;
    st.canvas.resize(canvasContainer.width(), canvasContainer.height());
    S = 1;
    R = 1;
    D();
  }
  // 缩放图
  function zoomGraph(X, W) {
    st.canvas.scale(X, W);
    S *= X;
    R *= W;
    D();
  }
  // 缩放标签
  function D() {
    $.each(st.labels.labels, function(W, Y) {
      var X = st.graph.getNode(this.id);
      lableStyle(X, this);
    });
  }

  function lableStyle(node, label) {
    if (!node) {
      return;
    }
    var width = node.getData('width');
    var height = node.getData('height');
    var Y = parseInt(width * S);
    var ab = parseInt(height * R);
    var W = 100 * S;
    var pos = $(label).position();
    pos.left = parseInt((width / 2) - (Y / 2));
    pos.top = parseInt((height / 2) - (ab / 2));
    $(label).css({
      marginLeft: pos.left,
      marginTop: pos.top,
      width: Y,
      height: ab,
      fontSize: W + '%'
    });
  }
  window.onresize = function(X) {
    var W = {
      x: S,
      y: R
    };
    resetGraph();
    zoomGraph(W.x, W.y);
  };
  return {
    getRelList: function() {
      return U;
    },
    getParentList: function(W) {
      return d.get(W).parents.keys();
    },
    getChildList: function(W) {
      return d.get(W).children.keys();
    },
    getGraphNode: function(W) {
      return d.get(W).children.keys();
    },
    setHoverList: function(W) {
      this.hoverList = W;
    },
    setHovered: function() {
      r = true;
    },
    plot: function() {
      st.plot();
    },
    isRendered: function(W) {
      if (U.get(W)) {
        return true;
      } else {
        return false;
      }
    },
    addRelation: function(Y, X) {
      processData(X);
      var W = g(Y);
      st.addSubtree(W, 'replot');
      st.onClick(Y);
    },
    clickNode: function(W) {
      $activeNode = W;
      $replot = true;
      st.onClick(W);
    },
    reInit: function() {
      relationFromIdMap = new Map();
      relationFromIdMap.set('tree', []);
      assetFromIdMap = new Map();
      assetFromIdMap.set('edges', []);
      U = new Map();
      d = new Map();
      relationIdMap = new Map();
    },
    st: st,
    infoPanel: $infoPanel,
    infoData: $infoData
  };
}

export default {
  createViz: createViz
};
