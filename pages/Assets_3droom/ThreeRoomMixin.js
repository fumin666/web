/**
 * Created by dgunzi on 2018/7/31.
 */

import {Mode, Oasis3d, Utils} from 'oasis3d'
import item from './AddItems'
import attrForm from './AttrForm'
import sceneItems from './SceneItems'
import roomItems from './RoomItems'
import newRoom from './NewRoom'
import editRoomForm from './EditRoomForm'
import cabinetEdit from './CabinetEdit'
import linkAsset from './LinkAsset'
import * as api from './RoomRoomApi'
import {cloneDeep} from 'lodash'
import itemsMixin from './ItemsMixin'

let threeRoomMixin = {
  mixins: [itemsMixin],
  data() {
    return {
      Mode: Mode,
      mode: 'view',
      infoPanelType: 0, // 左侧面板类型
      infoPanelTitles: ['机房列表', '调整物品', '调整墙面', '调整地面', '物品列表', '添加物品'],
      leftPanelShow: true,
      leftPanelFlag: false,
      currentMode: 0,
      resDialog: false,
      itemsLoading: 0,   // 载入计数
      drawHintFlag: false,
      spinFlag: true,
      mode2d: 0,
      panSpeed: 30,
      directions: {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
      },
      edgeView: true, // 正面墙是否展示
      selectedItem: null,
      roomTexturePath: 'static/3droom/rooms/',
      wallTexture: [{url: 'marbletiles.jpg', stretch: false, scale: 300}, {url: 'wallmap_yellow.png', stretch: false, scale: 300}, {url: 'light_brick.jpg', stretch: false, scale: 100}, {url: 'wallmap.png', stretch: true, scale: 0}],
      floorTexture: [{url: 'light_fine_wood.jpg', stretch: false, scale: 300}, {url: 'floor.jpg', stretch: false, scale: 100}, {url: 'hardwood.png', stretch: false, scale: 400}, {url: 'FloorDefault.jpg', stretch: false, scale: 60}],
      currentTarget: null,  // 当前目标
      roomList: [],
      currentRoom: {},
      newRoomDialog: false,  // 新建机房
      editRoomDialog: false,  // 编辑机房
      currentEditRoom: {},
      cabinetEditDialog: false, // 为机柜添加资产弹窗
      cabinetAsset: null,      // 编辑的具体机柜（资产）
      linkAssetDialog: false, // 关联机柜弹窗
      showCabinetUsage: false,  // 显示机柜利用率
      showCabinetSpace: false,  // 显示空间利用
      editRoomSubmit: false,     // 编辑内部资产按钮
      saveDisabled: false,     // 保存按钮不可用
      refreshDisabled: false,   // 刷新按钮
      cabinetUsageDisabled: false,    // 机柜利用率按钮
      cabinetSpaceDisabled: false     // 空间利用按钮
    }
  },
  components: {
    'r-item': item,
    'attr-form': attrForm,
    'scene-items': sceneItems,
    'room-items': roomItems,
    'new-room': newRoom,
    'edit-room-from': editRoomForm,
    'cabinet-edit-graph': cabinetEdit,
    'link-asset': linkAsset
  },
  created() {
    // 获取机房列表
    this.getRoomList()
  },
  mounted() {
      var opts = {
        floorplannerElement: 'floorplanner-canvas', // 2D 绘制canvas
        threeElement: '3d-viewer', // 右侧主区域
        resourceDir: 'static/3droom/res/',
        roomTextureDir: this.roomTexturePath,
        uiConfig: {
          left: 0,
          top: -25
        },
        widget: false
      };
      window.oasis3d_loading = false;
      window.oasis3d = new Oasis3d(opts);
      window.oasis3d.setCabinetOpenCallback(this.addEquments);
      window.oasis3d.setEquipmentClickCallback(this.equipmentClick);
      // 针对模型类型物品的点击事件
      window.oasis3d.addDbclickEvt({
        obj_ctype: 'camera',
        obj_event: (obj, controller, event) => {
        }
      });
      window.oasis3d.model.scene.itemLoadingCallbacks.add(() => {
        this.itemsLoading += 1;
        window.oasis3d_loading = true;
        document.getElementById('3droomloading').style.display = 'block';
      });
      window.oasis3d.model.scene.itemLoadedCallbacks.add((item) => {
        this.itemsLoading -= 1;
        if (this.itemsLoading === 0) {
          window.oasis3d_loading = false;
          document.getElementById('3droomloading').style.display = 'none';
        }
      });
      window.oasis3d.model.scene.itemRemovedCallbacks.add((item) => {
        if (this.infoPanelType === 4 && this.$refs.sceneItems) {
         this.$refs.sceneItems.init();
        }
      });
      // 2D编辑器
      window.floorplanner = window.oasis3d.floorplanner;
      // mode buttons
      window.floorplanner.modeResetCallbacks.add((mode) => {
        if (mode === Mode.DRAW) {
          this.drawHintFlag = true;
        } else {
          this.drawHintFlag = false;
        }
        this.$nextTick(() => {
          this.mode2d = mode;
        })
      });
      /* window.oasis3d.three.wallClicked.add((halfEdge) => {
        this.currentTarget = halfEdge;
        // 墙的纹理
        this.infoPanelType = 2;
        this.leftPanelShow = true;
      }); */
      window.oasis3d.three.floorClicked.add((room) => {
        this.currentTarget = room;
        this.infoPanelType = 3;
        this.leftPanelShow = true;
      });
      window.oasis3d.three.itemSelectedCallbacks.add((item) => {
          this.selectedItem = item;
          this.infoPanelType = 1;
          this.leftPanelShow = true;
      });
      window.oasis3d.three.itemUnselectedCallbacks.add(() => {
        this.selectedItem = null;
        if (this.infoPanelType !== 0) {
          this.infoPanelType = 4;
        }
      });
      window.oasis3d.three.nothingClicked.add(() => {
        this.infoPanelType = 4;
      });
      // 由于点击图后，不再旋转，增加回调函数
      window.oasis3d.three.elementClicked.add((hasClicked) => {
        this.spinFlag = !hasClicked;
      });
      window.oasis3d.three.getController().enabled = false;
  },
  methods: {
    getRoomList(flag) {
      api.getAssetRoomList().then(({data}) => {
        this.roomList = data;
        this.leftPanelShow = true;
        this.infoPanelType = 0;
        if (this.roomList.length > 0) {
          // 展示房间列表
          if (flag) {
            this.currentRoom = this.roomList[this.roomList.length - 1];
          } else {
            this.currentRoom = this.roomList[0];
          }
          api.getThreeDAssetRoomByUuid(this.currentRoom.roomUuid).then((res) => {
            window.oasis3d.model.loadJSON(res.data);
            if (res.data.items.length === 0) {
              document.getElementById('3droomloading').style.display = 'none';
            }
          });
        } else {
          // 兼容处理，保证在机房无数据下隐藏蒙版
          document.getElementById('3droomloading').style.display = 'none';
        }
      });
    },
    setNewTexture(textureUrl, textureStretch, textureScale, event) {
      this.currentTarget.setTexture(this.roomTexturePath + textureUrl, textureStretch, textureScale);
      event.preventDefault();
    },
    equipmentClick(equipment) {
      // alert('设备被点击了');
      // console.log(equipment);
    },
    addEquments(cabinet) {
      // 告警异常处理
     /* let uuidAry = ['ce1c3fc6-841e-11e8-adc0-fa7ae01bbebc'];
      for (let k = 0, l = cabinet.children.length; k < l; k++) {
        let index = uuidAry.findIndex(function(element) {
          return element === cabinet.children[k].uuid;
        });
        if (index !== -1) {
          Utils.setSkinColor(cabinet.children[k], 0xFF0000);
        }
      } */
      // 判断是否已经关联了机柜
      if (cabinet.uuid.indexOf('-') === -1) {
        api.cabinetUtilizationRate(cabinet.uuid).then(({data}) => {
          for (let i = 0; i < data.cabinetUAssetRel.length; i++) {
            let item = data.cabinetUAssetRel[i];
            let uNumber = Object.keys(item)[0];
            let cube = this.createEquipmentByData(cabinet, uNumber, item[uNumber]);
            cabinet.add(cube);
          }
        });
      }
    },
    // 根据数据完成设备模型的创建
    createEquipmentByData(cabinet, uNumber, equipmentInfo) {
      let uamount = equipmentInfo.uAmount;
      let height = uamount * 4.445;
      let yVal = uNumber * 4.685 - cabinet.halfSize.y - uamount * 4.445 / 2;
      let equipmentObj = {
        show: true,
        uuid: Utils.generateUUID(),
        name: 'equipment_card_14',
        objType: 'bladeServer',
        length: 76,
        width: 57,
        height: height,
        x: -3,
        y: yVal,
        z: 0,
        style: {
          skinColor: 0x92630B,
          skin: {
            skin_up: {
              skinColor: 0x92630B,
              imgurl: 'rack_inside.jpg'
            },
            skin_down: {
              skinColor: 0x92630B,
              imgurl: 'rack_inside.jpg'
            },
            skin_fore: {
              skinColor: 0x92630B,
              imgurl: 'rack_inside.jpg'
            },
            skin_behind: {
              skinColor: 0x92630B,
              imgurl: equipmentInfo.panel
            },
            skin_left: {
              skinColor: 0x92630B,
              imgurl: 'rack_inside.jpg'
            },
            skin_right: {
              skinColor: 0x92630B,
              imgurl: 'rack_inside.jpg'
            }
          }
        }
      };
      return Utils.createCube(equipmentObj);
    },
    changeEdgeView() {
      this.edgeView = !this.edgeView;
      window.oasis3d.three.getController().updateInWallItemVisibility(this.edgeView);
      window.oasis3d.three.getFloorplan().changeEdgeView(this.edgeView);
    },
    changeModeEvent(val) {
      window.oasis3d.three.getController().setSelectedObject(null);
      window.oasis3d.three.getController().changeToView();
      window.oasis3d.three.needsUpdate();
      // 切换到编辑模式，
      if (val === 'edit') {
        this.resetCabinet();
      }
    },
    changeCurrentMode(mode) {
      if (mode === 0) {
        document.getElementById('floorplanner').style.display = 'none';
        document.getElementById('3d-viewer').style.display = 'block';
        window.oasis3d.three.updateWindowSize();
        if (this.leftPanelFlag) {
          this.leftPanelShow = !this.leftPanelShow;
          this.leftPanelFlag = false;
        }
      } else {
        document.getElementById('3d-viewer').style.display = 'none';
        document.getElementById('floorplanner').style.display = 'block';
        if (this.leftPanelShow) {
          this.leftPanelShow = !this.leftPanelShow;
          this.leftPanelFlag = true;
        }
        window.floorplanner.reset();
        window.floorplanner.resizeView();
      }
      // 当前状态为编辑2D图的界面
      if (this.currentMode === 1) {
        window.oasis3d.model.floorplan.update();
        window.oasis3d.three.getController().updateInWallItemVisibility(this.edgeView);
        window.oasis3d.three.getFloorplan().changeEdgeView(this.edgeView);
      }
      this.currentMode = mode;
      // 信息面板切换
      this.infoPanelType = 0;
    },
    setPlannerMode(setMode) {
      this.mode2d = setMode;
      window.floorplanner.setMode(setMode);
    },
    hideShowPanel() {
      this.leftPanelShow = !this.leftPanelShow;
    },
    // 旋转
    spin() {
      if (this.spinFlag) {
        window.oasis3d.three.stopSpin();
      } else {
        window.oasis3d.three.startSpin();
      }
      this.spinFlag = !this.spinFlag;
    },
    // 机柜利用率
    cabinetUsage() {
      if (this.showCabinetSpace) {
        this.showCabinetSpace = window.oasis3d.three.getController().resetCabinetSpace();
      }
      // 物品列表隐藏
      if (this.leftPanelShow && this.infoPanelType === 4) {
        this.leftPanelShow = false;
        this.infoPanelType = 4;
      }
      this.cabinetUsageDisabled = true;
      if (!this.showCabinetUsage) {
        api.roomUtilizationRate(this.currentRoom.roomUuid).then(({data}) => {
          let usageObj = {};
          data.forEach((item) => {
            if (item.cuuid) {
              usageObj[item.cuuid] = item.usedUTotal / item.initUTotal;
            }
          });
          this.cabinetUsageDisabled = false;
          this.showCabinetUsage = window.oasis3d.three.getController().showCabinetUsage(usageObj);
        });
      } else {
        this.cabinetUsageDisabled = false;
        this.showCabinetUsage = window.oasis3d.three.getController().resetCabinetUsage();
      }
    },
    // 空间利用
    cabinetSpace() {
      // 如果机柜利用率点击了，则先恢复再操作
      if (this.showCabinetUsage) {
        this.showCabinetUsage = window.oasis3d.three.getController().resetCabinetUsage();
      }
      // 物品列表隐藏
      if (this.leftPanelShow && this.infoPanelType === 4) {
        this.leftPanelShow = false;
        this.infoPanelType = 4;
      }
      this.cabinetSpaceDisabled = true;
      if (!this.showCabinetSpace) {
        api.roomUtilizationRate(this.currentRoom.roomUuid).then(({data}) => {
          let spaceObj = {};
          data.forEach((item) => {
            if (item.cuuid) {
              let equipmentAry = this.getEquipmentAry(item.cabinetUAssetRel);
              let emptyAry = this.getArray(item.initUTotal, item.remainUTotalView, item.cabinetUAssetRel);
              spaceObj[item.cuuid] = equipmentAry.concat(emptyAry);
            }
          });
          this.cabinetSpaceDisabled = false;
          this.showCabinetSpace = window.oasis3d.three.getController().showCabinetSpace(spaceObj);
        });
      } else {
        this.cabinetSpaceDisabled = false;
        this.showCabinetSpace = window.oasis3d.three.getController().resetCabinetSpace();
      }
    },
    // 重置机柜
    resetCabinet() {
      // 如果机柜利用率点击了，则先恢复再操作
      if (this.showCabinetSpace) {
        this.showCabinetSpace = window.oasis3d.three.getController().resetCabinetSpace();
      }
      if (this.showCabinetUsage) {
        this.showCabinetUsage = window.oasis3d.three.getController().resetCabinetUsage();
      }
    },
    getArray(initUTotal, array, cabinetUAssetRel) {
      let equipments = [0];
      for (let i = 0; i < cabinetUAssetRel.length; i++) {
        equipments.push(Number.parseInt(Object.keys(cabinetUAssetRel[i])[0]));
      }
      // 在头尾加上两个数以取得一个正确的区间值数组
      equipments.push(initUTotal + 1);
      equipments.sort();
      let rAry = [];
      for (let i = 0; i < equipments.length; i++) {
        let subAry = array.filter((element) => {
          return (equipments[i] < element) && (element < equipments[i + 1]);
        });
        if (subAry.length > 0) {
          rAry.push({
            'height': subAry.length * 4.685,
            'uamount': subAry.length,
            'yVal': (subAry[0] - 1) * 4.685 + subAry.length * 4.685 / 2,
            'equipment': false
          });
        }
      }
      return rAry;
    },
    getEquipmentAry(cabinetUAssetRel) {
      let equipmentInfoAry = [];
      for (let i = 0; i < cabinetUAssetRel.length; i++) {
        let item = cabinetUAssetRel[i];
        let uNumber = Object.keys(item)[0];
        let uamount = item[uNumber].uAmount;
        equipmentInfoAry.push({
          'height': uamount * 4.445,
          'uamount': uamount,
          'yVal': (uNumber * 4.685 - uamount * 4.445) + uamount * 4.445 / 2,
          'equipment': true
        });
      }
      return equipmentInfoAry;
    },
    enter: function (el, done) {
      let leftValue = -260;
      let interval = setInterval(function () {
        leftValue = leftValue + 4;
        el.style.left = leftValue + 'px';
        if (leftValue === 0) {
          clearInterval(interval);
          done();
        }
      }, 2);
    },
    leave: function (el, done) {
      let leftValue = 0;
      let interval = setInterval(function () {
        leftValue = leftValue - 4;
        el.style.left = leftValue + 'px';
        if (leftValue === -260) {
          clearInterval(interval);
          done();
        }
      }, 2);
    },
    // 机房列表
    showRoomList() {
      if (this.leftPanelShow && this.infoPanelType === 0) {
        this.leftPanelShow = false;
        this.infoPanelType = 0;
      } else {
        this.infoPanelType = 0;
        this.leftPanelShow = true;
      }
    },
    // 物品列表
    showSceneItems() {
      this.resetCabinet();
      if (this.leftPanelShow && this.infoPanelType === 4) {
        this.leftPanelShow = false;
        this.infoPanelType = 4;
      } else {
        this.infoPanelType = 4;
        this.leftPanelShow = true;
      }
    },
    loadDesign() {
      let files = document.getElementById('loadFileInput').files;
      let reader = new FileReader();
      reader.onload = function(event) {
        let data = event.target.result;
        window.oasis3d.model.loadSerialized(data);
      };
      reader.readAsText(files[0]);
    },
    saveDesign() {
      let roomData = window.oasis3d.model.exportJSON();
      roomData.roomName = this.currentRoom.roomName;
      roomData.roomUuid = this.currentRoom.roomUuid;
      this.saveDisabled = true;
      let obj = {
        data: [],
        logTemplate: `编辑|机房(${roomData.roomName})`
      }
      api.modifyAssetRoom(roomData, obj).then(({data}) => {
        this.saveDisabled = false;
        if (data.state) {
          this.$message.success('保存成功');
        } else {
          this.$message.error(data.errormsg);
        }
      });
    },
    // 刷新机房
    refreshRoom() {
      this.refreshDisabled = true;
      api.getThreeDAssetRoomByUuid(this.currentRoom.roomUuid).then((res) => {
        window.oasis3d.model.loadJSON(res.data);
        this.refreshDisabled = false;
        this.showCabinetUsage = false;  // 显示机柜利用率
        this.showCabinetSpace = false;  // 显示空间利用
        if (res.data.items.length === 0) {
          document.getElementById('3droomloading').style.display = 'none';
        }
      });
    },
    // 新增机房
    newRoom() {
      this.newRoomDialog = true;
    },
    newDesign(form) {
      let width = form.roomWidth * 100 / 2 + 5;
      let height = form.roomHeight * 100 / 2 + 5;
      let cornersUuid1 = Utils.generateUUID();
      let cornersUuid2 = Utils.generateUUID();
      let cornersUuid3 = Utils.generateUUID();
      let cornersUuid4 = Utils.generateUUID();
      let newRoomStr = `{
          "roomName": "${form.roomName}",
          "floorplan": {
              "corners": {
                  "${cornersUuid1}": {
                      "x": -${width},
                      "y": ${height}
                  },
                  "${cornersUuid2}": {
                      "x": ${width},
                      "y": ${height}
                  },
                  "${cornersUuid3}": {
                      "x": ${width},
                      "y": -${height}
                  },
                  "${cornersUuid4}": {
                      "x": -${width},
                      "y": -${height}
                  }
              },
              "walls": [{
                  "corner1": "${cornersUuid4}",
                  "corner2": "${cornersUuid1}",
                  "frontTexture": {
                      "url": "static/3droom/rooms/wallmap.png",
                      "stretch": true,
                      "scale": 0
                  },
                  "backTexture": {
                      "url": "static/3droom/rooms/wallmap.png",
                      "stretch": true,
                      "scale": 0
                  }
              }, {
                  "corner1": "${cornersUuid1}",
                  "corner2": "${cornersUuid2}",
                  "frontTexture": {
                      "url": "static/3droom/rooms/wallmap.png",
                      "stretch": true,
                      "scale": 0
                  },
                  "backTexture": {
                      "url": "static/3droom/rooms/wallmap.png",
                      "stretch": true,
                      "scale": 0
                  }
              }, {
                  "corner1": "${cornersUuid2}",
                  "corner2": "${cornersUuid3}",
                  "frontTexture": {
                      "url": "static/3droom/rooms/wallmap.png",
                      "stretch": true,
                      "scale": 0
                  },
                  "backTexture": {
                      "url": "static/3droom/rooms/wallmap.png",
                      "stretch": true,
                      "scale": 0
                  }
              }, {
                  "corner1": "${cornersUuid3}",
                  "corner2": "${cornersUuid4}",
                  "frontTexture": {
                      "url": "static/3droom/rooms/wallmap.png",
                      "stretch": true,
                      "scale": 0
                  },
                  "backTexture": {
                      "url": "static/3droom/rooms/wallmap.png",
                      "stretch": true,
                      "scale": 0
                  }
              }],
              "wallTextures": [],
              "floorTextures": {},
              "newFloorTextures": {}
          },
          "items": []
      }`;

      return JSON.parse(newRoomStr);
    },
    zoomIn(e) {
      e.preventDefault();
      window.oasis3d.three.controls.dollyIn(1.1);
      window.oasis3d.three.controls.update();
    },
    zoomOut(e) {
      e.preventDefault();
      window.oasis3d.three.controls.dollyOut(1.1);
      window.oasis3d.three.controls.update();
    },
    resetCamera() {
      window.oasis3d.three.centerCamera();
    },
    pan(direction) {
      let orbitControls = window.oasis3d.three.controls;
      switch (direction) {
        case this.directions.UP:
          orbitControls.panXY(0, this.panSpeed);
          break;
        case this.directions.DOWN:
          orbitControls.panXY(0, -this.panSpeed);
          break;
        case this.directions.LEFT:
          orbitControls.panXY(this.panSpeed, 0);
          break;
        case this.directions.RIGHT:
          orbitControls.panXY(-this.panSpeed, 0);
          break;
      }
    },
    alarmAction() {
      window.oasis3d.three.getController().addIdentification('equipment_card_52');
      window.oasis3d.three.getController().changeAllAlarmEquipment();
    },
    // 添加物品面板
    addItem() {
      if (this.leftPanelShow && this.infoPanelType === 5) {
        this.infoPanelType = 5;
        this.leftPanelShow = false;
      } else {
        this.infoPanelType = 5;
        this.leftPanelShow = true;
      }
    },
    updateGraph() {
      window.oasis3d.three.needsUpdate();
    },
    // 切换房间
    changeRoom(item) {
      api.getThreeDAssetRoomByUuid(item.roomUuid).then((res) => {
        this.currentRoom = item;
        this.showCabinetUsage = false;  // 显示机柜利用率
        this.showCabinetSpace = false;  // 显示空间利用
        window.oasis3d.three.getController().resetStatus();
        window.oasis3d.model.loadJSON(res.data);
        if (res.data.items.length === 0) {
          document.getElementById('3droomloading').style.display = 'none';
        }
      });
    },
    // 删除房间
    deleteRoom(item) {
      let obj = {
        data: [],
        logTemplate: `删除|机房(${item.roomName})`
      }
      api.removeAssetRoom(item.roomUuid, obj).then(({data}) => {
        if (data.state) {
          this.$message.success('删除操作成功');
          this.getRoomList();
        } else {
          this.$message.error(data.errormsg);
        }
      });
    },
    editRoom(item) {
      this.currentEditRoom = item;
      this.editRoomDialog = true;
    },
    // 新建房间确认操作
    submitRoomForm() {
      this.$refs.newRoomForm.$refs.roomForm.validate((valid) => {
        if (valid) {
          let form = this.$refs.newRoomForm.roomForm;
          let roomJSON = this.newDesign(form);
          let obj = {
            data: [],
            logTemplate: `添加|机房(${form.roomName})`
          }
          api.addAssetRoom(roomJSON, obj).then(({data}) => {
            if (data.state) {
              this.newRoomDialog = false;
              this.$message.success('新增操作成功');
              this.getRoomList(true);
            } else {
              this.$message.error(data.errormsg);
            }
          });
        }
      });
    },
    // 编辑房间确认按钮
    submitEditRoomForm() {
      this.$refs.editRoomForm.$refs.roomForm.validate((valid) => {
        if (valid) {
          this.editRoomSubmit = true;
          let roomData = cloneDeep(this.$refs.editRoomForm.editRoomData);
          roomData.roomName = this.$refs.editRoomForm.roomForm.roomName;
          let obj = {
            data: [],
            logTemplate: `编辑|机房(${roomData.roomName})`
          }
          api.modifyAssetRoom(roomData, obj).then(({data}) => {
            this.editRoomSubmit = false;
            if (data.state) {
              this.editRoomDialog = false;
              this.$message.success('编辑操作成功');
              let index = this.roomList.findIndex((element) => {
                return element.roomUuid === roomData.roomUuid;
              });
              this.roomList[index].roomName = roomData.roomName;
            } else {
              this.$message.error(data.errormsg);
            }
          });
        }
      });
      // this.editRoomDialog = false;
    },
    // 为机柜添加资产
    cabinetAssetEdit(item) {
      this.cabinetEditDialog = true;
      this.cabinetAsset = item;
    },
    // 关联机柜
    cabinetLinkAsset(row) {
      this.linkAssetDialog = true;
      console.log(this.selectedItem);
    },
    // 提交2D平面机柜图
    submitCabinetGraph() {
      this.$refs.cabinetGraph.checkCorrect((flag, backData) => {
        if (flag) {
          api.saveAssetsToCabinet(backData).then(({data}) => {
            if (data.state) {
              this.$message.success('保存成功');
            } else {
              this.$message.error(data.errormsg);
            }
          });
        }
      });
    },
    // 关联资产（机柜）确认操作
    submitLinkAsset() {
      let selected = this.$refs.linkAsset.selectedOperations;
      if (selected.length > 1) {
        this.$message.warning('仅能选择一条记录与机柜关联!')
      }
      if (selected.length === 1) {
        this.selectedItem.uuid = selected[0].uuid;
        this.selectedItem.metadata.name = selected[0].itcompName;
        this.selectedItem.name = selected[0].itcompName;
        this.$refs.attrForm.updateVal();
        this.linkAssetDialog = false;
      }
      // 如果机柜中有内容则进行清理后再取消关联
      if (selected.length === 0) {
        // 已经关联设备才需要取消关联
        if (this.selectedItem.uuid.indexOf('-') === -1) {
          let info = this.getInfoByCtype(this.selectedItem.metadata.ctype);
          this.selectedItem.metadata.name = info.name;
          this.selectedItem.name = info.name;
          this.selectedItem.uuid = Utils.generateUUID();
          this.$refs.attrForm.updateVal();
        }
        this.linkAssetDialog = false;
      }
    }
  }
};

export default threeRoomMixin;
