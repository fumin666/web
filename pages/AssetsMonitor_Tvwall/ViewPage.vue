<!--电视墙-->
<template>
  <div class="tvwall-page">
    <div class="top" v-if="isShowLogo">
      <img src="static/images/logo/tvwall_logo.png" width="430" height="32" />
    </div>
    <div class="body" :style="bodyStyle">
      <s-row>
        <s-col :span="span" v-for="i in portletCount" :key="i" :style="{ height: spanHeight, display: disArr[i - 1] }">
          <template v-if="tvpageModels['location' + (i - 1)]">
            <div class="tvwall-card">
              <div class="tvwall-card-header">{{tvpageModels['location' + (i - 1)].title}}
                <i :class="'iconfont icon-' + zoom" @click="enlarge(i - 1)" v-if="portletCount > 1" :title="zoom === 'enlarge' ? '放大': '缩小'"></i>
                <i class="iconfont icon-edit" @click="edit(i)" title="编辑"></i>
                <i class="iconfont icon-refresh-circle" @click="refresh(i - 1)" title="刷新"></i>
                <i class="iconfont icon-set" @click="setting(i - 1)" title="设置"></i>
              </div>
              <div class="tvwall-card-body">
                <iframe width="100%" height="100%" frameborder="0" scrolling="no" :src="getSrc(i - 1)" :ref="'iframe' + (i - 1)" :id="iframeId[i - 1]"></iframe>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="tvwall-card">
              <div class="tvwall-card-header">区块{{i}}</div>
              <div class="tvwall-card-body empty-portlet" :style="{ height: Number(spanHeight.replace('px', '')) - 41 + 'px' }">
                <div class="add-portlet-btn" @click="addPortlet(i)"></div>
              </div>
            </div>
          </template>
        </s-col>
      </s-row>
    </div>

    <!--区块内容添加-->
    <s-dialog
      v-model="bloomAdd"
      v-if="bloomAdd"
      title="添加"
      width="300px">
      <add-portlet ref="add"></add-portlet>
      <template slot="footer">
        <s-button @click="addPortletOk">确定</s-button>
        <s-button type="cancel" @click="bloomAdd = false">取消</s-button>
      </template>
    </s-dialog>

    <!--区块内容修改-->
    <s-dialog
      v-model="bloomEdit"
      v-if="bloomEdit"
      title="修改区块内容"
      width="300px">
      <add-portlet ref="edit" :name="currentPortletName" :id="currentPortletChild"></add-portlet>
      <template slot="footer">
        <s-button @click="addPortletOk">确定</s-button>
        <s-button type="cancel" @click="bloomEdit = false">取消</s-button>
      </template>
    </s-dialog>

    <!--资产监控设置-->
    <s-dialog
      v-model="bloomAssetsSet"
      v-if="bloomAssetsSet"
      title="设置">
      <assets-set ref="assetsSet" :form="currentAssetsSet"></assets-set>
      <template slot="footer">
        <s-button @click="assetsSetOk">确定</s-button>
        <s-button type="cancel" @click="bloomAssetsSet = false">取消</s-button>
      </template>
    </s-dialog>

    <!--事件信息设置-->
    <s-dialog
      v-model="bloomIncidentSet"
      v-if="bloomIncidentSet"
      title="设置">
      <assets-set ref="incidentSet" :form="currentIncidentSet"></assets-set>
      <template slot="footer">
        <s-button @click="incidentSetOk">确定</s-button>
        <s-button type="cancel" @click="bloomIncidentSet = false">取消</s-button>
      </template>
    </s-dialog>

    <!--业务服务设置-->
    <s-dialog
      v-model="bloomBusinessSet"
      v-if="bloomBusinessSet"
      title="设置">
      <assets-set ref="businessSet" :form="currentBusinessSet"></assets-set>
      <template slot="footer">
        <s-button @click="businessSetOk">确定</s-button>
        <s-button type="cancel" @click="bloomBusinessSet = false">取消</s-button>
      </template>
    </s-dialog>

    <s-dialog
      v-model="bloomAssetsExSet"
      v-if="bloomAssetsExSet"
      title="设置">
      <assets-ex-set ref="businessSet" :form="currentAssetsExSet"></assets-ex-set>
      <template slot="footer">
        <s-button @click="bloomAssetsExSetOk">确定</s-button>
        <s-button type="cancel" @click="bloomAssetsExSet = false">取消</s-button>
      </template>
    </s-dialog>

    <s-dialog
      width="800px"
      v-model="monitorDetailFlag"
      v-if="monitorDetailFlag"
      :before-close="monitorDetailClose"
      title="监控事件信息"
      key="monitorDetail">
      <monitor-detail
        ref="monitorDetail"
        :detailData="monitorDetailData">
      </monitor-detail>
      <template slot="footer">
        <s-button @click="monitorDetailClose">关闭</s-button>
      </template>
    </s-dialog>

    <s-dialog
      width="1020px"
      v-model="deviceListFlag"
      v-if="deviceListFlag"
      :before-close="deviceListClose"
      title="设备列表"
      key="deviceList">
      <device-list
        ref="deviceList"
        :data="deviceListData">
      </device-list>
      <template slot="footer">
        <s-button @click="deviceListClose">关闭</s-button>
      </template>
    </s-dialog>
    <s-dialog
      width="1040px"
      v-model="eventListFlag"
      v-if="eventListFlag"
      title="事件列表"
      key="eventList"
      append-to-body>
      <event-list
        ref="deviceEventList"
        :uuid="deviceUuid">
      </event-list>
      <template slot="footer">
        <s-button @click="eventListFlag = false">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import AddPortlet from './AddPortlet'
  import AssetsSet from './AssetsSet'
  import { Validaters } from 'sunflower-common-utils'
  import AssetsExSet from './AssetsAndEx'
  import monitorDetail from './MonitorDetail.vue'
  import deviceList from './DeviceList.vue'
  import eventList from './EventList.vue'
  import Bus from '@/plugins/eventBus'
  let {isPosInt} = Validaters
  // 查看事件详情
  /* eslint-disable */
  window.showDetail = function(monitorDetailData) {
    Bus.$emit('monitor-detail', monitorDetailData, true);
  };
  // 查看某种设备列表
  /* eslint-disable */
  window.showList = function(deviceListData) {
    Bus.$emit('device-list', deviceListData);
  };
  /* eslint-disable */
  window.showEventList = function (uuid) {
    Bus.$emit('event-list', uuid);
  };

  export default {
    components: {
      AddPortlet,
      AssetsSet,
      AssetsExSet,
      monitorDetail,
      deviceList,
      eventList
    },
    data() {
      return {
        bloomAdd: false,
        bloomEdit: false,
        bloomAssetsSet: false,
        bloomIncidentSet: false,
        bloomBusinessSet: false,
        bloomAssetsExSet: false,
        isShowLogo: true,
        portletCount: 1,
        tvpageModels: {},
        currentPortlet: 0,
        currentPortletName: '',
        currentPortletChild: '',
        currentMode: 'add',
        tvwallId: this.$route.query.tvUrl,
        disArr: [],
        span: '24',
        spanHeight: '0',
        zoom: 'enlarge',
        currentAssetsSet: {
          booleanVTime: true,
          sliderVTime: 10,
          scaleType: 0,
          xbei: 1,
          ybei: 1
        },
        currentIncidentSet: {
          scaleType: 0,
          xbei: 1,
          ybei: 1
        },
        currentBusinessSet: {
          scaleType: 0,
          xbei: 1,
          ybei: 1
        },
        currentAssetsExSet: {
          booleanVTime: true,
          sliderVTime: 10,
          scaleType: 0,
          xbei: 1,
          ybei: 1
        },
        iframeId: [],
        monitorDetailFlag: false,   // 监控事件详情弹框
        monitorDetailData: {},      // 监控事件详情数据
        deviceListFlag: false,     // 设备列表弹窗
        deviceListData: {},        // 设备列表数据
        detailFromFlag: true,       // 两处不同来源（底层iframe/上面的二级弹窗），增加标志为进行鉴别
        eventListFlag: false,
        deviceUuid: ''
      }
    },
    computed: {
      bodyStyle() {
        let height = document.body.clientHeight;
        if (this.isShowLogo) {
          return {height: (height - 55) + 'px'}
        } else {
          return {height: height + 'px'}
        }
      }
    },
    mounted() {
      /* 监听查看事件操作 */
      Bus.$on('monitor-detail', (backData, flag) => {
        this.monitorDetailData = backData;
        this.monitorDetailFlag = true;
        this.detailFromFlag = flag;
      });

      Bus.$on('device-list', (backData) => {
        this.deviceListData = backData;
        this.deviceListFlag = true;
      });

      Bus.$on('event-list', (uuid) => {
        this.deviceUuid = uuid;
        this.eventListFlag = true;
      });
    },
    methods: {
      getAll() {
        $axios.get(`/systemManager/staticTvWall/viewPage/${this.$route.query.tvUrl}`).then((res) => {
          if (res.data && res.data.portletCount) {
            this.isShowLogo = (res.data.showLogo === 1);
            this.portletCount = res.data.portletCount;
            this.tvpageModels = res.data.tvpageModelMap;
            this.getSpan();
            this.getSpanHeight();
            this.getDisArr();
          } else {
            this.$message({type: 'error', message: '无法获得数据，当前电视墙记录可能已删除！'});
          }
        });
      },
      getDisArr() {
        this.disArr = [];
        for (let i = 0; i < this.portletCount; i++) {
          this.disArr.push('block');
        }
      },
      getSpan() {
        switch (this.portletCount) {
          case 1: this.span = '24'; break;
          case 2: this.span = '12'; break;
          case 4: this.span = '12'; break;
          case 6: this.span = '8'; break;
        }
      },
      getSpanHeight() {
        let height = document.body.clientHeight;
        let _height = this.isShowLogo ? height - 55 : height;
        if (this.portletCount > 2) {
          this.spanHeight = _height / 2 + 'px';
        } else {
          this.spanHeight = _height + 'px';
        }
      },
      edit(i) {
        this.currentPortlet = i - 1;
        this.currentPortletName = this.tvpageModels['location' + (i - 1)].title;
        this.currentPortletChild = this.tvpageModels['location' + (i - 1)].url.split('?id=')[1];
        this.currentMode = 'edit';
        this.bloomEdit = true;
      },
      addPortlet(i) {
        this.currentPortlet = i - 1;
        this.currentMode = 'add';
        this.bloomAdd = true;
      },
      addPortletOk() {
        if ((this.$refs[this.currentMode].index === 0 && this.$refs[this.currentMode].info.requestParm) || (this.$refs[this.currentMode].index !== 0)) {
          let data = {
            location: this.currentPortlet,
            tvwallId: this.tvwallId,
            tvshowtypeId: this.$refs[this.currentMode].info.tvshowtypeId,
            requestParm: '{\"id\":\"' + this.$refs[this.currentMode].info.requestParm + '\"}'
          };
          $axios.post('/systemManager/staticTvWall/saveTvwallParam', data).then((res) => {
            if (res.data && typeof res.data === 'string') {
              this.$message({type: 'success', message: '区块内容修改成功'});
              this.currentMode === 'add' ? this.bloomAdd = false : this.bloomEdit = false;
              this.zoom = 'enlarge';
              this.getAll();
            }
          });
        } else {
          this.$message({type: 'error', message: '请选择区块内容'});
        }
      },
      getSrc(i) {
        return this.tvpageModels['location' + i].url + '&location=' + i + '&tvwallid=' + this.tvwallId;
      },
      refresh(i) {
        this.$refs['iframe' + i][0].contentWindow.refresh();
      },
      enlarge(i) {
        if (this.zoom === 'enlarge') {
          for (let j = 0; j < this.disArr.length; j++) {
            if (i !== j) {
              this.$set(this.disArr, j, 'none');
            }
          }
          this.getId(i);
          this.getZoomHeight();
          this.span = 24;
          this.zoom = 'reduce';
        } else {
          this.getDisArr();
          this.getSpan();
          this.getSpanHeight();
          this.zoom = 'enlarge';
        }
      },
      getZoomHeight() {
        let height = document.body.clientHeight;
        let _height = this.isShowLogo ? height - 55 : height;
        this.spanHeight = _height + 'px';
      },
      setting(i) {
        this.currentPortlet = i;
        let title = this.tvpageModels['location' + i].title;
        let myFrame = this.$refs['iframe' + i][0];
        if (title === '资产监控') {
          this.currentAssetsSet = myFrame.contentWindow.getSet();
          this.bloomAssetsSet = true;
        } else if (title === '事件信息') {
          this.currentIncidentSet = myFrame.contentWindow.getSet();
          this.bloomIncidentSet = true;
        } else if (title === '拓扑图') {
          myFrame.contentWindow.settingPage(this.$route.query.tvUrl, i);
        } else if (title === '业务服务') {
          this.currentBusinessSet = myFrame.contentWindow.getSet();
          this.bloomBusinessSet = true;
        } else if (title === '事件中心') {
          this.currentAssetsExSet = myFrame.contentWindow.getSet();
          this.bloomAssetsExSet = true;
        }
      },
      assetsSetOk() {
        let tmp = this.$refs['assetsSet'].myForm.sliderVTime;
        if (isPosInt(tmp) && tmp >= 5) {
          this.$refs['iframe' + this.currentPortlet][0].contentWindow.setSet(this.$refs.assetsSet.myForm);
          this.bloomAssetsSet = false;
        } else {
          this.$message({type: 'error', message: '已关注资源切换时间有误，请输入大于等于5的正整数'});
        }
      },
      incidentSetOk() {
        this.$refs['iframe' + this.currentPortlet][0].contentWindow.setSet(this.$refs.incidentSet.myForm);
        this.bloomIncidentSet = false;
      },
      businessSetOk() {
        this.$refs['iframe' + this.currentPortlet][0].contentWindow.setSet(this.$refs.businessSet.myForm);
        this.bloomBusinessSet = false;
      },
      bloomAssetsExSetOk() {
        this.$refs['iframe' + this.currentPortlet][0].contentWindow.setSet(this.$refs.businessSet.myForm);
        this.bloomAssetsExSet = false;
      },
      monitorDetailClose(){
        if(this.detailFromFlag) {
          this.$refs['iframe' + this.currentPortlet][0].contentWindow.close();
        }
        this.monitorDetailData = {};   // 监控事件详情数据
        this.monitorDetailFlag = false;
      },
      deviceListClose(){
        this.$refs['iframe' + this.currentPortlet][0].contentWindow.close();
        this.deviceListData = {};
        this.deviceListFlag = false;
      },
      getId(val) {
        for (let i = 0; i < this.portletCount; i++) {
          if (val && val === i) {
            this.iframeId[i] = 'fullBoxIframe';
          } else {
            this.iframeId[i] = '';
          }
        }
      }
    },
    created() {
      this.getAll();
    }
  }
</script>
