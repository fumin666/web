<template>
  <section class="content sysSet home-page-box account-box" style="margin:0;width:100%" id="systemSetIndex">
    <s-row :gutter="10">
      <s-col span="19" class="main-left" style="padding:0">
        <s-card class="main-card-content box-card card-line" style="height: calc(100vh - 360px);max-height: 600px;"
                id="mainCardContent">
          <div slot="header" class="clearfix" style="padding:0 0 0 20px;">
              <span class="card-title">
                <!--<i class="iconfont icon-panel"></i>-->
                系统状况
              </span>
          </div>
          <div style="width:100%;height:400px">
            <s-col span="10" style="position: relative;">
              <div class="ring_wrap">
                <div class="status_ring"></div>
                <div class="status_inside"></div>
                <div class="outside_ring"></div>
                <div class="inner_wrap">
                  <div class="inner_word">
                    <span class="green">良好</span>
                    <div style="inner_state">运行状况</div>
                  </div>
                  <div class="inner_ring">
                    <canvas id="canvas"></canvas>
                  </div>
                </div>
              </div>
            </s-col>
            <s-col span="14">
              <div style="height:100%">
                <s-scrollbar wrap-style='height:calc(100vh - 370px);'>
                  <div style="margin-top:15px">
                    <div class="status-continue-time" style="margin-bottom:11px;">
                      <div class="blueWord">已持续为您服务：</div>
                      <div class="blueWord">
                        <div class="bigWord">{{serverTime.year}}</div>
                        <div class="font-small">年</div>
                        <div class="bigWord">{{serverTime.day}}</div>
                        <div class="font-small">天</div>
                        <div class="bigWord">{{serverTime.hour}}</div>
                        <div class="font-small">小时</div>
                        <div class="bigWord">{{serverTime.min}}</div>
                        <div class="font-small">分</div>
                      </div>
                    </div>
                    <div class="status-reset-time">上次重启时间{{sysSelfCheckInfo.lastRestart}}</div>
                  </div>
                  <div class="status-btn" style="margin:15px 0 20px 0">
                    <s-button icon="self-test" @click="startCheck">&nbsp;一键自检</s-button>
                  </div>
                  <s-row class="status-row" type="flex" align="middle">
                    <s-col :span="10">
                      <i class="iconfont icon-protocol"></i>
                      <span class="v-middle">您使用的版本</span>
                    </s-col>
                    <s-col :span="14">
                      <strong v-if="registerInfo.verType">{{ registerInfo.verType }}</strong>
                      <strong v-else>未注册</strong>
                    </s-col>
                  </s-row>
                  <s-row class="status-row" type="flex" align="middle">
                    <s-col :span="10">
                      <i class="iconfont icon-approve"></i>
                      <span class="v-middle">已为您正常服务</span>
                    </s-col>
                    <s-col :span="14">
                      <strong style="color:#54DAAC">{{ sysRegInfo && sysRegInfo.runDays ? sysRegInfo.runDays : 0 }}</strong>天
                    </s-col>
                  </s-row>
                  <s-row class="status-row" type="flex" align="middle">
                    <s-col :span="10">
                      <i class="iconfont icon-service-time"></i>
                      <span class="v-middle">服务有效期</span>
                    </s-col>
                    <s-col :span="14">
                      <span style="margin-right:9px;opacity:.65" v-if="sysRegInfo && sysRegInfo.serviceDayLeft">{{ sysRegInfo.serviceDeadLine }}</span>
                      剩余
                      <span v-for="(item,index) in computedServiceDayLeft" class="special-day"
                            :key="index"><span>{{ item }}</span>
                    </span>
                      天
                    </s-col>
                  </s-row>
                  <s-row class="status-row" type="flex" align="middle">
                    <s-col :span="10">
                      <i class="iconfont icon-order"></i>
                      <span class="v-middle">使用有效期</span>
                    </s-col>
                    <s-col :span="14">
                      <span style="margin-right:9px;opacity:.65" v-if="sysRegInfo && sysRegInfo.workDeadLine">{{ sysRegInfo.workDeadLine }}</span>
                      剩余
                      <span v-for="(item,index) in computedWorkDayLeft" class="special-day2"
                            :key="index"><span>{{ item }}</span>
                    </span>
                      天
                    </s-col>
                  </s-row>
                </s-scrollbar>
              </div>
            </s-col>
          </div>
        </s-card>
        <div class="aa" style="margin-bottom:20px"></div>
        <s-col span="12" style="height:200px;padding:0 10px 0 20px">
            <s-card class="box-card headbord card-line">
              <div slot="header" class="clearfix " style="padding: 0 12px 0 0;">
                <span class="card-title">
                  <!--<i class="iconfont icon-bulletin"></i>-->
                  磁盘预警
                </span>
                <div class="card-enter more-info" @click="goto('sys_diskwarning')">更多</div>
              </div>
              <s-row style="text-align:center;height:160px;font-size:12px" class="border">
                <s-col :span="8">
                  <v-circlar :chart='chart1'></v-circlar>
                  <div class="cpu_bg">CPU使用率</div>
                  <div >核数{{this.cpuInfo.cpuNu || '0'}}</div>
                  <div >使用率{{this.cpuInfo.cpuUse + '%'|| '0' + '%'}}</div>
                </s-col>
                <s-col :span="8">
                  <v-circlar :chart="chart2"></v-circlar>
                  <div class="cpu_bg">内存使用率</div>
                  <div >总量{{this.memInfo.memTotal || '0'}}</div>
                  <div >已用{{this.memInfo.memUsed || '0'}}</div>
                </s-col>
                <s-col :span="8">
                  <v-circlar :chart="chart3"></v-circlar>
                  <div class="cpu_bg">磁盘使用率</div>
                  <div >总量{{this.diskInfo.diskTotal || '0'}}</div>
                  <div >已用{{this.diskInfo.diskUsed || '0'}}</div>
                </s-col>
              </s-row>
            </s-card>
        </s-col>
        <s-col span="12" style="height:200px;padding:0 20px 0 10px">
          <s-card class="box-card headbord tableList card-line">
            <div slot="header" class="clearfix " style="padding: 0 12px 0 0">
                <span class="card-title">
                  <!--<i class="iconfont icon-bulletin"></i>-->
                  系统公告
                </span>
                <div class="card-enter more-info" @click="goto('sys_announce')">更多</div>
                <div class="card-enter" style="color:#199FED" @click="AddAnnounce"><i class="icon iconfont icon-announcement" ></i> 发布公告</div>
              </div>
              <s-row  style="height:160px" class="border">
                <div class="notice_con">
                  <s-carousel ref="noticeCarousel" class="inner" style="width:100%" :initial-index="0" :autoplay="false" arrow="never" indicator-position="none" @change="carouselChange">
                    <template v-if="notices&&notices.length">
                      <s-carousel-item v-for="(notice,index) in notices" :key="index" >
                        <s-scrollbar wrap-style='height:130px;'>
                          <div v-if="notice.content" style="padding:10px">
                            <div>
                              <s-row>
                                <s-col span='12' class="ellipsis" :title="notice.title"><i style="font-size:16px;line-height:19px" class="icon iconfont icon-announce tzIcon"></i>&nbsp;&nbsp;{{notice.title }}</s-col>
                                <s-col span='6' class="ellipsis" style="opacity: 0.45;" :title="notice.userName">发布人: {{notice.userName}}</s-col>
                                <s-col span='6' class="ellipsis" style="opacity: 0.45;" :title="notice.createTime">{{notice.createTime}}</s-col>
                              </s-row>
                            </div>
                            <div style="font-size:14px;margin-top:10px;opacity: 0.65;" v-text="notice.content"></div>
                          </div>
                          <p v-else style="text-align: center; margin-top: 70px;">暂无公告</p>
                        </s-scrollbar>
                      </s-carousel-item>
                    </template>
                    <template v-else>
                      <div style="height:44%" v-nodata='notices.length === 0'>
                        <!-- <p style="text-align: center; margin-top: 70px;">暂无公告</p> -->
                      </div>
                    </template>
                  </s-carousel>
                  <div>
                    <div style='padding:0 10px'>
                      <div class="page_turn">
                        <a class="icon iconfont icon-triangle-right" id="btn-left" style="line-height:16px;font-size:12px;text-align:center;transform:rotate(180deg);margin-top:1px" @click.prevent="noticePrev"></a>
                        <a class="icon iconfont icon-triangle-right" id="btn-right" style="line-height:16px;font-size:12px;text-align:center;margin-top:2px" @click.prevent="noticeNext"></a>
                        <span style="margin-left:5px;opacity: 0.45;font-size:14px">{{ currentNotice }}</span>
                        <span style="opacity: 0.45;font-size:14px">/ {{ notices.length }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </s-row>
            </s-card>
        </s-col>
      </s-col>
      <s-col span="5" class="main-right" style="padding: 0 20px 0 15px">
        <navs :modelName="'systemSet'" @goto="goto" @openDialog="showUpgrade" style="margin-top:20px;"></navs>
        <s-scrollbar wrap-style='height:calc(100vh - 142px);'>
          <s-card class="box-card tableList card-line">
            <div slot="header" class="clearfix ys" style="padding-right:12px">
              <span class="card-title">
                <!--<i class="iconfont icon-bulletin"></i>-->
                注册信息
              </span>
            </div>
            <div class="item" style="border:none">
              <ul>
                <li v-for="(item, index) in changePasswordList" :key="index" style="margin:10px 0">
                  <div class="ellipsis">
                    <span class="darkword">{{item.name}}：</span>
                    <span class="lightword">{{item.content}}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div style="margin:10px">
              <s-button  @click="productInfo = true">产品注册</s-button>
            </div>
          </s-card>
          <s-card class="box-card tableList card-line">
            <div slot="header" class="clearfix ys" style="margin-top:10px;padding-right:12px">
              <span class="card-title">
                <!--<i class="iconfont icon-bulletin"></i>-->
                系统最新备份
              </span>
              <div class="card-enter more-info" @click="goto('sys_backup')">更多</div>
            </div>
            <s-row >
              <div style="margin:20px 5px">
                <div style="margin:10px;opacity: 0.45;"><i class="icon iconfont icon-file"></i> 最新备份文件</div>
                <div style="margin:10px;opacity: 0.65;">{{sysBackupLogs.backupFileName}}</div>
              </div>
              <div style="margin:20px 5px">
                <div style="margin:10px;opacity: 0.45;"><i class="icon iconfont icon-last-time"></i> 备份时间</div>
                <div style="margin:10px;opacity: 0.65;">{{sysBackupLogs.createTime}}</div>
              </div>
              <div style="margin:20px 5px">
                <div style="margin:10px;opacity: 0.45;"><i class="icon iconfont icon-last-time"></i> 下次备份时间</div>
                <div style="margin:10px;opacity: 0.65;">{{sysBackupLogs.nextBackTime}}</div>
              </div>
            </s-row>
          </s-card>
        </s-scrollbar>
      </s-col>
    </s-row>
    <!--发布公告-->
    <s-dialog
      v-model="announceDialog"
      v-if="announceDialog"
      title="发布公告">
      <add-announce ref="announce"></add-announce>
      <template slot="footer">
        <s-button @click="announceSave">保存</s-button>
        <s-button type="cancel" @click="announceDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--系统升级-->
    <s-dialog
      v-model="sysUpgrade"
      v-if="sysUpgrade"
      width="1000px"
      title="系统升级">
      <system-upgrade></system-upgrade>
    </s-dialog>
    <!--添加备份服务器-->
    <s-dialog
      v-model="backupServerDialog"
      v-if="backupServerDialog"
      title="添加备份服务器">
      <backup-server ref="addServer"></backup-server>
      <template slot="footer">
        <s-button @click="backupServerSave">保存</s-button>
        <s-button type="cancel" @click="backupServerDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑备份服务器-->
    <s-dialog
      v-model="editServerDialog"
      v-if="editServerDialog"
      title="编辑备份服务器">
      <backup-server ref="editServer" :editData="editData"></backup-server>
      <template slot="footer">
        <s-button @click="editServerSave">保存</s-button>
        <s-button type="cancel" @click="editServerDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--产品信息-->
    <s-dialog
      v-model="productInfo"
      title="注册信息">
      <product-info @register="showRegister" :info="registerInfo"></product-info>
    </s-dialog>
    <!--一键自检-->
    <s-dialog
      v-model="checkSelfDialog"
      v-if="checkSelfDialog"
      width="800px"
      title="一键自检">
      <check-self></check-self>
    </s-dialog>
    <!--产品注册-->
    <s-dialog
      v-model="registerDialog"
      v-if="registerDialog"
      width="700px"
      title="产品注册">
      <s-form :model="register" :rules="registerRules" ref="registerForm" label-width="120px">
        <s-form-item label="序列号" prop="serialNumber">
          <s-input type="text" v-model="register.serialNumber"></s-input>
        </s-form-item>
        <s-form-item label="请求码" prop="requestCode">
          <!--<s-input type="text" v-model="register.requestCode"-->
          <!--:editable="false"></s-input>-->
          <div style="box-sizing: border-box;border: solid 1px #344458; border-radius:4px; height:36px; padding:0 10px;">
            {{ register.requestCode ? register.requestCode : '' }}
          </div>
        </s-form-item>
        <s-form-item label="激活码" prop="activationCode">
          <s-input type="textarea" v-model="register.activationCode"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer">
        <s-button @click="handleRegister">注册</s-button>
        <s-button type="cancel" @click="registerDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>
<style lang="stylus">
.sysSet
  .status-row
    height: 48px;
    line-height 48px
    i
      font-size 16px
      line-height 52px
  #canvas
    border-radius 50%
    position absolute
    top 0
    right 0
    left 0
    bottom 0
    margin auto
  .status-row
    margin-bottom 10px
  .main-right
    .s-card-header
      border-bottom none!important


</style>
<script type="text/babel">
  import vCirclar from '@/pages/AssetsMonitor_View/components/vCirclar.vue'
  import navs from '@/components/navButton/NavButton.vue';
  import $axios from 'sunflower-ajax'
  import AddAnnounce from '@/pages/SysManage_Announcement/AddAnnounce'
  import SystemUpgrade from './SystemUpgrade'
  import BackupServer from './BackupServer'
  import productInfo from './ProductInfo'
  import checkSelf from './CheckBySelf'
  import {isEmpty} from 'lodash'
  import {getConfig} from 'sunflower-common-utils'

  export default {
    data() {
      return {
        notices: [],
        currentNotice: 0,
        bottomBoxHeight: 122,
        bottomBoxBodyHeight: 84,
        scrollbarHeight: 0,
        scrollMinHeight: 0,
        chart1: {
          name: '1',
          width: '100%',
          height: '100%',
          value: 0,
          // text: 0,
          // ip: 0,
          isTagName: null
        },
        chart2: {
          name: '2',
          width: '100%',
          height: '100%',
          value: 0,
          // text: 0,
          // ip: 0,
          isTagName: null
        },
        chart3: {
          name: '3',
          width: '100%',
          height: '100%',
          value: 0,
          // text: 0,
          // ip: 0,
          isTagName: null
        },
        changePasswordList: [
          {
            name: '客户名称',
            content: ''
          },
          {
            name: '产品版本号',
            content: ''
          },
          {
            name: '服务热线',
            content: getConfig('hotline')
          },
          {
            name: '支持邮箱',
            content: getConfig('supporting')
          }
        ],
        announceDialog: false,
        sysUpgrade: false,
        backupServerDialog: false,
        editServerDialog: false,
        productInfo: false,
        checkSelfDialog: false,
        announceForm: {
          announceType: '0',
          title: '',
          content: ''
        },
        editData: {},
        sysSelfCheckInfo: {},
        sysRegInfo: {},
        sysBackupLogs: {
          backupFileName: '暂无数据',
          createTime: '暂无数据',
          nextBackTime: '暂无数据'
        },
        announcementList: {
          title: '暂无数据',
          createTime: '暂无数据',
          userName: '暂无数据'
        },
        cpuInfo: {},
        memInfo: {},
        diskInfo: {},
        serverTime: {
          year: '0',
          day: '0',
          hour: '0',
          min: '0'
        },
        // 注册
        registerInfo: {},
        registerDialog: false,
        register: {
          serialNumber: '',
          requestCode: '',
          activationCode: ''
        },
        registerRules: {
          serialNumber: [
            {required: true, message: '请输入序列号', trigger: 'blur'},
            {
              pattern: /^([\dA-Z]{5}-){4}[\dA-Z]{5}$/,
              message: '请填写正确格式的序列号(5个字母数字组合一组,共5组，中间用\' - \'隔开)',
              trigger: 'blur'
            }
          ],
          requestCode: [
            {required: true, message: '服务端错误，未获取到请求码', trigger: 'blur'}
          ],
          activationCode: [
            {required: true, message: '请输入激活码', trigger: 'blur'},
            {
              pattern: /^([\dA-Z]{5}-){49}[\dA-Z]{5}$/,
              message: '请填写正确格式的序列号(5个字母数字组合一组,共50组，中间用\' - \'隔开)',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    components: {
      navs,
      AddAnnounce,
      SystemUpgrade,
      BackupServer,
      productInfo,
      checkSelf,
      vCirclar
    },
    created() {
      this.getIndexInfo()
      this.getNotice()
    },
    mounted() {
      this.initDivHeight();
      this.Motion()
      this.noticePrev()
      window.addEventListener('resize', this.initDivHeight);
      this.getRegisterInfo()
    },
    watch: {
      currentNotice: {
        handler(val) {
          let right = document.getElementById('btn-right')
          let left = document.getElementById('btn-left')
          if (val === this.notices.length) {
            right.style.color = '#ccc';
          }
          if (val === 1) {
            left.style.color = '#ccc';
          }
        }
      },
      notices: {
        immediate: true,
        handler(val) {
          let right = document.getElementById('btn-right')
          if (this.notices.length === 2) {
            right.style.color = '#ccc';
            this.noticePrev()
          }
        }
      }
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    computed: {
      computedServiceDayLeft() {
        if (this.sysRegInfo && this.sysRegInfo.serviceDayLeft) {
          let days = this.sysRegInfo.serviceDayLeft + ''
          while (days.length < 4) {
            days = '0' + days
          }
          return days.split('')
        } else {
          return '0000'
        }
      },
      computedWorkDayLeft() {
        if (this.sysRegInfo && this.sysRegInfo.workDayLeft) {
          let days = this.sysRegInfo.workDayLeft + ''
          while (days.length < 4) {
            days = '0' + days
          }
          return days.split('')
        } else {
          return '0000'
        }
      }
    },
    methods: {
      getNotice() {
        let _self = this
        /* 公告数据 */
        $axios.post('/systemmanager/otherConfig/sysAnnouncement/list').then(function ({ data }) {
          _self.notices = data.splice(0, 5);
        })
      },
      Motion() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        canvas.width = 140
        canvas.height = 140
        function Circle() {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height;
          this.r = Math.random() * 7;
          // 绘制圆形
          this.paint = function() {
            context.beginPath();
            context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            context.fillStyle = '#15FF49';
            context.globalAlpha = 0.5;
            context.fill();
          }
          // 控制圆形移动
          this.step = function() {
            this.y--;
          }
        }
        var circles = [];
        function createCircles() {
          var circle = new Circle();// ??????
          circles[circles.length] = circle;
        }

        function paintCircles() {
          for (var i = 0; i < circles.length; i++) {
            circles[i].paint();
          }
        }
        function stepCircles() {
          for (var i = 0; i < circles.length; i++) {
            circles[i].step();
          }
        }
        var myimg = new Image();
        myimg.src = '../../../static/style/img/inner_ring.188db42.png';
        var timer = '';
        setInterval(function() {
          context.drawImage(myimg, -0.2, -0.2);
          timer++;
          if (timer % 20 === 0) {
            createCircles();
          }
          paintCircles();
          stepCircles();
        }, 10);
      },
      carouselChange(index) {
        if (this.notices.length > 0) {
          this.currentNotice = index + 1
        }
      },
      noticePrev() {
        let left = document.getElementById('btn-left')
        let right = document.getElementById('btn-right')
        if (this.currentNotice === 1) {
        } else {
          left.style.removeProperty('color');
          this.$refs.noticeCarousel.prev()
        }
        if (this.notices.length > 1) { right.style.removeProperty('color'); }
      },
      noticeNext() {
        let right = document.getElementById('btn-right')
        let left = document.getElementById('btn-left')
        if (this.currentNotice === this.notices.length) {
          // right.style.color = '#ccc';
        } else {
          right.style.removeProperty('color');
          this.$refs.noticeCarousel.next()
        }
        if (this.notices.length > 1) { left.style.removeProperty('color'); }
      },
      initDivHeight() {
        var accountBtnsHeight = 100;
        var mainCardHeight = document.getElementById('mainCardContent').offsetHeight;
        var indexHeight = document.getElementById('index-body').offsetHeight;
//        var indexHeight = document.body.offsetHeight - 100;
        var footerHeight = document.getElementsByClassName('s-footer')[0].offsetHeight;
        var boxHeaderHeight = document.getElementsByClassName('s-card-header')[0].offsetHeight;
        if (mainCardHeight <= 587 && mainCardHeight >= 585) {
          this.bottomBoxHeight = indexHeight - 608 - footerHeight;
          this.bottomBoxBodyHeight = this.bottomBoxHeight - boxHeaderHeight;
        }
        this.scrollbarHeight = mainCardHeight - accountBtnsHeight + 15;
      },
      formatTime() {
        const years = 365 * 24 * 60 * 60
        const days = 24 * 60 * 60
        const hours = 60 * 60
        const minutes = 60
        if (this.sysSelfCheckInfo.sysRunTime === '') {
          this.serverTime.year = 0
          this.serverTime.day = 0
          this.serverTime.hour = 0
          this.serverTime.min = 0
        } else {
          let nowSec = this.sysSelfCheckInfo.curTime - this.sysSelfCheckInfo.sysRunTime
          this.serverTime.year = (nowSec / years < 1) ? 0 : parseInt(nowSec / years)
          this.serverTime.day = (nowSec % years / days < 1) ? 0 : parseInt(nowSec % years / days)
          this.serverTime.hour = (nowSec % years % days / hours < 1) ? 0 : parseInt(nowSec % years % days / hours)
          this.serverTime.min = (nowSec % years % days % hours / minutes < 1) ? 0 : parseInt(nowSec % years % days % hours / minutes)
        }
      },
      startCheck() {
        $axios.get('/system/getSelfCheckingStatus').then((res) => {
          if (res.data === false) {
            this.checkSelfDialog = true
          } else {
            this.$message({type: 'error', message: '自检程序正在运行中,请稍后再试'});
          }
        });
      },
      unitFilter(n) {
        let num = parseInt(n)
        if (parseInt(num / 1024 / 1024) > 1) {
          return parseInt(num / 1024 / 1024) + 'GB'
        } else {
          return parseInt(num / 1024) + 'MB'
        }
      },
      getIndexInfo() {
        $axios.get('/system/getManagerInfo').then((res) => {
          if (res.data) {
            this.sysSelfCheckInfo = res.data.sysSelfCheckInfo
            this.sysRegInfo = res.data.sysRegInfo
            this.formatTime()
            if (res.data.sysBackupLogs.length !== 0) {
              this.sysBackupLogs = res.data.sysBackupLogs[0]
              this.sysBackupLogs.nextBackTime = res.data.nextBackTime
            }
            if (res.data.announcementList.length !== 0) {
              this.announcementList = res.data.announcementList[0]
            }
            if (!isEmpty(res.data.cpuInfo)) {
              this.cpuInfo = res.data.cpuInfo
              this.cpuInfo.cpuUse = parseInt(res.data.cpuInfo.cpuUse * 100)
            }
            if (!isEmpty(res.data.memInfo)) {
              this.memInfo.memTotal = this.unitFilter(res.data.memInfo.memTotal)
              this.memInfo.memUsed = this.unitFilter(res.data.memInfo.memUsed)
            }
            if (!isEmpty(res.data.diskInfo)) {
              this.diskInfo.diskTotal = this.unitFilter(res.data.diskInfo.diskTotal)
              this.diskInfo.diskUsed = this.unitFilter(res.data.diskInfo.diskUsed)
            }
            this.chart1.value = res.data.cpuInfo.cpuUse
            this.chart2.value = parseInt(res.data.memInfo.memUsed / res.data.memInfo.memTotal * 100)
            this.chart3.value = parseInt(res.data.diskInfo.diskUsed / res.data.diskInfo.diskTotal * 100)
          }
        })
      },
      backupServerSave() {
        const form = this.$refs['addServer'].$refs['serverForm']
        const addForm = this.$refs['addServer'].serverForm
        form.validate(valid => {
          if (!valid) return;
          $axios.post('/archiveDevice/save', addForm).then((res) => {
            if (res.data === true) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.backupServerDialog = false
              this.$refs['sysAdvanced'].getFtpList()
            }
          })
        })
      },
      editServerSave() {
        const form = this.$refs['editServer'].$refs['serverForm']
        const addForm = this.$refs['editServer'].serverForm
        form.validate(valid => {
          if (!valid) return;
          $axios.post('/archiveDevice/update', addForm).then((res) => {
            if (res.data === true) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.editServerDialog = false
              this.$refs['sysAdvanced'].getFtpList()
            }
          })
        })
      },
      showBackupServer() {
        this.backupServerDialog = true
      },
      showEditServer(row) {
        this.editServerDialog = true
        this.editData = row
      },
      showUpgrade() {
        this.sysUpgrade = true
      },
      goto(path) {
        this.$router.push('/SystemSet/' + path)
      },
      announceSave() {
        let formObj = this.$refs.announce.$refs['addAnnounceForm']
        let form = this.$refs.announce.addForm
        formObj.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('/systemmanager/otherConfig/sysAnnouncement/save', form, {
            data: [{title: form.title}],
            logTemplate: '发布|(#title#)'
          }).then((res) => {
            if (res.data === 'success') {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getNotice()
              this.announceDialog = false
              this.getIndexInfo()
            }
          });
        })
      },
      AddAnnounce() {
        this.announceDialog = true
      },
      // 注册
      getRegisterInfo(callback) {
        $axios.get('/systemmanager/systemsetting/getLicenseInfo').then(({data}) => {
          data.prodctVersion === null ? data.prodctVersion = 'V3.2' : data.prodctVersion = data.prodctVersion.replace(/(\.0)+$/, '')
          this.registerInfo = data
          this.changePasswordList[0].content = data.customerName
          this.changePasswordList[1].content = data.prodctVersion
          if (callback) {
            callback();
          }
        })
      },
      showRegister() {
        this.registerDialog = true
        $axios.get('/systemmanager/systemsetting/getRequestCode').then(({data}) => {
          this.register.requestCode = data
        })
      },
      handleRegister() {
        let _self = this
        _self.$refs.registerForm.validate((valid) => {
          if (valid) {
            // handle register
            $axios.post('/systemmanager/systemsetting/activeRegister', this.register).then(({data}) => {
              if (data === true) {
                this.registerDialog = false
                this.$message.success('激活成功!');
                this.getRegisterInfo(() => {
                  location.reload();
                });
              } else {
                this.$message.error('激活失败，请检查序列号或激活码是否正确!')
              }
            })
          }
        })
      }
    }
  }
</script>
