import {cabinetUtilizationRate} from './RoomRoomApi'

export default {
  data() {
    return {
      container: null,
      graph: {},
      outline: null,
      centerCellId: 'cabinet-center-cell',
      cabinetData: null
    }
  },
  beforeDestroy() {
    if (this.graph.popupMenuHandler) {
      this.graph.popupMenuHandler.destroy();
    }
    window.mxEvent.removeAllListeners(window);
    window.mxEvent.removeAllListeners(document);
  },
  methods: {
    init(callback) {
      this.initGraph(callback);
      this.loadData();
      this.loadPanel();
      this.addDragCellEvent();
    },
    initGraph(callback) {
      let _self = this;
      _self.container = document.getElementById('cabinetGraph');
      if (!window.mxClient.isBrowserSupported()) {
        this.$message.error('浏览器不支持绘图组件！');
      } else {
        window.mxEvent.disableContextMenu(_self.container);
        if (this.cabinetData !== null) {
          this.graph = _self.createGraph();
          if (callback) {
            callback();
          }
        }
        this.loadStyle();
      }
    },
    createGraph() {
      let _self = this;
      let moveCellsFun = function(cells, dx, dy, clone, target, evt, mapping) {
        if (target && target.style && target.style.indexOf('centerLineCell') !== -1) {
          if (cells[0] && cells[0].style && cells[0].style.indexOf('panel') !== -1) {
            dx = (dx != null) ? dx : 0;
            dy = (dy != null) ? dy : 0;
            clone = (clone != null) ? clone : false;

            if (cells != null && (dx !== 0 || dy !== 0 || clone || target != null)) {
              // Removes descendants with ancestors in cells to avoid multiple moving
              cells = this.model.getTopmostCells(cells);

              this.model.beginUpdate();
              try {
                // Faster cell lookups to remove relative edge labels with selected
                // terminals to avoid explicit and implicit move at same time
                var dict = new window.mxDictionary();

                for (var i = 0; i < cells.length; i++) {
                  dict.put(cells[i], true);
                }

                var isSelected = window.mxUtils.bind(this, function (cell) {
                  while (cell != null) {
                    if (dict.get(cell)) {
                      return true;
                    }

                    cell = this.model.getParent(cell);
                  }

                  return false;
                });

                // Removes relative edge labels with selected terminals
                var checked = [];

                for (let i = 0; i < cells.length; i++) {
                  var geo = this.getCellGeometry(cells[i]);
                  var parent = this.model.getParent(cells[i]);

                  if ((geo == null || !geo.relative) || !this.model.isEdge(parent) ||
                    (!isSelected(this.model.getTerminal(parent, true)) &&
                      !isSelected(this.model.getTerminal(parent, false)))) {
                    checked.push(cells[i]);
                  }
                }

                cells = checked;

                if (clone) {
                  cells = this.cloneCells(cells, this.isCloneInvalidEdges(), mapping);

                  if (target == null) {
                    target = this.getDefaultParent();
                  }
                }

                // FIXME: Cells should always be inserted first before any other edit
                // to avoid forward references in sessions.
                // Need to disable allowNegativeCoordinates if target not null to
                // allow for temporary negative numbers until cellsAdded is called.
                var previous = this.isAllowNegativeCoordinates();

                if (target != null) {
                  this.setAllowNegativeCoordinates(true);
                }

                this.cellsMoved(cells, dx, dy, !clone && this.isDisconnectOnMove() && this.isAllowDanglingEdges(), target == null, this.isExtendParentsOnMove() && target == null);

                this.setAllowNegativeCoordinates(previous);
                /* if (target != null) {
                  var index = this.model.getChildCount(target);
                  this.cellsAdded(cells, target, index, null, null, true);
                } */

                // Dispatches a move event
                this.fireEvent(new window.mxEventObject(window.mxEvent.MOVE_CELLS, 'cells', cells,
                  'dx', dx, 'dy', dy, 'clone', clone, 'target', target, 'event', evt));
              } finally {
                this.model.endUpdate();
              }
            }
          } else {
            _self.$message.warning('请拖动设备进行操作！')
          }
        } else {
            _self.$message.warning('请将设备拖拽到机架上！');
            return;
        }
        return cells;
      };
      let graph = new window.mxGraph(this.container);
      graph.moveCells = moveCellsFun;
      graph.setCellsMovable(true);
      graph.setCellsResizable(false);
      graph.setPanning(true);
      graph.setTooltips(true);
      // 禁用节点双击，防止改变数据
      graph.dblClick = function (evt, cell) {
        return false;
      };
      graph.graphHandler.setSelectEnabled(false);
      graph.centerZoom = false;
      graph.foldingEnabled = false;
      graph.setHtmlLabels(true);
      graph.setDropEnabled(true);
      // 拖拽目标
      let oldIsValidDropTarget = graph.isValidDropTarget;
      graph.isValidDropTarget = function(cell, cells, evt) {
        if (cell && cell.style && cell.style.indexOf('centerLineCell') !== -1) {
          return true;
        }
        return oldIsValidDropTarget.apply(this, arguments);
      };
      graph.popupMenuHandler.autoExpand = true;
      graph.panningHandler.useLeftButtonForPanning = true;
      // 右键菜单
      graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
        if (cell && cell.style && cell.style.indexOf('panel') !== -1) {
          menu.addItem('删除', null, () => {
            graph.removeCells([cell]);
          });
        }
      };
      // 浮动文字提示
      graph.getTooltipForCell = function(cell) {
        if (cell && cell.style && cell.style.indexOf('panel') !== -1) {
          return `${cell.address}-${cell.itname}-${cell.uamount}U`;
        }
      };
      // cell 是否可以拖动
      graph.isCellMovable = function(cell) {
        if (cell && cell.style && cell.style.indexOf('panel') !== -1) {
          return true;
        } else {
          return false;
        }
      };
      return graph;
    },
    // 添加拖拽事件
    addDragCellEvent() {
      this.graph.addListener(window.mxEvent.MOVE_CELLS, window.mxUtils.bind(this, (sender, event) => {
        let cells = event.getProperty('cells');
        let target = event.getProperty('target');
        if (target && target.style && target.style.indexOf('centerLineCell') !== -1) {
          if (this.checkPosition(target, cells[0].uamount)) {
            let geo = target.getGeometry();
            let cellGeo = cells[0].getGeometry();
            let newGeo = new window.mxGeometry(geo.x, geo.y, cellGeo.width, cellGeo.height);
            cells[0].number = target.value;
            cells[0].setGeometry(newGeo);
            this.graph.setSelectionCell(cells[0]);
          } else {
            let geo = this.graph.getModel().getCell('line-' + cells[0].number).getGeometry();
            let cellGeo = cells[0].getGeometry();
            let newGeo = new window.mxGeometry(geo.x, geo.y, cellGeo.width, cellGeo.height);
            cells[0].setGeometry(newGeo);
            this.$message.warning('目标位置无法放置该设备，请重新操作！');
          }
        }
      }));
    },
    loadStyle() {
      // 获取默认样式
      let node = window.mxUtils.load(window.mxBasePath + '/cabinet-style.xml').getDocumentElement();
      let dec = new window.mxCodec(node.ownerDocument);
      dec.decode(node, this.graph.getStylesheet());
      this.graph.refresh();
    },
    loadData(flag) {
      let model = this.graph.getModel();
      model.clear();
      model.beginUpdate();
      let parent = this.graph.getDefaultParent();
      try {
        // 通过资产取得容量
        let uCount = this.cabinet.uAmount;
        let name = this.cabinet.itcompName || '';
        // 总高 = 中间高度 + 顶部高度 + 底部高度
        let height = uCount * 27 + 34 + 69;
        let cabinetCell = this.graph.insertVertex(parent, null, '', 0, 0, 273, height, 'cabinetCell;');
        let topY = 0;
        // 顶部
        let topCell = this.graph.insertVertex(cabinetCell, null, '', 0, topY, 273, 34, 'cabinetTopCell;');
        this.graph.insertVertex(topCell, null, name, 17, topY, 239, 33, 'topLineCell;');
        this.graph.insertVertex(topCell, null, '', 0, topY, 16, 33, 'topLineCell;');
        this.graph.insertVertex(topCell, null, '', 257, topY, 16, 33, 'topLineCell;');
        let centerY = topY + 34;
        // 中间
        let centerCell = this.graph.insertVertex(cabinetCell, this.centerCellId, '', 0, centerY, 273, uCount * 27, 'cabinetCenterCell;');
        for (let i = 0; i < uCount; i++) {
          let heightY = i * 27;
          this.graph.insertVertex(centerCell, 'line-' + (uCount - i), '' + (uCount - i), 18, heightY, 237, 27, 'centerLineCell;');
        }
        let bottomY = centerY + uCount * 27;
        // 机柜底部
        this.graph.insertVertex(cabinetCell, null, '', 0, bottomY, 273, 69, 'cabinetBottomCell;image=static/3droom/res/cabinetbottom.svg');
      } finally {
        model.endUpdate();
        this.graph.fit(null, null, 10);
        this.graph.center();
      }
    },
    // 载入面板数据
    loadPanel() {
      let model = this.graph.getModel();
      model.beginUpdate();
      try {
        let centerCell = this.graph.getModel().getCell(this.centerCellId);
        for (let i = 0; i < this.cabinetData.cabinetUAssetRel.length; i++) {
          let item = this.cabinetData.cabinetUAssetRel[i];
          let uNumber = Object.keys(item)[0];
          let panelSrc = item[uNumber].panel;
          // 直接在目标cell位置上添加cell
          let target = this.graph.getModel().getCell('line-' + uNumber);
          let cell = this.graph.insertVertex(centerCell, null, '<div style="width: 237px;height:' + item[uNumber].uAmount * 27 + 'px;"><img src="' + panelSrc + '" height="100%" width="100%"></div>', target.geometry.x, target.geometry.y, 237, item[uNumber].uAmount * 27, 'panel');
          // 添加一些自定义属性
          cell.uuid = item[uNumber].uuid;
          // 当前所在位置
          cell.number = uNumber;
          cell.uamount = item[uNumber].uAmount;
          cell.itname = item[uNumber].itcompName;
          cell.address = item[uNumber].controlAdderss;
        }
      } finally {
        model.endUpdate()
      }
    },
    // 绑定拖拽事件
    addItemDraggable () {
      // var _self = this;
      let assetImgList = document.querySelectorAll('#assetList .assetImgItem');
      console.log(assetImgList);
      assetImgList.forEach((item) => {
        // 机柜Id
        let uamount = item.dataset.uamount;
        // 面板路径
        let panelSrc = item.dataset.panel;
        let uuid = item.dataset.uuid;
        let itname = item.dataset.itname;
        let address = item.dataset.address;
        this.createItemDragSource(item, uamount, panelSrc, uuid, itname, address);
      });
    },
    createItemDragSource (ele, uamount, panelSrc, uuid, itname, address) {
      let dragImage = ele.cloneNode(true);
      dragImage.style.width = '237px';
      dragImage.style.height = uamount * 27 + 'px';
      window.mxUtils.makeDraggable(ele, this.graph, (graph, evt, target, x, y) => {
        if (target && target.style && target.style.indexOf('centerLineCell') !== -1) {
          if (this.checkExist(uuid)) {
            this.$message.warning('该设备已经存在于当前机柜中！')
            return;
          }
          if (this.checkPosition(target, uamount)) {
            // 直接在目标cell位置上添加cell
            let cell = graph.insertVertex(target.parent, null, '<div style="width: 237px;height:' + uamount * 27 + 'px;"><img src="' + panelSrc + '" height="100%" width="100%"></div>', target.geometry.x, target.geometry.y, 237, uamount * 27, 'panel');
            // 添加一些自定义属性
            cell.uuid = uuid;
            // 当前所在位置
            cell.number = target.value;
            cell.uamount = uamount;
            cell.itname = itname;
            cell.address = address;
            graph.setSelectionCell(cell);
          } else {
            this.$message.warning('目标位置无法放置该设备，请重新操作！')
          }
        } else {
          this.$message.warning('请将设备拖拽到机架上')
        }
      }, dragImage, 0, 0, true, true);
    },
    // 检查是否能够拖动到目标位置
    checkPosition(target, uamount) {
      return (Number.parseInt(target.value) - Number.parseInt(uamount)) >= 0;
    },
    // 通过uuid判断是否存在将拖进到的资产
    checkExist(uuid) {
      let centerCell = this.graph.getModel().getCell(this.centerCellId);
      let index = centerCell.children.findIndex((child) => {
        if (child.style && child.style.indexOf('panel') !== -1) {
          if (child.uuid === uuid) {
            return true;
          }
        }
      });
      return index !== -1;
    },
    zoomIn() {
      this.graph.zoomIn();
    },
    zoomOut() {
      this.graph.zoomOut();
    },
    zoomFix() {
      this.graph.fit(null, null, 10);
      this.graph.center();
    },
    // 清理机柜
    clearCabinet() {
      this.loadData();
    },
    // 重置机柜
    resetCabinet() {
      this.loadData();
      cabinetUtilizationRate(this.cabinet.uuid).then(({data}) => {
        this.cabinetData = data;
        this.loadPanel();
      });
    },
    // 检测是否正确
    checkCorrect(callback) {
      let centerCell = this.graph.getModel().getCell(this.centerCellId);
      let numberAry = [];
      let panelsAry = [];
      centerCell.children.forEach((child) => {
        if (child.style && child.style.indexOf('panel') !== -1) {
          let ary = this.getNumberAry(child.number, child.uamount);
          numberAry = numberAry.concat(ary)
          panelsAry.push({
            'cabinetU': child.number,
            'attachedCuuid': child.uuid
          });
        }
      });
      let backData = {
        'cabinetUuid': this.cabinet.uuid,
        'assetURel': panelsAry
      };
      let setSize = new Set(numberAry).size;
      if (numberAry.length === setSize) {
        callback(true, backData);
      } else {
        this.$message.warning('设备之间有位置冲突，请认真检查');
      }
    },
    getNumberAry(numberVal, uamountVal) {
      let number = Number.parseInt(numberVal);
      let uamount = Number.parseInt(uamountVal);
      if (uamount > 1) {
        let ary = [];
        for (let i = 0; i < uamount; i++) {
          ary.push(number - i);
        }
        return ary;
      } else {
        return [number];
      }
    }
  }

};
