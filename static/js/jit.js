(function() {
  window.$jit = function(C) {
    C = C || window;
    for (var D in $jit) {
      if ($jit[D].$extend) {
        C[D] = $jit[D]
      }
    }
  };
  $jit.version = "2.0.0b";
  var e = function(C) {
    return document.getElementById(C)
  };
  e.empty = function() {};
  e.extend = function(E, C) {
    for (var D in (C || {})) {
      E[D] = C[D]
    }
    return E
  };
  e.lambda = function(C) {
    return (typeof C == "function") ? C : function() {
      return C
    }
  };
  e.time = Date.now || function() {
      return +new Date
    };
  e.splat = function(D) {
    var C = e.type(D);
    return C ? ((C != "array") ? [D] : D) : []
  };
  e.type = function(D) {
    var C = e.type.s.call(D).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
    if (C != "object") {
      return C
    }
    if (D && D.$$family) {
      return D.$$family
    }
    return (D && D.nodeName && D.nodeType == 1) ? "element" : C
  };
  e.type.s = Object.prototype.toString;
  e.each = function(H, G) {
    var F = e.type(H);
    if (F == "object") {
      for (var E in H) {
        G(H[E], E)
      }
    } else {
      for (var D = 0, C = H.length; D < C; D++) {
        G(H[D], D)
      }
    }
  };
  e.indexOf = function(F, E) {
    if (Array.indexOf) {
      return F.indexOf(E)
    }
    for (var D = 0, C = F.length; D < C; D++) {
      if (F[D] === E) {
        return D
      }
    }
    return -1
  };
  e.map = function(E, D) {
    var C = [];
    e.each(E, function(G, F) {
      C.push(D(G, F))
    });
    return C
  };
  e.reduce = function(G, E, D) {
    var C = G.length;
    if (C == 0) {
      return D
    }
    var F = arguments.length == 3 ? D : G[--C];
    while (C--) {
      F = E(F, G[C])
    }
    return F
  };
  e.merge = function() {
    var G = {};
    for (var F = 0, C = arguments.length; F < C; F++) {
      var D = arguments[F];
      if (e.type(D) != "object") {
        continue
      }
      for (var E in D) {
        var I = D[E],
          H = G[E];
        G[E] = (H && e.type(I) == "object" && e.type(H) == "object") ? e.merge(H, I) : e.unlink(I)
      }
    }
    return G
  };
  e.unlink = function(E) {
    var D;
    switch (e.type(E)) {
      case "object":
        D = {};
        for (var G in E) {
          D[G] = e.unlink(E[G])
        }
        break;
      case "array":
        D = [];
        for (var F = 0, C = E.length; F < C; F++) {
          D[F] = e.unlink(E[F])
        }
        break;
      default:
        return E
    }
    return D
  };
  e.zip = function() {
    if (arguments.length === 0) {
      return []
    }
    for (var E = 0, D = [], C = arguments.length, H = arguments[0].length; E < H; E++) {
      for (var F = 0, G = []; F < C; F++) {
        G.push(arguments[F][E])
      }
      D.push(G)
    }
    return D
  };
  e.rgbToHex = function(G, F) {
    if (G.length < 3) {
      return null
    }
    if (G.length == 4 && G[3] == 0 && !F) {
      return "transparent"
    }
    var D = [];
    for (var C = 0; C < 3; C++) {
      var E = (G[C] - 0).toString(16);
      D.push(E.length == 1 ? "0" + E : E)
    }
    return F ? D : "#" + D.join("")
  };
  e.hexToRgb = function(E) {
    if (E.length != 7) {
      E = E.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
      E.shift();
      if (E.length != 3) {
        return null
      }
      var C = [];
      for (var D = 0; D < 3; D++) {
        var F = E[D];
        if (F.length == 1) {
          F += F
        }
        C.push(parseInt(F, 16))
      }
      return C
    } else {
      E = parseInt(E.slice(1), 16);
      return [E >> 16, E >> 8 & 255, E & 255]
    }
  };
  e.destroy = function(C) {
    e.clean(C);
    if (C.parentNode) {
      C.parentNode.removeChild(C)
    }
    if (C.clearAttributes) {
      C.clearAttributes()
    }
  };
  e.clean = function(F) {
    for (var E = F.childNodes, D = 0, C = E.length; D < C; D++) {
      e.destroy(E[D])
    }
  };
  e.addEvent = function(E, D, C) {
    if (E.addEventListener) {
      E.addEventListener(D, C, false)
    } else {
      E.attachEvent("on" + D, C)
    }
  };
  e.addEvents = function(D, E) {
    for (var C in E) {
      e.addEvent(D, C, E[C])
    }
  };
  e.hasClass = function(D, C) {
    return (" " + D.className + " ").indexOf(" " + C + " ") > -1
  };
  e.addClass = function(D, C) {
    if (!e.hasClass(D, C)) {
      D.className = (D.className + " " + C)
    }
  };
  e.removeClass = function(D, C) {
    D.className = D.className.replace(new RegExp("(^|\\s)" + C + "(?:\\s|$)"), "$1")
  };
  e.getPos = function(E) {
    var H = G(E);
    var C = F(E);
    return {
      x: H.x - C.x,
      y: H.y - C.y
    };

    function G(J) {
      var I = {
        x: 0,
        y: 0
      };
      while (J && !D(J)) {
        I.x += J.offsetLeft;
        I.y += J.offsetTop;
        J = J.offsetParent
      }
      return I
    }

    function F(J) {
      var I = {
        x: 0,
        y: 0
      };
      while (J && !D(J)) {
        I.x += J.scrollLeft;
        I.y += J.scrollTop;
        J = J.parentNode
      }
      return I
    }

    function D(I) {
      return (/^(?:body|html)$/i).test(I.tagName)
    }
  };
  e.event = {
    get: function(D, C) {
      C = C || window;
      return D || C.event
    },
    getWheel: function(C) {
      return C.wheelDelta ? C.wheelDelta / 120 : -(C.detail || 0) / 3
    },
    isRightClick: function(C) {
      return (C.which == 3 || C.button == 2)
    },
    getPos: function(F, E) {
      E = E || window;
      F = F || E.event;
      var D = E.document;
      D = D.documentElement || D.body;
      if (F.touches && F.touches.length) {
        F = F.touches[0]
      }
      var C = {
        x: F.pageX || (F.clientX + D.scrollLeft),
        y: F.pageY || (F.clientY + D.scrollTop)
      };
      return C
    },
    stop: function(C) {
      if (C.stopPropagation) {
        C.stopPropagation()
      }
      C.cancelBubble = true;
      if (C.preventDefault) {
        C.preventDefault()
      } else {
        C.returnValue = false
      }
    }
  };
  $jit.util = $jit.id = e;
  var t = function(D) {
    D = D || {};
    var C = function() {
      for (var G in this) {
        if (typeof this[G] != "function") {
          this[G] = e.unlink(this[G])
        }
      }
      this.constructor = C;
      if (t.prototyping) {
        return this
      }
      var F = this.initialize ? this.initialize.apply(this, arguments) : this;
      this.$$family = "class";
      return F
    };
    for (var E in t.Mutators) {
      if (!D[E]) {
        continue
      }
      D = t.Mutators[E](D, D[E]);
      delete D[E]
    }
    e.extend(C, this);
    C.constructor = t;
    C.prototype = D;
    return C
  };
  t.Mutators = {
    Implements: function(C, D) {
      e.each(e.splat(D), function(F) {
        t.prototyping = F;
        var E = (typeof F == "function") ? new F : F;
        for (var G in E) {
          if (!(G in C)) {
            C[G] = E[G]
          }
        }
        delete t.prototyping
      });
      return C
    }
  };
  e.extend(t, {
    inherit: function(C, F) {
      for (var E in F) {
        var D = F[E];
        var H = C[E];
        var G = e.type(D);
        if (H && G == "function") {
          if (D != H) {
            t.override(C, E, D)
          }
        } else {
          if (G == "object") {
            C[E] = e.merge(H, D)
          } else {
            C[E] = D
          }
        }
      }
      return C
    },
    override: function(D, C, G) {
      var F = t.prototyping;
      if (F && D[C] != F[C]) {
        F = null
      }
      var E = function() {
        var H = this.parent;
        this.parent = F ? F[C] : D[C];
        var I = G.apply(this, arguments);
        this.parent = H;
        return I
      };
      D[C] = E
    }
  });
  t.prototype.implement = function() {
    var C = this.prototype;
    e.each(Array.prototype.slice.call(arguments || []), function(D) {
      t.inherit(C, D)
    });
    return this
  };
  $jit.Class = t;
  $jit.json = {
    prune: function(D, C) {
      this.each(D, function(F, E) {
        if (E == C && F.children) {
          delete F.children;
          F.children = []
        }
      })
    },
    getParent: function(C, G) {
      if (C.id == G) {
        return false
      }
      var F = C.children;
      if (F && F.length > 0) {
        for (var E = 0; E < F.length; E++) {
          if (F[E].id == G) {
            return C
          } else {
            var D = this.getParent(F[E], G);
            if (D) {
              return D
            }
          }
        }
      }
      return false
    },
    getSubtree: function(C, G) {
      if (C.id == G) {
        return C
      }
      for (var E = 0, F = C.children; E < F.length; E++) {
        var D = this.getSubtree(F[E], G);
        if (D != null) {
          return D
        }
      }
      return null
    },
    eachLevel: function(C, H, E, G) {
      if (H <= E) {
        G(C, H);
        if (!C.children) {
          return
        }
        for (var D = 0, F = C.children; D < F.length; D++) {
          this.eachLevel(F[D], H + 1, E, G)
        }
      }
    },
    each: function(C, D) {
      this.eachLevel(C, 0, Number.MAX_VALUE, D)
    }
  };
  $jit.Trans = {
    $extend: true,
    linear: function(C) {
      return C
    }
  };
  var l = $jit.Trans;
  (function() {
    var C = function(F, E) {
      E = e.splat(E);
      return e.extend(F, {
        easeIn: function(G) {
          return F(G, E)
        },
        easeOut: function(G) {
          return 1 - F(1 - G, E)
        },
        easeInOut: function(G) {
          return (G <= 0.5) ? F(2 * G, E) / 2 : (2 - F(2 * (1 - G), E)) / 2
        }
      })
    };
    var D = {
      Pow: function(F, E) {
        return Math.pow(F, E[0] || 6)
      },
      Expo: function(E) {
        return Math.pow(2, 8 * (E - 1))
      },
      Circ: function(E) {
        return 1 - Math.sin(Math.acos(E))
      },
      Sine: function(E) {
        return 1 - Math.sin((1 - E) * Math.PI / 2)
      },
      Back: function(F, E) {
        E = E[0] || 1.618;
        return Math.pow(F, 2) * ((E + 1) * F - E)
      },
      Bounce: function(H) {
        var G;
        for (var F = 0, E = 1; 1; F += E, E /= 2) {
          if (H >= (7 - 4 * F) / 11) {
            G = E * E - Math.pow((11 - 6 * F - 11 * H) / 4, 2);
            break
          }
        }
        return G
      },
      Elastic: function(F, E) {
        return Math.pow(2, 10 * --F) * Math.cos(20 * F * Math.PI * (E[0] || 1) / 3)
      }
    };
    e.each(D, function(F, E) {
      l[E] = C(F)
    });
    e.each(["Quad", "Cubic", "Quart", "Quint"], function(F, E) {
      l[F] = C(function(G) {
        return Math.pow(G, [E + 2])
      })
    })
  })();
  var A = new t({
    initialize: function(C) {
      this.setOptions(C)
    },
    setOptions: function(C) {
      var D = {
        duration: 2500,
        fps: 40,
        transition: l.Quart.easeInOut,
        compute: e.empty,
        complete: e.empty,
        link: "ignore"
      };
      this.opt = e.merge(D, C || {});
      return this
    },
    step: function() {
      var D = e.time(),
        C = this.opt;
      if (D < this.time + C.duration) {
        var E = C.transition((D - this.time) / C.duration);
        C.compute(E)
      } else {
        this.timer = clearInterval(this.timer);
        C.compute(1);
        C.complete()
      }
    },
    start: function() {
      if (!this.check()) {
        return this
      }
      this.time = 0;
      this.startTimer();
      return this
    },
    startTimer: function() {
      var C = this,
        D = this.opt.fps;
      if (this.timer) {
        return false
      }
      this.time = e.time() - this.time;
      this.timer = setInterval((function() {
        C.step()
      }), Math.round(1000 / D));
      return true
    },
    pause: function() {
      this.stopTimer();
      return this
    },
    resume: function() {
      this.startTimer();
      return this
    },
    stopTimer: function() {
      if (!this.timer) {
        return false
      }
      this.time = e.time() - this.time;
      this.timer = clearInterval(this.timer);
      return true
    },
    check: function() {
      if (!this.timer) {
        return true
      }
      if (this.opt.link == "cancel") {
        this.stopTimer();
        return true
      }
      return false
    }
  });
  var q = function() {
    var E = arguments;
    for (var G = 0, C = E.length, D = {}; G < C; G++) {
      var F = q[E[G]];
      if (F.$extend) {
        e.extend(D, F)
      } else {
        D[E[G]] = F
      }
    }
    return D
  };
  q.AreaChart = {
    $extend: true,
    animate: true,
    labelOffset: 3,
    type: "stacked",
    Tips: {
      enable: false,
      onShow: e.empty,
      onHide: e.empty
    },
    Events: {
      enable: false,
      onClick: e.empty
    },
    selectOnHover: true,
    showAggregates: true,
    showLabels: true,
    filterOnClick: false,
    restoreOnRightClick: false
  };
  q.Margin = {
    $extend: false,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
  q.Canvas = {
    $extend: true,
    injectInto: "id",
    width: false,
    height: false,
    useCanvas: false,
    withLabels: true,
    background: false
  };
  q.Tree = {
    $extend: true,
    orientation: "left",
    subtreeOffset: 8,
    siblingOffset: 5,
    indent: 10,
    multitree: false,
    align: "center"
  };
  q.Node = {
    $extend: false,
    overridable: false,
    type: "circle",
    color: "#ccb",
    alpha: 1,
    dim: 3,
    height: 20,
    width: 90,
    autoHeight: false,
    autoWidth: false,
    lineWidth: 1,
    transform: true,
    align: "center",
    angularWidth: 1,
    span: 1,
    CanvasStyles: {}
  };
  q.Edge = {
    $extend: false,
    overridable: false,
    type: "line",
    color: "#ccb",
    lineWidth: 1,
    dim: 15,
    alpha: 1,
    epsilon: 7,
    CanvasStyles: {}
  };
  q.Fx = {
    $extend: true,
    fps: 40,
    duration: 2500,
    transition: $jit.Trans.Quart.easeInOut,
    clearCanvas: true
  };
  q.Label = {
    $extend: false,
    overridable: false,
    type: "HTML",
    style: " ",
    size: 10,
    family: "sans-serif",
    textAlign: "center",
    textBaseline: "alphabetic",
    color: "#fff"
  };
  q.Tips = {
    $extend: false,
    enable: false,
    type: "auto",
    offsetX: 20,
    offsetY: 20,
    force: false,
    onShow: e.empty,
    onHide: e.empty
  };
  q.NodeStyles = {
    $extend: false,
    enable: false,
    type: "auto",
    stylesHover: false,
    stylesClick: false
  };
  q.Events = {
    $extend: false,
    enable: false,
    enableForEdges: false,
    type: "auto",
    onClick: e.empty,
    onRightClick: e.empty,
    onMouseMove: e.empty,
    onMouseEnter: e.empty,
    onMouseLeave: e.empty,
    onDragStart: e.empty,
    onDragMove: e.empty,
    onDragCancel: e.empty,
    onDragEnd: e.empty,
    onTouchStart: e.empty,
    onTouchMove: e.empty,
    onTouchEnd: e.empty,
    onMouseWheel: e.empty
  };
  q.Navigation = {
    $extend: false,
    enable: false,
    type: "auto",
    panning: false,
    zooming: false
  };
  q.Controller = {
    $extend: true,
    onBeforeCompute: e.empty,
    onAfterCompute: e.empty,
    onCreateLabel: e.empty,
    onPlaceLabel: e.empty,
    onComplete: e.empty,
    onBeforePlotLine: e.empty,
    onAfterPlotLine: e.empty,
    onBeforePlotNode: e.empty,
    onAfterPlotNode: e.empty,
    request: false
  };
  var z = {
    initialize: function(E, C) {
      this.viz = C;
      this.canvas = C.canvas;
      this.config = C.config[E];
      this.nodeTypes = C.fx.nodeTypes;
      var D = this.config.type;
      this.dom = D == "auto" ? (C.config.Label.type != "Native") : (D != "Native");
      this.labelContainer = this.dom && C.labels.getLabelContainer();
      this.isEnabled() && this.initializePost()
    },
    initializePost: e.empty,
    setAsProperty: e.lambda(false),
    isEnabled: function() {
      return this.config.enable
    },
    isLabel: function(F, E) {
      F = e.event.get(F, E);
      var C = this.labelContainer,
        D = F.target || F.srcElement;
      if (D && D.parentNode == C) {
        return D
      }
      return false
    }
  };
  var k = {
    onMouseUp: e.empty,
    onMouseDown: e.empty,
    onMouseMove: e.empty,
    onMouseOver: e.empty,
    onMouseOut: e.empty,
    onMouseWheel: e.empty,
    onTouchStart: e.empty,
    onTouchMove: e.empty,
    onTouchEnd: e.empty,
    onTouchCancel: e.empty
  };
  var v = new t({
    initialize: function(C) {
      this.viz = C;
      this.canvas = C.canvas;
      this.node = false;
      this.edge = false;
      this.registeredObjects = [];
      this.attachEvents()
    },
    attachEvents: function() {
      var E = this.canvas.getElement(),
        D = this;
      E.oncontextmenu = e.lambda(false);
      e.addEvents(E, {
        mouseup: function(H, G) {
          var F = e.event.get(H, G);
          D.handleEvent("MouseUp", H, G, D.makeEventObject(H, G), e.event.isRightClick(F))
        },
        mousedown: function(H, G) {
          var F = e.event.get(H, G);
          D.handleEvent("MouseDown", H, G, D.makeEventObject(H, G), e.event.isRightClick(F))
        },
        mousemove: function(G, F) {
          D.handleEvent("MouseMove", G, F, D.makeEventObject(G, F))
        },
        mouseover: function(G, F) {
          D.handleEvent("MouseOver", G, F, D.makeEventObject(G, F))
        },
        mouseout: function(G, F) {
          D.handleEvent("MouseOut", G, F, D.makeEventObject(G, F))
        },
        touchstart: function(G, F) {
          D.handleEvent("TouchStart", G, F, D.makeEventObject(G, F))
        },
        touchmove: function(G, F) {
          D.handleEvent("TouchMove", G, F, D.makeEventObject(G, F))
        },
        touchend: function(G, F) {
          D.handleEvent("TouchEnd", G, F, D.makeEventObject(G, F))
        }
      });
      var C = function(I, H) {
        var G = e.event.get(I, H);
        var F = e.event.getWheel(G);
        D.handleEvent("MouseWheel", I, H, F)
      };
      if (!document.getBoxObjectFor && window.mozInnerScreenX == null) {
        e.addEvent(E, "mousewheel", C)
      } else {
        E.addEventListener("DOMMouseScroll", C, false)
      }
    },
    register: function(C) {
      this.registeredObjects.push(C)
    },
    handleEvent: function() {
      var D = Array.prototype.slice.call(arguments),
        G = D.shift();
      for (var F = 0, E = this.registeredObjects, C = E.length; F < C; F++) {
        E[F]["on" + G].apply(E[F], D)
      }
    },
    makeEventObject: function(I, H) {
      var F = this,
        G = this.viz.graph,
        E = this.viz.fx,
        D = E.nodeTypes,
        C = E.edgeTypes;
      return {
        pos: false,
        node: false,
        edge: false,
        contains: false,
        getNodeCalled: false,
        getEdgeCalled: false,
        getPos: function() {
          var L = F.viz.canvas,
            M = L.getSize(),
            N = L.getPos(),
            K = L.translateOffsetX,
            J = L.translateOffsetY,
            Q = L.scaleOffsetX,
            O = L.scaleOffsetY,
            P = e.event.getPos(I, H);
          this.pos = {
            x: (P.x - N.x - M.width / 2 - K) * 1 / Q,
            y: (P.y - N.y - M.height / 2 - J) * 1 / O
          };
          return this.pos
        },
        getNode: function() {
          if (this.getNodeCalled) {
            return this.node
          }
          this.getNodeCalled = true;
          for (var M in G.nodes) {
            var L = G.nodes[M],
              K = L && D[L.getData("type")],
              J = K && K.contains && K.contains.call(E, L, this.getPos());
            if (J) {
              this.contains = J;
              return F.node = this.node = L
            }
          }
          return F.node = this.node = false
        },
        getEdge: function() {
          if (this.getEdgeCalled) {
            return this.edge
          }
          this.getEdgeCalled = true;
          var L = {};
          for (var P in G.edges) {
            var N = G.edges[P];
            L[P] = true;
            for (var O in N) {
              if (O in L) {
                continue
              }
              var M = N[O],
                K = M && C[M.getData("type")],
                J = K && K.contains && K.contains.call(E, M, this.getPos());
              if (J) {
                this.contains = J;
                return F.edge = this.edge = M
              }
            }
          }
          return F.edge = this.edge = false
        },
        getContains: function() {
          if (this.getNodeCalled) {
            return this.contains
          }
          this.getNode();
          return this.contains
        }
      }
    }
  });
  var r = {
    initializeExtras: function() {
      var D = new v(this),
        C = this;
      e.each(["NodeStyles", "Tips", "Navigation", "Events"], function(E) {
        var F = new r.Classes[E](E, C);
        if (F.isEnabled()) {
          D.register(F)
        }
        if (F.setAsProperty()) {
          C[E.toLowerCase()] = F
        }
      })
    }
  };
  r.Classes = {};
  r.Classes.Events = new t({
    Implements: [z, k],
    initializePost: function() {
      this.fx = this.viz.fx;
      this.ntypes = this.viz.fx.nodeTypes;
      this.etypes = this.viz.fx.edgeTypes;
      this.hovered = false;
      this.pressed = false;
      this.touched = false;
      this.touchMoved = false;
      this.moved = false
    },
    setAsProperty: e.lambda(true),
    onMouseUp: function(G, F, D, E) {
      var C = e.event.get(G, F);
      if (!this.moved) {
        if (E) {
          this.config.onRightClick(this.hovered, D, C)
        } else {
          this.config.onClick(this.pressed, D, C)
        }
      }
      if (this.pressed) {
        if (this.moved) {
          this.config.onDragEnd(this.pressed, D, C)
        } else {
          this.config.onDragCancel(this.pressed, D, C)
        }
        this.pressed = this.moved = false
      }
    },
    onMouseOut: function(H, G, F) {
      var D = e.event.get(H, G),
        E;
      if (this.dom && (E = this.isLabel(H, G))) {
        this.config.onMouseLeave(this.viz.graph.getNode(E.id), F, D);
        this.hovered = false;
        return
      }
      var C = D.relatedTarget,
        I = this.canvas.getElement();
      while (C && C.parentNode) {
        if (I == C.parentNode) {
          return
        }
        C = C.parentNode
      }
      if (this.hovered) {
        this.config.onMouseLeave(this.hovered, F, D);
        this.hovered = false
      }
    },
    onMouseOver: function(G, F, E) {
      var C = e.event.get(G, F),
        D;
      if (this.dom && (D = this.isLabel(G, F))) {
        this.hovered = this.viz.graph.getNode(D.id);
        this.config.onMouseEnter(this.hovered, E, C)
      }
    },
    onMouseMove: function(I, H, G) {
      var D, C = e.event.get(I, H);
      if (this.pressed) {
        this.moved = true;
        this.config.onDragMove(this.pressed, G, C);
        return
      }
      if (this.dom) {
        this.config.onMouseMove(this.hovered, G, C)
      } else {
        if (this.hovered) {
          var J = this.hovered;
          var F = J.nodeFrom ? this.etypes[J.getData("type")] : this.ntypes[J.getData("type")];
          var E = F && F.contains && F.contains.call(this.fx, J, G.getPos());
          if (E) {
            this.config.onMouseMove(J, G, C);
            return
          } else {
            this.config.onMouseLeave(J, G, C);
            this.hovered = false
          }
        }
        if (this.hovered = (G.getNode() || (this.config.enableForEdges && G.getEdge()))) {
          this.config.onMouseEnter(this.hovered, G, C)
        } else {
          this.config.onMouseMove(false, G, C)
        }
      }
    },
    onMouseWheel: function(D, C, E) {
      this.config.onMouseWheel(E, e.event.get(D, C))
    },
    onMouseDown: function(F, E, D) {
      var C = e.event.get(F, E);
      this.pressed = D.getNode() || (this.config.enableForEdges && D.getEdge());
      this.config.onDragStart(this.pressed, D, C)
    },
    onTouchStart: function(F, E, D) {
      var C = e.event.get(F, E);
      this.touched = D.getNode() || (this.config.enableForEdges && D.getEdge());
      this.config.onTouchStart(this.touched, D, C)
    },
    onTouchMove: function(F, E, D) {
      var C = e.event.get(F, E);
      if (this.touched) {
        this.touchMoved = true;
        this.config.onTouchMove(this.touched, D, C)
      }
    },
    onTouchEnd: function(F, E, D) {
      var C = e.event.get(F, E);
      if (this.touched) {
        if (this.touchMoved) {
          this.config.onTouchEnd(this.touched, D, C)
        } else {
          this.config.onTouchCancel(this.touched, D, C)
        }
        this.touched = this.touchMoved = false
      }
    }
  });
  r.Classes.Tips = new t({
    Implements: [z, k],
    initializePost: function() {
      if (document.body) {
        var C = e("_tooltip") || document.createElement("div");
        C.id = "_tooltip";
        C.className = "tip";
        e.extend(C.style, {
          position: "absolute",
          display: "none",
          zIndex: 13000
        });
        document.body.appendChild(C);
        this.tip = C;
        this.node = false
      }
    },
    setAsProperty: e.lambda(true),
    onMouseOut: function(E, D) {
      if (this.dom && this.isLabel(E, D)) {
        this.hide(true);
        return
      }
      var C = E.relatedTarget,
        F = this.canvas.getElement();
      while (C && C.parentNode) {
        if (F == C.parentNode) {
          return
        }
        C = C.parentNode
      }
      this.hide(false)
    },
    onMouseOver: function(E, D) {
      var C;
      if (this.dom && (C = this.isLabel(E, D))) {
        this.node = this.viz.graph.getNode(C.id);
        this.config.onShow(this.tip, this.node, C)
      }
    },
    onMouseMove: function(F, E, C) {
      if (this.dom && this.isLabel(F, E)) {
        this.setTooltipPosition(e.event.getPos(F, E))
      }
      if (!this.dom) {
        var D = C.getNode();
        if (!D) {
          this.hide(true);
          return
        }
        if (this.config.force || !this.node || this.node.id != D.id) {
          this.node = D;
          this.config.onShow(this.tip, D, C.getContains())
        }
        this.setTooltipPosition(e.event.getPos(F, E))
      }
    },
    setTooltipPosition: function(J) {
      var F = this.tip,
        E = F.style,
        D = this.config;
      E.display = "";
      var H = {
        height: document.body.clientHeight,
        width: document.body.clientWidth
      };
      var G = {
        width: F.offsetWidth,
        height: F.offsetHeight
      };
      var C = D.offsetX,
        I = D.offsetY;
      E.top = ((J.y + I + G.height > H.height) ? (J.y - G.height - I) : J.y + I) + "px";
      E.left = ((J.x + G.width + C > H.width) ? (J.x - G.width - C) : J.x + C) + "px"
    },
    hide: function(C) {
      this.tip.style.display = "none";
      C && this.config.onHide()
    }
  });
  r.Classes.NodeStyles = new t({
    Implements: [z, k],
    initializePost: function() {
      this.fx = this.viz.fx;
      this.types = this.viz.fx.nodeTypes;
      this.nStyles = this.config;
      this.nodeStylesOnHover = this.nStyles.stylesHover;
      this.nodeStylesOnClick = this.nStyles.stylesClick;
      this.hoveredNode = false;
      this.fx.nodeFxAnimation = new A();
      this.down = false;
      this.move = false
    },
    onMouseOut: function(E, D) {
      this.down = this.move = false;
      if (!this.hoveredNode) {
        return
      }
      if (this.dom && this.isLabel(E, D)) {
        this.toggleStylesOnHover(this.hoveredNode, false)
      }
      var C = E.relatedTarget,
        F = this.canvas.getElement();
      while (C && C.parentNode) {
        if (F == C.parentNode) {
          return
        }
        C = C.parentNode
      }
      this.toggleStylesOnHover(this.hoveredNode, false);
      this.hoveredNode = false
    },
    onMouseOver: function(F, E) {
      var C;
      if (this.dom && (C = this.isLabel(F, E))) {
        var D = this.viz.graph.getNode(C.id);
        if (D.selected) {
          return
        }
        this.hoveredNode = D;
        this.toggleStylesOnHover(this.hoveredNode, true)
      }
    },
    onMouseDown: function(G, F, D, E) {
      if (E) {
        return
      }
      var C;
      if (this.dom && (C = this.isLabel(G, F))) {
        this.down = this.viz.graph.getNode(C.id)
      } else {
        if (!this.dom) {
          this.down = D.getNode()
        }
      }
      this.move = false
    },
    onMouseUp: function(F, E, C, D) {
      if (D) {
        return
      }
      if (!this.move) {
        this.onClick(C.getNode())
      }
      this.down = this.move = false
    },
    getRestoredStyles: function(D, C) {
      var F = {},
        E = this["nodeStylesOn" + C];
      for (var G in E) {
        F[G] = D.styles["$" + G]
      }
      return F
    },
    toggleStylesOnHover: function(C, D) {
      if (this.nodeStylesOnHover) {
        this.toggleStylesOn("Hover", C, D)
      }
    },
    toggleStylesOnClick: function(C, D) {
      if (this.nodeStylesOnClick) {
        this.toggleStylesOn("Click", C, D)
      }
    },
    toggleStylesOn: function(G, C, I) {
      var J = this.viz;
      var H = this.nStyles;
      if (I) {
        var F = this;
        if (!C.styles) {
          C.styles = e.merge(C.data, {})
        }
        for (var K in this["nodeStylesOn" + G]) {
          var D = "$" + K;
          if (!(D in C.styles)) {
            C.styles[D] = C.getData(K)
          }
        }
        J.fx.nodeFx(e.extend({
          elements: {
            id: C.id,
            properties: F["nodeStylesOn" + G]
          },
          transition: l.Quart.easeOut,
          duration: 300,
          fps: 40
        }, this.config))
      } else {
        var E = this.getRestoredStyles(C, G);
        J.fx.nodeFx(e.extend({
          elements: {
            id: C.id,
            properties: E
          },
          transition: l.Quart.easeOut,
          duration: 300,
          fps: 40
        }, this.config))
      }
    },
    onClick: function(C) {
      if (!C) {
        return
      }
      var D = this.nodeStylesOnClick;
      if (!D) {
        return
      }
      if (C.selected) {
        this.toggleStylesOnClick(C, false);
        delete C.selected
      } else {
        this.viz.graph.eachNode(function(F) {
          if (F.selected) {
            for (var E in D) {
              F.setData(E, F.styles["$" + E], "end")
            }
            delete F.selected
          }
        });
        this.toggleStylesOnClick(C, true);
        C.selected = true;
        delete C.hovered;
        this.hoveredNode = false
      }
    },
    onMouseMove: function(I, H, F) {
      if (this.down) {
        this.move = true
      }
      if (this.dom && this.isLabel(I, H)) {
        return
      }
      var G = this.nodeStylesOnHover;
      if (!G) {
        return
      }
      if (!this.dom) {
        if (this.hoveredNode) {
          var D = this.types[this.hoveredNode.getData("type")];
          var C = D && D.contains && D.contains.call(this.fx, this.hoveredNode, F.getPos());
          if (C) {
            return
          }
        }
        var E = F.getNode();
        if (!this.hoveredNode && !E) {
          return
        }
        if (E.hovered) {
          return
        }
        if (E && !E.selected) {
          this.fx.nodeFxAnimation.stopTimer();
          this.viz.graph.eachNode(function(K) {
            if (K.hovered && !K.selected) {
              for (var J in G) {
                K.setData(J, K.styles["$" + J], "end")
              }
              delete K.hovered
            }
          });
          E.hovered = true;
          this.hoveredNode = E;
          this.toggleStylesOnHover(E, true)
        } else {
          if (this.hoveredNode && !this.hoveredNode.selected) {
            this.fx.nodeFxAnimation.stopTimer();
            this.toggleStylesOnHover(this.hoveredNode, false);
            delete this.hoveredNode.hovered;
            this.hoveredNode = false
          }
        }
      }
    }
  });
  r.Classes.Navigation = new t({
    Implements: [z, k],
    initializePost: function() {
      this.pos = false;
      this.pressed = false
    },
    onMouseWheel: function(F, E, C) {
      if (!this.config.zooming) {
        return
      }
      e.event.stop(e.event.get(F, E));
      var G = this.config.zooming / 1000,
        D = 1 + C * G;
      this.canvas.scale(D, D)
    },
    onMouseDown: function(H, G, F) {
      if (!this.config.panning) {
        return
      }
      if (this.config.panning == "avoid nodes" && F.getNode()) {
        return
      }
      this.pressed = true;
      this.pos = F.getPos();
      var E = this.canvas,
        D = E.translateOffsetX,
        C = E.translateOffsetY,
        J = E.scaleOffsetX,
        I = E.scaleOffsetY;
      this.pos.x *= J;
      this.pos.x += D;
      this.pos.y *= I;
      this.pos.y += C
    },
    onMouseMove: function(H, G, J) {
      if (!this.config.panning) {
        return
      }
      if (!this.pressed) {
        return
      }
      if (this.config.panning == "avoid nodes" && J.getNode()) {
        return
      }
      var F = this.pos,
        I = J.getPos(),
        D = this.canvas,
        E = D.translateOffsetX,
        C = D.translateOffsetY,
        N = D.scaleOffsetX,
        L = D.scaleOffsetY;
      I.x *= N;
      I.y *= L;
      I.x += E;
      I.y += C;
      var M = I.x - F.x,
        K = I.y - F.y;
      this.pos = I;
      this.canvas.translate(M * 1 / N, K * 1 / L)
    },
    onMouseUp: function(F, E, D, C) {
      if (!this.config.panning) {
        return
      }
      this.pressed = false
    }
  });
  var o;
  (function() {
    var C = typeof HTMLCanvasElement,
      E = (C == "object" || C == "function");

    function D(F, G) {
      var H = document.createElement(F);
      for (var I in G) {
        if (typeof G[I] == "object") {
          e.extend(H[I], G[I])
        } else {
          H[I] = G[I]
        }
      }
      if (F == "canvas" && !E && G_vmlCanvasManager) {
        H = G_vmlCanvasManager.initElement(document.body.appendChild(H))
      }
      return H
    }
    $jit.Canvas = o = new t({
      canvases: [],
      pos: false,
      element: false,
      labelContainer: false,
      translateOffsetX: 0,
      translateOffsetY: 0,
      scaleOffsetX: 1,
      scaleOffsetY: 1,
      initialize: function(Q, K) {
        this.viz = Q;
        this.opt = K;
        var H = e.type(K.injectInto) == "string" ? K.injectInto : K.injectInto.id,
          I = H + "-label",
          F = e(H),
          J = K.width || F.offsetWidth,
          R = K.height || F.offsetHeight;
        this.id = H;
        var L = {
          injectInto: H,
          width: J,
          height: R
        };
        this.element = D("div", {
          id: H + "-canvaswidget",
          style: {
            position: "relative",
            width: J + "px",
            height: R + "px"
          }
        });
        this.labelContainer = this.createLabelContainer(K.Label.type, I, L);
        this.canvases.push(new o.Base({
          config: e.extend({
            idSuffix: "-canvas"
          }, L),
          plot: function(S) {
            Q.fx.plot()
          },
          resize: function() {
            Q.refresh()
          }
        }));
        var M = K.background;
        if (M) {
          var P = new o.Background[M.type](Q, e.extend(M, L));
          this.canvases.push(new o.Base(P))
        }
        var O = this.canvases.length;
        while (O--) {
          this.element.appendChild(this.canvases[O].canvas);
          if (O > 0) {
            this.canvases[O].plot()
          }
        }
        this.element.appendChild(this.labelContainer);
        F.appendChild(this.element);
        var G = null,
          N = this;
        e.addEvent(window, "scroll", function() {
          clearTimeout(G);
          G = setTimeout(function() {
            N.getPos(true)
          }, 500)
        })
      },
      getCtx: function(F) {
        return this.canvases[F || 0].getCtx()
      },
      getConfig: function() {
        return this.opt
      },
      getElement: function() {
        return this.element
      },
      getSize: function(F) {
        return this.canvases[F || 0].getSize()
      },
      resize: function(J, F) {
        this.getPos(true);
        this.translateOffsetX = this.translateOffsetY = 0;
        this.scaleOffsetX = this.scaleOffsetY = 1;
        for (var H = 0, G = this.canvases.length; H < G; H++) {
          this.canvases[H].resize(J, F)
        }
        var I = this.element.style;
        I.width = J + "px";
        I.height = F + "px";
        if (this.labelContainer) {
          this.labelContainer.style.width = J + "px"
        }
      },
      translate: function(F, J, I) {
        this.translateOffsetX += F * this.scaleOffsetX;
        this.translateOffsetY += J * this.scaleOffsetY;
        for (var H = 0, G = this.canvases.length; H < G; H++) {
          this.canvases[H].translate(F, J, I)
        }
      },
      scale: function(K, H, I) {
        var L = this.scaleOffsetX * K,
          J = this.scaleOffsetY * H;
        var N = this.translateOffsetX * (K - 1) / L,
          M = this.translateOffsetY * (H - 1) / J;
        this.scaleOffsetX = L;
        this.scaleOffsetY = J;
        for (var G = 0, F = this.canvases.length; G < F; G++) {
          this.canvases[G].scale(K, H, true)
        }
        this.translate(N, M, false)
      },
      getPos: function(F) {
        if (F || !this.pos) {
          return this.pos = e.getPos(this.getElement())
        }
        return this.pos
      },
      clear: function(F) {
        this.canvases[F || 0].clear()
      },
      path: function(G, H) {
        var F = this.canvases[0].getCtx();
        F.beginPath();
        H(F);
        F[G]();
        F.closePath()
      },
      createLabelContainer: function(H, L, K) {
        var J = "http://www.w3.org/2000/svg";
        if (H == "HTML" || H == "Native") {
          return D("div", {
            id: L,
            style: {
              overflow: "visible",
              position: "absolute",
              top: 0,
              left: 0,
              width: K.width + "px",
              height: 0
            }
          })
        } else {
          if (H == "SVG") {
            var I = document.createElementNS(J, "svg:svg");
            I.setAttribute("width", K.width);
            I.setAttribute("height", K.height);
            var G = I.style;
            G.position = "absolute";
            G.left = G.top = "0px";
            var F = document.createElementNS(J, "svg:g");
            F.setAttribute("width", K.width);
            F.setAttribute("height", K.height);
            F.setAttribute("x", 0);
            F.setAttribute("y", 0);
            F.setAttribute("id", L);
            I.appendChild(F);
            return I
          }
        }
      }
    });
    o.Base = new t({
      translateOffsetX: 0,
      translateOffsetY: 0,
      scaleOffsetX: 1,
      scaleOffsetY: 1,
      initialize: function(F) {
        this.viz = F;
        this.opt = F.config;
        this.size = false;
        this.createCanvas();
        this.translateToCenter()
      },
      createCanvas: function() {
        var G = this.opt,
          H = G.width,
          F = G.height;
        this.canvas = D("canvas", {
          id: G.injectInto + G.idSuffix,
          width: H,
          height: F,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: H + "px",
            height: F + "px"
          }
        })
      },
      getCtx: function() {
        if (!this.ctx) {
          return this.ctx = this.canvas.getContext("2d")
        }
        return this.ctx
      },
      getSize: function() {
        if (this.size) {
          return this.size
        }
        var F = this.canvas;
        return this.size = {
          width: F.width,
          height: F.height
        }
      },
      translateToCenter: function(I) {
        var G = this.getSize(),
          H = I ? (G.width - I.width - this.translateOffsetX * 2) : G.width;
        var height = I ? (G.height - I.height - this.translateOffsetY * 2) : G.height;
        var F = this.getCtx();
        I && F.scale(1 / this.scaleOffsetX, 1 / this.scaleOffsetY);
        F.translate(H / 2, height / 2)
      },
      resize: function(I, F) {
        var H = this.getSize(),
          G = this.canvas,
          J = G.style;
        this.size = false;
        G.width = I;
        G.height = F;
        J.width = I + "px";
        J.height = F + "px";
        if (!E) {
          this.translateToCenter(H)
        } else {
          this.translateToCenter()
        }
        this.translateOffsetX = this.translateOffsetY = 0;
        this.scaleOffsetX = this.scaleOffsetY = 1;
        this.clear();
        this.viz.resize(I, F, this)
      },
      translate: function(F, J, G) {
        var I = this.scaleOffsetX,
          H = this.scaleOffsetY;
        this.translateOffsetX += F * I;
        this.translateOffsetY += J * H;
        this.getCtx().translate(F, J);
        !G && this.plot()
      },
      scale: function(F, H, G) {
        this.scaleOffsetX *= F;
        this.scaleOffsetY *= H;
        this.getCtx().scale(F, H);
        !G && this.plot()
      },
      clear: function() {
        var H = this.getSize(),
          G = this.translateOffsetX,
          F = this.translateOffsetY,
          J = this.scaleOffsetX,
          I = this.scaleOffsetY;
        this.getCtx().clearRect((-H.width / 2 - G) * 1 / J, (-H.height / 2 - F) * 1 / I, H.width * 1 / J, H.height * 1 / I)
      },
      plot: function() {
        this.clear();
        this.viz.plot(this)
      }
    });
    o.Background = {};
    o.Background.Circles = new t({
      initialize: function(F, G) {
        this.viz = F;
        this.config = e.merge({
          idSuffix: "-bkcanvas",
          levelDistance: 100,
          numberOfCircles: 6,
          CanvasStyles: {},
          offset: 0
        }, G)
      },
      resize: function(G, F, H) {
        this.plot(H)
      },
      plot: function(F) {
        var G = F.canvas,
          M = F.getCtx(),
          J = this.config,
          L = J.CanvasStyles;
        for (var N in L) {
          M[N] = L[N]
        }
        var H = J.numberOfCircles,
          K = J.levelDistance;
        for (var I = 1; I <= H; I++) {
          M.beginPath();
          M.arc(0, 0, K * I, 0, 2 * Math.PI, false);
          M.stroke();
          M.closePath()
        }
      }
    })
  })();
  var c = function(D, C) {
    this.theta = D;
    this.rho = C
  };
  $jit.Polar = c;
  c.prototype = {
    getc: function(C) {
      return this.toComplex(C)
    },
    getp: function() {
      return this
    },
    set: function(C) {
      C = C.getp();
      this.theta = C.theta;
      this.rho = C.rho
    },
    setc: function(C, D) {
      this.rho = Math.sqrt(C * C + D * D);
      this.theta = Math.atan2(D, C);
      if (this.theta < 0) {
        this.theta += Math.PI * 2
      }
    },
    setp: function(D, C) {
      this.theta = D;
      this.rho = C
    },
    clone: function() {
      return new c(this.theta, this.rho)
    },
    toComplex: function(E) {
      var C = Math.cos(this.theta) * this.rho;
      var D = Math.sin(this.theta) * this.rho;
      if (E) {
        return {
          x: C,
          y: D
        }
      }
      return new s(C, D)
    },
    add: function(C) {
      return new c(this.theta + C.theta, this.rho + C.rho)
    },
    scale: function(C) {
      return new c(this.theta, this.rho * C)
    },
    equals: function(C) {
      return this.theta == C.theta && this.rho == C.rho
    },
    $add: function(C) {
      this.theta = this.theta + C.theta;
      this.rho += C.rho;
      return this
    },
    $madd: function(C) {
      this.theta = (this.theta + C.theta) % (Math.PI * 2);
      this.rho += C.rho;
      return this
    },
    $scale: function(C) {
      this.rho *= C;
      return this
    },
    interpolate: function(E, L) {
      var F = Math.PI,
        I = F * 2;
      var D = function(N) {
        var M = (N < 0) ? (N % I) + I : N % I;
        return M
      };
      var H = this.theta,
        K = E.theta;
      var G, J = Math.abs(H - K);
      if (J == F) {
        if (H > K) {
          G = D((K + ((H - I) - K) * L))
        } else {
          G = D((K - I + (H - (K)) * L))
        }
      } else {
        if (J >= F) {
          if (H > K) {
            G = D((K + ((H - I) - K) * L))
          } else {
            G = D((K - I + (H - (K - I)) * L))
          }
        } else {
          G = D((K + (H - K) * L))
        }
      }
      var C = (this.rho - E.rho) * L + E.rho;
      return {
        theta: G,
        rho: C
      }
    }
  };
  var n = function(D, C) {
    return new c(D, C)
  };
  c.KER = n(0, 0);
  var s = function(C, D) {
    this.x = C;
    this.y = D
  };
  $jit.Complex = s;
  s.prototype = {
    getc: function() {
      return this
    },
    getp: function(C) {
      return this.toPolar(C)
    },
    set: function(C) {
      C = C.getc(true);
      this.x = C.x;
      this.y = C.y
    },
    setc: function(C, D) {
      this.x = C;
      this.y = D
    },
    setp: function(D, C) {
      this.x = Math.cos(D) * C;
      this.y = Math.sin(D) * C
    },
    clone: function() {
      return new s(this.x, this.y)
    },
    toPolar: function(E) {
      var C = this.norm();
      var D = Math.atan2(this.y, this.x);
      if (D < 0) {
        D += Math.PI * 2
      }
      if (E) {
        return {
          theta: D,
          rho: C
        }
      }
      return new c(D, C)
    },
    norm: function() {
      return Math.sqrt(this.squaredNorm())
    },
    squaredNorm: function() {
      return this.x * this.x + this.y * this.y
    },
    add: function(C) {
      return new s(this.x + C.x, this.y + C.y)
    },
    prod: function(C) {
      return new s(this.x * C.x - this.y * C.y, this.y * C.x + this.x * C.y)
    },
    conjugate: function() {
      return new s(this.x, -this.y)
    },
    scale: function(C) {
      return new s(this.x * C, this.y * C)
    },
    equals: function(C) {
      return this.x == C.x && this.y == C.y
    },
    $add: function(C) {
      this.x += C.x;
      this.y += C.y;
      return this
    },
    $prod: function(E) {
      var C = this.x,
        D = this.y;
      this.x = C * E.x - D * E.y;
      this.y = D * E.x + C * E.y;
      return this
    },
    $conjugate: function() {
      this.y = -this.y;
      return this
    },
    $scale: function(C) {
      this.x *= C;
      this.y *= C;
      return this
    },
    $div: function(F) {
      var C = this.x,
        E = this.y;
      var D = F.squaredNorm();
      this.x = C * F.x + E * F.y;
      this.y = E * F.x - C * F.y;
      return this.$scale(1 / D)
    }
  };
  var u = function(D, C) {
    return new s(D, C)
  };
  s.KER = u(0, 0);
  $jit.Graph = new t({
    initialize: function(E, D, C, I) {
      var G = {
        complex: false,
        Node: {}
      };
      this.Node = D;
      this.Edge = C;
      this.Label = I;
      this.opt = e.merge(G, E || {});
      this.nodes = {};
      this.edges = {};
      var F = this;
      this.nodeList = {};
      for (var H in m) {
        F.nodeList[H] = (function(J) {
          return function() {
            var K = Array.prototype.slice.call(arguments);
            F.eachNode(function(L) {
              L[J].apply(L, K)
            })
          }
        })(H)
      }
    },
    getNode: function(C) {
      if (this.hasNode(C)) {
        return this.nodes[C]
      }
      return false
    },
    getByName: function(C) {
      for (var E in this.nodes) {
        var D = this.nodes[E];
        if (D.name == C) {
          return D
        }
      }
      return false
    },
    getAdjacence: function(D, C) {
      if (D in this.edges) {
        return this.edges[D][C]
      }
      return false
    },
    addNode: function(D) {
      if (!this.nodes[D.id]) {
        var C = this.edges[D.id] = {};
        this.nodes[D.id] = new g.Node(e.extend({
          id: D.id,
          name: D.name,
          data: e.merge(D.data || {}, {}),
          adjacencies: C
        }, this.opt.Node), this.opt.complex, this.Node, this.Edge, this.Label)
      }
      return this.nodes[D.id]
    },
    addAdjacence: function(F, E, D) {
      if (!this.hasNode(F.id)) {
        this.addNode(F)
      }
      if (!this.hasNode(E.id)) {
        this.addNode(E)
      }
      F = this.nodes[F.id];
      E = this.nodes[E.id];
      if (!F.adjacentTo(E)) {
        var G = this.edges[F.id] = this.edges[F.id] || {};
        var C = this.edges[E.id] = this.edges[E.id] || {};
        G[E.id] = C[F.id] = new g.Adjacence(F, E, D, this.Edge, this.Label);
        return G[E.id]
      }
      return this.edges[F.id][E.id]
    },
    removeNode: function(E) {
      if (this.hasNode(E)) {
        delete this.nodes[E];
        var D = this.edges[E];
        for (var C in D) {
          delete this.edges[C][E]
        }
        delete this.edges[E]
      }
    },
    removeAdjacence: function(D, C) {
      delete this.edges[D][C];
      delete this.edges[C][D]
    },
    hasNode: function(C) {
      return C in this.nodes
    },
    empty: function() {
      this.nodes = {};
      this.edges = {}
    }
  });
  var g = $jit.Graph;
  var m;
  (function() {
    var C = function(J, L, G, I, K) {
      var H;
      G = G || "current";
      J = "$" + (J ? J + "-" : "");
      if (G == "current") {
        H = this.data
      } else {
        if (G == "start") {
          H = this.startData
        } else {
          if (G == "end") {
            H = this.endData
          }
        }
      }
      var F = J + L;
      if (I) {
        return H[F]
      }
      if (!this.Config.overridable) {
        return K[L] || 0
      }
      return (F in H) ? H[F] : ((F in this.data) ? this.data[F] : (K[L] || 0))
    };
    var E = function(I, J, H, F) {
      F = F || "current";
      I = "$" + (I ? I + "-" : "");
      var G;
      if (F == "current") {
        G = this.data
      } else {
        if (F == "start") {
          G = this.startData
        } else {
          if (F == "end") {
            G = this.endData
          }
        }
      }
      G[I + J] = H
    };
    var D = function(H, F) {
      H = "$" + (H ? H + "-" : "");
      var G = this;
      e.each(F, function(J) {
        var I = H + J;
        delete G.data[I];
        delete G.endData[I];
        delete G.startData[I]
      })
    };
    m = {
      getData: function(H, F, G) {
        return C.call(this, "", H, F, G, this.Config)
      },
      setData: function(H, G, F) {
        E.call(this, "", H, G, F)
      },
      setDataset: function(I, J) {
        I = e.splat(I);
        for (var F in J) {
          for (var H = 0, K = e.splat(J[F]), G = I.length; H < G; H++) {
            this.setData(F, K[H], I[H])
          }
        }
      },
      removeData: function() {
        D.call(this, "", Array.prototype.slice.call(arguments))
      },
      getCanvasStyle: function(H, F, G) {
        return C.call(this, "canvas", H, F, G, this.Config.CanvasStyles)
      },
      setCanvasStyle: function(H, G, F) {
        E.call(this, "canvas", H, G, F)
      },
      setCanvasStyles: function(I, J) {
        I = e.splat(I);
        for (var F in J) {
          for (var H = 0, K = e.splat(J[F]), G = I.length; H < G; H++) {
            this.setCanvasStyle(F, K[H], I[H])
          }
        }
      },
      removeCanvasStyle: function() {
        D.call(this, "canvas", Array.prototype.slice.call(arguments))
      },
      getLabelData: function(H, F, G) {
        return C.call(this, "label", H, F, G, this.Label)
      },
      setLabelData: function(H, G, F) {
        E.call(this, "label", H, G, F)
      },
      setLabelDataset: function(I, J) {
        I = e.splat(I);
        for (var F in J) {
          for (var H = 0, K = e.splat(J[F]), G = I.length; H < G; H++) {
            this.setLabelData(F, K[H], I[H])
          }
        }
      },
      removeLabelData: function() {
        D.call(this, "label", Array.prototype.slice.call(arguments))
      }
    }
  })();
  g.Node = new t({
    initialize: function(E, G, D, C, H) {
      var F = {
        id: "",
        name: "",
        data: {},
        startData: {},
        endData: {},
        adjacencies: {},
        selected: false,
        drawn: false,
        exist: false,
        angleSpan: {
          begin: 0,
          end: 0
        },
        pos: (G && u(0, 0)) || n(0, 0),
        startPos: (G && u(0, 0)) || n(0, 0),
        endPos: (G && u(0, 0)) || n(0, 0)
      };
      e.extend(this, e.extend(F, E));
      this.Config = this.Node = D;
      this.Edge = C;
      this.Label = H
    },
    adjacentTo: function(C) {
      return C.id in this.adjacencies
    },
    getAdjacency: function(C) {
      return this.adjacencies[C]
    },
    getPos: function(C) {
      C = C || "current";
      if (C == "current") {
        return this.pos
      } else {
        if (C == "end") {
          return this.endPos
        } else {
          if (C == "start") {
            return this.startPos
          }
        }
      }
    },
    setPos: function(D, C) {
      C = C || "current";
      var E;
      if (C == "current") {
        E = this.pos
      } else {
        if (C == "end") {
          E = this.endPos
        } else {
          if (C == "start") {
            E = this.startPos
          }
        }
      }
      E.set(D)
    }
  });
  g.Node.implement(m);
  g.Adjacence = new t({
    initialize: function(D, G, E, C, F) {
      this.nodeFrom = D;
      this.nodeTo = G;
      this.data = E || {};
      this.startData = {};
      this.endData = {};
      this.Config = this.Edge = C;
      this.Label = F
    }
  });
  g.Adjacence.implement(m);
  g.Util = {
    filter: function(D) {
      if (!D || !(e.type(D) == "string")) {
        return function() {
          return true
        }
      }
      var C = D.split(" ");
      return function(F) {
        for (var E = 0; E < C.length; E++) {
          if (F[C[E]]) {
            return false
          }
        }
        return true
      }
    },
    getNode: function(C, D) {
      return C.nodes[D]
    },
    eachNode: function(G, F, C) {
      var E = this.filter(C);
      for (var D in G.nodes) {
        if (E(G.nodes[D])) {
          F(G.nodes[D])
        }
      }
    },
    eachAdjacency: function(H, I, D) {
      var E = H.adjacencies,
        G = this.filter(D);
      for (var J in E) {
        var C = E[J];
        if (G(C)) {
          if (C.nodeFrom != H) {
            var F = C.nodeFrom;
            C.nodeFrom = C.nodeTo;
            C.nodeTo = F
          }
          I(C, J)
        }
      }
    },
    computeLevels: function(I, J, F, E) {
      F = F || 0;
      var G = this.filter(E);
      this.eachNode(I, function(K) {
        K._flag = false;
        K._depth = -1
      }, E);
      var D = I.getNode(J);
      D._depth = F;
      var C = [D];
      while (C.length != 0) {
        var H = C.pop();
        H._flag = true;
        this.eachAdjacency(H, function(K) {
          var L = K.nodeTo;
          if (L._flag == false && G(L)) {
            if (L._depth < 0) {
              L._depth = H._depth + 1 + F
            }
            C.unshift(L)
          }
        }, E)
      }
    },
    eachBFS: function(H, I, G, D) {
      var E = this.filter(D);
      this.clean(H);
      var C = [H.getNode(I)];
      while (C.length != 0) {
        var F = C.pop();
        F._flag = true;
        G(F, F._depth);
        this.eachAdjacency(F, function(J) {
          var K = J.nodeTo;
          if (K._flag == false && E(K)) {
            K._flag = true;
            C.unshift(K)
          }
        }, D)
      }
    },
    eachLevel: function(G, K, D, H, F) {
      var J = G._depth,
        C = this.filter(F),
        I = this;
      D = D === false ? Number.MAX_VALUE - J : D;
      (function E(N, L, M) {
        var O = N._depth;
        if (O >= L && O <= M && C(N)) {
          H(N, O)
        }
        if (O < M) {
          I.eachAdjacency(N, function(P) {
            var Q = P.nodeTo;
            if (Q._depth > O) {
              E(Q, L, M)
            }
          })
        }
      })(G, K + J, D + J)
    },
    eachSubgraph: function(D, E, C) {
      this.eachLevel(D, 0, false, E, C)
    },
    eachSubnode: function(D, E, C) {
      this.eachLevel(D, 1, 1, E, C)
    },
    anySubnode: function(F, E, D) {
      var C = false;
      E = E || e.lambda(true);
      var G = e.type(E) == "string" ? function(H) {
        return H[E]
      } : E;
      this.eachSubnode(F, function(H) {
        if (G(H)) {
          C = true
        }
      }, D);
      return C
    },
    getSubnodes: function(H, I, C) {
      var E = [],
        G = this;
      I = I || 0;
      var F, D;
      if (e.type(I) == "array") {
        F = I[0];
        D = I[1]
      } else {
        F = I;
        D = Number.MAX_VALUE - H._depth
      }
      this.eachLevel(H, F, D, function(J) {
        E.push(J)
      }, C);
      return E
    },
    getParents: function(D) {
      var C = [];
      this.eachAdjacency(D, function(E) {
        var F = E.nodeTo;
        if (F._depth < D._depth) {
          C.push(F)
        }
      });
      return C
    },
    isDescendantOf: function(F, G) {
      if (F.id == G) {
        return true
      }
      var E = this.getParents(F),
        C = false;
      for (var D = 0; !C && D < E.length; D++) {
        C = C || this.isDescendantOf(E[D], G)
      }
      return C
    },
    clean: function(C) {
      this.eachNode(C, function(D) {
        D._flag = false
      })
    },
    getClosestNodeToOrigin: function(D, E, C) {
      return this.getClosestNodeToPos(D, c.KER, E, C)
    },
    getClosestNodeToPos: function(E, H, G, C) {
      var D = null;
      G = G || "current";
      H = H && H.getc(true) || s.KER;
      var F = function(J, I) {
        var L = J.x - I.x,
          K = J.y - I.y;
        return L * L + K * K
      };
      this.eachNode(E, function(I) {
        D = (D == null || F(I.getPos(G).getc(true), H) < F(D.getPos(G).getc(true), H)) ? I : D
      }, C);
      return D
    }
  };
  e.each(["getNode", "eachNode", "computeLevels", "eachBFS", "clean", "getClosestNodeToPos", "getClosestNodeToOrigin"], function(C) {
    g.prototype[C] = function() {
      return g.Util[C].apply(g.Util, [this].concat(Array.prototype.slice.call(arguments)))
    }
  });
  e.each(["eachAdjacency", "eachLevel", "eachSubgraph", "eachSubnode", "anySubnode", "getSubnodes", "getParents", "isDescendantOf"], function(C) {
    g.Node.prototype[C] = function() {
      return g.Util[C].apply(g.Util, [this].concat(Array.prototype.slice.call(arguments)))
    }
  });
  g.Op = {
    options: {
      type: "nothing",
      duration: 2000,
      hideLabels: true,
      fps: 30
    },
    initialize: function(C) {
      this.viz = C
    },
    removeNode: function(H, F) {
      var C = this.viz;
      var D = e.merge(this.options, C.controller, F);
      var J = e.splat(H);
      var E, G, I;
      switch (D.type) {
        case "nothing":
          for (E = 0; E < J.length; E++) {
            C.graph.removeNode(J[E])
          }
          break;
        case "replot":
          this.removeNode(J, {
            type: "nothing"
          });
          C.labels.clearLabels();
          C.refresh(true);
          break;
        case "fade:seq":
        case "fade":
          G = this;
          for (E = 0; E < J.length; E++) {
            I = C.graph.getNode(J[E]);
            I.setData("alpha", 0, "end")
          }
          C.fx.animate(e.merge(D, {
            modes: ["node-property:alpha"],
            onComplete: function() {
              G.removeNode(J, {
                type: "nothing"
              });
              C.labels.clearLabels();
              C.reposition();
              C.fx.animate(e.merge(D, {
                modes: ["linear"]
              }))
            }
          }));
          break;
        case "fade:con":
          G = this;
          for (E = 0; E < J.length; E++) {
            I = C.graph.getNode(J[E]);
            I.setData("alpha", 0, "end");
            I.ignore = true
          }
          C.reposition();
          C.fx.animate(e.merge(D, {
            modes: ["node-property:alpha", "linear"],
            onComplete: function() {
              G.removeNode(J, {
                type: "nothing"
              })
            }
          }));
          break;
        case "iter":
          G = this;
          C.fx.sequence({
            condition: function() {
              return J.length != 0
            },
            step: function() {
              G.removeNode(J.shift(), {
                type: "nothing"
              });
              C.labels.clearLabels()
            },
            onComplete: function() {
              D.onComplete()
            },
            duration: Math.ceil(D.duration / J.length)
          });
          break;
        default:
          this.doError()
      }
    },
    removeEdge: function(J, H) {
      var C = this.viz;
      var F = e.merge(this.options, C.controller, H);
      var E = (e.type(J[0]) == "string") ? [J] : J;
      var G, I, D;
      switch (F.type) {
        case "nothing":
          for (G = 0; G < E.length; G++) {
            C.graph.removeAdjacence(E[G][0], E[G][1])
          }
          break;
        case "replot":
          this.removeEdge(E, {
            type: "nothing"
          });
          C.refresh(true);
          break;
        case "fade:seq":
        case "fade":
          I = this;
          for (G = 0; G < E.length; G++) {
            D = C.graph.getAdjacence(E[G][0], E[G][1]);
            if (D) {
              D.setData("alpha", 0, "end")
            }
          }
          C.fx.animate(e.merge(F, {
            modes: ["edge-property:alpha"],
            onComplete: function() {
              I.removeEdge(E, {
                type: "nothing"
              });
              C.reposition();
              C.fx.animate(e.merge(F, {
                modes: ["linear"]
              }))
            }
          }));
          break;
        case "fade:con":
          I = this;
          for (G = 0; G < E.length; G++) {
            D = C.graph.getAdjacence(E[G][0], E[G][1]);
            if (D) {
              D.setData("alpha", 0, "end");
              D.ignore = true
            }
          }
          C.reposition();
          C.fx.animate(e.merge(F, {
            modes: ["edge-property:alpha", "linear"],
            onComplete: function() {
              I.removeEdge(E, {
                type: "nothing"
              })
            }
          }));
          break;
        case "iter":
          I = this;
          C.fx.sequence({
            condition: function() {
              return E.length != 0
            },
            step: function() {
              I.removeEdge(E.shift(), {
                type: "nothing"
              });
              C.labels.clearLabels()
            },
            onComplete: function() {
              F.onComplete()
            },
            duration: Math.ceil(F.duration / E.length)
          });
          break;
        default:
          this.doError()
      }
    },
    sum: function(G, F) {
      var C = this.viz;
      var E = e.merge(this.options, C.controller, F),
        D = C.root;
      var I;
      C.root = F.id || C.root;
      switch (E.type) {
        case "nothing":
          I = C.construct(G);
          I.eachNode(function(K) {
            K.eachAdjacency(function(L) {
              C.graph.addAdjacence(L.nodeFrom, L.nodeTo, L.data)
            })
          });
          break;
        case "replot":
          C.refresh(true);
          this.sum(G, {
            type: "nothing"
          });
          C.refresh(true);
          break;
        case "fade:seq":
        case "fade":
        case "fade:con":
          that = this;
          I = C.construct(G);
          var J = this.preprocessSum(I);
          var H = !J ? ["node-property:alpha"] : ["node-property:alpha", "edge-property:alpha"];
          C.reposition();
          if (E.type != "fade:con") {
            C.fx.animate(e.merge(E, {
              modes: ["linear"],
              onComplete: function() {
                C.fx.animate(e.merge(E, {
                  modes: H,
                  onComplete: function() {
                    E.onComplete()
                  }
                }))
              }
            }))
          } else {
            C.graph.eachNode(function(K) {
              if (K.id != D && K.pos.getp().equals(c.KER)) {
                K.pos.set(K.endPos);
                K.startPos.set(K.endPos)
              }
            });
            C.fx.animate(e.merge(E, {
              modes: ["linear"].concat(H)
            }))
          }
          break;
        default:
          this.doError()
      }
    },
    morph: function(K, D, F) {
      var H = this.viz;
      var L = e.merge(this.options, H.controller, D),
        G = H.root;
      var I;
      H.root = D.id || H.root;
      switch (L.type) {
        case "nothing":
          I = H.construct(K);
          I.eachNode(function(O) {
            var N = H.graph.hasNode(O.id);
            O.eachAdjacency(function(S) {
              var R = !!H.graph.getAdjacence(S.nodeFrom.id, S.nodeTo.id);
              H.graph.addAdjacence(S.nodeFrom, S.nodeTo, S.data);
              if (R) {
                var Q = H.graph.getAdjacence(S.nodeFrom.id, S.nodeTo.id);
                for (var T in (S.data || {})) {
                  Q.data[T] = S.data[T]
                }
              }
            });
            if (N) {
              var M = H.graph.getNode(O.id);
              for (var P in (O.data || {})) {
                M.data[P] = O.data[P]
              }
            }
          });
          H.graph.eachNode(function(M) {
            M.eachAdjacency(function(N) {
              if (!I.getAdjacence(N.nodeFrom.id, N.nodeTo.id)) {
                H.graph.removeAdjacence(N.nodeFrom.id, N.nodeTo.id)
              }
            });
            if (!I.hasNode(M.id)) {
              H.graph.removeNode(M.id)
            }
          });
          break;
        case "replot":
          H.labels.clearLabels(true);
          this.morph(K, {
            type: "nothing"
          });
          H.refresh(true);
          H.refresh(true);
          break;
        case "fade:seq":
        case "fade":
        case "fade:con":
          that = this;
          I = H.construct(K);
          var J = F && ("node-property" in F) && e.map(e.splat(F["node-property"]), function(M) {
              return "$" + M
            });
          H.graph.eachNode(function(N) {
            var O = I.getNode(N.id);
            if (!O) {
              N.setData("alpha", 1);
              N.setData("alpha", 1, "start");
              N.setData("alpha", 0, "end");
              N.ignore = true
            } else {
              var M = O.data;
              for (var P in M) {
                if (J && (e.indexOf(J, P) > -1)) {
                  N.endData[P] = M[P]
                } else {
                  N.data[P] = M[P]
                }
              }
            }
          });
          H.graph.eachNode(function(M) {
            if (M.ignore) {
              return
            }
            M.eachAdjacency(function(N) {
              if (N.nodeFrom.ignore || N.nodeTo.ignore) {
                return
              }
              var O = I.getNode(N.nodeFrom.id);
              var P = I.getNode(N.nodeTo.id);
              if (!O.adjacentTo(P)) {
                var N = H.graph.getAdjacence(O.id, P.id);
                C = true;
                N.setData("alpha", 1);
                N.setData("alpha", 1, "start");
                N.setData("alpha", 0, "end")
              }
            })
          });
          var C = this.preprocessSum(I);
          var E = !C ? ["node-property:alpha"] : ["node-property:alpha", "edge-property:alpha"];
          E[0] = E[0] + ((F && ("node-property" in F)) ? (":" + e.splat(F["node-property"]).join(":")) : "");
          E[1] = (E[1] || "edge-property:alpha") + ((F && ("edge-property" in F)) ? (":" + e.splat(F["edge-property"]).join(":")) : "");
          if (F && ("label-property" in F)) {
            E.push("label-property:" + e.splat(F["label-property"]).join(":"))
          }
          H.reposition();
          H.graph.eachNode(function(M) {
            if (M.id != G && M.pos.getp().equals(c.KER)) {
              M.pos.set(M.endPos);
              M.startPos.set(M.endPos)
            }
          });
          H.fx.animate(e.merge(L, {
            modes: ["polar"].concat(E),
            onComplete: function() {
              H.graph.eachNode(function(M) {
                if (M.ignore) {
                  H.graph.removeNode(M.id)
                }
              });
              H.graph.eachNode(function(M) {
                M.eachAdjacency(function(N) {
                  if (N.ignore) {
                    H.graph.removeAdjacence(N.nodeFrom.id, N.nodeTo.id)
                  }
                })
              });
              L.onComplete()
            }
          }));
          break;
        default:
      }
    },
    contract: function(E, D) {
      var C = this.viz;
      if (E.collapsed || !E.anySubnode(e.lambda(true))) {
        return
      }
      D = e.merge(this.options, C.config, D || {}, {
        modes: ["node-property:alpha:span", "linear"]
      });
      E.collapsed = true;
      (function F(G) {
        G.eachSubnode(function(H) {
          H.ignore = true;
          H.setData("alpha", 0, D.type == "animate" ? "end" : "current");
          F(H)
        })
      })(E);
      if (D.type == "animate") {
        C.compute("end");
        if (C.rotated) {
          C.rotate(C.rotated, "none", {
            property: "end"
          })
        }(function F(G) {
          G.eachSubnode(function(H) {
            H.setPos(E.getPos("end"), "end");
            F(H)
          })
        })(E);
        C.fx.animate(D)
      } else {
        if (D.type == "replot") {
          C.refresh()
        }
      }
    },
    expand: function(E, D) {
      if (!("collapsed" in E)) {
        return
      }
      var C = this.viz;
      D = e.merge(this.options, C.config, D || {}, {
        modes: ["node-property:alpha:span", "linear"]
      });
      delete E.collapsed;
      (function F(G) {
        G.eachSubnode(function(H) {
          delete H.ignore;
          H.setData("alpha", 1, D.type == "animate" ? "end" : "current");
          F(H)
        })
      })(E);
      if (D.type == "animate") {
        C.compute("end");
        if (C.rotated) {
          C.rotate(C.rotated, "none", {
            property: "end"
          })
        }
        C.fx.animate(D)
      } else {
        if (D.type == "replot") {
          C.refresh()
        }
      }
    },
    preprocessSum: function(D) {
      var C = this.viz;
      D.eachNode(function(F) {
        if (!C.graph.hasNode(F.id)) {
          C.graph.addNode(F);
          var G = C.graph.getNode(F.id);
          G.setData("alpha", 0);
          G.setData("alpha", 0, "start");
          G.setData("alpha", 1, "end")
        }
      });
      var E = false;
      D.eachNode(function(F) {
        F.eachAdjacency(function(G) {
          var H = C.graph.getNode(G.nodeFrom.id);
          var I = C.graph.getNode(G.nodeTo.id);
          if (!H.adjacentTo(I)) {
            var G = C.graph.addAdjacence(H, I, G.data);
            if (H.startAlpha == H.endAlpha && I.startAlpha == I.endAlpha) {
              E = true;
              G.setData("alpha", 0);
              G.setData("alpha", 0, "start");
              G.setData("alpha", 1, "end")
            }
          }
        })
      });
      return E
    }
  };
  var b = {
    none: {
      render: e.empty,
      contains: e.lambda(false)
    },
    circle: {
      render: function(F, G, C, E) {
        var D = E.getCtx();
        D.beginPath();
        D.arc(G.x, G.y, C, 0, Math.PI * 2, true);
        D.closePath();
        D[F]()
      },
      contains: function(H, G, C) {
        var E = H.x - G.x,
          D = H.y - G.y,
          F = E * E + D * D;
        return F <= C * C
      }
    },
    ellipse: {
      render: function(G, H, F, C, E) {
        var D = E.getCtx();
        C /= 2;
        F /= 2;
        D.save();
        D.scale(F / C, C / F);
        D.beginPath();
        D.arc(H.x * (C / F), H.y * (F / C), C, 0, Math.PI * 2, true);
        D.closePath();
        D[G]();
        D.restore()
      },
      contains: function(J, I, F, C) {
        F /= 2;
        C /= 2;
        var H = (F + C) / 2,
          E = J.x - I.x,
          D = J.y - I.y,
          G = E * E + D * D;
        return G <= H * H
      }
    },
    square: {
      render: function(D, F, E, C) {
        C.getCtx()[D + "Rect"](F.x - E, F.y - E, 2 * E, 2 * E)
      },
      contains: function(E, D, C) {
        return Math.abs(D.x - E.x) <= C && Math.abs(D.y - E.y) <= C
      }
    },
    rectangle: {
      render: function(F, G, E, C, D) {
        D.getCtx()[F + "Rect"](G.x - E / 2, G.y - C / 2, E, C)
      },
      contains: function(F, E, D, C) {
        return Math.abs(E.x - F.x) <= D / 2 && Math.abs(E.y - F.y) <= C / 2
      }
    },
    triangle: {
      render: function(I, J, F, C) {
        var M = C.getCtx(),
          E = J.x,
          D = J.y - F,
          L = E - F,
          K = J.y + F,
          H = E + F,
          G = K;
        M.beginPath();
        M.moveTo(E, D);
        M.lineTo(L, K);
        M.lineTo(H, G);
        M.closePath();
        M[I]()
      },
      contains: function(E, D, C) {
        return b.circle.contains(E, D, C)
      }
    },
    star: {
      render: function(G, I, H, D) {
        var C = D.getCtx(),
          F = Math.PI / 5;
        C.save();
        C.translate(I.x, I.y);
        C.beginPath();
        C.moveTo(H, 0);
        for (var E = 0; E < 9; E++) {
          C.rotate(F);
          if (E % 2 == 0) {
            C.lineTo((H / 0.525731) * 0.200811, 0)
          } else {
            C.lineTo(H, 0)
          }
        }
        C.closePath();
        C[G]();
        C.restore()
      },
      contains: function(E, D, C) {
        return b.circle.contains(E, D, C)
      }
    }
  };
  var p = {
    line: {
      render: function(F, E, D) {
        var C = D.getCtx();
        C.beginPath();
        C.moveTo(F.x, F.y);
        C.lineTo(E.x, E.y);
        C.stroke()
      },
      contains: function(M, E, H, K) {
        var F = Math.min,
          I = Math.max,
          D = F(M.x, E.x),
          L = I(M.x, E.x),
          C = F(M.y, E.y),
          J = I(M.y, E.y);
        if (H.x >= D && H.x <= L && H.y >= C && H.y <= J) {
          if (Math.abs(E.x - M.x) <= K) {
            return true
          }
          var G = (E.y - M.y) / (E.x - M.x) * (H.x - M.x) + M.y;
          return Math.abs(G - H.y) <= K
        }
        return false
      }
    },
    arrow: {
      render: function(L, M, F, D, C) {
        var N = C.getCtx();
        if (D) {
          var E = L;
          L = M;
          M = E
        }
        var I = new s(M.x - L.x, M.y - L.y);
        I.$scale(F / I.norm());
        var G = new s(M.x - I.x, M.y - I.y),
          H = new s(-I.y / 2, I.x / 2),
          K = G.add(H),
          J = G.$add(H.$scale(-1));
        N.beginPath();
        N.moveTo(L.x, L.y);
        N.lineTo(M.x, M.y);
        N.stroke();
        N.beginPath();
        N.moveTo(K.x, K.y);
        N.lineTo(J.x, J.y);
        N.lineTo(M.x, M.y);
        N.closePath();
        N.fill()
      },
      contains: function(D, C, F, E) {
        return p.line.contains(D, C, F, E)
      }
    },
    hyperline: {
      render: function(J, K, C, E) {
        var L = E.getCtx();
        var F = G(J, K);
        if (F.a > 1000 || F.b > 1000 || F.ratio < 0) {
          L.beginPath();
          L.moveTo(J.x * C, J.y * C);
          L.lineTo(K.x * C, K.y * C);
          L.stroke()
        } else {
          var I = Math.atan2(K.y - F.y, K.x - F.x);
          var H = Math.atan2(J.y - F.y, J.x - F.x);
          var D = D(I, H);
          L.beginPath();
          L.arc(F.x * C, F.y * C, F.ratio * C, I, H, D);
          L.stroke()
        }

        function G(Y, X) {
          var Q = (Y.x * X.y - Y.y * X.x),
            M = Q;
          var P = Y.squaredNorm(),
            O = X.squaredNorm();
          if (Q == 0) {
            return {
              x: 0,
              y: 0,
              ratio: -1
            }
          }
          var W = (Y.y * O - X.y * P + Y.y - X.y) / Q;
          var U = (X.x * P - Y.x * O + X.x - Y.x) / M;
          var V = -W / 2;
          var T = -U / 2;
          var S = (W * W + U * U) / 4 - 1;
          if (S < 0) {
            return {
              x: 0,
              y: 0,
              ratio: -1
            }
          }
          var R = Math.sqrt(S);
          var N = {
            x: V,
            y: T,
            ratio: R > 1000 ? -1 : R,
            a: W,
            b: U
          };
          return N
        }

        function D(M, N) {
          return (M < N) ? ((M + Math.PI > N) ? false : true) : ((N + Math.PI > M) ? true : false)
        }
      },
      contains: e.lambda(false)
    }
  };
  g.Plot = {
    initialize: function(D, C) {
      this.viz = D;
      this.config = D.config;
      this.node = D.config.Node;
      this.edge = D.config.Edge;
      this.animation = new A;
      this.nodeTypes = new C.Plot.NodeTypes;
      this.edgeTypes = new C.Plot.EdgeTypes;
      this.labels = D.labels
    },
    nodeHelper: b,
    edgeHelper: p,
    Interpolator: {
      map: {
        border: "color",
        color: "color",
        width: "number",
        height: "number",
        dim: "number",
        alpha: "number",
        lineWidth: "number",
        angularWidth: "number",
        span: "number",
        valueArray: "array-number",
        dimArray: "array-number"
      },
      canvas: {
        globalAlpha: "number",
        fillStyle: "color",
        strokeStyle: "color",
        lineWidth: "number",
        shadowBlur: "number",
        shadowColor: "color",
        shadowOffsetX: "number",
        shadowOffsetY: "number",
        miterLimit: "number"
      },
      label: {
        size: "number",
        color: "color"
      },
      compute: function(E, D, C) {
        return E + (D - E) * C
      },
      moebius: function(H, G, J, D) {
        var F = D.scale(-J);
        if (F.norm() < 1) {
          var C = F.x,
            I = F.y;
          var E = H.startPos.getc().moebiusTransformation(F);
          H.pos.setc(E.x, E.y);
          F.x = C;
          F.y = I
        }
      },
      linear: function(D, C, G) {
        var F = D.startPos.getc(true);
        var E = D.endPos.getc(true);
        D.pos.setc(this.compute(F.x, E.x, G), this.compute(F.y, E.y, G))
      },
      polar: function(E, D, H) {
        var G = E.startPos.getp(true);
        var F = E.endPos.getp();
        var C = F.interpolate(G, H);
        E.pos.setp(C.theta, C.rho)
      },
      number: function(D, I, H, C, G) {
        var F = D[C](I, "start");
        var E = D[C](I, "end");
        D[G](I, this.compute(F, E, H))
      },
      color: function(E, C, K, H, F) {
        var I = e.hexToRgb(E[H](C, "start"));
        var J = e.hexToRgb(E[H](C, "end"));
        var G = this.compute;
        var D = e.rgbToHex([parseInt(G(I[0], J[0], K)), parseInt(G(I[1], J[1], K)), parseInt(G(I[2], J[2], K))]);
        E[F](C, D)
      },
      "array-number": function(F, E, P, M, H) {
        var N = F[M](E, "start"),
          O = F[M](E, "end"),
          Q = [];
        for (var K = 0, G = N.length; K < G; K++) {
          var D = N[K],
            C = O[K];
          if (D.length) {
            for (var J = 0, L = D.length, I = []; J < L; J++) {
              I.push(this.compute(D[J], C[J], P))
            }
            Q.push(I)
          } else {
            Q.push(this.compute(D, C, P))
          }
        }
        F[H](E, Q)
      },
      node: function(D, I, K, C, J, E) {
        C = this[C];
        if (I) {
          var H = I.length;
          for (var F = 0; F < H; F++) {
            var G = I[F];
            this[C[G]](D, G, K, J, E)
          }
        } else {
          for (var G in C) {
            this[C[G]](D, G, K, J, E)
          }
        }
      },
      edge: function(E, D, J, F, C, I) {
        var H = E.adjacencies;
        for (var G in H) {
          this["node"](H[G], D, J, F, C, I)
        }
      },
      "node-property": function(D, C, E) {
        this["node"](D, C, E, "map", "getData", "setData")
      },
      "edge-property": function(D, C, E) {
        this["edge"](D, C, E, "map", "getData", "setData")
      },
      "label-property": function(D, C, E) {
        this["node"](D, C, E, "label", "getLabelData", "setLabelData")
      },
      "node-style": function(D, C, E) {
        this["node"](D, C, E, "canvas", "getCanvasStyle", "setCanvasStyle")
      },
      "edge-style": function(D, C, E) {
        this["edge"](D, C, E, "canvas", "getCanvasStyle", "setCanvasStyle")
      }
    },
    sequence: function(D) {
      var E = this;
      D = e.merge({
        condition: e.lambda(false),
        step: e.empty,
        onComplete: e.empty,
        duration: 200
      }, D || {});
      var C = setInterval(function() {
        if (D.condition()) {
          D.step()
        } else {
          clearInterval(C);
          D.onComplete()
        }
        E.viz.refresh(true)
      }, D.duration)
    },
    prepare: function(I) {
      var H = this.viz.graph,
        F = {
          "node-property": {
            getter: "getData",
            setter: "setData"
          },
          "edge-property": {
            getter: "getData",
            setter: "setData"
          },
          "node-style": {
            getter: "getCanvasStyle",
            setter: "setCanvasStyle"
          },
          "edge-style": {
            getter: "getCanvasStyle",
            setter: "setCanvasStyle"
          }
        };
      var D = {};
      if (e.type(I) == "array") {
        for (var G = 0, C = I.length; G < C; G++) {
          var E = I[G].split(":");
          D[E.shift()] = E
        }
      } else {
        for (var J in I) {
          if (J == "position") {
            D[I.position] = []
          } else {
            D[J] = e.splat(I[J])
          }
        }
      }
      H.eachNode(function(K) {
        K.startPos.set(K.pos);
        e.each(["node-property", "node-style"], function(N) {
          if (N in D) {
            var O = D[N];
            for (var M = 0, L = O.length; M < L; M++) {
              K[F[N].setter](O[M], K[F[N].getter](O[M]), "start")
            }
          }
        });
        e.each(["edge-property", "edge-style"], function(L) {
          if (L in D) {
            var M = D[L];
            K.eachAdjacency(function(O) {
              for (var P = 0, N = M.length; P < N; P++) {
                O[F[L].setter](M[P], O[F[L].getter](M[P]), "start")
              }
            })
          }
        })
      });
      return D
    },
    animate: function(F, E) {
      F = e.merge(this.viz.config, F || {});
      var G = this,
        D = this.viz,
        I = D.graph,
        J = this.Interpolator,
        H = F.type === "nodefx" ? this.nodeFxAnimation : this.animation;
      var C = this.prepare(F.modes);
      if (F.hideLabels) {
        this.labels.hideLabels(true)
      }
      H.setOptions(e.merge(F, {
        $animating: false,
        compute: function(K) {
          I.eachNode(function(L) {
            for (var M in C) {
              J[M](L, C[M], K, E)
            }
          });
          G.plot(F, this.$animating, K);
          this.$animating = true
        },
        complete: function() {
          if (F.hideLabels) {
            G.labels.hideLabels(false)
          }
          G.plot(F);
          F.onComplete();
          F.onAfterCompute()
        }
      })).start()
    },
    nodeFx: function(E) {
      var J = this.viz,
        K = J.graph,
        H = this.nodeFxAnimation,
        L = e.merge(this.viz.config, {
          elements: {
            id: false,
            properties: {}
          },
          reposition: false
        });
      E = e.merge(L, E || {}, {
        onBeforeCompute: e.empty,
        onAfterCompute: e.empty
      });
      H.stopTimer();
      var I = E.elements.properties;
      if (!E.elements.id) {
        K.eachNode(function(N) {
          for (var M in I) {
            N.setData(M, I[M], "end")
          }
        })
      } else {
        var C = e.splat(E.elements.id);
        e.each(C, function(O) {
          var N = K.getNode(O);
          if (N) {
            for (var M in I) {
              N.setData(M, I[M], "end")
            }
          }
        })
      }
      var G = [];
      for (var D in I) {
        G.push(D)
      }
      var F = ["node-property:" + G.join(":")];
      if (E.reposition) {
        F.push("linear");
        J.compute("end")
      }
      this.animate(e.merge(E, {
        modes: F,
        type: "nodefx"
      }))
    },
    plot: function(D, M) {
      var K = this.viz,
        H = K.graph,
        E = K.canvas,
        C = K.root,
        I = this,
        L = E.getCtx(),
        G = Math.min,
        D = D || this.viz.controller;
      D.clearCanvas && E.clear();
      var J = H.getNode(C);
      if (!J) {
        return
      }
      var F = !!J.visited;
      H.eachNode(function(O) {
        var N = O.getData("alpha");
        O.eachAdjacency(function(P) {
          var Q = P.nodeTo;
          if (!!Q.visited === F && O.drawn && Q.drawn) {
            !M && D.onBeforePlotLine(P);
            L.save();
            L.globalAlpha = G(N, Q.getData("alpha"), P.getData("alpha"));
            I.plotLine(P, E, M);
            L.restore();
            !M && D.onAfterPlotLine(P)
          }
        });
        L.save();
        if (O.drawn) {
          !M && D.onBeforePlotNode(O);
          I.plotNode(O, E, M);
          !M && D.onAfterPlotNode(O)
        }
        if (!I.labelsHidden && D.withLabels) {
          if (O.drawn && N >= 0.95) {
            I.labels.plotLabel(E, O, D)
          } else {
            I.labels.hideLabel(O, false)
          }
        }
        L.restore();
        O.visited = !F
      })
    },
    plotTree: function(G, D, K) {
      var H = this,
        I = this.viz,
        E = I.canvas,
        F = this.config,
        J = E.getCtx();
      var C = G.getData("alpha");
      G.eachSubnode(function(M) {
        if (D.plotSubtree(G, M) && M.exist && M.drawn) {
          var L = G.getAdjacency(M.id);
          !K && D.onBeforePlotLine(L);
          J.globalAlpha = Math.min(C, M.getData("alpha"));
          H.plotLine(L, E, K);
          !K && D.onAfterPlotLine(L);
          H.plotTree(M, D, K)
        }
      });
      if (G.drawn) {
        !K && D.onBeforePlotNode(G);
        this.plotNode(G, E, K);
        !K && D.onAfterPlotNode(G);
        if (!D.hideLabels && D.withLabels && C >= 0.95) {
          this.labels.plotLabel(E, G, D)
        } else {
          this.labels.hideLabel(G, false)
        }
      } else {
        this.labels.hideLabel(G, true)
      }
    },
    plotNode: function(E, D, L) {
      var I = E.getData("type"),
        H = this.node.CanvasStyles;
      if (I != "none") {
        var C = E.getData("lineWidth"),
          G = E.getData("color"),
          F = E.getData("alpha"),
          J = D.getCtx();
        J.lineWidth = C;
        J.fillStyle = J.strokeStyle = G;
        J.globalAlpha = F;
        for (var K in H) {
          J[K] = E.getCanvasStyle(K)
        }
        this.nodeTypes[I].render.call(this, E, D, L)
      }
    },
    plotLine: function(H, D, K) {
      var G = H.getData("type"),
        F = this.edge.CanvasStyles;
      if (G != "none") {
        var C = H.getData("lineWidth"),
          E = H.getData("color"),
          I = D.getCtx();
        I.lineWidth = C;
        I.fillStyle = I.strokeStyle = E;
        for (var J in F) {
          I[J] = H.getCanvasStyle(J)
        }
        this.edgeTypes[G].render.call(this, H, D, K)
      }
    }
  };
  g.Label = {};
  g.Label.Native = new t({
    plotLabel: function(E, F, D) {
      var C = E.getCtx();
      var G = F.pos.getc(true);
      C.font = F.getLabelData("style") + " " + F.getLabelData("size") + "px " + F.getLabelData("family");
      C.textAlign = F.getLabelData("textAlign");
      C.fillStyle = C.strokeStyle = F.getLabelData("color");
      C.textBaseline = F.getLabelData("textBaseline");
      this.renderLabel(E, F, D)
    },
    renderLabel: function(E, F, D) {
      var C = E.getCtx();
      var G = F.pos.getc(true);
      C.fillText(F.name, G.x, G.y + F.getData("height") / 2)
    },
    hideLabel: e.empty,
    hideLabels: e.empty
  });
  g.Label.DOM = new t({
    labelsHidden: false,
    labelContainer: false,
    labels: {},
    getLabelContainer: function() {
      return this.labelContainer ? this.labelContainer : this.labelContainer = document.getElementById(this.viz.config.labelContainer)
    },
    getLabel: function(C) {
      return (C in this.labels && this.labels[C] != null) ? this.labels[C] : this.labels[C] = document.getElementById(C)
    },
    hideLabels: function(D) {
      var C = this.getLabelContainer();
      if (D) {
        C.style.display = "none"
      } else {
        C.style.display = ""
      }
      this.labelsHidden = D
    },
    clearLabels: function(C) {
      for (var D in this.labels) {
        if (C || !this.viz.graph.hasNode(D)) {
          this.disposeLabel(D);
          delete this.labels[D]
        }
      }
    },
    disposeLabel: function(D) {
      var C = this.getLabel(D);
      if (C && C.parentNode) {
        C.parentNode.removeChild(C)
      }
    },
    hideLabel: function(G, C) {
      G = e.splat(G);
      var D = C ? "" : "none",
        E, F = this;
      e.each(G, function(I) {
        var H = F.getLabel(I.id);
        if (H) {
          H.style.display = D
        }
      })
    },
    fitsInCanvas: function(E, C) {
      var D = C.getSize();
      if (E.x >= D.width || E.x < 0 || E.y >= D.height || E.y < 0) {
        return false
      }
      return true
    }
  });
  g.Label.HTML = new t({
    Implements: g.Label.DOM,
    plotLabel: function(F, G, E) {
      var H = G.id,
        C = this.getLabel(H);
      if (!C && !(C = document.getElementById(H))) {
        C = document.createElement("div");
        var D = this.getLabelContainer();
        C.id = H;
        C.className = "node";
        C.style.position = "absolute";
        E.onCreateLabel(C, G);
        D.appendChild(C);
        this.labels[G.id] = C
      }
      this.placeLabel(C, G, E)
    }
  });
  g.Label.SVG = new t({
    Implements: g.Label.DOM,
    plotLabel: function(F, H, E) {
      var J = H.id,
        C = this.getLabel(J);
      if (!C && !(C = document.getElementById(J))) {
        var G = "http://www.w3.org/2000/svg";
        C = document.createElementNS(G, "svg:text");
        var I = document.createElementNS(G, "svg:tspan");
        C.appendChild(I);
        var D = this.getLabelContainer();
        C.setAttribute("id", J);
        C.setAttribute("class", "node");
        D.appendChild(C);
        E.onCreateLabel(C, H);
        this.labels[H.id] = C
      }
      this.placeLabel(C, H, E)
    }
  });
  g.Geom = new t({
    initialize: function(C) {
      this.viz = C;
      this.config = C.config;
      this.node = C.config.Node;
      this.edge = C.config.Edge
    },
    translate: function(D, C) {
      C = e.splat(C);
      this.viz.graph.eachNode(function(E) {
        e.each(C, function(F) {
          E.getPos(F).$add(D)
        })
      })
    },
    setRightLevelToShow: function(F, C, H) {
      var G = this.getRightLevelToShow(F, C),
        E = this.viz.labels,
        D = e.merge({
          execShow: true,
          execHide: true,
          onHide: e.empty,
          onShow: e.empty
        }, H || {});
      F.eachLevel(0, this.config.levelsToShow, function(J) {
        var I = J._depth - F._depth;
        if (I > G) {
          D.onHide(J);
          if (D.execHide) {
            J.drawn = false;
            J.exist = false;
            E.hideLabel(J, false)
          }
        } else {
          D.onShow(J);
          if (D.execShow) {
            J.exist = true
          }
        }
      });
      F.drawn = true
    },
    getRightLevelToShow: function(F, D) {
      var C = this.config;
      var G = C.levelsToShow;
      var E = C.constrained;
      if (!E) {
        return G
      }
      while (!this.treeFitsInCanvas(F, D, G) && G > 1) {
        G--
      }
      return G
    }
  });
  var f = {
    construct: function(D) {
      var E = (e.type(D) == "array");
      var C = new g(this.graphOptions, this.config.Node, this.config.Edge, this.config.Label);
      if (!E) {
        (function(F, H) {
          F.addNode(H);
          if (H.children) {
            for (var G = 0, I = H.children; G < I.length; G++) {
              F.addAdjacence(H, I[G]);
              arguments.callee(F, I[G])
            }
          }
        })(C, D)
      } else {
        (function(N, O) {
          var G = function(S) {
            for (var R = 0, P = O.length; R < P; R++) {
              if (O[R].id == S) {
                return O[R]
              }
            }
            var Q = {
              id: S,
              name: S
            };
            return N.addNode(Q)
          };
          for (var K = 0, H = O.length; K < H; K++) {
            N.addNode(O[K]);
            var L = O[K].adjacencies;
            if (L) {
              for (var I = 0, M = L.length; I < M; I++) {
                var F = L[I],
                  J = {};
                if (typeof L[I] != "string") {
                  J = e.merge(F.data, {});
                  F = F.nodeTo
                }
                N.addAdjacence(O[K], G(F), J)
              }
            }
          }
        })(C, D)
      }
      return C
    },
    loadJSON: function(D, C) {
      this.json = D;
      if (this.labels && this.labels.clearLabels) {
        this.labels.clearLabels(true)
      }
      this.graph = this.construct(D);
      if (e.type(D) != "array") {
        this.root = D.id
      } else {
        this.root = D[C ? C : 0].id
      }
    },
    toJSON: function(G) {
      G = G || "tree";
      if (G == "tree") {
        var E = {};
        var D = this.graph.getNode(this.root);
        var E = (function C(J) {
          var H = {};
          H.id = J.id;
          H.name = J.name;
          H.data = J.data;
          var I = [];
          J.eachSubnode(function(K) {
            I.push(C(K))
          });
          H.children = I;
          return H
        })(D);
        return E
      } else {
        var E = [];
        var F = !!this.graph.getNode(this.root).visited;
        this.graph.eachNode(function(I) {
          var H = {};
          H.id = I.id;
          H.name = I.name;
          H.data = I.data;
          var J = [];
          I.eachAdjacency(function(K) {
            var M = K.nodeTo;
            if (!!M.visited === F) {
              var L = {};
              L.nodeTo = M.id;
              L.data = K.data;
              J.push(L)
            }
          });
          H.adjacencies = J;
          E.push(H);
          I.visited = !F
        });
        return E
      }
    }
  };
  var j = $jit.Layouts = {};
  var h = {
    label: null,
    compute: function(F, G, D) {
      this.initializeLabel(D);
      var C = this.label,
        E = C.style;
      F.eachNode(function(J) {
        var N = J.getData("autoWidth"),
          O = J.getData("autoHeight");
        if (N || O) {
          delete J.data.$width;
          delete J.data.$height;
          delete J.data.$dim;
          var H = J.getData("width"),
            P = J.getData("height");
          E.width = N ? "auto" : H + "px";
          E.height = O ? "auto" : P + "px";
          C.innerHTML = J.name;
          var L = C.offsetWidth,
            I = C.offsetHeight;
          var M = J.getData("type");
          if (e.indexOf(["circle", "square", "triangle", "star"], M) === -1) {
            J.setData("width", L);
            J.setData("height", I)
          } else {
            var K = L > I ? L : I;
            J.setData("width", K);
            J.setData("height", K);
            J.setData("dim", K)
          }
        }
      })
    },
    initializeLabel: function(C) {
      if (!this.label) {
        this.label = document.createElement("div");
        document.body.appendChild(this.label)
      }
      this.setLabelStyles(C)
    },
    setLabelStyles: function(C) {
      e.extend(this.label.style, {
        visibility: "hidden",
        position: "absolute",
        width: "auto",
        height: "auto"
      });
      this.label.className = "jit-autoadjust-label"
    }
  };
  j.Tree = (function() {
    var L = Array.prototype.slice;

    function J(V, Q, N, T, O) {
      var S = Q.Node;
      var P = Q.multitree;
      if (S.overridable) {
        var U = -1,
          R = -1;
        V.eachNode(function(Y) {
          if (Y._depth == N && (!P || ("$orn" in Y.data) && Y.data.$orn == T)) {
            var W = Y.getData("width", O);
            var X = Y.getData("height", O);
            U = (U < W) ? W : U;
            R = (R < X) ? X : R
          }
        });
        return {
          width: U < 0 ? S.width : U,
          height: R < 0 ? S.height : R
        }
      } else {
        return S
      }
    }

    function M(O, R, Q, N) {
      var P = (N == "left" || N == "right") ? "y" : "x";
      O.getPos(R)[P] += Q
    }

    function H(O, P) {
      var N = [];
      e.each(O, function(Q) {
        Q = L.call(Q);
        Q[0] += P;
        Q[1] += P;
        N.push(Q)
      });
      return N
    }

    function K(Q, N) {
      if (Q.length == 0) {
        return N
      }
      if (N.length == 0) {
        return Q
      }
      var P = Q.shift(),
        O = N.shift();
      return [
        [P[0], O[1]]
      ].concat(K(Q, N))
    }

    function F(N, O) {
      O = O || [];
      if (N.length == 0) {
        return O
      }
      var P = N.pop();
      return F(N, K(P, O))
    }

    function I(Q, O, R, N, P) {
      if (Q.length <= P || O.length <= P) {
        return 0
      }
      var T = Q[P][1],
        S = O[P][0];
      return Math.max(I(Q, O, R, N, ++P) + R, T - S + N)
    }

    function G(Q, O, N) {
      function P(T, V, S) {
        if (V.length <= S) {
          return []
        }
        var U = V[S],
          R = I(T, U, O, N, 0);
        return [R].concat(P(K(T, H(U, R)), V, ++S))
      }
      return P([], Q, 0)
    }

    function D(R, Q, P) {
      function N(U, W, T) {
        if (W.length <= T) {
          return []
        }
        var V = W[T],
          S = -I(V, U, Q, P, 0);
        return [S].concat(N(K(H(V, S), U), W, ++T))
      }
      R = L.call(R);
      var O = N([], R.reverse(), 0);
      return O.reverse()
    }

    function C(T, R, O, U) {
      var P = G(T, R, O),
        S = D(T, R, O);
      if (U == "left") {
        S = P
      } else {
        if (U == "right") {
          P = S
        }
      }
      for (var Q = 0, N = []; Q < P.length; Q++) {
        N[Q] = (P[Q] + S[Q]) / 2
      }
      return N
    }

    function E(N, X, O, ae, ac) {
      var Q = ae.multitree;
      var W = ["x", "y"],
        T = ["width", "height"];
      var P = +(ac == "left" || ac == "right");
      var U = W[P],
        ad = W[1 - P];
      var Z = ae.Node;
      var S = T[P],
        ab = T[1 - P];
      var R = ae.siblingOffset;
      var aa = ae.subtreeOffset;
      var Y = ae.align;

      function V(ah, al, ap) {
        var ag = ah.getData(S, O);
        var ao = al || (ah.getData(ab, O));
        var at = [],
          aq = [],
          am = false;
        var af = ao + ae.levelDistance;
        ah.eachSubnode(function(av) {
          if (av.exist && (!Q || ("$orn" in av.data) && av.data.$orn == ac)) {
            if (!am) {
              am = J(N, ae, av._depth, ac, O)
            }
            var au = V(av, am[ab], ap + af);
            at.push(au.tree);
            aq.push(au.extent)
          }
        });
        var ak = C(aq, aa, R, Y);
        for (var aj = 0, ai = [], an = []; aj < at.length; aj++) {
          M(at[aj], O, ak[aj], ac);
          an.push(H(aq[aj], ak[aj]))
        }
        var ar = [
          [-ag / 2, ag / 2]
        ].concat(F(an));
        ah.getPos(O)[U] = 0;
        if (ac == "top" || ac == "left") {
          ah.getPos(O)[ad] = ap
        } else {
          ah.getPos(O)[ad] = -ap
        }
        return {
          tree: ah,
          extent: ar
        }
      }
      V(X, false, 0)
    }
    return new t({
      compute: function(P, O) {
        var Q = P || "start";
        var N = this.graph.getNode(this.root);
        e.extend(N, {
          drawn: true,
          exist: true,
          selected: true
        });
        h.compute(this.graph, Q, this.config);
        if (!!O || !("_depth" in N)) {
          this.graph.computeLevels(this.root, 0, "ignore")
        }
        this.computePositions(N, Q)
      },
      computePositions: function(R, N) {
        var P = this.config;
        var O = P.multitree;
        var U = P.align;
        var Q = U !== "center" && P.indent;
        var V = P.orientation;
        var T = O ? ["top", "right", "bottom", "left"] : [V];
        var S = this;
        e.each(T, function(W) {
          E(S.graph, R, N, S.config, W, N);
          var X = ["x", "y"][+(W == "left" || W == "right")];
          (function Y(Z) {
            Z.eachSubnode(function(aa) {
              if (aa.exist && (!O || ("$orn" in aa.data) && aa.data.$orn == W)) {
                aa.getPos(N)[X] += Z.getPos(N)[X];
                if (Q) {
                  aa.getPos(N)[X] += U == "left" ? Q : -Q
                }
                Y(aa)
              }
            })
          })(R)
        })
      }
    })
  })();
  $jit.ST = (function() {
    var D = [];

    function E(J) {
      J = J || this.clickedNode;
      if (!this.config.constrained) {
        return []
      }
      var G = this.geom;
      var N = this.graph;
      var H = this.canvas;
      var F = J._depth,
        K = [];
      N.eachNode(function(O) {
        if (O.exist && !O.selected) {
          if (O.isDescendantOf(J.id)) {
            if (O._depth <= F) {
              K.push(O)
            }
          } else {
            K.push(O)
          }
        }
      });
      var L = G.getRightLevelToShow(J, H);
      J.eachLevel(L, L, function(O) {
        if (O.exist && !O.selected) {
          K.push(O)
        }
      });
      for (var M = 0; M < D.length; M++) {
        var I = this.graph.getNode(D[M]);
        if (!I.isDescendantOf(J.id)) {
          K.push(I)
        }
      }
      return K
    }

    function C(H) {
      var G = [],
        F = this.config;
      H = H || this.clickedNode;
      this.clickedNode.eachLevel(0, F.levelsToShow, function(I) {
        if (F.multitree && !("$orn" in I.data) && I.anySubnode(function(J) {
            return J.exist && !J.drawn
          })) {
          G.push(I)
        } else {
          if (I.drawn && !I.anySubnode("drawn")) {
            G.push(I)
          }
        }
      });
      return G
    }
    return new t({
      Implements: [f, r, j.Tree],
      initialize: function(F) {
        var H = $jit.ST;
        var G = {
          levelsToShow: 2,
          levelDistance: 30,
          constrained: true,
          Node: {
            type: "rectangle"
          },
          duration: 700,
          offsetX: 0,
          offsetY: 0
        };
        this.controller = this.config = e.merge(q("Canvas", "Fx", "Tree", "Node", "Edge", "Controller", "Tips", "NodeStyles", "Events", "Navigation", "Label"), G, F);
        var I = this.config;
        if (I.useCanvas) {
          this.canvas = I.useCanvas;
          this.config.labelContainer = this.canvas.id + "-label"
        } else {
          if (I.background) {
            I.background = e.merge({
              type: "Circles"
            }, I.background)
          }
          this.canvas = new o(this, I);
          this.config.labelContainer = (typeof I.injectInto == "string" ? I.injectInto : I.injectInto.id) + "-label"
        }
        this.graphOptions = {
          complex: true
        };
        this.graph = new g(this.graphOptions, this.config.Node, this.config.Edge);
        this.labels = new H.Label[I.Label.type](this);
        this.fx = new H.Plot(this, H);
        this.op = new H.Op(this);
        this.group = new H.Group(this);
        this.geom = new H.Geom(this);
        this.clickedNode = null;
        this.initializeExtras()
      },
      plot: function() {
        this.fx.plot(this.controller)
      },
      switchPosition: function(K, J, I) {
        var F = this.geom,
          G = this.fx,
          H = this;
        if (!G.busy) {
          G.busy = true;
          this.contract({
            onComplete: function() {
              F.switchOrientation(K);
              H.compute("end", false);
              G.busy = false;
              if (J == "animate") {
                H.onClick(H.clickedNode.id, I)
              } else {
                if (J == "replot") {
                  H.select(H.clickedNode.id, I)
                }
              }
            }
          }, K)
        }
      },
      switchAlignment: function(H, G, F) {
        this.config.align = H;
        if (G == "animate") {
          this.select(this.clickedNode.id, F)
        } else {
          if (G == "replot") {
            this.onClick(this.clickedNode.id, F)
          }
        }
      },
      addNodeInPath: function(F) {
        D.push(F);
        this.select((this.clickedNode && this.clickedNode.id) || this.root)
      },
      clearNodesInPath: function(F) {
        D.length = 0;
        this.select((this.clickedNode && this.clickedNode.id) || this.root)
      },
      refresh: function() {
        this.reposition();
        this.select((this.clickedNode && this.clickedNode.id) || this.root)
      },
      reposition: function() {
        this.graph.computeLevels(this.root, 0, "ignore");
        this.geom.setRightLevelToShow(this.clickedNode, this.canvas);
        this.graph.eachNode(function(F) {
          if (F.exist) {
            F.drawn = true
          }
        });
        this.compute("end")
      },
      requestNodes: function(H, I) {
        var G = e.merge(this.controller, I),
          F = this.config.levelsToShow;
        if (G.request) {
          var K = [],
            J = H._depth;
          H.eachLevel(0, F, function(L) {
            if (L.drawn && !L.anySubnode()) {
              K.push(L);
              L._level = F - (L._depth - J)
            }
          });
          if (!this.config.callLeavesReqOnParentCall) {
            K = [];
            K.push(H)
          }
          this.group.requestNodes(K, G)
        } else {
          G.onComplete()
        }
      },
      contract: function(J, K) {
        var I = this.config.orientation;
        var F = this.geom,
          H = this.group;
        if (K) {
          F.switchOrientation(K)
        }
        var G = E.call(this);
        if (K) {
          F.switchOrientation(I)
        }
        H.contract(G, e.merge(this.controller, J))
      },
      move: function(G, H) {
        this.compute("end", false);
        var F = H.Move,
          I = {
            x: F.offsetX,
            y: F.offsetY
          };
        if (F.enable) {
          this.geom.translate(G.endPos.add(I).$scale(-1), "end")
        }
        this.fx.animate(e.merge(this.controller, {
          modes: ["linear"]
        }, H))
      },
      expand: function(G, H) {
        var F = C.call(this, G);
        this.group.expand(F, e.merge(this.controller, H))
      },
      selectPath: function(I) {
        var H = this;
        this.graph.eachNode(function(K) {
          K.selected = false
        });

        function J(L) {
          if (L == null || L.selected) {
            return
          }
          L.selected = true;
          e.each(H.group.getSiblings([L])[L.id], function(M) {
            M.exist = true;
            M.drawn = true
          });
          var K = L.getParents();
          K = (K.length > 0) ? K[0] : null;
          J(K)
        }
        for (var F = 0, G = [I.id].concat(D); F < G.length; F++) {
          J(this.graph.getNode(G[F]))
        }
      },
      setRoot: function(M, L, K) {
        if (this.busy) {
          return
        }
        this.busy = true;
        var J = this,
          H = this.canvas;
        var F = this.graph.getNode(this.root);
        var G = this.graph.getNode(M);

        function I() {
          if (this.config.multitree && G.data.$orn) {
            var O = G.data.$orn;
            var P = {
              left: "right",
              right: "left",
              top: "bottom",
              bottom: "top"
            }[O];
            F.data.$orn = P;
            (function N(Q) {
              Q.eachSubnode(function(R) {
                if (R.id != M) {
                  R.data.$orn = P;
                  N(R)
                }
              })
            })(F);
            delete G.data.$orn
          }
          this.root = M;
          this.clickedNode = G;
          this.graph.computeLevels(this.root, 0, "ignore");
          this.geom.setRightLevelToShow(G, H, {
            execHide: false,
            onShow: function(Q) {
              if (!Q.drawn) {
                Q.drawn = true;
                Q.setData("alpha", 1, "end");
                Q.setData("alpha", 0);
                Q.pos.setc(G.pos.x, G.pos.y)
              }
            }
          });
          this.compute("end");
          this.busy = true;
          this.fx.animate({
            modes: ["linear", "node-property:alpha"],
            onComplete: function() {
              J.busy = false;
              J.onClick(M, {
                onComplete: function() {
                  K && K.onComplete()
                }
              })
            }
          })
        }
        delete F.data.$orns;
        if (L == "animate") {
          I.call(this);
          J.selectPath(G)
        } else {
          if (L == "replot") {
            I.call(this);
            this.select(this.root)
          }
        }
      },
      addSubtree: function(F, H, G) {
        if (H == "replot") {
          this.op.sum(F, e.extend({
            type: "replot"
          }, G || {}))
        } else {
          if (H == "animate") {
            this.op.sum(F, e.extend({
              type: "fade:seq"
            }, G || {}))
          }
        }
      },
      removeSubtree: function(K, G, J, I) {
        var H = this.graph.getNode(K),
          F = [];
        H.eachLevel(+!G, false, function(L) {
          F.push(L.id)
        });
        if (J == "replot") {
          this.op.removeNode(F, e.extend({
            type: "replot"
          }, I || {}))
        } else {
          if (J == "animate") {
            this.op.removeNode(F, e.extend({
              type: "fade:seq"
            }, I || {}))
          }
        }
      },
      select: function(F, I) {
        var N = this.group,
          L = this.geom;
        var J = this.graph.getNode(F),
          H = this.canvas;
        var M = this.graph.getNode(this.root);
        var G = e.merge(this.controller, I);
        var K = this;
        G.onBeforeCompute(J);
        this.selectPath(J);
        this.clickedNode = J;
        this.requestNodes(J, {
          onComplete: function() {
            N.hide(N.prepare(E.call(K)), G);
            L.setRightLevelToShow(J, H);
            K.compute("current");
            K.graph.eachNode(function(Q) {
              var P = Q.pos.getc(true);
              Q.startPos.setc(P.x, P.y);
              Q.endPos.setc(P.x, P.y);
              Q.visited = false
            });
            var O = {
              x: G.offsetX,
              y: G.offsetY
            };
            K.geom.translate(J.endPos.add(O).$scale(-1), ["start", "current", "end"]);
            N.show(C.call(K));
            K.plot();
            G.onAfterCompute(K.clickedNode);
            G.onComplete()
          }
        })
      },
      onClick: function(G, N) {
        var I = this.canvas,
          M = this,
          F = this.geom,
          J = this.config;
        var L = {
          Move: {
            enable: true,
            offsetX: J.offsetX || 0,
            offsetY: J.offsetY || 0
          },
          setRightLevelToShowConfig: false,
          onBeforeRequest: e.empty,
          onBeforeContract: e.empty,
          onBeforeMove: e.empty,
          onBeforeExpand: e.empty
        };
        var H = e.merge(this.controller, L, N);
        if (!this.busy) {
          this.busy = true;
          var K = this.graph.getNode(G);
          this.selectPath(K, this.clickedNode);
          this.clickedNode = K;
          H.onBeforeCompute(K);
          H.onBeforeRequest(K);
          this.requestNodes(K, {
            onComplete: function() {
              H.onBeforeContract(K);
              M.contract({
                onComplete: function() {
                  F.setRightLevelToShow(K, I, H.setRightLevelToShowConfig);
                  H.onBeforeMove(K);
                  M.move(K, {
                    Move: H.Move,
                    onComplete: function() {
                      H.onBeforeExpand(K);
                      M.expand(K, {
                        onComplete: function() {
                          M.busy = false;
                          H.onAfterCompute(G);
                          H.onComplete()
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  })();
  $jit.ST.$extend = true;
  $jit.ST.Op = new t({
    Implements: g.Op
  });
  $jit.ST.Group = new t({
    initialize: function(C) {
      this.viz = C;
      this.canvas = C.canvas;
      this.config = C.config;
      this.animation = new A;
      this.nodes = null
    },
    requestNodes: function(H, G) {
      var F = 0,
        D = H.length,
        J = {};
      var E = function() {
        G.onComplete()
      };
      var C = this.viz;
      if (D == 0) {
        E()
      }
      for (var I = 0; I < D; I++) {
        J[H[I].id] = H[I];
        G.request(H[I].id, H[I]._level, {
          onComplete: function(L, K) {
            if (K && K.children) {
              K.id = L;
              C.op.sum(K, {
                type: "nothing"
              })
            }
            if (++F == D) {
              C.graph.computeLevels(C.root, 0);
              E()
            }
          }
        })
      }
    },
    contract: function(E, D) {
      var C = this.viz;
      var F = this;
      E = this.prepare(E);
      this.animation.setOptions(e.merge(D, {
        $animating: false,
        compute: function(G) {
          if (G == 1) {
            G = 0.99
          }
          F.plotStep(1 - G, D, this.$animating);
          this.$animating = "contract"
        },
        complete: function() {
          F.hide(E, D)
        }
      })).start()
    },
    hide: function(E, D) {
      var C = this.viz;
      for (var F = 0; F < E.length; F++) {
        if (true || !D || !D.request) {
          E[F].eachLevel(1, false, function(H) {
            if (H.exist) {
              e.extend(H, {
                drawn: false,
                exist: false
              })
            }
          })
        } else {
          var G = [];
          E[F].eachLevel(1, false, function(H) {
            G.push(H.id)
          });
          C.op.removeNode(G, {
            type: "nothing"
          });
          C.labels.clearLabels()
        }
      }
      D.onComplete()
    },
    expand: function(D, C) {
      var E = this;
      this.show(D);
      this.animation.setOptions(e.merge(C, {
        $animating: false,
        compute: function(F) {
          E.plotStep(F, C, this.$animating);
          this.$animating = "expand"
        },
        complete: function() {
          E.plotStep(undefined, C, false);
          C.onComplete()
        }
      })).start()
    },
    show: function(C) {
      var D = this.config;
      this.prepare(C);
      e.each(C, function(F) {
        if (D.multitree && !("$orn" in F.data)) {
          delete F.data.$orns;
          var E = " ";
          F.eachSubnode(function(G) {
            if (("$orn" in G.data) && E.indexOf(G.data.$orn) < 0 && G.exist && !G.drawn) {
              E += G.data.$orn + " "
            }
          });
          F.data.$orns = E
        }
        F.eachLevel(0, D.levelsToShow, function(G) {
          if (G.exist) {
            G.drawn = true
          }
        })
      })
    },
    prepare: function(C) {
      this.nodes = this.getNodesWithChildren(C);
      return this.nodes
    },
    getNodesWithChildren: function(E) {
      var D = [],
        G = this.config,
        C = this.viz.root;
      E.sort(function(K, J) {
        return (K._depth <= J._depth) - (K._depth >= J._depth)
      });
      for (var H = 0; H < E.length; H++) {
        if (E[H].anySubnode("exist")) {
          for (var F = H + 1, I = false; !I && F < E.length; F++) {
            if (!G.multitree || "$orn" in E[F].data) {
              I = I || E[H].isDescendantOf(E[F].id)
            }
          }
          if (!I) {
            D.push(E[H])
          }
        }
      }
      return D
    },
    plotStep: function(M, I, O) {
      var L = this.viz,
        F = this.config,
        E = L.canvas,
        N = E.getCtx(),
        C = this.nodes;
      var H, G;
      var D = {};
      for (H = 0; H < C.length; H++) {
        G = C[H];
        D[G.id] = [];
        var K = F.multitree && !("$orn" in G.data);
        var J = K && G.data.$orns;
        G.eachSubgraph(function(P) {
          if (K && J && J.indexOf(P.data.$orn) > 0 && P.drawn) {
            P.drawn = false;
            D[G.id].push(P)
          } else {
            if ((!K || !J) && P.drawn) {
              P.drawn = false;
              D[G.id].push(P)
            }
          }
        });
        G.drawn = true
      }
      if (C.length > 0) {
        L.fx.plot()
      }
      for (H in D) {
        e.each(D[H], function(P) {
          P.drawn = true
        })
      }
      for (H = 0; H < C.length; H++) {
        G = C[H];
        N.save();
        L.fx.plotSubtree(G, I, M, O);
        N.restore()
      }
    },
    getSiblings: function(C) {
      var D = {};
      e.each(C, function(G) {
        var F = G.getParents();
        if (F.length == 0) {
          D[G.id] = [G]
        } else {
          var E = [];
          F[0].eachSubnode(function(H) {
            E.push(H)
          });
          D[G.id] = E
        }
      });
      return D
    }
  });
  $jit.ST.Geom = new t({
    Implements: g.Geom,
    switchOrientation: function(C) {
      this.config.orientation = C
    },
    dispatch: function() {
      var D = Array.prototype.slice.call(arguments);
      var E = D.shift(),
        C = D.length;
      var F = function(G) {
        return typeof G == "function" ? G() : G
      };
      if (C == 2) {
        return (E == "top" || E == "bottom") ? F(D[0]) : F(D[1])
      } else {
        if (C == 4) {
          switch (E) {
            case "top":
              return F(D[0]);
            case "right":
              return F(D[1]);
            case "bottom":
              return F(D[2]);
            case "left":
              return F(D[3])
          }
        }
      }
      return undefined
    },
    getSize: function(J, I) {
      var H = J.data,
        E = this.config;
      var D = E.siblingOffset;
      var G = (E.multitree && ("$orn" in H) && H.$orn) || E.orientation;
      var C = J.getData("width") + D;
      var F = J.getData("height") + D;
      if (!I) {
        return this.dispatch(G, F, C)
      } else {
        return this.dispatch(G, C, F)
      }
    },
    getTreeBaseSize: function(G, H, D) {
      var E = this.getSize(G, true),
        C = 0,
        F = this;
      if (D(H, G)) {
        return E
      }
      if (H === 0) {
        return 0
      }
      G.eachSubnode(function(I) {
        C += F.getTreeBaseSize(I, H - 1, D)
      });
      return (E > C ? E : C) + this.config.subtreeOffset
    },
    getEdge: function(H, G, F) {
      var D = function(K, J) {
        return function() {
          return H.pos.add(new s(K, J))
        }
      };
      var I = this.node;
      var C = H.getData("width");
      var E = H.getData("height");
      if (G == "begin") {
        if (I.align == "center") {
          return this.dispatch(F, D(0, E / 2), D(-C / 2, 0), D(0, -E / 2), D(C / 2, 0))
        } else {
          if (I.align == "left") {
            return this.dispatch(F, D(0, E), D(0, 0), D(0, 0), D(C, 0))
          } else {
            if (I.align == "right") {
              return this.dispatch(F, D(0, 0), D(-C, 0), D(0, -E), D(0, 0))
            } else {
              throw "align: not implemented"
            }
          }
        }
      } else {
        if (G == "end") {
          if (I.align == "center") {
            return this.dispatch(F, D(0, -E / 2), D(C / 2, 0), D(0, E / 2), D(-C / 2, 0))
          } else {
            if (I.align == "left") {
              return this.dispatch(F, D(0, 0), D(C, 0), D(0, E), D(0, 0))
            } else {
              if (I.align == "right") {
                return this.dispatch(F, D(0, -E), D(0, 0), D(0, 0), D(-C, 0))
              } else {
                throw "align: not implemented"
              }
            }
          }
        }
      }
    },
    getScaledTreePosition: function(G, I) {
      var H = this.node;
      var C = G.getData("width");
      var F = G.getData("height");
      var E = (this.config.multitree && ("$orn" in G.data) && G.data.$orn) || this.config.orientation;
      var D = function(K, J) {
        return function() {
          return G.pos.add(new s(K, J)).$scale(1 - I)
        }
      };
      if (H.align == "left") {
        return this.dispatch(E, D(0, F), D(0, 0), D(0, 0), D(C, 0))
      } else {
        if (H.align == "center") {
          return this.dispatch(E, D(0, F / 2), D(-C / 2, 0), D(0, -F / 2), D(C / 2, 0))
        } else {
          if (H.align == "right") {
            return this.dispatch(E, D(0, 0), D(-C, 0), D(0, -F), D(0, 0))
          } else {
            throw "align: not implemented"
          }
        }
      }
    },
    treeFitsInCanvas: function(H, C, I) {
      var E = C.getSize();
      var F = (this.config.multitree && ("$orn" in H.data) && H.data.$orn) || this.config.orientation;
      var D = this.dispatch(F, E.width, E.height);
      var G = this.getTreeBaseSize(H, I, function(K, J) {
        return K === 0 || !J.anySubnode()
      });
      return (G < D)
    }
  });
  $jit.ST.Plot = new t({
    Implements: g.Plot,
    plotSubtree: function(F, C, G, K) {
      var I = this.viz,
        D = I.canvas,
        E = I.config;
      G = Math.min(Math.max(0.001, G), 1);
      if (G >= 0) {
        F.drawn = false;
        var J = D.getCtx();
        var H = I.geom.getScaledTreePosition(F, G);
        J.translate(H.x, H.y);
        J.scale(G, G)
      }
      this.plotTree(F, e.merge(C, {
        withLabels: true,
        hideLabels: !!G,
        plotSubtree: function(O, M) {
          var L = E.multitree && !("$orn" in F.data);
          var N = L && F.getData("orns");
          return !L || N.indexOf(elem.getData("orn")) > -1
        }
      }), K);
      if (G >= 0) {
        F.drawn = true
      }
    },
    getAlignedPos: function(H, F, C) {
      var E = this.node;
      var G, D;
      if (E.align == "center") {
        G = {
          x: H.x - F / 2,
          y: H.y - C / 2
        }
      } else {
        if (E.align == "left") {
          D = this.config.orientation;
          if (D == "bottom" || D == "top") {
            G = {
              x: H.x - F / 2,
              y: H.y
            }
          } else {
            G = {
              x: H.x,
              y: H.y - C / 2
            }
          }
        } else {
          if (E.align == "right") {
            D = this.config.orientation;
            if (D == "bottom" || D == "top") {
              G = {
                x: H.x - F / 2,
                y: H.y - C
              }
            } else {
              G = {
                x: H.x - F,
                y: H.y - C / 2
              }
            }
          } else {
            throw "align: not implemented"
          }
        }
      }
      return G
    },
    getOrientation: function(C) {
      var E = this.config;
      var D = E.orientation;
      if (E.multitree) {
        var F = C.nodeFrom;
        var G = C.nodeTo;
        D = (("$orn" in F.data) && F.data.$orn) || (("$orn" in G.data) && G.data.$orn)
      }
      return D
    }
  });
  $jit.ST.Label = {};
  $jit.ST.Label.Native = new t({
    Implements: g.Label.Native,
    renderLabel: function(E, F, D) {
      var C = E.getCtx();
      var G = F.pos.getc(true);
      C.fillText(F.name, G.x, G.y)
    }
  });
  $jit.ST.Label.DOM = new t({
    Implements: g.Label.DOM,
    placeLabel: function(U, O, K) {
      var G = O.pos.getc(true),
        T = this.viz.config,
        P = T.Node,
        C = this.viz.canvas,
        H = O.getData("width"),
        R = O.getData("height"),
        D = C.getSize(),
        L, S;
      var F = C.translateOffsetX,
        E = C.translateOffsetY,
        J = C.scaleOffsetX,
        I = C.scaleOffsetY,
        N = G.x * J + F,
        M = G.y * I + E;
      if (P.align == "center") {
        L = {
          x: Math.round(N - H / 2 + D.width / 2),
          y: Math.round(M - R / 2 + D.height / 2)
        }
      } else {
        if (P.align == "left") {
          S = T.orientation;
          if (S == "bottom" || S == "top") {
            L = {
              x: Math.round(N - H / 2 + D.width / 2),
              y: Math.round(M + D.height / 2)
            }
          } else {
            L = {
              x: Math.round(N + D.width / 2),
              y: Math.round(M - R / 2 + D.height / 2)
            }
          }
        } else {
          if (P.align == "right") {
            S = T.orientation;
            if (S == "bottom" || S == "top") {
              L = {
                x: Math.round(N - H / 2 + D.width / 2),
                y: Math.round(M - R + D.height / 2)
              }
            } else {
              L = {
                x: Math.round(N - H + D.width / 2),
                y: Math.round(M - R / 2 + D.height / 2)
              }
            }
          } else {
            throw "align: not implemented"
          }
        }
      }
      var Q = U.style;
      Q.left = L.x + "px";
      Q.top = L.y + "px";
      Q.display = this.fitsInCanvas(L, C) ? "" : "none";
      K.onPlaceLabel(U, O)
    }
  });
  $jit.ST.Label.SVG = new t({
    Implements: [$jit.ST.Label.DOM, g.Label.SVG],
    initialize: function(C) {
      this.viz = C
    }
  });
  $jit.ST.Label.HTML = new t({
    Implements: [$jit.ST.Label.DOM, g.Label.HTML],
    initialize: function(C) {
      this.viz = C
    }
  });
  $jit.ST.Plot.NodeTypes = new t({
    none: {
      render: e.empty,
      contains: e.lambda(false)
    },
    circle: {
      render: function(D, C) {
        var F = D.getData("dim"),
          G = this.getAlignedPos(D.pos.getc(true), F, F),
          E = F / 2;
        this.nodeHelper.circle.render("fill", {
          x: G.x + E,
          y: G.y + E
        }, E, C)
      },
      contains: function(C, G) {
        var E = C.getData("dim"),
          F = this.getAlignedPos(C.pos.getc(true), E, E),
          D = E / 2;
        this.nodeHelper.circle.contains({
          x: F.x + D,
          y: F.y + D
        }, D)
      }
    },
    square: {
      render: function(D, C) {
        var F = D.getData("dim"),
          E = F / 2,
          G = this.getAlignedPos(D.pos.getc(true), F, F);
        this.nodeHelper.square.render("fill", {
          x: G.x + E,
          y: G.y + E
        }, E, C)
      },
      contains: function(C, G) {
        var E = C.getData("dim"),
          F = this.getAlignedPos(C.pos.getc(true), E, E),
          D = E / 2;
        this.nodeHelper.square.contains({
          x: F.x + D,
          y: F.y + D
        }, D)
      }
    },
    ellipse: {
      render: function(F, D) {
        var E = F.getData("width"),
          C = F.getData("height"),
          G = this.getAlignedPos(F.pos.getc(true), E, C);
        this.nodeHelper.ellipse.render("fill", {
          x: G.x + E / 2,
          y: G.y + C / 2
        }, E, C, D)
      },
      contains: function(E, G) {
        var D = E.getData("width"),
          C = E.getData("height"),
          F = this.getAlignedPos(E.pos.getc(true), D, C);
        this.nodeHelper.ellipse.contains({
          x: F.x + D / 2,
          y: F.y + C / 2
        }, D, C, canvas)
      }
    },
    rectangle: {
      render: function(F, D) {
        var E = F.getData("width"),
          C = F.getData("height"),
          G = this.getAlignedPos(F.pos.getc(true), E, C);
        this.nodeHelper.rectangle.render("fill", {
          x: G.x + E / 2,
          y: G.y + C / 2
        }, E, C, D)
      },
      contains: function(E, G) {
        var D = E.getData("width"),
          C = E.getData("height"),
          F = this.getAlignedPos(E.pos.getc(true), D, C);
        this.nodeHelper.rectangle.contains({
          x: F.x + D / 2,
          y: F.y + C / 2
        }, D, C, canvas)
      }
    }
  });
  $jit.ST.Plot.EdgeTypes = new t({
    none: e.empty,
    line: {
      render: function(D, F) {
        var E = this.getOrientation(D),
          G = D.nodeFrom,
          H = D.nodeTo,
          C = G._depth < H._depth,
          J = this.viz.geom.getEdge(C ? G : H, "begin", E),
          I = this.viz.geom.getEdge(C ? H : G, "end", E);
        this.edgeHelper.line.render(J, I, F)
      },
      contains: function(D, J) {
        var E = this.getOrientation(D),
          F = D.nodeFrom,
          G = D.nodeTo,
          C = F._depth < G._depth,
          I = this.viz.geom.getEdge(C ? F : G, "begin", E),
          H = this.viz.geom.getEdge(C ? G : F, "end", E);
        return this.edgeHelper.line.contains(I, H, J, this.edge.epsilon)
      }
    },
    arrow: {
      render: function(I, D) {
        var H = this.getOrientation(I),
          E = I.nodeFrom,
          C = I.nodeTo,
          G = I.getData("dim"),
          K = this.viz.geom.getEdge(E, "begin", H),
          L = this.viz.geom.getEdge(C, "end", H),
          J = I.data.$direction,
          F = (J && J.length > 1 && J[0] != E.id);
        this.edgeHelper.arrow.render(K, L, G, F, D)
      },
      contains: function(D, J) {
        var E = this.getOrientation(D),
          F = D.nodeFrom,
          G = D.nodeTo,
          C = F._depth < G._depth,
          I = this.viz.geom.getEdge(C ? F : G, "begin", E),
          H = this.viz.geom.getEdge(C ? G : F, "end", E);
        return this.edgeHelper.arrow.contains(I, H, J, this.edge.epsilon)
      }
    },
    "quadratic:begin": {
      render: function(I, C) {
        var H = this.getOrientation(I);
        var G = I.nodeFrom,
          J = I.nodeTo,
          L = G._depth < J._depth,
          D = this.viz.geom.getEdge(L ? G : J, "begin", H),
          E = this.viz.geom.getEdge(L ? J : G, "end", H),
          F = I.getData("dim"),
          K = C.getCtx();
        K.beginPath();
        K.moveTo(D.x, D.y);
        switch (H) {
          case "left":
            K.quadraticCurveTo(D.x + F, D.y, E.x, E.y);
            break;
          case "right":
            K.quadraticCurveTo(D.x - F, D.y, E.x, E.y);
            break;
          case "top":
            K.quadraticCurveTo(D.x, D.y + F, E.x, E.y);
            break;
          case "bottom":
            K.quadraticCurveTo(D.x, D.y - F, E.x, E.y);
            break
        }
        K.stroke()
      }
    },
    "quadratic:end": {
      render: function(I, C) {
        var H = this.getOrientation(I);
        var G = I.nodeFrom,
          J = I.nodeTo,
          L = G._depth < J._depth,
          D = this.viz.geom.getEdge(L ? G : J, "begin", H),
          E = this.viz.geom.getEdge(L ? J : G, "end", H),
          F = I.getData("dim"),
          K = C.getCtx();
        K.beginPath();
        K.moveTo(D.x, D.y);
        switch (H) {
          case "left":
            K.quadraticCurveTo(E.x - F, E.y, E.x, E.y);
            break;
          case "right":
            K.quadraticCurveTo(E.x + F, E.y, E.x, E.y);
            break;
          case "top":
            K.quadraticCurveTo(E.x, E.y - F, E.x, E.y);
            break;
          case "bottom":
            K.quadraticCurveTo(E.x, E.y + F, E.x, E.y);
            break
        }
        K.stroke()
      }
    },
    bezier: {
      render: function(I, C) {
        var H = this.getOrientation(I),
          G = I.nodeFrom,
          J = I.nodeTo,
          L = G._depth < J._depth,
          D = this.viz.geom.getEdge(L ? G : J, "begin", H),
          E = this.viz.geom.getEdge(L ? J : G, "end", H),
          F = I.getData("dim"),
          K = C.getCtx();
        K.beginPath();
        K.moveTo(D.x, D.y);
        switch (H) {
          case "left":
            K.bezierCurveTo(D.x + F, D.y, E.x - F, E.y, E.x, E.y);
            break;
          case "right":
            K.bezierCurveTo(D.x - F, D.y, E.x + F, E.y, E.x, E.y);
            break;
          case "top":
            K.bezierCurveTo(D.x, D.y + F, E.x, E.y - F, E.x, E.y);
            break;
          case "bottom":
            K.bezierCurveTo(D.x, D.y - F, E.x, E.y + F, E.x, E.y);
            break
        }
        K.stroke()
      }
    }
  });
  $jit.ST.Plot.NodeTypes.implement({
    "areachart-stacked": {
      render: function(Z, H) {
        var X = Z.pos.getc(true),
          C = Z.getData("width"),
          E = Z.getData("height"),
          K = this.getAlignedPos(X, C, E),
          ae = K.x,
          ad = K.y,
          P = Z.getData("stringArray"),
          J = Z.getData("dimArray"),
          F = Z.getData("valueArray"),
          ag = e.reduce(F, function(am, an) {
            return am + an[0]
          }, 0),
          af = e.reduce(F, function(am, an) {
            return am + an[1]
          }, 0),
          M = Z.getData("colorArray"),
          G = M.length,
          ab = Z.getData("config"),
          N = Z.getData("gradient"),
          al = ab.showLabels,
          R = ab.showAggregates,
          ah = ab.Label,
          W = Z.getData("prev");
        var Q = H.getCtx(),
          L = Z.getData("border");
        if (M && J && P) {
          for (var ak = 0, ai = J.length, O = 0, I = 0, aa = 0; ak < ai; ak++) {
            Q.fillStyle = Q.strokeStyle = M[ak % G];
            Q.save();
            if (N && (J[ak][0] > 0 || J[ak][1] > 0)) {
              var U = O + J[ak][0],
                S = I + J[ak][1],
                aj = Math.atan((S - U) / C),
                ac = 55;
              var Y = Q.createLinearGradient(ae + C / 2, ad - (U + S) / 2, ae + C / 2 + ac * Math.sin(aj), ad - (U + S) / 2 + ac * Math.cos(aj));
              var T = e.rgbToHex(e.map(e.hexToRgb(M[ak % G].slice(1)), function(am) {
                return (am * 0.85) >> 0
              }));
              Y.addColorStop(0, M[ak % G]);
              Y.addColorStop(1, T);
              Q.fillStyle = Y
            }
            Q.beginPath();
            Q.moveTo(ae, ad - O);
            Q.lineTo(ae + C, ad - I);
            Q.lineTo(ae + C, ad - I - J[ak][1]);
            Q.lineTo(ae, ad - O - J[ak][0]);
            Q.lineTo(ae, ad - O);
            Q.fill();
            Q.restore();
            if (L) {
              var V = L.name == P[ak];
              var D = V ? 0.7 : 0.8;
              var T = e.rgbToHex(e.map(e.hexToRgb(M[ak % G].slice(1)), function(am) {
                return (am * D) >> 0
              }));
              Q.strokeStyle = T;
              Q.lineWidth = V ? 4 : 1;
              Q.save();
              Q.beginPath();
              if (L.index === 0) {
                Q.moveTo(ae, ad - O);
                Q.lineTo(ae, ad - O - J[ak][0])
              } else {
                Q.moveTo(ae + C, ad - I);
                Q.lineTo(ae + C, ad - I - J[ak][1])
              }
              Q.stroke();
              Q.restore()
            }
            O += (J[ak][0] || 0);
            I += (J[ak][1] || 0);
            if (J[ak][0] > 0) {
              aa += (F[ak][0] || 0)
            }
          }
          if (W && ah.type == "Native") {
            Q.save();
            Q.beginPath();
            Q.fillStyle = Q.strokeStyle = ah.color;
            Q.font = ah.style + " " + ah.size + "px " + ah.family;
            Q.textAlign = "center";
            Q.textBaseline = "middle";
            if (R(Z.name, ag, af, Z)) {
              Q.fillText(aa, ae, ad - O - ab.labelOffset - ah.size / 2, C)
            }
            if (al(Z.name, ag, af, Z)) {
              Q.fillText(Z.name, ae, ad + ah.size / 2 + ab.labelOffset)
            }
            Q.restore()
          }
        }
      },
      contains: function(G, I) {
        var N = G.pos.getc(true),
          D = G.getData("width"),
          R = G.getData("height"),
          Q = this.getAlignedPos(N, D, R),
          P = Q.x,
          O = Q.y,
          S = G.getData("dimArray"),
          C = I.x - P;
        if (I.x < P || I.x > P + D || I.y > O || I.y < O - R) {
          return false
        }
        for (var J = 0, H = S.length, M = O, E = O; J < H; J++) {
          var F = S[J];
          M -= F[0];
          E -= F[1];
          var K = M + (E - M) * C / D;
          if (I.y >= K) {
            var L = +(C > D / 2);
            return {
              name: G.getData("stringArray")[J],
              color: G.getData("colorArray")[J],
              value: G.getData("valueArray")[J][L],
              index: L
            }
          }
        }
        return false
      }
    }
  });
  $jit.AreaChart = new t({
    st: null,
    colors: ["#416D9C", "#70A35E", "#EBB056", "#C74243", "#83548B", "#909291", "#557EAA"],
    selected: {},
    busy: false,
    initialize: function(E) {
      this.controller = this.config = e.merge(q("Canvas", "Margin", "Label", "AreaChart"), {
        Label: {
          type: "Native"
        }
      }, E);
      var F = this.config.showLabels,
        D = e.type(F),
        G = this.config.showAggregates,
        C = e.type(G);
      this.config.showLabels = D == "function" ? F : e.lambda(F);
      this.config.showAggregates = C == "function" ? G : e.lambda(G);
      this.initializeViz()
    },
    initializeViz: function() {
      var E = this.config,
        H = this,
        C = E.type.split(":")[0],
        G = {};
      var D = new $jit.ST({
        injectInto: E.injectInto,
        orientation: "bottom",
        levelDistance: 0,
        siblingOffset: 0,
        subtreeOffset: 0,
        withLabels: E.Label.type != "Native",
        useCanvas: E.useCanvas,
        Label: {
          type: E.Label.type
        },
        Node: {
          overridable: true,
          type: "areachart-" + C,
          align: "left",
          width: 1,
          height: 1
        },
        Edge: {
          type: "none"
        },
        Tips: {
          enable: E.Tips.enable,
          type: "Native",
          force: true,
          onShow: function(M, L, J) {
            var K = J;
            E.Tips.onShow(M, K, L)
          }
        },
        Events: {
          enable: true,
          type: "Native",
          onClick: function(L, M, J) {
            if (!E.filterOnClick && !E.Events.enable) {
              return
            }
            var K = M.getContains();
            if (K) {
              E.filterOnClick && H.filter(K.name)
            }
            E.Events.enable && E.Events.onClick(K, M, J)
          },
          onRightClick: function(K, L, J) {
            if (!E.restoreOnRightClick) {
              return
            }
            H.restore()
          },
          onMouseMove: function(L, M, J) {
            if (!E.selectOnHover) {
              return
            }
            if (L) {
              var K = M.getContains();
              H.select(L.id, K.name, K.index)
            } else {
              H.select(false, false, false)
            }
          }
        },
        onCreateLabel: function(P, M) {
          var V = E.Label,
            U = M.getData("valueArray"),
            N = e.reduce(U, function(W, X) {
              return W + X[0]
            }, 0),
            S = e.reduce(U, function(W, X) {
              return W + X[1]
            }, 0);
          if (M.getData("prev")) {
            var R = {
              wrapper: document.createElement("div"),
              aggregate: document.createElement("div"),
              label: document.createElement("div")
            };
            var J = R.wrapper,
              T = R.label,
              K = R.aggregate,
              L = J.style,
              Q = T.style,
              O = K.style;
            G[M.id] = R;
            J.appendChild(T);
            J.appendChild(K);
            if (!E.showLabels(M.name, N, S, M)) {
              T.style.display = "none"
            }
            if (!E.showAggregates(M.name, N, S, M)) {
              K.style.display = "none"
            }
            L.position = "relative";
            L.overflow = "visible";
            L.fontSize = V.size + "px";
            L.fontFamily = V.family;
            L.color = V.color;
            L.textAlign = "center";
            O.position = Q.position = "absolute";
            P.style.width = M.getData("width") + "px";
            P.style.height = M.getData("height") + "px";
            T.innerHTML = M.name;
            P.appendChild(J)
          }
        },
        onPlaceLabel: function(aa, U) {
          if (!U.getData("prev")) {
            return
          }
          var Y = G[U.id],
            K = Y.wrapper.style,
            J = Y.label.style,
            T = Y.aggregate.style,
            R = U.getData("width"),
            P = U.getData("height"),
            O = U.getData("dimArray"),
            L = U.getData("valueArray"),
            Q = e.reduce(L, function(ab, ac) {
              return ab + ac[0]
            }, 0),
            M = e.reduce(L, function(ab, ac) {
              return ab + ac[1]
            }, 0),
            N = parseInt(K.fontSize, 10),
            S = aa.style;
          if (O && L) {
            if (E.showLabels(U.name, Q, M, U)) {
              J.display = ""
            } else {
              J.display = "none"
            }
            if (E.showAggregates(U.name, Q, M, U)) {
              T.display = ""
            } else {
              T.display = "none"
            }
            K.width = T.width = J.width = aa.style.width = R + "px";
            T.left = J.left = -R / 2 + "px";
            for (var X = 0, V = L.length, W = 0, Z = 0; X < V; X++) {
              if (O[X][0] > 0) {
                W += L[X][0];
                Z += O[X][0]
              }
            }
            T.top = (-N - E.labelOffset) + "px";
            J.top = (E.labelOffset + Z) + "px";
            aa.style.top = parseInt(aa.style.top, 10) - Z + "px";
            aa.style.height = K.height = Z + "px";
            Y.aggregate.innerHTML = W
          }
        }
      });
      var F = D.canvas.getSize(),
        I = E.Margin;
      D.config.offsetY = -F.height / 2 + I.bottom + (E.showLabels && (E.labelOffset + E.Label.size));
      D.config.offsetX = (I.right - I.left) / 2;
      this.st = D;
      this.canvas = this.st.canvas
    },
    loadJSON: function(T) {
      var Q = e.time(),
        H = [],
        M = this.st,
        W = e.splat(T.label),
        P = e.splat(T.color || this.colors),
        U = this.config,
        D = !!U.type.split(":")[1],
        F = U.animate;
      for (var R = 0, E = T.values, O = E.length; R < O - 1; R++) {
        var V = E[R],
          K = E[R - 1],
          L = E[R + 1];
        var S = e.splat(E[R].values),
          C = e.splat(E[R + 1].values);
        var G = e.zip(S, C);
        var J = 0,
          I = 0;
        H.push({
          id: Q + V.label,
          name: V.label,
          data: {
            value: G,
            "$valueArray": G,
            "$colorArray": P,
            "$stringArray": W,
            "$next": L.label,
            "$prev": K ? K.label : false,
            "$config": U,
            "$gradient": D
          },
          children: []
        })
      }
      var N = {
        id: Q + "$root",
        name: "",
        data: {
          "$type": "none",
          "$width": 1,
          "$height": 1
        },
        children: H
      };
      M.loadJSON(N);
      this.normalizeDims();
      M.compute();
      M.select(M.root);
      if (F) {
        M.fx.animate({
          modes: ["node-property:height:dimArray"],
          duration: 1500
        })
      }
    },
    updateJSON: function(F, I) {
      if (this.busy) {
        return
      }
      this.busy = true;
      var E = this.st,
        H = E.graph,
        J = F.label && e.splat(F.label),
        D = F.values,
        C = this.config.animate,
        G = this;
      e.each(D, function(L) {
        var R = H.getByName(L.label);
        if (R) {
          L.values = e.splat(L.values);
          var M = R.getData("stringArray"),
            Q = R.getData("valueArray");
          e.each(Q, function(S, T) {
            S[0] = L.values[T];
            if (J) {
              M[T] = J[T]
            }
          });
          R.setData("valueArray", Q);
          var O = R.getData("prev"),
            N = R.getData("next"),
            K = H.getByName(N);
          if (O) {
            var P = H.getByName(O);
            if (P) {
              var Q = P.getData("valueArray");
              e.each(Q, function(S, T) {
                S[1] = L.values[T]
              })
            }
          }
          if (!K) {
            var Q = R.getData("valueArray");
            e.each(Q, function(S, T) {
              S[1] = L.values[T]
            })
          }
        }
      });
      this.normalizeDims();
      E.compute();
      E.select(E.root);
      if (C) {
        E.fx.animate({
          modes: ["node-property:height:dimArray"],
          duration: 1500,
          onComplete: function() {
            G.busy = false;
            I && I.onComplete()
          }
        })
      }
    },
    filter: function() {
      if (this.busy) {
        return
      }
      this.busy = true;
      if (this.config.Tips.enable) {
        this.st.tips.hide()
      }
      this.select(false, false, false);
      var D = Array.prototype.slice.call(arguments);
      var C = this.st.graph.getNode(this.st.root);
      var E = this;
      C.eachAdjacency(function(F) {
        var I = F.nodeTo,
          H = I.getData("dimArray"),
          G = I.getData("stringArray");
        I.setData("dimArray", e.map(H, function(K, J) {
          return (e.indexOf(D, G[J]) > -1) ? K : [0, 0]
        }), "end")
      });
      this.st.fx.animate({
        modes: ["node-property:dimArray"],
        duration: 1500,
        onComplete: function() {
          E.busy = false
        }
      })
    },
    restore: function() {
      if (this.busy) {
        return
      }
      this.busy = true;
      if (this.config.Tips.enable) {
        this.st.tips.hide()
      }
      this.select(false, false, false);
      this.normalizeDims();
      var C = this;
      this.st.fx.animate({
        modes: ["node-property:height:dimArray"],
        duration: 1500,
        onComplete: function() {
          C.busy = false
        }
      })
    },
    select: function(H, D, C) {
      if (!this.config.selectOnHover) {
        return
      }
      var E = this.selected;
      if (E.id != H || E.name != D || E.index != C) {
        E.id = H;
        E.name = D;
        E.index = C;
        this.st.graph.eachNode(function(I) {
          I.setData("border", false)
        });
        if (H) {
          var G = this.st.graph.getNode(H);
          G.setData("border", E);
          var F = C === 0 ? "prev" : "next";
          F = G.getData(F);
          if (F) {
            G = this.st.graph.getByName(F);
            if (G) {
              G.setData("border", {
                name: D,
                index: 1 - C
              })
            }
          }
        }
        this.st.plot()
      }
    },
    getLegend: function() {
      var E = {};
      var F;
      this.st.graph.getNode(this.st.root).eachAdjacency(function(G) {
        F = G.nodeTo
      });
      var D = F.getData("colorArray"),
        C = D.length;
      e.each(F.getData("stringArray"), function(H, G) {
        E[H] = D[G % C]
      });
      return E
    },
    getMaxValue: function() {
      var C = 0;
      this.st.graph.eachNode(function(H) {
        var E = H.getData("valueArray"),
          D = 0,
          G = 0;
        e.each(E, function(I) {
          D += +I[0];
          G += +I[1]
        });
        var F = G > D ? G : D;
        C = C > F ? C : F
      });
      return C
    },
    normalizeDims: function() {
      var I = this.st.graph.getNode(this.st.root),
        F = 0;
      I.eachAdjacency(function() {
        F++
      });
      var H = this.getMaxValue() || 1,
        L = this.st.canvas.getSize(),
        E = this.config,
        G = E.Margin,
        J = E.labelOffset + E.Label.size,
        C = (L.width - (G.left + G.right)) / F,
        D = E.animate,
        K = L.height - (G.top + G.bottom) - (E.showAggregates && J) - (E.showLabels && J);
      this.st.graph.eachNode(function(R) {
        var O = 0,
          Q = 0,
          M = [];
        e.each(R.getData("valueArray"), function(S) {
          O += +S[0];
          Q += +S[1];
          M.push([0, 0])
        });
        var P = Q > O ? Q : O;
        R.setData("width", C);
        if (D) {
          R.setData("height", P * K / H, "end");
          R.setData("dimArray", e.map(R.getData("valueArray"), function(S) {
            return [S[0] * K / H, S[1] * K / H]
          }), "end");
          var N = R.getData("dimArray");
          if (!N) {
            R.setData("dimArray", M)
          }
        } else {
          R.setData("height", P * K / H);
          R.setData("dimArray", e.map(R.getData("valueArray"), function(S) {
            return [S[0] * K / H, S[1] * K / H]
          }))
        }
      })
    }
  });
  q.BarChart = {
    $extend: true,
    animate: true,
    type: "stacked",
    labelOffset: 3,
    barsOffset: 0,
    hoveredColor: "#9fd4ff",
    orientation: "horizontal",
    showAggregates: true,
    showLabels: true,
    Tips: {
      enable: false,
      onShow: e.empty,
      onHide: e.empty
    },
    Events: {
      enable: false,
      onClick: e.empty
    }
  };
  $jit.ST.Plot.NodeTypes.implement({
    "barchart-stacked": {
      render: function(U, G) {
        var L = U.pos.getc(true),
          T = U.getData("width"),
          R = U.getData("height"),
          P = this.getAlignedPos(L, T, R),
          O = P.x,
          N = P.y,
          Q = U.getData("dimArray"),
          J = U.getData("valueArray"),
          I = U.getData("colorArray"),
          F = I.length,
          ab = U.getData("stringArray");
        var W = G.getCtx(),
          C = {},
          X = U.getData("border"),
          D = U.getData("gradient"),
          ad = U.getData("config"),
          E = ad.orientation == "horizontal",
          H = ad.showAggregates,
          S = ad.showLabels,
          M = ad.Label;
        if (I && Q && ab) {
          for (var aa = 0, V = Q.length, Z = 0, K = 0; aa < V; aa++) {
            W.fillStyle = W.strokeStyle = I[aa % F];
            if (D) {
              var ac;
              if (E) {
                ac = W.createLinearGradient(O + Z + Q[aa] / 2, N, O + Z + Q[aa] / 2, N + R)
              } else {
                ac = W.createLinearGradient(O, N - Z - Q[aa] / 2, O + T, N - Z - Q[aa] / 2)
              }
              var Y = e.rgbToHex(e.map(e.hexToRgb(I[aa % F].slice(1)), function(ae) {
                return (ae * 0.5) >> 0
              }));
              ac.addColorStop(0, Y);
              ac.addColorStop(0.5, I[aa % F]);
              ac.addColorStop(1, Y);
              W.fillStyle = ac
            }
            if (E) {
              W.fillRect(O + Z, N, Q[aa], R)
            } else {
              W.fillRect(O, N - Z - Q[aa], T, Q[aa])
            }
            if (X && X.name == ab[aa]) {
              C.acum = Z;
              C.dimValue = Q[aa]
            }
            Z += (Q[aa] || 0);
            K += (J[aa] || 0)
          }
          if (X) {
            W.save();
            W.lineWidth = 2;
            W.strokeStyle = X.color;
            if (E) {
              W.strokeRect(O + C.acum + 1, N + 1, C.dimValue - 2, R - 2)
            } else {
              W.strokeRect(O + 1, N - C.acum - C.dimValue + 1, T - 2, C.dimValue - 2)
            }
            W.restore()
          }
          if (M.type == "Native") {
            W.save();
            W.fillStyle = W.strokeStyle = M.color;
            W.font = M.style + " " + M.size + "px " + M.family;
            W.textBaseline = "middle";
            if (H(U.name, K)) {
              if (E) {
                W.textAlign = "right";
                W.fillText(K, O + Z - ad.labelOffset, N + R / 2)
              } else {
                W.textAlign = "center";
                W.fillText(K, O + T / 2, N - R - M.size / 2 - ad.labelOffset)
              }
            }
            if (S(U.name, K, U)) {
              if (E) {
                W.textAlign = "center";
                W.translate(O - ad.labelOffset - M.size / 2, N + R / 2);
                W.rotate(Math.PI / 2);
                W.fillText(U.name, 0, 0)
              } else {
                W.textAlign = "center";
                W.fillText(U.name, O + T / 2, N + M.size / 2 + ad.labelOffset)
              }
            }
            W.restore()
          }
        }
      },
      contains: function(H, J) {
        var M = H.pos.getc(true),
          E = H.getData("width"),
          R = H.getData("height"),
          Q = this.getAlignedPos(M, E, R),
          P = Q.x,
          N = Q.y,
          S = H.getData("dimArray"),
          F = H.getData("config"),
          D = J.x - P,
          C = F.orientation == "horizontal";
        if (C) {
          if (J.x < P || J.x > P + E || J.y > N + R || J.y < N) {
            return false
          }
        } else {
          if (J.x < P || J.x > P + E || J.y > N || J.y < N - R) {
            return false
          }
        }
        for (var K = 0, I = S.length, O = (C ? P : N); K < I; K++) {
          var G = S[K];
          if (C) {
            O += G;
            var L = O;
            if (J.x <= L) {
              return {
                name: H.getData("stringArray")[K],
                color: H.getData("colorArray")[K],
                value: H.getData("valueArray")[K],
                label: H.name
              }
            }
          } else {
            O -= G;
            var L = O;
            if (J.y >= L) {
              return {
                name: H.getData("stringArray")[K],
                color: H.getData("colorArray")[K],
                value: H.getData("valueArray")[K],
                label: H.name
              }
            }
          }
        }
        return false
      }
    },
    "barchart-grouped": {
      render: function(V, G) {
        var M = V.pos.getc(true),
          U = V.getData("width"),
          S = V.getData("height"),
          Q = this.getAlignedPos(M, U, S),
          P = Q.x,
          O = Q.y,
          R = V.getData("dimArray"),
          K = V.getData("valueArray"),
          ab = K.length,
          J = V.getData("colorArray"),
          F = J.length,
          ad = V.getData("stringArray");
        var X = G.getCtx(),
          C = {},
          Y = V.getData("border"),
          D = V.getData("gradient"),
          af = V.getData("config"),
          E = af.orientation == "horizontal",
          I = af.showAggregates,
          T = af.showLabels,
          N = af.Label,
          H = (E ? S : U) / ab;
        if (J && R && ad) {
          for (var ac = 0, W = ab, aa = 0, L = 0; ac < W; ac++) {
            X.fillStyle = X.strokeStyle = J[ac % F];
            if (D) {
              var ae;
              if (E) {
                ae = X.createLinearGradient(P + R[ac] / 2, O + H * ac, P + R[ac] / 2, O + H * (ac + 1))
              } else {
                ae = X.createLinearGradient(P + H * ac, O - R[ac] / 2, P + H * (ac + 1), O - R[ac] / 2)
              }
              var Z = e.rgbToHex(e.map(e.hexToRgb(J[ac % F].slice(1)), function(ag) {
                return (ag * 0.5) >> 0
              }));
              ae.addColorStop(0, Z);
              ae.addColorStop(0.5, J[ac % F]);
              ae.addColorStop(1, Z);
              X.fillStyle = ae
            }
            if (E) {
              X.fillRect(P, O + H * ac, R[ac], H)
            } else {
              X.fillRect(P + H * ac, O - R[ac], H, R[ac])
            }
            if (Y && Y.name == ad[ac]) {
              C.acum = H * ac;
              C.dimValue = R[ac]
            }
            aa += (R[ac] || 0);
            L += (K[ac] || 0)
          }
          if (Y) {
            X.save();
            X.lineWidth = 2;
            X.strokeStyle = Y.color;
            if (E) {
              X.strokeRect(P + 1, O + C.acum + 1, C.dimValue - 2, H - 2)
            } else {
              X.strokeRect(P + C.acum + 1, O - C.dimValue + 1, H - 2, C.dimValue - 2)
            }
            X.restore()
          }
          if (N.type == "Native") {
            X.save();
            X.fillStyle = X.strokeStyle = N.color;
            X.font = N.style + " " + N.size + "px " + N.family;
            X.textBaseline = "middle";
            if (I(V.name, L)) {
              if (E) {
                X.textAlign = "right";
                X.fillText(L, P + Math.max.apply(null, R) - af.labelOffset, O + S / 2)
              } else {
                X.textAlign = "center";
                X.fillText(L, P + U / 2, O - Math.max.apply(null, R) - N.size / 2 - af.labelOffset)
              }
            }
            if (T(V.name, L, V)) {
              if (E) {
                X.textAlign = "center";
                X.translate(P - af.labelOffset - N.size / 2, O + S / 2);
                X.rotate(Math.PI / 2);
                X.fillText(V.name, 0, 0)
              } else {
                X.textAlign = "center";
                X.fillText(V.name, P + U / 2, O + N.size / 2 + af.labelOffset)
              }
            }
            X.restore()
          }
        }
      },
      contains: function(N, J) {
        var F = N.pos.getc(true),
          M = N.getData("width"),
          L = N.getData("height"),
          I = this.getAlignedPos(F, M, L),
          H = I.x,
          G = I.y,
          K = N.getData("dimArray"),
          Q = K.length,
          T = N.getData("config"),
          E = J.x - H,
          C = T.orientation == "horizontal",
          D = (C ? L : M) / Q;
        if (C) {
          if (J.x < H || J.x > H + M || J.y > G + L || J.y < G) {
            return false
          }
        } else {
          if (J.x < H || J.x > H + M || J.y > G || J.y < G - L) {
            return false
          }
        }
        for (var P = 0, O = K.length; P < O; P++) {
          var S = K[P];
          if (C) {
            var R = G + D * P;
            if (J.x <= H + S && J.y >= R && J.y <= R + D) {
              return {
                name: N.getData("stringArray")[P],
                color: N.getData("colorArray")[P],
                value: N.getData("valueArray")[P],
                label: N.name
              }
            }
          } else {
            var R = H + D * P;
            if (J.x >= R && J.x <= R + D && J.y >= G - S) {
              return {
                name: N.getData("stringArray")[P],
                color: N.getData("colorArray")[P],
                value: N.getData("valueArray")[P],
                label: N.name
              }
            }
          }
        }
        return false
      }
    }
  });
  $jit.BarChart = new t({
    st: null,
    colors: ["#416D9C", "#70A35E", "#EBB056", "#C74243", "#83548B", "#909291", "#557EAA"],
    selected: {},
    busy: false,
    initialize: function(E) {
      this.controller = this.config = e.merge(q("Canvas", "Margin", "Label", "BarChart"), {
        Label: {
          type: "Native"
        }
      }, E);
      var F = this.config.showLabels,
        D = e.type(F),
        G = this.config.showAggregates,
        C = e.type(G);
      this.config.showLabels = D == "function" ? F : e.lambda(F);
      this.config.showAggregates = C == "function" ? G : e.lambda(G);
      this.initializeViz()
    },
    initializeViz: function() {
      var E = this.config,
        H = this;
      var C = E.type.split(":")[0],
        J = E.orientation == "horizontal",
        G = {};
      var D = new $jit.ST({
        injectInto: E.injectInto,
        orientation: J ? "left" : "bottom",
        levelDistance: 0,
        siblingOffset: E.barsOffset,
        subtreeOffset: 0,
        withLabels: E.Label.type != "Native",
        useCanvas: E.useCanvas,
        Label: {
          type: E.Label.type
        },
        Node: {
          overridable: true,
          type: "barchart-" + C,
          align: "left",
          width: 1,
          height: 1
        },
        Edge: {
          type: "none"
        },
        Tips: {
          enable: E.Tips.enable,
          type: "Native",
          force: true,
          onShow: function(N, M, K) {
            var L = K;
            E.Tips.onShow(N, L, M)
          }
        },
        Events: {
          enable: true,
          type: "Native",
          onClick: function(M, N, K) {
            if (!E.Events.enable) {
              return
            }
            var L = N.getContains();
            E.Events.onClick(L, N, K)
          },
          onMouseMove: function(M, N, K) {
            if (!E.hoveredColor) {
              return
            }
            if (M) {
              var L = N.getContains();
              H.select(M.id, L.name, L.index)
            } else {
              H.select(false, false, false)
            }
          }
        },
        onCreateLabel: function(P, N) {
          var V = E.Label,
            T = N.getData("valueArray"),
            S = e.reduce(T, function(W, X) {
              return W + X
            }, 0);
          var R = {
            wrapper: document.createElement("div"),
            aggregate: document.createElement("div"),
            label: document.createElement("div")
          };
          var K = R.wrapper,
            U = R.label,
            L = R.aggregate,
            M = K.style,
            Q = U.style,
            O = L.style;
          G[N.id] = R;
          K.appendChild(U);
          K.appendChild(L);
          if (!E.showLabels(N.name, S, N)) {
            Q.display = "none"
          }
          if (!E.showAggregates(N.name, S, N)) {
            O.display = "none"
          }
          M.position = "relative";
          M.overflow = "visible";
          M.fontSize = V.size + "px";
          M.fontFamily = V.family;
          M.color = V.color;
          M.textAlign = "center";
          O.position = Q.position = "absolute";
          P.style.width = N.getData("width") + "px";
          P.style.height = N.getData("height") + "px";
          O.left = Q.left = "0px";
          U.innerHTML = N.name;
          P.appendChild(K)
        },
        onPlaceLabel: function(R, N) {
          if (!G[N.id]) {
            return
          }
          var T = G[N.id],
            O = T.wrapper.style,
            V = T.label.style,
            S = T.aggregate.style,
            W = E.type.split(":")[0] == "grouped",
            K = E.orientation == "horizontal",
            Z = N.getData("dimArray"),
            aa = N.getData("valueArray"),
            L = (W && K) ? Math.max.apply(null, Z) : N.getData("width"),
            Y = (W && !K) ? Math.max.apply(null, Z) : N.getData("height"),
            M = parseInt(O.fontSize, 10),
            U = R.style;
          if (Z && aa) {
            O.width = S.width = V.width = R.style.width = L + "px";
            for (var Q = 0, P = aa.length, X = 0; Q < P; Q++) {
              if (Z[Q] > 0) {
                X += aa[Q]
              }
            }
            if (E.showLabels(N.name, X, N)) {
              V.display = ""
            } else {
              V.display = "none"
            }
            if (E.showAggregates(N.name, X, N)) {
              S.display = ""
            } else {
              S.display = "none"
            }
            if (E.orientation == "horizontal") {
              S.textAlign = "right";
              V.textAlign = "left";
              V.textIndex = S.textIndent = E.labelOffset + "px";
              S.top = V.top = (Y - M) / 2 + "px";
              R.style.height = O.height = Y + "px"
            } else {
              S.top = (-M - E.labelOffset) + "px";
              V.top = (E.labelOffset + Y) + "px";
              R.style.top = parseInt(R.style.top, 10) - Y + "px";
              R.style.height = O.height = Y + "px"
            }
            T.aggregate.innerHTML = X
          }
        }
      });
      var F = D.canvas.getSize(),
        I = E.Margin;
      if (J) {
        D.config.offsetX = F.width / 2 - I.left - (E.showLabels && (E.labelOffset + E.Label.size));
        D.config.offsetY = (I.bottom - I.top) / 2
      } else {
        D.config.offsetY = -F.height / 2 + I.bottom + (E.showLabels && (E.labelOffset + E.Label.size));
        D.config.offsetX = (I.right - I.left) / 2
      }
      this.st = D;
      this.canvas = this.st.canvas
    },
    loadJSON: function(Q) {
      if (this.busy) {
        return
      }
      this.busy = true;
      var O = e.time(),
        I = [],
        J = this.st,
        T = e.splat(Q.label),
        N = e.splat(Q.color || this.colors),
        R = this.config,
        C = !!R.type.split(":")[1],
        F = R.animate,
        E = R.orientation == "horizontal",
        G = this;
      for (var P = 0, D = Q.values, L = D.length; P < L; P++) {
        var S = D[P];
        var H = e.splat(D[P].values);
        var M = 0;
        I.push({
          id: O + S.label,
          name: S.label,
          data: {
            value: H,
            "$valueArray": H,
            "$colorArray": N,
            "$stringArray": T,
            "$gradient": C,
            "$config": R
          },
          children: []
        })
      }
      var K = {
        id: O + "$root",
        name: "",
        data: {
          "$type": "none",
          "$width": 1,
          "$height": 1
        },
        children: I
      };
      J.loadJSON(K);
      this.normalizeDims();
      J.compute();
      J.select(J.root);
      if (F) {
        if (E) {
          J.fx.animate({
            modes: ["node-property:width:dimArray"],
            duration: 1500,
            onComplete: function() {
              G.busy = false
            }
          })
        } else {
          J.fx.animate({
            modes: ["node-property:height:dimArray"],
            duration: 1500,
            onComplete: function() {
              G.busy = false
            }
          })
        }
      } else {
        this.busy = false
      }
    },
    updateJSON: function(F, I) {
      if (this.busy) {
        return
      }
      this.busy = true;
      var E = this.st;
      var H = E.graph;
      var D = F.values;
      var C = this.config.animate;
      var G = this;
      var J = this.config.orientation == "horizontal";
      e.each(D, function(K) {
        var L = H.getByName(K.label);
        if (L) {
          L.setData("valueArray", e.splat(K.values));
          if (F.label) {
            L.setData("stringArray", e.splat(F.label))
          }
        }
      });
      this.normalizeDims();
      E.compute();
      E.select(E.root);
      if (C) {
        if (J) {
          E.fx.animate({
            modes: ["node-property:width:dimArray"],
            duration: 1500,
            onComplete: function() {
              G.busy = false;
              I && I.onComplete()
            }
          })
        } else {
          E.fx.animate({
            modes: ["node-property:height:dimArray"],
            duration: 1500,
            onComplete: function() {
              G.busy = false;
              I && I.onComplete()
            }
          })
        }
      }
    },
    select: function(E, C) {
      if (!this.config.hoveredColor) {
        return
      }
      var D = this.selected;
      if (D.id != E || D.name != C) {
        D.id = E;
        D.name = C;
        D.color = this.config.hoveredColor;
        this.st.graph.eachNode(function(F) {
          if (E == F.id) {
            F.setData("border", D)
          } else {
            F.setData("border", false)
          }
        });
        this.st.plot()
      }
    },
    getLegend: function() {
      var E = {};
      var F;
      this.st.graph.getNode(this.st.root).eachAdjacency(function(G) {
        F = G.nodeTo
      });
      var D = F.getData("colorArray"),
        C = D.length;
      e.each(F.getData("stringArray"), function(H, G) {
        E[H] = D[G % C]
      });
      return E
    },
    getMaxValue: function() {
      var D = 0,
        C = this.config.type.split(":")[0] == "stacked";
      this.st.graph.eachNode(function(G) {
        var E = G.getData("valueArray"),
          F = 0;
        if (!E) {
          return
        }
        if (C) {
          e.each(E, function(H) {
            F += +H
          })
        } else {
          F = Math.max.apply(null, E)
        }
        D = D > F ? D : F
      });
      return D
    },
    setBarType: function(C) {
      this.config.type = C;
      this.st.config.Node.type = "barchart-" + C.split(":")[0]
    },
    normalizeDims: function() {
      var M = this.st.graph.getNode(this.st.root),
        H = 0;
      M.eachAdjacency(function() {
        H++
      });
      var J = this.getMaxValue() || 1,
        P = this.st.canvas.getSize(),
        F = this.config,
        I = F.Margin,
        N = I.left + I.right,
        G = I.top + I.bottom,
        D = F.orientation == "horizontal",
        C = (P[D ? "height" : "width"] - (D ? G : N) - (H - 1) * F.barsOffset) / H,
        E = F.animate,
        O = P[D ? "width" : "height"] - (D ? N : G) - (!D && F.showAggregates && (F.Label.size + F.labelOffset)) - (F.showLabels && (F.Label.size + F.labelOffset)),
        L = D ? "height" : "width",
        K = D ? "width" : "height";
      this.st.graph.eachNode(function(T) {
        var S = 0,
          Q = [];
        e.each(T.getData("valueArray"), function(U) {
          S += +U;
          Q.push(0)
        });
        T.setData(L, C);
        if (E) {
          T.setData(K, S * O / J, "end");
          T.setData("dimArray", e.map(T.getData("valueArray"), function(U) {
            return U * O / J
          }), "end");
          var R = T.getData("dimArray");
          if (!R) {
            T.setData("dimArray", Q)
          }
        } else {
          T.setData(K, S * O / J);
          T.setData("dimArray", e.map(T.getData("valueArray"), function(U) {
            return U * O / J
          }))
        }
      })
    }
  });
  q.PieChart = {
    $extend: true,
    animate: true,
    offset: 25,
    sliceOffset: 0,
    labelOffset: 3,
    type: "stacked",
    hoveredColor: "#9fd4ff",
    Events: {
      enable: false,
      onClick: e.empty
    },
    Tips: {
      enable: false,
      onShow: e.empty,
      onHide: e.empty
    },
    showLabels: true,
    resizeLabels: false,
    updateHeights: false
  };
  j.Radial = new t({
    compute: function(D) {
      var E = e.splat(D || ["current", "start", "end"]);
      h.compute(this.graph, E, this.config);
      this.graph.computeLevels(this.root, 0, "ignore");
      var C = this.createLevelDistanceFunc();
      this.computeAngularWidths(E);
      this.computePositions(E, C)
    },
    computePositions: function(J, G) {
      var L = J;
      var K = this.graph;
      var H = K.getNode(this.root);
      var I = this.parent;
      var C = this.config;
      for (var E = 0, D = L.length; E < D; E++) {
        var F = L[E];
        H.setPos(n(0, 0), F);
        H.setData("span", Math.PI * 2, F)
      }
      H.angleSpan = {
        begin: 0,
        end: 2 * Math.PI
      };
      K.eachBFS(this.root, function(Q) {
        var W = Q.angleSpan.end - Q.angleSpan.begin;
        var Y = Q.angleSpan.begin;
        var X = G(Q);
        var Z = 0,
          M = [],
          P = {};
        Q.eachSubnode(function(ac) {
          Z += ac._treeAngularWidth;
          for (var ad = 0, ab = L.length; ad < ab; ad++) {
            var af = L[ad],
              ae = ac.getData("dim", af);
            P[af] = (af in P) ? (ae > P[af] ? ae : P[af]) : ae
          }
          M.push(ac)
        }, "ignore");
        if (I && I.id == Q.id && M.length > 0 && M[0].dist) {
          M.sort(function(ac, ab) {
            return (ac.dist >= ab.dist) - (ac.dist <= ab.dist)
          })
        }
        for (var S = 0, U = M.length; S < U; S++) {
          var O = M[S];
          if (!O._flag) {
            var aa = O._treeAngularWidth / Z * W;
            var N = Y + aa / 2;
            for (var T = 0, R = L.length; T < R; T++) {
              var V = L[T];
              O.setPos(n(N, X), V);
              O.setData("span", aa, V);
              O.setData("dim-quotient", O.getData("dim", V) / P[V], V)
            }
            O.angleSpan = {
              begin: Y,
              end: Y + aa
            };
            Y += aa
          }
        }
      }, "ignore")
    },
    setAngularWidthForNodes: function(C) {
      this.graph.eachBFS(this.root, function(F, D) {
        var E = F.getData("angularWidth", C[0]) || 5;
        F._angularWidth = E / D
      }, "ignore")
    },
    setSubtreesAngularWidth: function() {
      var C = this;
      this.graph.eachNode(function(D) {
        C.setSubtreeAngularWidth(D)
      }, "ignore")
    },
    setSubtreeAngularWidth: function(F) {
      var E = this,
        D = F._angularWidth,
        C = 0;
      F.eachSubnode(function(G) {
        E.setSubtreeAngularWidth(G);
        C += G._treeAngularWidth
      }, "ignore");
      F._treeAngularWidth = Math.max(D, C)
    },
    computeAngularWidths: function(C) {
      this.setAngularWidthForNodes(C);
      this.setSubtreesAngularWidth()
    }
  });
  $jit.Sunburst = new t({
    Implements: [f, r, j.Radial],
    initialize: function(C) {
      var E = $jit.Sunburst;
      var D = {
        interpolation: "linear",
        levelDistance: 100,
        Node: {
          type: "multipie",
          height: 0
        },
        Edge: {
          type: "none"
        },
        Label: {
          textAlign: "start",
          textBaseline: "middle"
        }
      };
      this.controller = this.config = e.merge(q("Canvas", "Node", "Edge", "Fx", "Tips", "NodeStyles", "Events", "Navigation", "Controller", "Label"), D, C);
      var F = this.config;
      if (F.useCanvas) {
        this.canvas = F.useCanvas;
        this.config.labelContainer = this.canvas.id + "-label"
      } else {
        if (F.background) {
          F.background = e.merge({
            type: "Circles"
          }, F.background)
        }
        this.canvas = new o(this, F);
        this.config.labelContainer = (typeof F.injectInto == "string" ? F.injectInto : F.injectInto.id) + "-label"
      }
      this.graphOptions = {
        complex: false,
        Node: {
          selected: false,
          exist: true,
          drawn: true
        }
      };
      this.graph = new g(this.graphOptions, this.config.Node, this.config.Edge);
      this.labels = new E.Label[F.Label.type](this);
      this.fx = new E.Plot(this, E);
      this.op = new E.Op(this);
      this.json = null;
      this.root = null;
      this.rotated = null;
      this.busy = false;
      this.initializeExtras()
    },
    createLevelDistanceFunc: function() {
      var C = this.config.levelDistance;
      return function(D) {
        return (D._depth + 1) * C
      }
    },
    refresh: function() {
      this.compute();
      this.plot()
    },
    reposition: function() {
      this.compute("end")
    },
    rotate: function(E, F, D) {
      var C = E.getPos(D.property || "current").getp(true).theta;
      this.rotated = E;
      this.rotateAngle(-C, F, D)
    },
    rotateAngle: function(E, H, D) {
      var F = this;
      var C = e.merge(this.config, D || {}, {
        modes: ["polar"]
      });
      var G = D.property || (H === "animate" ? "end" : "current");
      if (H === "animate") {
        this.fx.animation.pause()
      }
      this.graph.eachNode(function(J) {
        var I = J.getPos(G);
        I.theta += E;
        if (I.theta < 0) {
          I.theta += Math.PI * 2
        }
      });
      if (H == "animate") {
        this.fx.animate(C)
      } else {
        if (H == "replot") {
          this.fx.plot();
          this.busy = false
        }
      }
    },
    plot: function() {
      this.fx.plot()
    }
  });
  $jit.Sunburst.$extend = true;
  (function(C) {
    C.Op = new t({
      Implements: g.Op
    });
    C.Plot = new t({
      Implements: g.Plot
    });
    C.Label = {};
    C.Label.Native = new t({
      Implements: g.Label.Native,
      initialize: function(D) {
        this.viz = D;
        this.label = D.config.Label;
        this.config = D.config
      },
      renderLabel: function(G, I, K) {
        var R = I.getData("span");
        if (R < Math.PI / 2 && Math.tan(R) * this.config.levelDistance * I._depth < 10) {
          return
        }
        var S = G.getCtx();
        var E = S.measureText(I.name);
        if (I.id == this.viz.root) {
          var Q = -E.width / 2,
            O = 0,
            P = 0;
          var D = 0
        } else {
          var H = 5;
          var D = K.levelDistance - H;
          var N = I.pos.clone();
          N.rho += H;
          var F = N.getp(true);
          var L = N.getc(true);
          var Q = L.x,
            O = L.y;
          var J = Math.PI;
          var M = (F.theta > J / 2 && F.theta < 3 * J / 2);
          var P = M ? F.theta + J : F.theta;
          if (M) {
            Q -= Math.abs(Math.cos(F.theta) * E.width);
            O += Math.sin(F.theta) * E.width
          } else {
            if (I.id == this.viz.root) {
              Q -= E.width / 2
            }
          }
        }
        S.save();
        S.translate(Q, O);
        S.rotate(P);
        S.fillText(I.name, 0, 0);
        S.restore()
      }
    });
    C.Label.SVG = new t({
      Implements: g.Label.SVG,
      initialize: function(D) {
        this.viz = D
      },
      placeLabel: function(R, G, I) {
        var N = G.pos.getc(true),
          Q = this.viz,
          E = this.viz.canvas;
        var J = E.getSize();
        var F = {
          x: Math.round(N.x + J.width / 2),
          y: Math.round(N.y + J.height / 2)
        };
        R.setAttribute("x", F.x);
        R.setAttribute("y", F.y);
        var K = R.getBBox();
        if (K) {
          var P = R.getAttribute("x");
          var M = R.getAttribute("y");
          var D = G.pos.getp(true);
          var H = Math.PI;
          var L = (D.theta > H / 2 && D.theta < 3 * H / 2);
          if (L) {
            R.setAttribute("x", P - K.width);
            R.setAttribute("y", M - K.height)
          } else {
            if (G.id == Q.root) {
              R.setAttribute("x", P - K.width / 2)
            }
          }
          var O = L ? D.theta + H : D.theta;
          if (G._depth) {
            R.setAttribute("transform", "rotate(" + O * 360 / (2 * H) + " " + P + " " + M + ")")
          }
        }
        I.onPlaceLabel(R, G)
      }
    });
    C.Label.HTML = new t({
      Implements: g.Label.HTML,
      initialize: function(D) {
        this.viz = D
      },
      placeLabel: function(M, G, I) {
        var K = G.pos.clone(),
          E = this.viz.canvas,
          L = G.getData("height"),
          H = ((L || G._depth == 0) ? L : this.viz.config.levelDistance) / 2,
          J = E.getSize();
        K.rho += H;
        K = K.getc(true);
        var F = {
          x: Math.round(K.x + J.width / 2),
          y: Math.round(K.y + J.height / 2)
        };
        var D = M.style;
        D.left = F.x + "px";
        D.top = F.y + "px";
        D.display = this.fitsInCanvas(F, E) ? "" : "none";
        I.onPlaceLabel(M, G)
      }
    });
    C.Plot.NodeTypes = new t({
      none: {
        render: e.empty,
        contains: e.lambda(false),
        anglecontains: function(H, J) {
          var G = H.getData("span") / 2,
            E = H.pos.theta;
          var F = E - G,
            D = E + G;
          if (F < 0) {
            F += Math.PI * 2
          }
          var I = Math.atan2(J.y, J.x);
          if (I < 0) {
            I += Math.PI * 2
          }
          if (F > D) {
            return (I > F && I <= Math.PI * 2) || I < D
          } else {
            return I > F && I < D
          }
        }
      },
      pie: {
        render: function(I, G) {
          var M = I.getData("span") / 2,
            F = I.pos.theta;
          var H = F - M,
            J = F + M;
          var L = I.pos.getp(true);
          var D = new c(L.rho, H);
          var E = D.getc(true);
          D.theta = J;
          var K = D.getc(true);
          var N = G.getCtx();
          N.beginPath();
          N.moveTo(0, 0);
          N.lineTo(E.x, E.y);
          N.moveTo(0, 0);
          N.lineTo(K.x, K.y);
          N.moveTo(0, 0);
          N.arc(0, 0, L.rho * I.getData("dim-quotient"), H, J, false);
          N.fill()
        },
        contains: function(F, H) {
          if (this.nodeTypes.none.anglecontains.call(this, F, H)) {
            var D = Math.sqrt(H.x * H.x + H.y * H.y);
            var E = this.config.levelDistance,
              G = F._depth;
            return (D <= E * G)
          }
          return false
        }
      },
      multipie: {
        render: function(J, H) {
          var Q = J.getData("height");
          var K = Q ? Q : this.config.levelDistance;
          var P = J.getData("span") / 2,
            G = J.pos.theta;
          var I = G - P,
            M = G + P;
          var O = J.pos.getp(true);
          var E = new c(O.rho, I);
          var F = E.getc(true);
          E.theta = M;
          var N = E.getc(true);
          E.rho += K;
          var D = E.getc(true);
          E.theta = I;
          var L = E.getc(true);
          var R = H.getCtx();
          R.moveTo(0, 0);
          R.beginPath();
          R.arc(0, 0, O.rho, I, M, false);
          R.arc(0, 0, O.rho + K, M, I, true);
          R.moveTo(F.x, F.y);
          R.lineTo(L.x, L.y);
          R.moveTo(N.x, N.y);
          R.lineTo(D.x, D.y);
          R.fill();
          if (J.collapsed) {
            R.save();
            R.lineWidth = 2;
            R.moveTo(0, 0);
            R.beginPath();
            R.arc(0, 0, O.rho + K + 5, M - 0.01, I + 0.01, true);
            R.stroke();
            R.restore()
          }
        },
        contains: function(G, J) {
          if (this.nodeTypes.none.anglecontains.call(this, G, J)) {
            var E = Math.sqrt(J.x * J.x + J.y * J.y);
            var D = G.getData("height");
            var H = D ? D : this.config.levelDistance;
            var F = this.config.levelDistance,
              I = G._depth;
            return (E >= F * I) && (E <= (F * I + H))
          }
          return false
        }
      },
      "gradient-multipie": {
        render: function(G, D) {
          var L = D.getCtx();
          var K = G.getData("height");
          var H = K ? K : this.config.levelDistance;
          var E = L.createRadialGradient(0, 0, G.getPos().rho, 0, 0, G.getPos().rho + H);
          var J = e.hexToRgb(G.getData("color")),
            I = [];
          e.each(J, function(M) {
            I.push(parseInt(M * 0.5, 10))
          });
          var F = e.rgbToHex(I);
          E.addColorStop(0, F);
          E.addColorStop(1, G.getData("color"));
          L.fillStyle = E;
          this.nodeTypes.multipie.render.call(this, G, D)
        },
        contains: function(D, E) {
          return this.nodeTypes.multipie.contains.call(this, D, E)
        }
      },
      "gradient-pie": {
        render: function(I, F) {
          var D = F.getCtx();
          var J = D.createRadialGradient(0, 0, 0, 0, 0, I.getPos().rho);
          var H = e.hexToRgb(I.getData("color")),
            E = [];
          e.each(H, function(K) {
            E.push(parseInt(K * 0.5, 10))
          });
          var G = e.rgbToHex(E);
          J.addColorStop(1, G);
          J.addColorStop(0, I.getData("color"));
          D.fillStyle = J;
          this.nodeTypes.pie.render.call(this, I, F)
        },
        contains: function(D, E) {
          return this.nodeTypes.pie.contains.call(this, D, E)
        }
      }
    });
    C.Plot.EdgeTypes = new t({
      none: e.empty,
      line: {
        render: function(D, E) {
          var G = D.nodeFrom.pos.getc(true),
            F = D.nodeTo.pos.getc(true);
          this.edgeHelper.line.render(G, F, E)
        },
        contains: function(D, G) {
          var F = D.nodeFrom.pos.getc(true),
            E = D.nodeTo.pos.getc(true);
          return this.edgeHelper.line.contains(F, E, G, this.edge.epsilon)
        }
      },
      arrow: {
        render: function(E, F) {
          var J = E.nodeFrom.pos.getc(true),
            I = E.nodeTo.pos.getc(true),
            H = E.getData("dim"),
            G = E.data.$direction,
            D = (G && G.length > 1 && G[0] != E.nodeFrom.id);
          this.edgeHelper.arrow.render(J, I, H, D, F)
        },
        contains: function(D, G) {
          var F = D.nodeFrom.pos.getc(true),
            E = D.nodeTo.pos.getc(true);
          return this.edgeHelper.arrow.contains(F, E, G, this.edge.epsilon)
        }
      },
      hyperline: {
        render: function(D, E) {
          var H = D.nodeFrom.pos.getc(),
            G = D.nodeTo.pos.getc(),
            F = Math.max(H.norm(), G.norm());
          this.edgeHelper.hyperline.render(H.$scale(1 / F), G.$scale(1 / F), F, E)
        },
        contains: e.lambda(false)
      }
    })
  })($jit.Sunburst);
  $jit.Sunburst.Plot.NodeTypes.implement({
    "piechart-stacked": {
      render: function(aa, G) {
        var Z = aa.pos.getp(true),
          I = aa.getData("dimArray"),
          Y = aa.getData("valueArray"),
          M = aa.getData("colorArray"),
          F = M.length,
          S = aa.getData("stringArray"),
          V = aa.getData("span") / 2,
          Q = aa.pos.theta,
          L = Q - V,
          P = Q + V,
          X = new c;
        var T = G.getCtx(),
          R = {},
          O = aa.getData("gradient"),
          J = aa.getData("border"),
          af = aa.getData("config"),
          ao = af.showLabels,
          ae = af.resizeLabels,
          ah = af.Label;
        var ak = af.sliceOffset * Math.cos((L + P) / 2);
        var K = af.sliceOffset * Math.sin((L + P) / 2);
        if (M && I && S) {
          for (var al = 0, ai = I.length, C = 0, ad = 0; al < ai; al++) {
            var H = I[al],
              am = M[al % F];
            if (H <= 0) {
              continue
            }
            T.fillStyle = T.strokeStyle = am;
            if (O && H) {
              var aj = T.createRadialGradient(ak, K, C + af.sliceOffset, ak, K, C + H + af.sliceOffset);
              var D = e.hexToRgb(am),
                ac = e.map(D, function(ar) {
                  return (ar * 0.8) >> 0
                }),
                E = e.rgbToHex(ac);
              aj.addColorStop(0, am);
              aj.addColorStop(0.5, am);
              aj.addColorStop(1, E);
              T.fillStyle = aj
            }
            X.rho = C + af.sliceOffset;
            X.theta = L;
            var an = X.getc(true);
            X.theta = P;
            var U = X.getc(true);
            X.rho += H;
            var ap = X.getc(true);
            X.theta = L;
            var W = X.getc(true);
            T.beginPath();
            T.arc(ak, K, C + 0.01, L, P, false);
            T.arc(ak, K, C + H + 0.01, P, L, true);
            T.fill();
            if (J && J.name == S[al]) {
              R.acum = C;
              R.dimValue = I[al];
              R.begin = L;
              R.end = P
            }
            C += (H || 0);
            ad += (Y[al] || 0)
          }
          if (J) {
            T.save();
            T.globalCompositeOperation = "source-over";
            T.lineWidth = 2;
            T.strokeStyle = J.color;
            var ag = L < P ? 1 : -1;
            T.beginPath();
            T.arc(ak, K, R.acum + 0.01 + 1, R.begin, R.end, false);
            T.arc(ak, K, R.acum + R.dimValue + 0.01 - 1, R.end, R.begin, true);
            T.closePath();
            T.stroke();
            T.restore()
          }
          if (ao && ah.type == "Native") {
            T.save();
            T.fillStyle = T.strokeStyle = ah.color;
            var ab = ae ? aa.getData("normalizedDim") : 1,
              N = (ah.size * ab) >> 0;
            N = N < +ae ? +ae : N;
            T.font = ah.style + " " + N + "px " + ah.family;
            T.textBaseline = "middle";
            T.textAlign = "center";
            X.rho = C + af.labelOffset + af.sliceOffset;
            X.theta = aa.pos.theta;
            var aq = X.getc(true);
            T.fillText(aa.name, aq.x, aq.y);
            T.restore()
          }
        }
      },
      contains: function(F, J) {
        if (this.nodeTypes.none.anglecontains.call(this, F, J)) {
          var L = Math.sqrt(J.x * J.x + J.y * J.y);
          var C = this.config.levelDistance,
            I = F._depth;
          var D = F.getData("config");
          if (L <= C * I + D.sliceOffset) {
            var M = F.getData("dimArray");
            for (var H = 0, G = M.length, K = D.sliceOffset; H < G; H++) {
              var E = M[H];
              if (L >= K && L <= K + E) {
                return {
                  name: F.getData("stringArray")[H],
                  color: F.getData("colorArray")[H],
                  value: F.getData("valueArray")[H],
                  label: F.name
                }
              }
              K += E
            }
          }
          return false
        }
        return false
      }
    }
  });
  $jit.PieChart = new t({
    sb: null,
    colors: ["#416D9C", "#70A35E", "#EBB056", "#C74243", "#83548B", "#909291", "#557EAA"],
    selected: {},
    busy: false,
    initialize: function(C) {
      this.controller = this.config = e.merge(q("Canvas", "PieChart", "Label"), {
        Label: {
          type: "Native"
        }
      }, C);
      this.initializeViz()
    },
    initializeViz: function() {
      var D = this.config,
        G = this;
      var C = D.type.split(":")[0];
      var H = new $jit.Sunburst({
        injectInto: D.injectInto,
        useCanvas: D.useCanvas,
        withLabels: D.Label.type != "Native",
        Label: {
          type: D.Label.type
        },
        Node: {
          overridable: true,
          type: "piechart-" + C,
          width: 1,
          height: 1
        },
        Edge: {
          type: "none"
        },
        Tips: {
          enable: D.Tips.enable,
          type: "Native",
          force: true,
          onShow: function(L, K, I) {
            var J = I;
            D.Tips.onShow(L, J, K)
          }
        },
        Events: {
          enable: true,
          type: "Native",
          onClick: function(K, L, I) {
            if (!D.Events.enable) {
              return
            }
            var J = L.getContains();
            D.Events.onClick(J, L, I)
          },
          onMouseMove: function(K, L, I) {
            if (!D.hoveredColor) {
              return
            }
            if (K) {
              var J = L.getContains();
              G.select(K.id, J.name, J.index)
            } else {
              G.select(false, false, false)
            }
          }
        },
        onCreateLabel: function(L, K) {
          var I = D.Label;
          if (D.showLabels) {
            var J = L.style;
            J.fontSize = I.size + "px";
            J.fontFamily = I.family;
            J.color = I.color;
            J.textAlign = "center";
            L.innerHTML = K.name
          }
        },
        onPlaceLabel: function(Y, S) {
          if (!D.showLabels) {
            return
          }
          var M = S.pos.getp(true),
            P = S.getData("dimArray"),
            V = S.getData("span") / 2,
            N = S.pos.theta,
            X = N - V,
            J = N + V,
            aa = new c;
          var R = D.showLabels,
            L = D.resizeLabels,
            O = D.Label;
          if (P) {
            for (var W = 0, T = P.length, U = 0; W < T; W++) {
              U += P[W]
            }
            var Z = L ? S.getData("normalizedDim") : 1,
              I = (O.size * Z) >> 0;
            I = I < +L ? +L : I;
            Y.style.fontSize = I + "px";
            aa.rho = U + D.labelOffset + D.sliceOffset;
            aa.theta = (X + J) / 2;
            var M = aa.getc(true);
            var K = G.canvas.getSize();
            var Q = {
              x: Math.round(M.x + K.width / 2),
              y: Math.round(M.y + K.height / 2)
            };
            Y.style.left = Q.x + "px";
            Y.style.top = Q.y + "px"
          }
        }
      });
      var F = H.canvas.getSize(),
        E = Math.min;
      H.config.levelDistance = E(F.width, F.height) / 2 - D.offset - D.sliceOffset;
      this.sb = H;
      this.canvas = this.sb.canvas;
      this.canvas.getCtx().globalCompositeOperation = "lighter"
    },
    loadJSON: function(Q) {
      var O = e.time(),
        I = [],
        C = this.sb,
        T = e.splat(Q.label),
        K = T.length,
        N = e.splat(Q.color || this.colors),
        F = N.length,
        R = this.config,
        D = !!R.type.split(":")[1],
        G = R.animate,
        M = K == 1;
      for (var P = 0, E = Q.values, L = E.length; P < L; P++) {
        var S = E[P];
        var H = e.splat(S.values);
        I.push({
          id: O + S.label,
          name: S.label,
          data: {
            value: H,
            "$valueArray": H,
            "$colorArray": M ? e.splat(N[P % F]) : N,
            "$stringArray": T,
            "$gradient": D,
            "$config": R,
            "$angularWidth": e.reduce(H, function(U, V) {
              return U + V
            })
          },
          children: []
        })
      }
      var J = {
        id: O + "$root",
        name: "",
        data: {
          "$type": "none",
          "$width": 1,
          "$height": 1
        },
        children: I
      };
      C.loadJSON(J);
      this.normalizeDims();
      C.refresh();
      if (G) {
        C.fx.animate({
          modes: ["node-property:dimArray"],
          duration: 1500
        })
      }
    },
    updateJSON: function(E, H) {
      if (this.busy) {
        return
      }
      this.busy = true;
      var I = this.sb;
      var G = I.graph;
      var D = E.values;
      var C = this.config.animate;
      var F = this;
      e.each(D, function(J) {
        var L = G.getByName(J.label),
          K = e.splat(J.values);
        if (L) {
          L.setData("valueArray", K);
          L.setData("angularWidth", e.reduce(K, function(M, N) {
            return M + N
          }));
          if (E.label) {
            L.setData("stringArray", e.splat(E.label))
          }
        }
      });
      this.normalizeDims();
      if (C) {
        I.compute("end");
        I.fx.animate({
          modes: ["node-property:dimArray:span", "linear"],
          duration: 1500,
          onComplete: function() {
            F.busy = false;
            H && H.onComplete()
          }
        })
      } else {
        I.refresh()
      }
    },
    select: function(E, C) {
      if (!this.config.hoveredColor) {
        return
      }
      var D = this.selected;
      if (D.id != E || D.name != C) {
        D.id = E;
        D.name = C;
        D.color = this.config.hoveredColor;
        this.sb.graph.eachNode(function(F) {
          if (E == F.id) {
            F.setData("border", D)
          } else {
            F.setData("border", false)
          }
        });
        this.sb.plot()
      }
    },
    getLegend: function() {
      var E = {};
      var F;
      this.sb.graph.getNode(this.sb.root).eachAdjacency(function(G) {
        F = G.nodeTo
      });
      var D = F.getData("colorArray"),
        C = D.length;
      e.each(F.getData("stringArray"), function(H, G) {
        E[H] = D[G % C]
      });
      return E
    },
    getMaxValue: function() {
      var C = 0;
      this.sb.graph.eachNode(function(F) {
        var D = F.getData("valueArray"),
          E = 0;
        e.each(D, function(G) {
          E += +G
        });
        C = C > E ? C : E
      });
      return C
    },
    normalizeDims: function() {
      var D = this.sb.graph.getNode(this.sb.root),
        C = 0;
      D.eachAdjacency(function() {
        C++
      });
      var H = this.getMaxValue() || 1,
        G = this.config,
        E = G.animate,
        F = this.sb.config.levelDistance;
      this.sb.graph.eachNode(function(M) {
        var L = 0,
          I = [];
        e.each(M.getData("valueArray"), function(N) {
          L += +N;
          I.push(1)
        });
        var K = (I.length == 1) && !G.updateHeights;
        if (E) {
          M.setData("dimArray", e.map(M.getData("valueArray"), function(N) {
            return K ? F : (N * F / H)
          }), "end");
          var J = M.getData("dimArray");
          if (!J) {
            M.setData("dimArray", I)
          }
        } else {
          M.setData("dimArray", e.map(M.getData("valueArray"), function(N) {
            return K ? F : (N * F / H)
          }))
        }
        M.setData("normalizedDim", L / H)
      })
    }
  });
  j.TM = {};
  j.TM.SliceAndDice = new t({
    compute: function(H) {
      var D = this.graph.getNode(this.clickedNode && this.clickedNode.id || this.root);
      this.controller.onBeforeCompute(D);
      var F = this.canvas.getSize(),
        E = this.config,
        G = F.width,
        C = F.height;
      this.graph.computeLevels(this.root, 0, "ignore");
      D.getPos(H).setc(-G / 2, -C / 2);
      D.setData("width", G, H);
      D.setData("height", C + E.titleHeight, H);
      this.computePositions(D, D, this.layout.orientation, H);
      this.controller.onAfterCompute(D)
    },
    computePositions: function(L, J, V, E) {
      var S = 0;
      L.eachSubnode(function(X) {
        S += X.getData("area", E)
      });
      var W = this.config,
        T = W.offset,
        P = L.getData("width", E),
        N = L.getData("height", E) - W.titleHeight,
        D = L == J ? 1 : (J.getData("area", E) / S);
      var O, M, R, H, G, K, I;
      var U = (V == "h");
      if (U) {
        V = "v";
        O = N;
        M = P * D;
        R = "height";
        H = "y";
        G = "x";
        K = W.titleHeight;
        I = 0
      } else {
        V = "h";
        O = N * D;
        M = P;
        R = "width";
        H = "x";
        G = "y";
        K = 0;
        I = W.titleHeight
      }
      var C = J.getPos(E);
      J.setData("width", M, E);
      J.setData("height", O, E);
      var Q = 0,
        F = this;
      J.eachSubnode(function(Y) {
        var X = Y.getPos(E);
        X[H] = Q + C[H] + K;
        X[G] = C[G] + I;
        F.computePositions(J, Y, V, E);
        Q += Y.getData(R, E)
      })
    }
  });
  j.TM.Area = {
    compute: function(C) {
      C = C || "current";
      var I = this.graph.getNode(this.clickedNode && this.clickedNode.id || this.root);
      this.controller.onBeforeCompute(I);
      var E = this.config,
        L = this.canvas.getSize(),
        D = L.width,
        K = L.height,
        J = E.offset,
        F = D - J,
        H = K - J;
      this.graph.computeLevels(this.root, 0, "ignore");
      I.getPos(C).setc(-D / 2, -K / 2);
      I.setData("width", D, C);
      I.setData("height", K, C);
      var G = {
        top: -K / 2 + E.titleHeight,
        left: -D / 2,
        width: F,
        height: H - E.titleHeight
      };
      this.computePositions(I, G, C);
      this.controller.onAfterCompute(I)
    },
    computeDim: function(G, H, J, F, E, C) {
      if (G.length + H.length == 1) {
        var D = (G.length == 1) ? G : H;
        this.layoutLast(D, J, F, C);
        return
      }
      if (G.length >= 2 && H.length == 0) {
        H = [G.shift()]
      }
      if (G.length == 0) {
        if (H.length > 0) {
          this.layoutRow(H, J, F, C)
        }
        return
      }
      var I = G[0];
      if (E(H, J) >= E([I].concat(H), J)) {
        this.computeDim(G.slice(1), H.concat([I]), J, F, E, C)
      } else {
        var K = this.layoutRow(H, J, F, C);
        this.computeDim(G, [], K.dim, K, E, C)
      }
    },
    worstAspectRatio: function(C, K) {
      if (!C || C.length == 0) {
        return Number.MAX_VALUE
      }
      var D = 0,
        L = 0,
        G = Number.MAX_VALUE;
      for (var I = 0, H = C.length; I < H; I++) {
        var E = C[I]._area;
        D += E;
        G = G < E ? G : E;
        L = L > E ? L : E
      }
      var J = K * K,
        F = D * D;
      return Math.max(J * L / F, F / (J * G))
    },
    avgAspectRatio: function(G, D) {
      if (!G || G.length == 0) {
        return Number.MAX_VALUE
      }
      var I = 0;
      for (var E = 0, C = G.length; E < C; E++) {
        var H = G[E]._area;
        var F = H / D;
        I += D > F ? D / F : F / D
      }
      return I / C
    },
    layoutLast: function(D, C, G, F) {
      var E = D[0];
      E.getPos(F).setc(G.left, G.top);
      E.setData("width", G.width, F);
      E.setData("height", G.height, F)
    }
  };
  j.TM.Squarified = new t({
    Implements: j.TM.Area,
    computePositions: function(G, J, D) {
      var F = this.config;
      if (J.width >= J.height) {
        this.layout.orientation = "h"
      } else {
        this.layout.orientation = "v"
      }
      var C = G.getSubnodes([1, 1], "ignore");
      if (C.length > 0) {
        this.processChildrenLayout(G, C, J, D);
        for (var I = 0, H = C.length; I < H; I++) {
          var L = C[I];
          var M = F.offset,
            N = L.getData("height", D) - M - F.titleHeight,
            E = L.getData("width", D) - M;
          var K = L.getPos(D);
          J = {
            width: E,
            height: N,
            top: K.y + F.titleHeight,
            left: K.x
          };
          this.computePositions(L, J, D)
        }
      }
    },
    processChildrenLayout: function(M, C, I, D) {
      var G = I.width * I.height;
      var H, E = C.length,
        J = 0,
        N = [];
      for (H = 0; H < E; H++) {
        N[H] = parseFloat(C[H].getData("area", D));
        J += N[H]
      }
      for (H = 0; H < E; H++) {
        C[H]._area = G * N[H] / J
      }
      var F = this.layout.horizontal() ? I.height : I.width;
      C.sort(function(P, O) {
        var Q = O._area - P._area;
        return Q ? Q : (O.id == P.id ? 0 : (O.id < P.id ? 1 : -1))
      });
      var L = [C[0]];
      var K = C.slice(1);
      this.squarify(K, L, F, I, D)
    },
    squarify: function(D, G, C, F, E) {
      this.computeDim(D, G, C, F, this.worstAspectRatio, E)
    },
    layoutRow: function(D, C, F, E) {
      if (this.layout.horizontal()) {
        return this.layoutV(D, C, F, E)
      } else {
        return this.layoutH(D, C, F, E)
      }
    },
    layoutV: function(C, N, J, D) {
      var O = 0,
        F = function(P) {
          return P
        };
      e.each(C, function(P) {
        O += P._area
      });
      var E = F(O / N),
        K = 0;
      for (var H = 0, G = C.length; H < G; H++) {
        var I = F(C[H]._area / E);
        var L = C[H];
        L.getPos(D).setc(J.left, J.top + K);
        L.setData("width", E, D);
        L.setData("height", I, D);
        K += I
      }
      var M = {
        height: J.height,
        width: J.width - E,
        top: J.top,
        left: J.left + E
      };
      M.dim = Math.min(M.width, M.height);
      if (M.dim != M.height) {
        this.layout.change()
      }
      return M
    },
    layoutH: function(C, L, H, D) {
      var N = 0;
      e.each(C, function(O) {
        N += O._area
      });
      var M = N / L,
        I = H.top,
        E = 0;
      for (var G = 0, F = C.length; G < F; G++) {
        var J = C[G];
        var L = J._area / M;
        J.getPos(D).setc(H.left + E, I);
        J.setData("width", L, D);
        J.setData("height", M, D);
        E += L
      }
      var K = {
        height: H.height - M,
        width: H.width,
        top: H.top + M,
        left: H.left
      };
      K.dim = Math.min(K.width, K.height);
      if (K.dim != K.width) {
        this.layout.change()
      }
      return K
    }
  });
  j.TM.Strip = new t({
    Implements: j.TM.Area,
    computePositions: function(G, J, D) {
      var C = G.getSubnodes([1, 1], "ignore"),
        F = this.config;
      if (C.length > 0) {
        this.processChildrenLayout(G, C, J, D);
        for (var I = 0, H = C.length; I < H; I++) {
          var L = C[I];
          var M = F.offset,
            N = L.getData("height", D) - M - F.titleHeight,
            E = L.getData("width", D) - M;
          var K = L.getPos(D);
          J = {
            width: E,
            height: N,
            top: K.y + F.titleHeight,
            left: K.x
          };
          this.computePositions(L, J, D)
        }
      }
    },
    processChildrenLayout: function(M, C, H, D) {
      var F = H.width * H.height;
      var G, E = C.length,
        I = 0,
        N = [];
      for (G = 0; G < E; G++) {
        N[G] = +C[G].getData("area", D);
        I += N[G]
      }
      for (G = 0; G < E; G++) {
        C[G]._area = F * N[G] / I
      }
      var L = this.layout.horizontal() ? H.width : H.height;
      var K = [C[0]];
      var J = C.slice(1);
      this.stripify(J, K, L, H, D)
    },
    stripify: function(D, G, C, F, E) {
      this.computeDim(D, G, C, F, this.avgAspectRatio, E)
    },
    layoutRow: function(D, C, F, E) {
      if (this.layout.horizontal()) {
        return this.layoutH(D, C, F, E)
      } else {
        return this.layoutV(D, C, F, E)
      }
    },
    layoutV: function(C, L, I, D) {
      var M = 0;
      e.each(C, function(N) {
        M += N._area
      });
      var E = M / L,
        J = 0;
      for (var G = 0, F = C.length; G < F; G++) {
        var K = C[G];
        var H = K._area / E;
        K.getPos(D).setc(I.left, I.top + (L - H - J));
        K.setData("width", E, D);
        K.setData("height", H, D);
        J += H
      }
      return {
        height: I.height,
        width: I.width - E,
        top: I.top,
        left: I.left + E,
        dim: L
      }
    },
    layoutH: function(C, K, H, D) {
      var M = 0;
      e.each(C, function(O) {
        M += O._area
      });
      var L = M / K,
        I = H.height - L,
        E = 0;
      for (var G = 0, F = C.length; G < F; G++) {
        var J = C[G];
        var N = J._area / L;
        J.getPos(D).setc(H.left + E, H.top + I);
        J.setData("width", N, D);
        J.setData("height", L, D);
        E += N
      }
      return {
        height: H.height - L,
        width: H.width,
        top: H.top,
        left: H.left,
        dim: K
      }
    }
  });
  j.Icicle = new t({
    compute: function(K) {
      K = K || "current";
      var J = this.graph.getNode(this.root),
        F = this.config,
        N = this.canvas.getSize(),
        C = N.width,
        M = N.height,
        G = F.offset,
        I = F.constrained ? F.levelsToShow : Number.MAX_VALUE;
      this.controller.onBeforeCompute(J);
      g.Util.computeLevels(this.graph, J.id, 0, "ignore");
      var L = 0;
      g.Util.eachLevel(J, 0, false, function(P, O) {
        if (O > L) {
          L = O
        }
      });
      var E = this.graph.getNode(this.clickedNode && this.clickedNode.id || J.id);
      var D = Math.min(L, I - 1);
      var H = E._depth;
      if (this.layout.horizontal()) {
        this.computeSubtree(E, -C / 2, -M / 2, C / (D + 1), M, H, D, K)
      } else {
        this.computeSubtree(E, -C / 2, -M / 2, C, M / (D + 1), H, D, K)
      }
    },
    computeSubtree: function(K, M, J, C, P, I, E, L) {
      K.getPos(L).setc(M, J);
      K.setData("width", C, L);
      K.setData("height", P, L);
      var G, O = 0,
        N = 0;
      var D = g.Util.getSubnodes(K, [1, 1]);
      if (!D.length) {
        return
      }
      e.each(D, function(Q) {
        N += Q.getData("dim")
      });
      for (var H = 0, F = D.length; H < F; H++) {
        if (this.layout.horizontal()) {
          G = P * D[H].getData("dim") / N;
          this.computeSubtree(D[H], M + C, J, C, G, I, E, L);
          J += G
        } else {
          G = C * D[H].getData("dim") / N;
          this.computeSubtree(D[H], M, J + P, G, P, I, E, L);
          M += G
        }
      }
    }
  });
  $jit.Icicle = new t({
    Implements: [f, r, j.Icicle],
    layout: {
      orientation: "h",
      vertical: function() {
        return this.orientation == "v"
      },
      horizontal: function() {
        return this.orientation == "h"
      },
      change: function() {
        this.orientation = this.vertical() ? "h" : "v"
      }
    },
    initialize: function(C) {
      var D = {
        animate: false,
        orientation: "h",
        offset: 2,
        levelsToShow: Number.MAX_VALUE,
        constrained: false,
        Node: {
          type: "rectangle",
          overridable: true
        },
        Edge: {
          type: "none"
        },
        Label: {
          type: "Native"
        },
        duration: 700,
        fps: 45
      };
      var F = q("Canvas", "Node", "Edge", "Fx", "Tips", "NodeStyles", "Events", "Navigation", "Controller", "Label");
      this.controller = this.config = e.merge(F, D, C);
      this.layout.orientation = this.config.orientation;
      var E = this.config;
      if (E.useCanvas) {
        this.canvas = E.useCanvas;
        this.config.labelContainer = this.canvas.id + "-label"
      } else {
        this.canvas = new o(this, E);
        this.config.labelContainer = (typeof E.injectInto == "string" ? E.injectInto : E.injectInto.id) + "-label"
      }
      this.graphOptions = {
        complex: true,
        Node: {
          selected: false,
          exist: true,
          drawn: true
        }
      };
      this.graph = new g(this.graphOptions, this.config.Node, this.config.Edge, this.config.Label);
      this.labels = new $jit.Icicle.Label[this.config.Label.type](this);
      this.fx = new $jit.Icicle.Plot(this, $jit.Icicle);
      this.op = new $jit.Icicle.Op(this);
      this.group = new $jit.Icicle.Group(this);
      this.clickedNode = null;
      this.initializeExtras()
    },
    refresh: function() {
      var C = this.config.Label.type;
      if (C != "Native") {
        var D = this;
        this.graph.eachNode(function(E) {
          D.labels.hideLabel(E, false)
        })
      }
      this.compute();
      this.plot()
    },
    plot: function() {
      this.fx.plot(this.config)
    },
    enter: function(E) {
      if (this.busy) {
        return
      }
      this.busy = true;
      var D = this,
        C = this.config;
      var F = {
        onComplete: function() {
          if (C.request) {
            D.compute()
          }
          if (C.animate) {
            D.graph.nodeList.setDataset(["current", "end"], {
              alpha: [1, 0]
            });
            g.Util.eachSubgraph(E, function(G) {
              G.setData("alpha", 1, "end")
            }, "ignore");
            D.fx.animate({
              duration: 500,
              modes: ["node-property:alpha"],
              onComplete: function() {
                D.clickedNode = E;
                D.compute("end");
                D.fx.animate({
                  modes: ["linear", "node-property:width:height"],
                  duration: 1000,
                  onComplete: function() {
                    D.busy = false;
                    D.clickedNode = E
                  }
                })
              }
            })
          } else {
            D.clickedNode = E;
            D.busy = false;
            D.refresh()
          }
        }
      };
      if (C.request) {
        this.requestNodes(clickedNode, F)
      } else {
        F.onComplete()
      }
    },
    out: function() {
      if (this.busy) {
        return
      }
      var H = this,
        G = g.Util,
        E = this.config,
        J = this.graph,
        D = G.getParents(J.getNode(this.clickedNode && this.clickedNode.id || this.root)),
        F = D[0],
        C = F,
        I = this.clickedNode;
      this.busy = true;
      this.events.hoveredNode = false;
      if (!F) {
        this.busy = false;
        return
      }
      callback = {
        onComplete: function() {
          H.clickedNode = F;
          if (E.request) {
            H.requestNodes(F, {
              onComplete: function() {
                H.compute();
                H.plot();
                H.busy = false
              }
            })
          } else {
            H.compute();
            H.plot();
            H.busy = false
          }
        }
      };
      if (E.animate) {
        this.clickedNode = C;
        this.compute("end");
        this.clickedNode = I;
        this.fx.animate({
          modes: ["linear", "node-property:width:height"],
          duration: 1000,
          onComplete: function() {
            H.clickedNode = C;
            J.nodeList.setDataset(["current", "end"], {
              alpha: [0, 1]
            });
            G.eachSubgraph(I, function(K) {
              K.setData("alpha", 1)
            }, "ignore");
            H.fx.animate({
              duration: 500,
              modes: ["node-property:alpha"],
              onComplete: function() {
                callback.onComplete()
              }
            })
          }
        })
      } else {
        callback.onComplete()
      }
    },
    requestNodes: function(E, F) {
      var D = e.merge(this.controller, F),
        C = this.config.constrained ? this.config.levelsToShow : Number.MAX_VALUE;
      if (D.request) {
        var H = [],
          G = E._depth;
        g.Util.eachLevel(E, 0, C, function(I) {
          if (I.drawn && !g.Util.anySubnode(I)) {
            H.push(I);
            I._level = I._depth - G;
            if (this.config.constrained) {
              I._level = C - I._level
            }
          }
        });
        this.group.requestNodes(H, D)
      } else {
        D.onComplete()
      }
    }
  });
  $jit.Icicle.Op = new t({
    Implements: g.Op
  });
  $jit.Icicle.Group = new t({
    initialize: function(C) {
      this.viz = C;
      this.canvas = C.canvas;
      this.config = C.config
    },
    requestNodes: function(H, G) {
      var F = 0,
        D = H.length,
        J = {};
      var E = function() {
        G.onComplete()
      };
      var C = this.viz;
      if (D == 0) {
        E()
      }
      for (var I = 0; I < D; I++) {
        J[H[I].id] = H[I];
        G.request(H[I].id, H[I]._level, {
          onComplete: function(L, K) {
            if (K && K.children) {
              K.id = L;
              C.op.sum(K, {
                type: "nothing"
              })
            }
            if (++F == D) {
              g.Util.computeLevels(C.graph, C.root, 0);
              E()
            }
          }
        })
      }
    }
  });
  $jit.Icicle.Plot = new t({
    Implements: g.Plot,
    plot: function(G, E) {
      G = G || this.viz.controller;
      var C = this.viz,
        H = C.graph,
        D = H.getNode(C.clickedNode && C.clickedNode.id || C.root),
        F = D._depth;
      C.canvas.clear();
      this.plotTree(D, e.merge(G, {
        withLabels: true,
        hideLabels: false,
        plotSubtree: function(I, J) {
          return !C.config.constrained || (J._depth - F < C.config.levelsToShow)
        }
      }), E)
    }
  });
  $jit.Icicle.Label = {};
  $jit.Icicle.Label.Native = new t({
    Implements: g.Label.Native,
    renderLabel: function(D, E, G) {
      var J = D.getCtx(),
        C = E.getData("width"),
        I = E.getData("height"),
        K = E.getLabelData("size"),
        F = J.measureText(E.name);
      if (I < (K * 1.5) || C < F.width) {
        return
      }
      var H = E.pos.getc(true);
      J.fillText(E.name, H.x + C / 2, H.y + I / 2)
    }
  });
  $jit.Icicle.Label.SVG = new t({
    Implements: g.Label.SVG,
    initialize: function(C) {
      this.viz = C
    },
    placeLabel: function(D, G, E) {
      var I = G.pos.getc(true),
        F = this.viz.canvas;
      var C = F.getSize();
      var H = {
        x: Math.round(I.x + C.width / 2),
        y: Math.round(I.y + C.height / 2)
      };
      D.setAttribute("x", H.x);
      D.setAttribute("y", H.y);
      E.onPlaceLabel(D, G)
    }
  });
  $jit.Icicle.Label.HTML = new t({
    Implements: g.Label.HTML,
    initialize: function(C) {
      this.viz = C
    },
    placeLabel: function(D, H, E) {
      var J = H.pos.getc(true),
        F = this.viz.canvas;
      var C = F.getSize();
      var I = {
        x: Math.round(J.x + C.width / 2),
        y: Math.round(J.y + C.height / 2)
      };
      var G = D.style;
      G.left = I.x + "px";
      G.top = I.y + "px";
      G.display = "";
      E.onPlaceLabel(D, H)
    }
  });
  $jit.Icicle.Plot.NodeTypes = new t({
    none: {
      render: e.empty
    },
    rectangle: {
      render: function(F, D, Q) {
        var E = this.viz.config;
        var I = E.offset;
        var C = F.getData("width");
        var N = F.getData("height");
        var H = F.getData("border");
        var M = F.pos.getc(true);
        var L = M.x + I / 2,
          J = M.y + I / 2;
        var P = D.getCtx();
        if (C - I < 2 || N - I < 2) {
          return
        }
        if (E.cushion) {
          var G = F.getData("color");
          var O = P.createRadialGradient(L + (C - I) / 2, J + (N - I) / 2, 1, L + (C - I) / 2, J + (N - I) / 2, C < N ? N : C);
          var K = e.rgbToHex(e.map(e.hexToRgb(G), function(R) {
            return R * 0.3 >> 0
          }));
          O.addColorStop(0, G);
          O.addColorStop(1, K);
          P.fillStyle = O
        }
        if (H) {
          P.strokeStyle = H;
          P.lineWidth = 3
        }
        P.fillRect(L, J, Math.max(0, C - I), Math.max(0, N - I));
        H && P.strokeRect(M.x, M.y, C, N)
      },
      contains: function(E, G) {
        if (this.viz.clickedNode && !$jit.Graph.Util.isDescendantOf(E, this.viz.clickedNode.id)) {
          return false
        }
        var F = E.pos.getc(true),
          D = E.getData("width"),
          C = E.getData("height");
        return this.nodeHelper.rectangle.contains({
          x: F.x + D / 2,
          y: F.y + C / 2
        }, G, D, C)
      }
    }
  });
  $jit.Icicle.Plot.EdgeTypes = new t({
    none: e.empty
  });
  j.ForceDirected = new t({
    getOptions: function(I) {
      var G = this.canvas.getSize();
      var D = G.width,
        F = G.height;
      var H = 0;
      this.graph.eachNode(function(K) {
        H++
      });
      var J = D * F / H,
        E = Math.sqrt(J);
      var C = this.config.levelDistance;
      return {
        width: D,
        height: F,
        tstart: D * 0.1,
        nodef: function(K) {
          return J / (K || 1)
        },
        edgef: function(K) {
          return E * (K - C)
        }
      }
    },
    compute: function(D, E) {
      var F = e.splat(D || ["current", "start", "end"]);
      var C = this.getOptions();
      h.compute(this.graph, F, this.config);
      this.graph.computeLevels(this.root, 0, "ignore");
      this.graph.eachNode(function(G) {
        e.each(F, function(H) {
          var I = G.getPos(H);
          if (I.equals(s.KER)) {
            I.x = C.width / 5 * (Math.random() - 0.5);
            I.y = C.height / 5 * (Math.random() - 0.5)
          }
          G.disp = {};
          e.each(F, function(J) {
            G.disp[J] = u(0, 0)
          })
        })
      });
      this.computePositions(F, C, E)
    },
    computePositions: function(G, E, H) {
      var I = this.config.iterations,
        D = 0,
        F = this;
      if (H) {
        (function C() {
          for (var K = H.iter, J = 0; J < K; J++) {
            E.t = E.tstart * (1 - D++/(I-1));F.computePositionStep(G,E);if(D>=I){H.onComplete();return}}H.onStep(Math.round(D/ (I - 1) * 100));
          setTimeout(C, 1)
        })()
      } else {
        for (; D < I; D++) {
          E.t = E.tstart * (1 - D / (I - 1));
          this.computePositionStep(G, E)
        }
      }
    },
    computePositionStep: function(J, C) {
      var K = this.graph;
      var E = Math.min,
        I = Math.max;
      var H = u(0, 0);
      K.eachNode(function(M) {
        e.each(J, function(N) {
          M.disp[N].x = 0;
          M.disp[N].y = 0
        });
        K.eachNode(function(N) {
          if (N.id != M.id) {
            e.each(J, function(R) {
              var P = M.getPos(R),
                O = N.getPos(R);
              H.x = P.x - O.x;
              H.y = P.y - O.y;
              var Q = H.norm() || 1;
              M.disp[R].$add(H.$scale(C.nodef(Q) / Q))
            })
          }
        })
      });
      var D = !!K.getNode(this.root).visited;
      K.eachNode(function(M) {
        M.eachAdjacency(function(N) {
          var O = N.nodeTo;
          if (!!O.visited === D) {
            e.each(J, function(S) {
              var Q = M.getPos(S),
                P = O.getPos(S);
              H.x = Q.x - P.x;
              H.y = Q.y - P.y;
              var R = H.norm() || 1;
              M.disp[S].$add(H.$scale(-C.edgef(R) / R));
              O.disp[S].$add(H.$scale(-1))
            })
          }
        });
        M.visited = !D
      });
      var L = C.t,
        F = C.width / 2,
        G = C.height / 2;
      K.eachNode(function(M) {
        e.each(J, function(P) {
          var N = M.disp[P];
          var O = N.norm() || 1;
          var P = M.getPos(P);
          P.$add(u(N.x * E(Math.abs(N.x), L) / O, N.y * E(Math.abs(N.y), L) / O));
          P.x = E(F, I(-F, P.x));
          P.y = E(G, I(-G, P.y))
        })
      })
    }
  });
  $jit.ForceDirected = new t({
    Implements: [f, r, j.ForceDirected],
    initialize: function(D) {
      var C = $jit.ForceDirected;
      var E = {
        iterations: 50,
        levelDistance: 50
      };
      this.controller = this.config = e.merge(q("Canvas", "Node", "Edge", "Fx", "Tips", "NodeStyles", "Events", "Navigation", "Controller", "Label"), E, D);
      var F = this.config;
      if (F.useCanvas) {
        this.canvas = F.useCanvas;
        this.config.labelContainer = this.canvas.id + "-label"
      } else {
        if (F.background) {
          F.background = e.merge({
            type: "Circles"
          }, F.background)
        }
        this.canvas = new o(this, F);
        this.config.labelContainer = (typeof F.injectInto == "string" ? F.injectInto : F.injectInto.id) + "-label"
      }
      this.graphOptions = {
        complex: true,
        Node: {
          selected: false,
          exist: true,
          drawn: true
        }
      };
      this.graph = new g(this.graphOptions, this.config.Node, this.config.Edge);
      this.labels = new C.Label[F.Label.type](this);
      this.fx = new C.Plot(this, C);
      this.op = new C.Op(this);
      this.json = null;
      this.busy = false;
      this.initializeExtras()
    },
    refresh: function() {
      this.compute();
      this.plot()
    },
    reposition: function() {
      this.compute("end")
    },
    computeIncremental: function(C) {
      C = e.merge({
        iter: 20,
        property: "end",
        onStep: e.empty,
        onComplete: e.empty
      }, C || {});
      this.config.onBeforeCompute(this.graph.getNode(this.root));
      this.compute(C.property, C)
    },
    plot: function() {
      this.fx.plot()
    },
    animate: function(C) {
      this.fx.animate(e.merge({
        modes: ["linear"]
      }, C || {}))
    }
  });
  $jit.ForceDirected.$extend = true;
  (function(C) {
    C.Op = new t({
      Implements: g.Op
    });
    C.Plot = new t({
      Implements: g.Plot
    });
    C.Label = {};
    C.Label.Native = new t({
      Implements: g.Label.Native
    });
    C.Label.SVG = new t({
      Implements: g.Label.SVG,
      initialize: function(D) {
        this.viz = D
      },
      placeLabel: function(N, H, I) {
        var L = H.pos.getc(true),
          E = this.viz.canvas,
          F = E.translateOffsetX,
          D = E.translateOffsetY,
          M = E.scaleOffsetX,
          K = E.scaleOffsetY,
          J = E.getSize();
        var G = {
          x: Math.round(L.x * M + F + J.width / 2),
          y: Math.round(L.y * K + D + J.height / 2)
        };
        N.setAttribute("x", G.x);
        N.setAttribute("y", G.y);
        I.onPlaceLabel(N, H)
      }
    });
    C.Label.HTML = new t({
      Implements: g.Label.HTML,
      initialize: function(D) {
        this.viz = D
      },
      placeLabel: function(O, I, J) {
        var M = I.pos.getc(true),
          F = this.viz.canvas,
          G = F.translateOffsetX,
          E = F.translateOffsetY,
          N = F.scaleOffsetX,
          L = F.scaleOffsetY,
          K = F.getSize();
        var H = {
          x: Math.round(M.x * N + G + K.width / 2),
          y: Math.round(M.y * L + E + K.height / 2)
        };
        var D = O.style;
        D.left = H.x + "px";
        D.top = H.y + "px";
        D.display = this.fitsInCanvas(H, F) ? "" : "none";
        J.onPlaceLabel(O, I)
      }
    });
    C.Plot.NodeTypes = new t({
      none: {
        render: e.empty,
        contains: e.lambda(false)
      },
      circle: {
        render: function(E, D) {
          var G = E.pos.getc(true),
            F = E.getData("dim");
          this.nodeHelper.circle.render("fill", G, F, D)
        },
        contains: function(D, G) {
          var F = D.pos.getc(true),
            E = D.getData("dim");
          return this.nodeHelper.circle.contains(F, G, E)
        }
      },
      ellipse: {
        render: function(G, E) {
          var H = G.pos.getc(true),
            F = G.getData("width"),
            D = G.getData("height");
          this.nodeHelper.ellipse.render("fill", H, F, D, E)
        },
        contains: function(F, H) {
          var G = F.pos.getc(true),
            E = F.getData("width"),
            D = F.getData("height");
          return this.nodeHelper.ellipse.contains(G, H, E, D)
        }
      },
      square: {
        render: function(E, D) {
          var G = E.pos.getc(true),
            F = E.getData("dim");
          this.nodeHelper.square.render("fill", G, F, D)
        },
        contains: function(D, G) {
          var F = D.pos.getc(true),
            E = D.getData("dim");
          return this.nodeHelper.square.contains(F, G, E)
        }
      },
      rectangle: {
        render: function(G, E) {
          var H = G.pos.getc(true),
            F = G.getData("width"),
            D = G.getData("height");
          this.nodeHelper.rectangle.render("fill", H, F, D, E)
        },
        contains: function(F, H) {
          var G = F.pos.getc(true),
            E = F.getData("width"),
            D = F.getData("height");
          return this.nodeHelper.rectangle.contains(G, H, E, D)
        }
      },
      triangle: {
        render: function(E, D) {
          var G = E.pos.getc(true),
            F = E.getData("dim");
          this.nodeHelper.triangle.render("fill", G, F, D)
        },
        contains: function(D, G) {
          var F = D.pos.getc(true),
            E = D.getData("dim");
          return this.nodeHelper.triangle.contains(F, G, E)
        }
      },
      star: {
        render: function(E, D) {
          var G = E.pos.getc(true),
            F = E.getData("dim");
          this.nodeHelper.star.render("fill", G, F, D)
        },
        contains: function(D, G) {
          var F = D.pos.getc(true),
            E = D.getData("dim");
          return this.nodeHelper.star.contains(F, G, E)
        }
      }
    });
    C.Plot.EdgeTypes = new t({
      none: e.empty,
      line: {
        render: function(D, E) {
          var G = D.nodeFrom.pos.getc(true),
            F = D.nodeTo.pos.getc(true);
          this.edgeHelper.line.render(G, F, E)
        },
        contains: function(D, G) {
          var F = D.nodeFrom.pos.getc(true),
            E = D.nodeTo.pos.getc(true);
          return this.edgeHelper.line.contains(F, E, G, this.edge.epsilon)
        }
      },
      arrow: {
        render: function(E, F) {
          var J = E.nodeFrom.pos.getc(true),
            I = E.nodeTo.pos.getc(true),
            H = E.getData("dim"),
            G = E.data.$direction,
            D = (G && G.length > 1 && G[0] != E.nodeFrom.id);
          this.edgeHelper.arrow.render(J, I, H, D, F)
        },
        contains: function(D, G) {
          var F = D.nodeFrom.pos.getc(true),
            E = D.nodeTo.pos.getc(true);
          return this.edgeHelper.arrow.contains(F, E, G, this.edge.epsilon)
        }
      }
    })
  })($jit.ForceDirected);
  $jit.TM = {};
  var B = $jit.TM;
  $jit.TM.$extend = true;
  B.Base = {
    layout: {
      orientation: "h",
      vertical: function() {
        return this.orientation == "v"
      },
      horizontal: function() {
        return this.orientation == "h"
      },
      change: function() {
        this.orientation = this.vertical() ? "h" : "v"
      }
    },
    initialize: function(C) {
      var D = {
        orientation: "h",
        titleHeight: 13,
        offset: 2,
        levelsToShow: 0,
        constrained: false,
        animate: false,
        Node: {
          type: "rectangle",
          overridable: true,
          width: 3,
          height: 3,
          color: "#444"
        },
        Label: {
          textAlign: "center",
          textBaseline: "top"
        },
        Edge: {
          type: "none"
        },
        duration: 700,
        fps: 45
      };
      this.controller = this.config = e.merge(q("Canvas", "Node", "Edge", "Fx", "Controller", "Tips", "NodeStyles", "Events", "Navigation", "Label"), D, C);
      this.layout.orientation = this.config.orientation;
      var E = this.config;
      if (E.useCanvas) {
        this.canvas = E.useCanvas;
        this.config.labelContainer = this.canvas.id + "-label"
      } else {
        if (E.background) {
          E.background = e.merge({
            type: "Circles"
          }, E.background)
        }
        this.canvas = new o(this, E);
        this.config.labelContainer = (typeof E.injectInto == "string" ? E.injectInto : E.injectInto.id) + "-label"
      }
      this.graphOptions = {
        complex: true,
        Node: {
          selected: false,
          exist: true,
          drawn: true
        }
      };
      this.graph = new g(this.graphOptions, this.config.Node, this.config.Edge);
      this.labels = new B.Label[E.Label.type](this);
      this.fx = new B.Plot(this);
      this.op = new B.Op(this);
      this.group = new B.Group(this);
      this.geom = new B.Geom(this);
      this.clickedNode = null;
      this.busy = false;
      this.initializeExtras()
    },
    refresh: function() {
      if (this.busy) {
        return
      }
      this.busy = true;
      var D = this;
      if (this.config.animate) {
        this.compute("end");
        this.config.levelsToShow > 0 && this.geom.setRightLevelToShow(this.graph.getNode(this.clickedNode && this.clickedNode.id || this.root));
        this.fx.animate(e.merge(this.config, {
          modes: ["linear", "node-property:width:height"],
          onComplete: function() {
            D.busy = false
          }
        }))
      } else {
        var C = this.config.Label.type;
        if (C != "Native") {
          var D = this;
          this.graph.eachNode(function(E) {
            D.labels.hideLabel(E, false)
          })
        }
        this.busy = false;
        this.compute();
        this.config.levelsToShow > 0 && this.geom.setRightLevelToShow(this.graph.getNode(this.clickedNode && this.clickedNode.id || this.root));
        this.plot()
      }
    },
    plot: function() {
      this.fx.plot()
    },
    leaf: function(C) {
      return C.getSubnodes([1, 1], "ignore").length == 0
    },
    enter: function(I) {
      if (this.busy) {
        return
      }
      this.busy = true;
      var E = this,
        D = this.config,
        G = this.graph,
        C = I,
        F = this.clickedNode;
      var H = {
        onComplete: function() {
          if (D.levelsToShow > 0) {
            E.geom.setRightLevelToShow(I)
          }
          if (D.levelsToShow > 0 || D.request) {
            E.compute()
          }
          if (D.animate) {
            G.nodeList.setData("alpha", 0, "end");
            I.eachSubgraph(function(J) {
              J.setData("alpha", 1, "end")
            }, "ignore");
            E.fx.animate({
              duration: 500,
              modes: ["node-property:alpha"],
              onComplete: function() {
                E.clickedNode = C;
                E.compute("end");
                E.clickedNode = F;
                E.fx.animate({
                  modes: ["linear", "node-property:width:height"],
                  duration: 1000,
                  onComplete: function() {
                    E.busy = false;
                    E.clickedNode = C
                  }
                })
              }
            })
          } else {
            E.busy = false;
            E.clickedNode = I;
            E.refresh()
          }
        }
      };
      if (D.request) {
        this.requestNodes(C, H)
      } else {
        H.onComplete()
      }
    },
    out: function() {
      if (this.busy) {
        return
      }
      this.busy = true;
      this.events.hoveredNode = false;
      var G = this,
        E = this.config,
        I = this.graph,
        D = I.getNode(this.clickedNode && this.clickedNode.id || this.root).getParents(),
        F = D[0],
        C = F,
        H = this.clickedNode;
      if (!F) {
        this.busy = false;
        return
      }
      callback = {
        onComplete: function() {
          G.clickedNode = F;
          if (E.request) {
            G.requestNodes(F, {
              onComplete: function() {
                G.compute();
                G.plot();
                G.busy = false
              }
            })
          } else {
            G.compute();
            G.plot();
            G.busy = false
          }
        }
      };
      if (E.levelsToShow > 0) {
        this.geom.setRightLevelToShow(F)
      }
      if (E.animate) {
        this.clickedNode = C;
        this.compute("end");
        this.clickedNode = H;
        this.fx.animate({
          modes: ["linear", "node-property:width:height"],
          duration: 1000,
          onComplete: function() {
            G.clickedNode = C;
            I.eachNode(function(J) {
              J.setDataset(["current", "end"], {
                alpha: [0, 1]
              })
            }, "ignore");
            H.eachSubgraph(function(J) {
              J.setData("alpha", 1)
            }, "ignore");
            G.fx.animate({
              duration: 500,
              modes: ["node-property:alpha"],
              onComplete: function() {
                callback.onComplete()
              }
            })
          }
        })
      } else {
        callback.onComplete()
      }
    },
    requestNodes: function(E, F) {
      var D = e.merge(this.controller, F),
        C = this.config.levelsToShow;
      if (D.request) {
        var H = [],
          G = E._depth;
        E.eachLevel(0, C, function(J) {
          var I = C - (J._depth - G);
          if (J.drawn && !J.anySubnode() && I > 0) {
            H.push(J);
            J._level = I
          }
        });
        this.group.requestNodes(H, D)
      } else {
        D.onComplete()
      }
    }
  };
  B.Op = new t({
    Implements: g.Op,
    initialize: function(C) {
      this.viz = C
    }
  });
  B.Geom = new t({
    Implements: g.Geom,
    getRightLevelToShow: function() {
      return this.viz.config.levelsToShow
    },
    setRightLevelToShow: function(D) {
      var E = this.getRightLevelToShow(),
        C = this.viz.labels;
      D.eachLevel(0, E + 1, function(G) {
        var F = G._depth - D._depth;
        if (F > E) {
          G.drawn = false;
          G.exist = false;
          G.ignore = true;
          C.hideLabel(G, false)
        } else {
          G.drawn = true;
          G.exist = true;
          delete G.ignore
        }
      });
      D.drawn = true;
      delete D.ignore
    }
  });
  B.Group = new t({
    initialize: function(C) {
      this.viz = C;
      this.canvas = C.canvas;
      this.config = C.config
    },
    requestNodes: function(H, G) {
      var F = 0,
        D = H.length,
        J = {};
      var E = function() {
        G.onComplete()
      };
      var C = this.viz;
      if (D == 0) {
        E()
      }
      for (var I = 0; I < D; I++) {
        J[H[I].id] = H[I];
        G.request(H[I].id, H[I]._level, {
          onComplete: function(L, K) {
            if (K && K.children) {
              K.id = L;
              C.op.sum(K, {
                type: "nothing"
              })
            }
            if (++F == D) {
              C.graph.computeLevels(C.root, 0);
              E()
            }
          }
        })
      }
    }
  });
  B.Plot = new t({
    Implements: g.Plot,
    initialize: function(C) {
      this.viz = C;
      this.config = C.config;
      this.node = this.config.Node;
      this.edge = this.config.Edge;
      this.animation = new A;
      this.nodeTypes = new B.Plot.NodeTypes;
      this.edgeTypes = new B.Plot.EdgeTypes;
      this.labels = C.labels
    },
    plot: function(E, D) {
      var C = this.viz,
        F = C.graph;
      C.canvas.clear();
      this.plotTree(F.getNode(C.clickedNode && C.clickedNode.id || C.root), e.merge(C.config, E || {}, {
        withLabels: true,
        hideLabels: false,
        plotSubtree: function(H, G) {
          return H.anySubnode("exist")
        }
      }), D)
    }
  });
  B.Label = {};
  B.Label.Native = new t({
    Implements: g.Label.Native,
    initialize: function(C) {
      this.config = C.config;
      this.leaf = C.leaf
    },
    renderLabel: function(D, E, F) {
      if (!this.leaf(E) && !this.config.titleHeight) {
        return
      }
      var H = E.pos.getc(true),
        K = D.getCtx(),
        C = E.getData("width"),
        J = E.getData("height"),
        I = H.x + C / 2,
        G = H.y;
      K.fillText(E.name, I, G, C)
    }
  });
  B.Label.SVG = new t({
    Implements: g.Label.SVG,
    initialize: function(C) {
      this.viz = C;
      this.leaf = C.leaf;
      this.config = C.config
    },
    placeLabel: function(M, G, H) {
      var K = G.pos.getc(true),
        D = this.viz.canvas,
        E = D.translateOffsetX,
        C = D.translateOffsetY,
        L = D.scaleOffsetX,
        J = D.scaleOffsetY,
        I = D.getSize();
      var F = {
        x: Math.round(K.x * L + E + I.width / 2),
        y: Math.round(K.y * J + C + I.height / 2)
      };
      M.setAttribute("x", F.x);
      M.setAttribute("y", F.y);
      if (!this.leaf(G) && !this.config.titleHeight) {
        M.style.display = "none"
      }
      H.onPlaceLabel(M, G)
    }
  });
  B.Label.HTML = new t({
    Implements: g.Label.HTML,
    initialize: function(C) {
      this.viz = C;
      this.leaf = C.leaf;
      this.config = C.config
    },
    placeLabel: function(N, H, I) {
      var L = H.pos.getc(true),
        E = this.viz.canvas,
        F = E.translateOffsetX,
        D = E.translateOffsetY,
        M = E.scaleOffsetX,
        K = E.scaleOffsetY,
        J = E.getSize();
      var G = {
        x: Math.round(L.x * M + F + J.width / 2),
        y: Math.round(L.y * K + D + J.height / 2)
      };
      var C = N.style;
      C.left = G.x + "px";
      C.top = G.y + "px";
      C.width = H.getData("width") * M + "px";
      C.height = H.getData("height") * K + "px";
      C.zIndex = H._depth * 100;
      C.display = "";
      if (!this.leaf(H) && !this.config.titleHeight) {
        N.style.display = "none"
      }
      I.onPlaceLabel(N, H)
    }
  });
  B.Plot.NodeTypes = new t({
    none: {
      render: e.empty
    },
    rectangle: {
      render: function(F, D, S) {
        var J = this.viz.leaf(F),
          E = this.config,
          O = E.offset,
          I = E.titleHeight,
          N = F.pos.getc(true),
          C = F.getData("width"),
          P = F.getData("height"),
          H = F.getData("border"),
          R = D.getCtx(),
          M = N.x + O / 2,
          K = N.y + O / 2;
        if (C <= O || P <= O) {
          return
        }
        if (J) {
          if (E.cushion) {
            var Q = R.createRadialGradient(M + (C - O) / 2, K + (P - O) / 2, 1, M + (C - O) / 2, K + (P - O) / 2, C < P ? P : C);
            var G = F.getData("color");
            var L = e.rgbToHex(e.map(e.hexToRgb(G), function(T) {
              return T * 0.2 >> 0
            }));
            Q.addColorStop(0, G);
            Q.addColorStop(1, L);
            R.fillStyle = Q
          }
          R.fillRect(M, K, C - O, P - O);
          if (H) {
            R.save();
            R.strokeStyle = H;
            R.strokeRect(M, K, C - O, P - O);
            R.restore()
          }
        } else {
          if (I > 0) {
            R.fillRect(N.x + O / 2, N.y + O / 2, C - O, I - O);
            if (H) {
              R.save();
              R.strokeStyle = H;
              R.strokeRect(N.x + O / 2, N.y + O / 2, C - O, P - O);
              R.restore()
            }
          }
        }
      },
      contains: function(F, H) {
        if (this.viz.clickedNode && !F.isDescendantOf(this.viz.clickedNode.id) || F.ignore) {
          return false
        }
        var G = F.pos.getc(true),
          E = F.getData("width"),
          D = this.viz.leaf(F),
          C = D ? F.getData("height") : this.config.titleHeight;
        return this.nodeHelper.rectangle.contains({
          x: G.x + E / 2,
          y: G.y + C / 2
        }, H, E, C)
      }
    }
  });
  B.Plot.EdgeTypes = new t({
    none: e.empty
  });
  B.SliceAndDice = new t({
    Implements: [f, r, B.Base, j.TM.SliceAndDice]
  });
  B.Squarified = new t({
    Implements: [f, r, B.Base, j.TM.Squarified]
  });
  B.Strip = new t({
    Implements: [f, r, B.Base, j.TM.Strip]
  });
  $jit.RGraph = new t({
    Implements: [f, r, j.Radial],
    initialize: function(C) {
      var D = $jit.RGraph;
      var E = {
        interpolation: "linear",
        levelDistance: 100
      };
      this.controller = this.config = e.merge(q("Canvas", "Node", "Edge", "Fx", "Controller", "Tips", "NodeStyles", "Events", "Navigation", "Label"), E, C);
      var F = this.config;
      if (F.useCanvas) {
        this.canvas = F.useCanvas;
        this.config.labelContainer = this.canvas.id + "-label"
      } else {
        if (F.background) {
          F.background = e.merge({
            type: "Circles"
          }, F.background)
        }
        this.canvas = new o(this, F);
        this.config.labelContainer = (typeof F.injectInto == "string" ? F.injectInto : F.injectInto.id) + "-label"
      }
      this.graphOptions = {
        complex: false,
        Node: {
          selected: false,
          exist: true,
          drawn: true
        }
      };
      this.graph = new g(this.graphOptions, this.config.Node, this.config.Edge);
      this.labels = new D.Label[F.Label.type](this);
      this.fx = new D.Plot(this, D);
      this.op = new D.Op(this);
      this.json = null;
      this.root = null;
      this.busy = false;
      this.parent = false;
      this.initializeExtras()
    },
    createLevelDistanceFunc: function() {
      var C = this.config.levelDistance;
      return function(D) {
        return (D._depth + 1) * C
      }
    },
    refresh: function() {
      this.compute();
      this.plot()
    },
    reposition: function() {
      this.compute("end")
    },
    plot: function() {
      this.fx.plot()
    },
    getNodeAndParentAngle: function(J) {
      var E = false;
      var I = this.graph.getNode(J);
      var G = I.getParents();
      var F = (G.length > 0) ? G[0] : false;
      if (F) {
        var C = F.pos.getc(),
          H = I.pos.getc();
        var D = C.add(H.scale(-1));
        E = Math.atan2(D.y, D.x);
        if (E < 0) {
          E += 2 * Math.PI
        }
      }
      return {
        parent: F,
        theta: E
      }
    },
    tagChildren: function(G, I) {
      if (G.angleSpan) {
        var H = [];
        G.eachAdjacency(function(J) {
          H.push(J.nodeTo)
        }, "ignore");
        var C = H.length;
        for (var F = 0; F < C && I != H[F].id; F++) {}
        for (var E = (F + 1) % C, D = 0; I != H[E].id; E = (E + 1) % C) {
          H[E].dist = D++
        }
      }
    },
    onClick: function(G, D) {
      if (this.root != G && !this.busy) {
        this.busy = true;
        this.root = G;
        that = this;
        this.controller.onBeforeCompute(this.graph.getNode(G));
        var E = this.getNodeAndParentAngle(G);
        this.tagChildren(E.parent, G);
        this.parent = E.parent;
        this.compute("end");
        var C = E.theta - E.parent.endPos.theta;
        this.graph.eachNode(function(H) {
          H.endPos.set(H.endPos.getp().add(n(C, 0)))
        });
        var F = this.config.interpolation;
        D = e.merge({
          onComplete: e.empty
        }, D || {});
        this.fx.animate(e.merge({
          hideLabels: true,
          modes: [F]
        }, D, {
          onComplete: function() {
            that.busy = false;
            D.onComplete()
          }
        }))
      }
    }
  });
  $jit.RGraph.$extend = true;
  (function(C) {
    C.Op = new t({
      Implements: g.Op
    });
    C.Plot = new t({
      Implements: g.Plot
    });
    C.Label = {};
    C.Label.Native = new t({
      Implements: g.Label.Native
    });
    C.Label.SVG = new t({
      Implements: g.Label.SVG,
      initialize: function(D) {
        this.viz = D
      },
      placeLabel: function(N, H, I) {
        var L = H.pos.getc(true),
          E = this.viz.canvas,
          F = E.translateOffsetX,
          D = E.translateOffsetY,
          M = E.scaleOffsetX,
          K = E.scaleOffsetY,
          J = E.getSize();
        var G = {
          x: Math.round(L.x * M + F + J.width / 2),
          y: Math.round(L.y * K + D + J.height / 2)
        };
        N.setAttribute("x", G.x);
        N.setAttribute("y", G.y);
        I.onPlaceLabel(N, H)
      }
    });
    C.Label.HTML = new t({
      Implements: g.Label.HTML,
      initialize: function(D) {
        this.viz = D
      },
      placeLabel: function(O, I, J) {
        var M = I.pos.getc(true),
          F = this.viz.canvas,
          G = F.translateOffsetX,
          E = F.translateOffsetY,
          N = F.scaleOffsetX,
          L = F.scaleOffsetY,
          K = F.getSize();
        var H = {
          x: Math.round(M.x * N + G + K.width / 2),
          y: Math.round(M.y * L + E + K.height / 2)
        };
        var D = O.style;
        D.left = H.x + "px";
        D.top = H.y + "px";
        D.display = this.fitsInCanvas(H, F) ? "" : "none";
        J.onPlaceLabel(O, I)
      }
    });
    C.Plot.NodeTypes = new t({
      none: {
        render: e.empty,
        contains: e.lambda(false)
      },
      circle: {
        render: function(E, D) {
          var G = E.pos.getc(true),
            F = E.getData("dim");
          this.nodeHelper.circle.render("fill", G, F, D)
        },
        contains: function(D, G) {
          var F = D.pos.getc(true),
            E = D.getData("dim");
          return this.nodeHelper.circle.contains(F, G, E)
        }
      },
      ellipse: {
        render: function(G, E) {
          var H = G.pos.getc(true),
            F = G.getData("width"),
            D = G.getData("height");
          this.nodeHelper.ellipse.render("fill", H, F, D, E)
        },
        contains: function(F, H) {
          var G = F.pos.getc(true),
            E = F.getData("width"),
            D = F.getData("height");
          return this.nodeHelper.ellipse.contains(G, H, E, D)
        }
      },
      square: {
        render: function(E, D) {
          var G = E.pos.getc(true),
            F = E.getData("dim");
          this.nodeHelper.square.render("fill", G, F, D)
        },
        contains: function(D, G) {
          var F = D.pos.getc(true),
            E = D.getData("dim");
          return this.nodeHelper.square.contains(F, G, E)
        }
      },
      rectangle: {
        render: function(G, E) {
          var H = G.pos.getc(true),
            F = G.getData("width"),
            D = G.getData("height");
          this.nodeHelper.rectangle.render("fill", H, F, D, E)
        },
        contains: function(F, H) {
          var G = F.pos.getc(true),
            E = F.getData("width"),
            D = F.getData("height");
          return this.nodeHelper.rectangle.contains(G, H, E, D)
        }
      },
      triangle: {
        render: function(E, D) {
          var G = E.pos.getc(true),
            F = E.getData("dim");
          this.nodeHelper.triangle.render("fill", G, F, D)
        },
        contains: function(D, G) {
          var F = D.pos.getc(true),
            E = D.getData("dim");
          return this.nodeHelper.triangle.contains(F, G, E)
        }
      },
      star: {
        render: function(E, D) {
          var G = E.pos.getc(true),
            F = E.getData("dim");
          this.nodeHelper.star.render("fill", G, F, D)
        },
        contains: function(D, G) {
          var F = D.pos.getc(true),
            E = D.getData("dim");
          return this.nodeHelper.star.contains(F, G, E)
        }
      }
    });
    C.Plot.EdgeTypes = new t({
      none: e.empty,
      line: {
        render: function(D, E) {
          var G = D.nodeFrom.pos.getc(true),
            F = D.nodeTo.pos.getc(true);
          this.edgeHelper.line.render(G, F, E)
        },
        contains: function(D, G) {
          var F = D.nodeFrom.pos.getc(true),
            E = D.nodeTo.pos.getc(true);
          return this.edgeHelper.line.contains(F, E, G, this.edge.epsilon)
        }
      },
      arrow: {
        render: function(E, F) {
          var J = E.nodeFrom.pos.getc(true),
            I = E.nodeTo.pos.getc(true),
            H = E.getData("dim"),
            G = E.data.$direction,
            D = (G && G.length > 1 && G[0] != E.nodeFrom.id);
          this.edgeHelper.arrow.render(J, I, H, D, F)
        },
        contains: function(D, G) {
          var F = D.nodeFrom.pos.getc(true),
            E = D.nodeTo.pos.getc(true);
          return this.edgeHelper.arrow.contains(F, E, G, this.edge.epsilon)
        }
      }
    })
  })($jit.RGraph);
  s.prototype.moebiusTransformation = function(E) {
    var C = this.add(E);
    var D = E.$conjugate().$prod(this);
    D.x++;
    return C.$div(D)
  };
  g.Util.moebiusTransformation = function(E, G, F, D, C) {
    this.eachNode(E, function(I) {
      for (var H = 0; H < F.length; H++) {
        var K = G[H].scale(-1),
          J = D ? D : F[H];
        I.getPos(F[H]).set(I.getPos(J).getc().moebiusTransformation(K))
      }
    }, C)
  };
  $jit.Hypertree = new t({
    Implements: [f, r, j.Radial],
    initialize: function(C) {
      var F = $jit.Hypertree;
      var D = {
        radius: "auto",
        offset: 0,
        Edge: {
          type: "hyperline"
        },
        duration: 1500,
        fps: 35
      };
      this.controller = this.config = e.merge(q("Canvas", "Node", "Edge", "Fx", "Tips", "NodeStyles", "Events", "Navigation", "Controller", "Label"), D, C);
      var E = this.config;
      if (E.useCanvas) {
        this.canvas = E.useCanvas;
        this.config.labelContainer = this.canvas.id + "-label"
      } else {
        if (E.background) {
          E.background = e.merge({
            type: "Circles"
          }, E.background)
        }
        this.canvas = new o(this, E);
        this.config.labelContainer = (typeof E.injectInto == "string" ? E.injectInto : E.injectInto.id) + "-label"
      }
      this.graphOptions = {
        complex: false,
        Node: {
          selected: false,
          exist: true,
          drawn: true
        }
      };
      this.graph = new g(this.graphOptions, this.config.Node, this.config.Edge);
      this.labels = new F.Label[E.Label.type](this);
      this.fx = new F.Plot(this, F);
      this.op = new F.Op(this);
      this.json = null;
      this.root = null;
      this.busy = false;
      this.initializeExtras()
    },
    createLevelDistanceFunc: function() {
      var G = this.getRadius();
      var I = 0,
        C = Math.max,
        D = this.config;
      this.graph.eachNode(function(J) {
        I = C(J._depth, I)
      }, "ignore");
      I++;
      var H = function(J) {
        return function(L) {
          L.scale = G;
          var N = L._depth + 1;
          var M = 0,
            K = Math.pow;
          while (N) {
            M += K(J, N--)
          }
          return M - D.offset
        }
      };
      for (var F = 0.51; F <= 1; F += 0.01) {
        var E = (1 - Math.pow(F, I)) / (1 - F);
        if (E >= 2) {
          return H(F - 0.01)
        }
      }
      return H(0.75)
    },
    getRadius: function() {
      var C = this.config.radius;
      if (C !== "auto") {
        return C
      }
      var D = this.canvas.getSize();
      return Math.min(D.width, D.height) / 2
    },
    refresh: function(C) {
      if (C) {
        this.reposition();
        this.graph.eachNode(function(D) {
          D.startPos.rho = D.pos.rho = D.endPos.rho;
          D.startPos.theta = D.pos.theta = D.endPos.theta
        })
      } else {
        this.compute()
      }
      this.plot()
    },
    reposition: function() {
      this.compute("end");
      var C = this.graph.getNode(this.root).pos.getc().scale(-1);
      g.Util.moebiusTransformation(this.graph, [C], ["end"], "end", "ignore");
      this.graph.eachNode(function(D) {
        if (D.ignore) {
          D.endPos.rho = D.pos.rho;
          D.endPos.theta = D.pos.theta
        }
      })
    },
    plot: function() {
      this.fx.plot()
    },
    onClick: function(E, C) {
      var D = this.graph.getNode(E).pos.getc(true);
      this.move(D, C)
    },
    move: function(G, E) {
      var D = u(G.x, G.y);
      if (this.busy === false && D.norm() < 1) {
        this.busy = true;
        var C = this.graph.getClosestNodeToPos(D),
          F = this;
        this.graph.computeLevels(C.id, 0);
        this.controller.onBeforeCompute(C);
        E = e.merge({
          onComplete: e.empty
        }, E || {});
        this.fx.animate(e.merge({
          modes: ["moebius"],
          hideLabels: true
        }, E, {
          onComplete: function() {
            F.busy = false;
            E.onComplete()
          }
        }), D)
      }
    }
  });
  $jit.Hypertree.$extend = true;
  (function(C) {
    C.Op = new t({
      Implements: g.Op
    });
    C.Plot = new t({
      Implements: g.Plot
    });
    C.Label = {};
    C.Label.Native = new t({
      Implements: g.Label.Native,
      initialize: function(D) {
        this.viz = D
      },
      renderLabel: function(F, H, E) {
        var D = F.getCtx();
        var I = H.pos.getc(true);
        var G = this.viz.getRadius();
        D.fillText(H.name, I.x * G, I.y * G)
      }
    });
    C.Label.SVG = new t({
      Implements: g.Label.SVG,
      initialize: function(D) {
        this.viz = D
      },
      placeLabel: function(O, I, J) {
        var M = I.pos.getc(true),
          F = this.viz.canvas,
          G = F.translateOffsetX,
          E = F.translateOffsetY,
          N = F.scaleOffsetX,
          L = F.scaleOffsetY,
          K = F.getSize(),
          D = this.viz.getRadius();
        var H = {
          x: Math.round((M.x * N) * D + G + K.width / 2),
          y: Math.round((M.y * L) * D + E + K.height / 2)
        };
        O.setAttribute("x", H.x);
        O.setAttribute("y", H.y);
        J.onPlaceLabel(O, I)
      }
    });
    C.Label.HTML = new t({
      Implements: g.Label.HTML,
      initialize: function(D) {
        this.viz = D
      },
      placeLabel: function(P, J, K) {
        var N = J.pos.getc(true),
          G = this.viz.canvas,
          H = G.translateOffsetX,
          F = G.translateOffsetY,
          O = G.scaleOffsetX,
          M = G.scaleOffsetY,
          L = G.getSize(),
          D = this.viz.getRadius();
        var I = {
          x: Math.round((N.x * O) * D + H + L.width / 2),
          y: Math.round((N.y * M) * D + F + L.height / 2)
        };
        var E = P.style;
        E.left = I.x + "px";
        E.top = I.y + "px";
        E.display = this.fitsInCanvas(I, G) ? "" : "none";
        K.onPlaceLabel(P, J)
      }
    });
    C.Plot.NodeTypes = new t({
      none: {
        render: e.empty,
        contains: e.lambda(false)
      },
      circle: {
        render: function(F, D) {
          var E = this.node,
            H = F.getData("dim"),
            G = F.pos.getc();
          H = E.transform ? H * (1 - G.squaredNorm()) : H;
          G.$scale(F.scale);
          if (H > 0.2) {
            this.nodeHelper.circle.render("fill", G, H, D)
          }
        },
        contains: function(D, G) {
          var E = D.getData("dim"),
            F = D.pos.getc().$scale(D.scale);
          return this.nodeHelper.circle.contains(F, G, E)
        }
      },
      ellipse: {
        render: function(G, E) {
          var H = G.pos.getc().$scale(G.scale),
            F = G.getData("width"),
            D = G.getData("height");
          this.nodeHelper.ellipse.render("fill", H, F, D, E)
        },
        contains: function(F, H) {
          var E = F.getData("width"),
            D = F.getData("height"),
            G = F.pos.getc().$scale(F.scale);
          return this.nodeHelper.circle.contains(G, H, E, D)
        }
      },
      square: {
        render: function(F, D) {
          var E = this.node,
            H = F.getData("dim"),
            G = F.pos.getc();
          H = E.transform ? H * (1 - G.squaredNorm()) : H;
          G.$scale(F.scale);
          if (H > 0.2) {
            this.nodeHelper.square.render("fill", G, H, D)
          }
        },
        contains: function(D, G) {
          var E = D.getData("dim"),
            F = D.pos.getc().$scale(D.scale);
          return this.nodeHelper.square.contains(F, G, E)
        }
      },
      rectangle: {
        render: function(H, E) {
          var G = this.node,
            F = H.getData("width"),
            D = H.getData("height"),
            I = H.pos.getc();
          F = G.transform ? F * (1 - I.squaredNorm()) : F;
          D = G.transform ? D * (1 - I.squaredNorm()) : D;
          I.$scale(H.scale);
          if (F > 0.2 && D > 0.2) {
            this.nodeHelper.rectangle.render("fill", I, F, D, E)
          }
        },
        contains: function(F, H) {
          var E = F.getData("width"),
            D = F.getData("height"),
            G = F.pos.getc().$scale(F.scale);
          return this.nodeHelper.square.contains(G, H, E, D)
        }
      },
      triangle: {
        render: function(F, D) {
          var E = this.node,
            H = F.getData("dim"),
            G = F.pos.getc();
          H = E.transform ? H * (1 - G.squaredNorm()) : H;
          G.$scale(F.scale);
          if (H > 0.2) {
            this.nodeHelper.triangle.render("fill", G, H, D)
          }
        },
        contains: function(D, G) {
          var E = D.getData("dim"),
            F = D.pos.getc().$scale(D.scale);
          return this.nodeHelper.triangle.contains(F, G, E)
        }
      },
      star: {
        render: function(F, D) {
          var E = this.node,
            H = F.getData("dim"),
            G = F.pos.getc();
          H = E.transform ? H * (1 - G.squaredNorm()) : H;
          G.$scale(F.scale);
          if (H > 0.2) {
            this.nodeHelper.star.render("fill", G, H, D)
          }
        },
        contains: function(D, G) {
          var E = D.getData("dim"),
            F = D.pos.getc().$scale(D.scale);
          return this.nodeHelper.star.contains(F, G, E)
        }
      }
    });
    C.Plot.EdgeTypes = new t({
      none: e.empty,
      line: {
        render: function(D, E) {
          var H = D.nodeFrom.pos.getc(true),
            G = D.nodeTo.pos.getc(true),
            F = D.nodeFrom.scale;
          this.edgeHelper.line.render({
            x: H.x * F,
            y: H.y * F
          }, {
            x: G.x * F,
            y: G.y * F
          }, E)
        },
        contains: function(D, H) {
          var G = D.nodeFrom.pos.getc(true),
            F = D.nodeTo.pos.getc(true),
            E = D.nodeFrom.scale;
          this.edgeHelper.line.contains({
            x: G.x * E,
            y: G.y * E
          }, {
            x: F.x * E,
            y: F.y * E
          }, H, this.edge.epsilon)
        }
      },
      arrow: {
        render: function(E, F) {
          var K = E.nodeFrom.pos.getc(true),
            J = E.nodeTo.pos.getc(true),
            G = E.nodeFrom.scale,
            I = E.getData("dim"),
            H = E.data.$direction,
            D = (H && H.length > 1 && H[0] != E.nodeFrom.id);
          this.edgeHelper.arrow.render({
            x: K.x * G,
            y: K.y * G
          }, {
            x: J.x * G,
            y: J.y * G
          }, I, D, F)
        },
        contains: function(D, H) {
          var G = D.nodeFrom.pos.getc(true),
            F = D.nodeTo.pos.getc(true),
            E = D.nodeFrom.scale;
          this.edgeHelper.arrow.contains({
            x: G.x * E,
            y: G.y * E
          }, {
            x: F.x * E,
            y: F.y * E
          }, H, this.edge.epsilon)
        }
      },
      hyperline: {
        render: function(D, E) {
          var H = D.nodeFrom.pos.getc(),
            G = D.nodeTo.pos.getc(),
            F = this.viz.getRadius();
          this.edgeHelper.hyperline.render(H, G, F, E)
        },
        contains: e.lambda(false)
      }
    })
  })($jit.Hypertree)
})();
