/**
* Created by dgunzi on 2018/7/26.
 */

<template>
    <div>
      <div class="main_3droom_content">
      <s-row>
        <s-col span="18">
          <s-button class="collapse_btn" :icon="leftPanelShow ? 'left' : 'right'" :title="leftPanelShow ?  '隐藏面板' : '显示面板'" @click="hideShowPanel"></s-button>
          <s-button @click="showRoomList">机房列表</s-button>
          <s-button @click="refreshRoom" :disabled="refreshDisabled">刷新</s-button>
          <s-button @click="saveDesign" v-show="mode === 'edit'" :disabled="saveDisabled">保存</s-button>
          <s-dropdown @on-click="changeCurrentMode" v-show="mode === 'edit'">
            <s-button>
              <span v-if="currentMode === 1">墙体编辑</span>
              <span v-if="currentMode === 0">3D场景编辑</span>
              <i class="iconfont icon-bottom"></i>
            </s-button>
            <s-dropdown-menu slot="list">
              <s-dropdown-item :name="1">墙体编辑</s-dropdown-item>
              <s-dropdown-item :name="0">3D场景编辑</s-dropdown-item>
            </s-dropdown-menu>
          </s-dropdown>
          <s-button @click="showSceneItems">物品列表</s-button>
          <s-button v-show="currentMode == 0 && mode === 'edit'" @click="addItem">添加物品</s-button>
          <s-button v-show="currentMode == 0" @click="changeEdgeView"><template v-if="edgeView">隐藏正面墙</template><template v-if="!edgeView">显示正面墙</template></s-button>
          <s-button v-show="currentMode == 0" @click="spin"><template v-if="spinFlag">停止旋转</template><template v-if="!spinFlag">开始旋转</template></s-button>
          <s-button v-show="currentMode == 0 && mode === 'view'" @click="cabinetUsage" :disabled="cabinetUsageDisabled">机柜利用率</s-button>
          <s-button v-show="currentMode == 0 && mode === 'view'" @click="cabinetSpace" :disabled="cabinetSpaceDisabled">可用空间</s-button>
          <s-button :type="(mode2d == 0) ? 'default' : 'cancel'" v-show="currentMode == 1" title="移动墙体" @click="setPlannerMode(Mode.MOVE)">移动墙体</s-button>
          <s-button :type="(mode2d == 1) ? 'default' : 'cancel'" v-show="currentMode == 1" title="绘制墙体" @click="setPlannerMode(Mode.DRAW)">绘制墙体</s-button>
          <s-button :type="(mode2d == 2) ? 'default' : 'cancel'" v-show="currentMode == 1" title="删除墙体" @click="setPlannerMode(Mode.DELETE)">删除墙体</s-button>
        </s-col>
        <s-col span="6" style="text-align: right">
          <s-radio-group v-model="mode" v-show="currentMode == 0" size="small" @change="changeModeEvent">
            <s-radio-button label="view">查看</s-radio-button>
            <s-radio-button label="edit">编辑</s-radio-button>
          </s-radio-group>
        </s-col>
      </s-row>
      <input type="file" style="display: none" id="loadFileInput" @change="loadDesign"/>
      <div id="current_roomname" style="position: absolute;top:55px;right: 10px;font-size:14px;z-index:4;">{{ currentRoom.roomName }}</div>
      <div class="canvas_content">
        <div id="3d-viewer" style="width: 100%;height: calc(100vh - 165px)">
        </div>
        <div id="floorplanner" style="width: 100%;height: calc(100vh - 165px)">
          <canvas id="floorplanner-canvas"></canvas>
        </div>
        <transition
          v-on:enter="enter"
          v-on:leave="leave"
          v-bind:css="false"
        >
        <div class="info_panel" v-show="leftPanelShow">
          <div class="info_panel_title s-card-header">
            <span class="icon iconfont icon-batch-add" style="margin-right: 5px" v-if="infoPanelType === 5"></span>
            <span class="icon iconfont icon-resource" style="margin-right: 5px" v-if="infoPanelType === 4"></span>
            <span class="icon iconfont icon-home" style="margin-right: 5px" v-if="infoPanelType === 0"></span>
            <span class="icon iconfont icon-pencil" style="margin-right: 5px" v-if="infoPanelType === 1"></span>
            <span class="icon iconfont icon-layout-custom" style="margin-right: 5px" v-if="infoPanelType === 2 || infoPanelType === 3"></span>
            <span>{{ infoPanelTitles[infoPanelType] }}</span>
            <s-button icon="plus" title="新增机房" v-show="infoPanelType == 0 && mode === 'edit'" size="mini" style="float: right" @click="newRoom"></s-button>
            <s-button icon="plus" title="添加物品" v-show="infoPanelType == 4 && mode === 'edit'" size="mini" style="float: right" @click="addItem"></s-button>
          </div>
            <div class="bg-purple" v-show="infoPanelType == 0">
              <room-items :room-list="roomList" :current-room="currentRoom" :is-view="mode === 'view'" @changeRoom="changeRoom" @deleteRoom="deleteRoom" @editRoom="editRoom"></room-items>
            </div>
            <div class="bg-purple" v-show="infoPanelType == 1">
              <attr-form :selectedItem="selectedItem" :v-if="infoPanelType == 1 && selectedItem !== null" ref="attrForm" @updateGraph = "updateGraph" @cabinetLinkAsset="cabinetLinkAsset"></attr-form>
            </div>
            <div class="bg-purple" v-show="infoPanelType == 2">
              <s-row>
                <s-col span="12" v-for="texture in wallTexture" :key="texture.url">
                  <a class="texture-thumbnail" @click="setNewTexture(texture.url, texture.stretch, texture.scale, $event)"><img alt="贴图" :src="roomTexturePath + 'thumbnail_' + texture.url"></a>
                </s-col>
              </s-row>
            </div>
            <div class="bg-purple" v-show="infoPanelType == 3">
              <s-row>
                <s-col span="12" v-for="texture in floorTexture" :key="texture.url">
                  <a class="texture-thumbnail" @click="setNewTexture(texture.url, texture.stretch, texture.scale, $event)"><img alt="贴图" :src="roomTexturePath + 'thumbnail_' + texture.url"></a>
                </s-col>
              </s-row>
            </div>
            <div class="bg-purple" v-show="infoPanelType == 4">
              <scene-items ref="sceneItems" v-if="infoPanelType == 4" :is-view="mode === 'view'"></scene-items>
            </div>
            <div class="bg-purple item-panel" v-show="infoPanelType == 5">
              <r-item></r-item>
            </div>
        </div>
        </transition>
      </div>
      <div id="camera-controls" v-show="currentMode == 0">
        <div style="float: left;margin-right:4px">
          <s-button icon="reduce" @click="zoomOut" title="缩小"></s-button>
          <s-button icon="home" @click="resetCamera" title="重置"></s-button>
          <s-button icon="enlarge" @click="zoomIn" title="放大"></s-button>
        </div>
        <div style="float: left;">
          <s-button icon="arrow-left" @click="pan(directions.LEFT)" title="左移"></s-button>
        </div>
        <div style="float: left;width:40px;margin-left:4px;margin-right:4px;height:80px;margin-top: -36px;">
          <s-button icon="arrow-top" @click="pan(directions.UP)" title="上移" style="margin-bottom:4px;"></s-button>
          <s-button icon="arrow-bottom" @click="pan(directions.DOWN)" title="下移"></s-button>
        </div>
        <div style="float: left;">
          <s-button icon="arrow-right" @click="pan(directions.RIGHT)" title="右移"></s-button>
        </div>
      </div>
      </div>
      <div id="draw-walls-hint" v-show="drawHintFlag && currentMode == 1">
        按下 "Esc" 键将停止绘制
      </div>
      <s-dialog
        v-model="newRoomDialog"
        title="新建机房" width="450px">
        <new-room v-if="newRoomDialog" ref="newRoomForm"></new-room>
        <template slot="footer" class="dialog-footer">
          <s-button @click="submitRoomForm">确定</s-button>
          <s-button type="cancel" @click="newRoomDialog = false">取消</s-button>
        </template>
      </s-dialog>
      <s-dialog
        v-model="editRoomDialog"
        title="修改房间" width="450px">
        <edit-room-from v-if="editRoomDialog" ref="editRoomForm" :editRoom="currentEditRoom"></edit-room-from>
        <template slot="footer" class="dialog-footer">
          <s-button @click="submitEditRoomForm" :disabled="editRoomSubmit">确定</s-button>
          <s-button type="cancel" @click="editRoomDialog = false">取消</s-button>
        </template>
      </s-dialog>
      <s-dialog
        v-model="cabinetEditDialog"
        title="编辑机柜内部资产" width="850px" height="700px">
        <cabinet-edit-graph v-if="cabinetEditDialog" ref="cabinetGraph" :cabinet="cabinetAsset"></cabinet-edit-graph>
        <template slot="footer" class="dialog-footer">
          <s-button @click="submitCabinetGraph">确定</s-button>
          <s-button type="cancel" @click="cabinetEditDialog = false">取消</s-button>
        </template>
      </s-dialog>
      <s-dialog v-model="linkAssetDialog" title="关联机柜" width="880px">
        <link-asset v-if="linkAssetDialog" @cabinetAssetEdit="cabinetAssetEdit" ref="linkAsset"></link-asset>
        <template slot="footer" class="dialog-footer">
          <s-button @click="submitLinkAsset">确定</s-button>
          <s-button type="cancel" @click="linkAssetDialog = false">取消</s-button>
        </template>
      </s-dialog>
      <div class="s-loading-mask is-fullscreen" id="3droomloading"><div class="s-loading-spinner"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg> <p class="s-loading-text">加载中...</p></div></div>
    </div>
</template>
<script type="text/babel">
  // import Grail from '@/components/grailLayout/Grail'
  import mixin from './ThreeRoomMixin'

  export default {
    mixins: [mixin],
    data () {
      return {
      }
    },
    components: {
      // 's-index': Grail
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    mounted() {
    }
  }
</script>
<style lang="stylus">
  .signboard7 {
    position: absolute;
    font-size: 12px;
    width: 320px
    width: auto;
    background-color: rgba(52, 62, 80, .8);
    color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
    height: 32px;
    padding-right: 10px;
  }

  .signboard7 .signboard-ul .cr {
    padding-left: 14px;
    line-height: 30px
  }

  .signboard7 ul {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    clear: both
  }

  .signboard7:before {
    content: "";
    width: 2px;
    height: 20px;
    background-color: #fff;
    position: absolute;
    bottom: 5px;
    left: -1px
  }

  .signboard7 .left-bottom {
    position: absolute;
    left: -50px;
    bottom: -20px;
    width: 49px;
    height: 35px;
    background: url(../../../static/3droom/res/left-bottom_s7c1.png) no-repeat 50%;
    background-size: contain
  }
</style>
