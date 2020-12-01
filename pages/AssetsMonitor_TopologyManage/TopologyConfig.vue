<template>
  <s-tab :nimated="false" id="topologyConfig">
    <s-tab-pane label="基本设置">
      <s-scrollbar wrap-class="pinfo">
        <div class="bg-purple">
          <s-row>
            <s-col :span="7">
              <div class="grid-content">实时信息轮询周期</div>
            </s-col>
            <s-col :span="17">
              <div class="grid-content" style="text-align: left;">
                <s-form :model="periodForm" :rules="periodRules" ref="topologyPeriodFrom" class="demo-ruleForm">
                  <s-form-item prop="period">
                    <s-input v-model="periodForm.period" class="size1-input"></s-input>单位：秒
                  </s-form-item>
                </s-form>
              </div>
            </s-col>

          </s-row>
          <s-row>
            <s-col :span="20">
              <div class="grid-content"></div>
            </s-col>
            <s-col :span="4">
              <div class="grid-content"><s-button title="保存" @click="saveTopologyPeriod">保存</s-button></div>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="9">
              <div class="grid-content">默认获取那些实时信息</div>
            </s-col>
            <s-col :span="15">
              <div class="grid-content"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="24">
              <div class="grid-content">
                <s-checkbox v-model="realtime0">线上流量</s-checkbox>
                <s-checkbox v-model="realtime1">资产在线状态</s-checkbox>
                <s-checkbox v-model="realtime2">未恢复事件个数</s-checkbox>
                <s-checkbox v-model="realtime3">子拓扑在线状态</s-checkbox>
              </div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="20">
              <div class="grid-content"></div>
            </s-col>
            <s-col :span="4">
              <div class="grid-content"><s-button title="保存" @click="saveTopologyRealTime">保存</s-button></div>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="11">
              <div class="grid-content">是否在拓扑图中显示应用节点</div>
            </s-col>
            <s-col :span="13">
              <s-radio class="radio" v-model="showapp" :label="1">是</s-radio>
              <s-radio class="radio" v-model="showapp" :label="0">否</s-radio>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="20">
              <div class="grid-content"></div>
            </s-col>
            <s-col :span="4">
              <div class="grid-content"><s-button title="保存" @click="saveTopologyShowApp">保存</s-button></div>
            </s-col>
          </s-row>
        </div>
      </s-scrollbar>
    </s-tab-pane>
    <s-tab-pane label="布局设置">
      <s-scrollbar wrap-class="pinof">
        <s-form :model="layoutForm" :rules="layoutRules" ref="topologyLayoutFrom" class="layout-form">
        <div class="bg-purple">
          <s-row>
            <s-col :span="4">
              <div class="grid-content">
                环形布局
              </div>
            </s-col>
            <s-col :span="8">
              <div class="grid-content">
                节点组成圆的半径
              </div>
            </s-col>
            <s-col :span="12">
              <s-form-item prop="layout0">
                <s-input placeholder="请输入整数" v-model="layoutForm.layout0" class="size1-input"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="4">
              <div class="grid-content">
                有机布局
              </div>
            </s-col>
            <s-col :span="8">
              <div class="grid-content">
                节点与中心节点的距离
              </div>
            </s-col>
            <s-col :span="12">
              <s-form-item prop="layout1">
                <s-input placeholder="请输入整数" v-model="layoutForm.layout1" class="size1-input"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="4">
              <div class="grid-content">
                水平树
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                层间距离
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout20">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout20" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                节点间距
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout21">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout21" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="4">
              <div class="grid-content">
                垂直树
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                层间距离
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout30">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout30" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                节点间距
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout31">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout31" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="4">
              <div class="grid-content">
                径向树
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                层间距离
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout40">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout40" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                节点间距
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout41">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout41" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="4">
              <div class="grid-content">
                水平流
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                层间距离
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout50">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout50" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                节点间距
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout51">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout51" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="4">
              <div class="grid-content">
                垂直流
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                层间距离
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout60">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout60" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
            <s-col :span="3">
              <div class="grid-content">
                节点间距
              </div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content">
                <s-form-item prop="layout61">
                  <s-input placeholder="请输入整数" v-model="layoutForm.layout61" class="size2-input"></s-input>
                </s-form-item>
              </div>
            </s-col>
          </s-row>
        </div>
        <div class="bg-purple">
          <s-row>
            <s-col :span="20">
              <div class="grid-content"></div>
            </s-col>
            <s-col :span="4">
              <div class="grid-content"><s-button title="保存" @click="saveTopologyLayout">保存</s-button></div>
            </s-col>
          </s-row>
        </div>
        </s-form>
      </s-scrollbar>
    </s-tab-pane>
  </s-tab>
</template>
<script>
  import { updateTopoviewConfig } from './api/topology_api'
  import RealtimeInfo from './module/topology.realtimeInfo'
  import {Validaters} from 'sunflower-common-utils';

  let oldConfig = null;
  export default {
    data () {
      let checkNumber = (rule, value, callback) => {
        let reg = new RegExp('^[1-9][0-9]*$');
        if (value === '') {
          callback(new Error('不能为空'));
        } else if (!reg.test(value)) {
          callback(new Error('请输入正整数值'));
        } else {
          callback();
        }
      };
      return {
        periodForm: {
          period: 50000
        },
        periodRules: {
          period: [
            Object.assign(Validaters.NotNull, {message: '请输入轮询周期'}),
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000),
            Validaters.MinNum(30)
          ]
        },
        layoutRules: {
          layout0: [
            Object.assign(Validaters.NotNull, {message: '请输入节点组成圆的半径'}),
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout1: [
            Object.assign(Validaters.NotNull, {message: '请输入节点与中心节点的距离'}),
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout20: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout21: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout30: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout31: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout40: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout41: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout50: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout51: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout60: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ],
          layout61: [
            {validator: checkNumber, trigger: 'blur'},
            Validaters.MaxNum(1000000)
          ]
        },
        realtime0: false,
        realtime1: false,
        realtime2: false,
        realtime3: false,
        showapp: 1,
        layoutForm: {
          layout0: null,
          layout1: null,
          layout20: null,
          layout21: null,
          layout30: null,
          layout31: null,
          layout40: null,
          layout41: null,
          layout50: null,
          layout51: null,
          layout60: null,
          layout61: null
        }
      };
    },
    mounted () {
      this.initData();
    },
    props: {
      config: {
        type: Object,
        required: true
      }
    },
    methods: {
      saveTopologyPeriod () {
        this.$refs.topologyPeriodFrom.validate((valid) => {
          var newConfig = Object.assign(oldConfig, {period: this.periodForm.period});
          if (valid) {
            this.saveConfigData(oldConfig, () => {
              oldConfig = newConfig;
              window.TopologyGraph.getGraphVm().config = newConfig;
              RealtimeInfo.setNewPeriod(this.periodForm.period);
            });
          } else {
            return false;
          }
        });
      },
      saveTopologyRealTime () {
        var flagAry = [];
        flagAry[0] = this.realtime0 ? 1 : 0;
        flagAry[1] = this.realtime1 ? 1 : 0;
        flagAry[2] = this.realtime2 ? 1 : 0;
        flagAry[3] = this.realtime3 ? 1 : 0;
        var newConfig = Object.assign(oldConfig, {realtime: flagAry});
        this.saveConfigData(newConfig, function () {
          oldConfig = newConfig;
          window.TopologyGraph.getGraphVm().config = newConfig;
          window.TopologyGraph.getGraphVm().realtime = flagAry;
          RealtimeInfo.setFlowData(flagAry[0], false);
          RealtimeInfo.setOnlineData(flagAry[1], false);
          RealtimeInfo.setIncidentFlag(flagAry[2], false);
          var flag = window.TopologyGraph.getMode() === 1; // 查看模式才需要调用实时信息轮训
          RealtimeInfo.setSubTopoFlag(flagAry[3], flag);
        });
      },
      saveTopologyShowApp () {
        var newConfig = Object.assign(oldConfig, {showapp: this.showapp});
        this.saveConfigData(newConfig, function () {
         oldConfig = newConfig;
         window.TopologyGraph.getGraphVm().config = newConfig;
         window.TopologyGraph.setShowApp(newConfig.showapp);
         window.TopologyGraph.init();
        });
      },
      saveTopologyLayout () {
        this.$refs.topologyLayoutFrom.validate((valid) => {
          if (valid) {
            var jsonAry = [];
            var value2 = this.layoutForm.layout20 + '|' + this.layoutForm.layout21;
            var value3 = this.layoutForm.layout30 + '|' + this.layoutForm.layout31;
            var value4 = this.layoutForm.layout40 + '|' + this.layoutForm.layout41;
            var value5 = this.layoutForm.layout50 + '|' + this.layoutForm.layout51;
            var value6 = this.layoutForm.layout60 + '|' + this.layoutForm.layout61;
            jsonAry.push({1: this.layoutForm.layout0});
            jsonAry.push({2: this.layoutForm.layout1});
            jsonAry.push({3: value2});
            jsonAry.push({4: value3});
            jsonAry.push({5: value4});
            jsonAry.push({6: value5});
            jsonAry.push({7: value6});
            var newConfig = Object.assign(oldConfig, {layout: jsonAry});
            this.saveConfigData(newConfig, function () {
              oldConfig = newConfig;
              window.TopologyGraph.getGraphVm().config = newConfig;
            });
          } else {
            return false;
          }
        });
      },
      saveConfigData (data, callback) {
        updateTopoviewConfig({topoviewConfig: data}).then((result) => {
          if (result) {
            this.$message({
              message: '保存成功!',
              type: 'success'
            });
            if (typeof callback !== 'undefined') {
              callback();
            }
          } else {
            this.$message.error('保存失败!');
          }
        });
      },
      initData () {
        let res = this.config;
        oldConfig = res;
        this.periodForm.period = Number.parseInt(res.period);
        this.realtime0 = res.realtime[0] === 1;
        this.realtime1 = res.realtime[1] === 1;
        this.realtime2 = res.realtime[2] === 1;
        this.realtime3 = res.realtime[3] === 1;
        this.showapp = res.showapp;
        this.layoutForm.layout0 = res.layout[0][1];
        this.layoutForm.layout1 = res.layout[1][2];
        var layout2 = res.layout[2][3].split('|');
        this.layoutForm.layout20 = layout2[0];
        this.layoutForm.layout21 = layout2[1];
        var layout3 = res.layout[3][4].split('|');
        this.layoutForm.layout30 = layout3[0];
        this.layoutForm.layout31 = layout3[1];
        var layout4 = res.layout[4][5].split('|');
        this.layoutForm.layout40 = layout4[0];
        this.layoutForm.layout41 = layout4[1];
        var layout5 = res.layout[5][6].split('|');
        this.layoutForm.layout50 = layout5[0];
        this.layoutForm.layout51 = layout5[1];
        var layout6 = res.layout[6][7].split('|');
        this.layoutForm.layout60 = layout6[0];
        this.layoutForm.layout61 = layout6[1];
      }
    }
  }
</script>
<style>
  #topologyConfig .bg-purple {
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 5px;
    padding-left: 0px;
  }
  #topologyConfig .grid-content{
    margin-left: 10px;
  }
  #topologyConfig .s-col-8 .grid-content{
    text-align: left;
  }
  #topologyConfig .s-col-10 .grid-content{
    text-align: left;
  }
  #topologyConfig .size1-input{
    width:220px;
    margin-right:10px;
  }
  #topologyConfig .size2-input{
    width:100px;
  }
  #topologyConfig .s-form-item {
    margin-bottom: 0px;
  }
  #topologyConfig .layout-form .s-col-7 .grid-content{
    text-align: left;
  }
  #topologyConfig .layout-form .s-col-7 .s-form-item-content{
    margin-left: 10px;
  }
  #topologyConfig .s-col-13{
    padding-top: 10px;
  }
</style>
