/**
* Created by dgunzi on 2019/07/30.
* 机柜平面编辑
*/
<template>
  <div id="roomCabinetEdit">
    <div style="width:800px; height:700px;display: flex;">
      <div id="assetList" style="width:268px; height:698px; overflow: hidden">
        <div class="searchBar" style="margin: 5px;">
          <s-row>
            <s-col span="12">
              <s-select style="width: calc(100% - 5px)" v-model="currentKey" size="small" @change="typeChange">
                <s-option
                  v-for="item in keys"
                  :key="item"
                  :label="item"
                  :value="item">
                </s-option>
              </s-select>
            </s-col>
            <s-col span="12">
              <s-input size="small" placeholder="请输入关键字" v-model="keyword"></s-input>
            </s-col>
          </s-row>
        </div>
        <s-scrollbar wrap-style="height: 668px;">
        <div class="assetItem bg-purple" v-for="item in assetAry" v-if="assetAry.length !== 0">
          <div class="infoLine bg-purple-light">
            {{printContent(item)}}
          </div>
          <div class="assetImg" :style="getItemHeight(item)" v-if="item.panel">
            <div class="assetImgItem" :style="getBackground(item)" :data-uamount="item.uAmount" :data-itname="item.itcompName" :data-address="item.controlAdderss" :data-uuid="item.uuid" :data-panel="item.panel" :key="item.uuid"></div>
          </div>
          <div class="assetImg" v-if="!item.panel && item.uAmount > 0" style="height: 35px;">
            <div style="text-align: center;font-size: 12px;line-height: 35px">暂无面板图片</div>
          </div>
        </div>
        <div v-if="assetAry.length === 0" class="bg-purple emptyMsg">
          暂无数据
        </div>
        </s-scrollbar>
      </div>
      <div style="top: 18px;left: 295px;position: absolute;z-index: 10;">
        <s-button icon="back-circle" type="cancel" size="mini" title="恢复" @click="resetCabinet"></s-button>
        <s-button icon="clean-up" type="cancel" size="mini" title="清空" @click="clearCabinet"></s-button>
      </div>
      <div style="top: 18px;right: 35px;position: absolute;z-index: 10;">
        <s-button icon="minus-bold" type="cancel" size="mini" title="缩小" @click="zoomOut"></s-button>
        <s-button icon="home" type="cancel" size="mini" title="默认" @click="zoomFix"></s-button>
        <s-button icon="plus-bold" type="cancel" size="mini" title="放大" @click="zoomIn"></s-button>
      </div>
      <div id="cabinetGraph" style="flex: 1;height:698px;overflow: hidden;border-left:none"></div>
      <div style="bottom: 13px;right: 31px;position: absolute;z-index: 10;">
        <outline ref="outline" :graph="graph" :bottomPanelHeight="bottomPanelHeight"></outline>
      </div>
    </div>
  </div>
</template>

<script>
  import cabinetGraphMixin from './CabinetGraphMixin.js'
  import outline from '@/components/graph/Outline'
  import {cabinetUtilizationRate, getThreeDAssets} from './RoomRoomApi.js'

  /* [
    {'controlAdderss': '192.168.212.211', 'itcompName': '核心交换机', 'uAmount': 4, 'panel': 'static/3droom/panels/server3.png', uuid: '0aed5107-6099-4fe9-976e-64b88f4c8571'},
    {'controlAdderss': '192.168.137.201', 'itcompName': '核心交换机', 'uAmount': 2, 'panel': 'static/3droom/panels/server2.jpg', uuid: '25da7b1b-dd93-4d13-a5b3-4310c503e204'},
    {'controlAdderss': '192.168.128.211', 'itcompName': '核心交换机', 'uAmount': 1, 'panel': 'static/3droom/panels/74DFAE3E-F963-4CFE-8DE2-1A28D4FB1600副本.png', uuid: '0b048070-c4d8-4e75-be45-c5338ab74966'}
  ] */

  export default {
        mixins: [cabinetGraphMixin],
        name: 'cabinetEdit',
        data() {
            return {
              assetAry: [],
              bottomPanelHeight: 0,
              keys: [],
              currentKey: '',
              assetList: {},
              keyword: ''
            }
        },
        components: {
          outline
        },
        props: {
          cabinet: {
            type: Object,
            required: true
          }
        },
        created() {
          getThreeDAssets().then(({data}) => {
            this.assetList = data;
            this.keys = Object.keys(data);
            this.currentKey = this.keys[0];
            this.assetAry = this.assetList[this.currentKey];
            cabinetUtilizationRate(this.cabinet.uuid).then(({data}) => {
              this.cabinetData = data;
              this.init(() => {
                this.$nextTick(() => {
                  this.addItemDraggable();
                });
              });
            });
          });
        },
        watch: {
          keyword(val, oldVal) {
            let ary = [];
            if (val === '') {
              this.assetAry = this.assetList[this.currentKey];
            } else {
              let assetAry = this.assetList[this.currentKey];
              for (let i = 0; i < assetAry.length; i++) {
                if ((assetAry[i].controlAdderss && assetAry[i].controlAdderss.indexOf(val) !== -1) || (assetAry[i].itcompName && assetAry[i].itcompName.indexOf(val) !== -1)) {
                  ary.push(assetAry[i]);
                }
              }
              this.assetAry = ary;
            }
            this.$nextTick(() => {
              this.addItemDraggable();
            });
          }
        },
        methods: {
          getBackground(item) {
            return 'background-image: url(' + item.panel + ')';
          },
          getItemHeight(item) {
            return 'height:' + item.uAmount * 34 + 'px'
          },
          typeChange(key) {
            this.assetAry = this.assetList[key];
            this.$nextTick(() => {
              this.addItemDraggable();
            });
            this.keyword = '';
          },
          printContent(item) {
            if (!item.uAmount) {
              item.uAmount = 0;
            }
            return item.controlAdderss + '-' + item.itcompName + '-' + item.uAmount + 'U'
          }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .assetItem
    height auto
    width 268px
    font-size 12px
    text-align center
    padding 0
    .infoLine
      height 32px
      line-height 32px
      padding 0
    .assetImg
      height 68px
      width 268px
  .emptyMsg
    line-height 32px
    font-size 16px
    height 32px
    text-align center
  .assetImgItem
    background-size 100% 100%
    width calc(100% - 6px)
    height calc(100% - 6px)
    margin-top 3px
    margin-left 3px
</style>
