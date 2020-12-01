<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 17:03:00
 * @LastEditTime: 2019-09-04 15:05:51
 * @LastEditors: Please set LastEditors
 -->
<template>
  <section class="content diy-aud">
    <s-scrollbar wrap-style="height: 100vh;">
      <s-row style='padding:0 10px'>
        <s-card class="box-card">
          <s-tab type="card">
            <s-tab-pane label="会话审核" v-if="judgeRoleBtn('logCenter_operAuditSessionAudit')">
              <audit :show1="show1"></audit>
            </s-tab-pane>
            <s-tab-pane label="智能审计" v-if="judgeRoleBtn('logCenter_operAuditIntelligentAudit')">
              <intelligent-audit :show2="show2"></intelligent-audit>
            </s-tab-pane>
          </s-tab>
        </s-card>
      </s-row>
      <s-row style="margin-top:15px;">
        <s-col span='18' style='padding:0 10px'>
          <s-card class="box-card" style="margin-bottom:30px;">
            <s-tab type="card" >
                <s-tab-pane label="运维审计事件报表" name="pane2" v-if="judgeRoleBtn('logCenter_operAuditEvent')">
                  <ops-audit :show3="show3"></ops-audit>
                </s-tab-pane>
                <s-tab-pane label="登录重要资产事件报表" name="pane3" v-if="judgeRoleBtn('logCenter_loginAlarmEvent')">
                  <important-asset :show4="show4"></important-asset>
                </s-tab-pane>
            </s-tab>
          </s-card>
        </s-col>
        <s-col span='6'>
          <s-card class="box-card">
            <div class="Adu_font">事件级别分布</div>
            <ul class="Adu_sj">
              <li class="Adu_lb">
                <div class="Adu_lbfont">{{yznum}}</div>
                <div>严重</div>
              </li>
              <li class="Adu_lb">
                <div class="Adu_lbfont">{{zynum}}</div>
                <div>主要</div>
              </li>
              <li class="Adu_lb">
                <div class="Adu_lbfont">{{cynum}}</div>
                <div>次要</div>
              </li>
              <li class="Adu_lb">
                <div class="Adu_lbfont">{{jgnum}}</div>
                <div>警告</div>
              </li>
            </ul>
            <ul style="margin-top:30px;width:500px;">
              <li class="Adu_yz">
                <s-tooltip  effect="dark" placement="top">
                  <div slot="content">{{yzcontent}}</div>
                  <div>
                    <div class="Adu_wenz">
                      <div class="Adu_wenz">严重</div>
                    </div>
                    <div style="width:300px;float:left;">
                      <div class="Adu_yanz" :style="{width: yzwidth}"></div>
                    </div>
                  </div>
                </s-tooltip>
              </li>
              <br>
              <li class="Adu_yz">
                <s-tooltip  effect="dark"  placement="top">
                  <div slot="content">{{zycontent}}</div>
                  <div>
                    <div class="Adu_wenz">
                      <div class="Adu_wenz">主要</div>
                    </div>
                    <div style="width:300px;float:left;">
                      <div class="Adu_zy" :style="{width: zywidth}"></div>
                    </div>
                  </div>
                </s-tooltip>
              </li>
              <br>
              <li class="Adu_yz">
                <s-tooltip  effect="dark"  placement="top">
                  <div slot="content">{{cycontent}}</div>
                  <div>
                    <div class="Adu_wenz">
                      <div class="Adu_wenz">次要</div>
                    </div>
                    <div style="width:300px;float:left;">
                      <div class="Adu_cy" :style="{width: cywidth}"></div>
                    </div>
                  </div>
                </s-tooltip>
              </li>
              <br>
              <li class="Adu_yz">
                <s-tooltip  effect="dark"  placement="top">
                  <div slot="content">{{jgcontent}}</div>
                  <div>
                    <div class="Adu_wenz">
                      <div class="Adu_wenz">警告</div>
                    </div>
                    <div style="width:300px;float:left;">
                      <div class="Adu_jg" :style="{width: jgwidth}"></div>
                    </div>
                  </div>
                </s-tooltip>
              </li>
              <br>
              <li class="Adu_yz">
                <s-tooltip  effect="dark"  placement="top">
                  <div slot="content">{{tscontent}}</div>
                  <div>
                    <div class="Adu_wenz">
                      <div class="Adu_wenz">提示</div>
                    </div>
                    <div style="width:300px;float:left;">
                      <div class="Adu_ts" :style="{width: tswidth}"></div>
                    </div>
                  </div>
                </s-tooltip>
              </li>
              <br>
              <li class="Adu_yz">
                <s-tooltip  effect="dark"  placement="top">
                  <div slot="content">{{zccontent}}</div>
                  <div>
                    <div class="Adu_wenz">
                      <div class="Adu_wenz">正常</div>
                    </div>
                    <div style="width:300px;float:left;">
                      <div class="Adu_zc" :style="{width: zcwidth}"></div>
                    </div>
                  </div>
                </s-tooltip>
              </li>
              <br>
              <li class="Adu_yz">
                <s-tooltip  effect="dark"  placement="top">
                  <div slot="content">{{wzcontent}}</div>
                  <div>
                    <div class="Adu_wenz">
                      <div class="Adu_wenz">未知</div>
                    </div>
                    <div style="width:300px;float:left;">
                      <div class="Adu_wz" :style="{width: wzwidth}"></div>
                    </div>
                  </div>
                </s-tooltip>
              </li>
            </ul>
          </s-card>
          <s-card class="box-card" style="margin-top:20px;">
            <s-row style="padding:20px;margin: 0 auto;">
              <s-col span=12 style="width:50%;text-align:center; float:left;" @click="opera">
                <div class="icon iconfont icon-alter opera" @click="opera"></div>
                <div style="margin-top:10px;" @click="opera">在线运维用户</div>
              </s-col>
              <s-col style="width:50%;text-align:center;float:left" @click="Administration">
                <div class="icon iconfont icon-union Administration" @click="Administration"></div>
                <div style="margin-top:10px;" @click="Administration">管理操作日志</div>
              </s-col>
            </s-row>
          </s-card>
        </s-col>
      </s-row>
    </s-scrollbar>
  </section>
</template>
<script>
  import Audit from '../Log_OperationStatistics/Audit'
  import intelligentAudit from '../Log_OperationStatistics/IntelligentAudit'
  import OpsAudit from './SafetyDialog/OpsAudit'
  import ImportantAsset from '../Log_EventAccount/ImportantAsset'
  import $axios from 'sunflower-ajax';
  export default{
    components: {
      Audit,
      OpsAudit,
      ImportantAsset,
      intelligentAudit
    },
    data() {
      return {
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        yzwidth: '1%',
        zywidth: '1%',
        cywidth: '1%',
        jgwidth: '1%',
        tswidth: '1%',
        zcwidth: '1%',
        wzwidth: '1%',
        yzcontent: '',
        zycontent: '',
        cycontent: '',
        jgcontent: '',
        tscontent: '',
        zccontent: '',
        wzcontent: '',
        yznum: 0,
        zynum: 0,
        cynum: 0,
        jgnum: 0
      }
    },
    created() {
      this.getList()
    },
    props: [],
    methods: {
      showTab(val) {
        let vm = this;
        let vals = 1 + Number(val);
        vm.show1 = false;
        vm.show2 = false;
        this['show' + vals] = true;
      },

      getList() {
        $axios.get('/omaIndex/getEventLevelCount').then(res => {
          let arr = res.data.map(val => val.value)
          let max = arr.reduce(function(a, b) { return b > a ? b : a; });
          res.data.map(val => {
            if (val.level === 6) {
                this.yzwidth = val.value / max * 100 + '%'
                this.yzcontent = val.name + ':' + val.value
                this.yznum = val.value
            } else if (val.level === 5) {
                this.zywidth = val.value / max * 100 + '%'
                this.zycontent = val.name + ':' + val.value
                this.zynum = val.value
            } else if (val.level === 4) {
                this.cywidth = val.value / max * 100 + '%'
                this.cycontent = val.name + ':' + val.value
                this.cynum = val.value
            } else if (val.level === 3) {
                this.jgwidth = val.value / max * 100 + '%'
                this.jgcontent = val.name + ':' + val.value
                this.jgnum = val.value
            } else if (val.level === 2) {
                this.tswidth = val.value / max * 100 + '%'
                this.tscontent = val.name + ':' + val.value
            } else if (val.level === 1) {
                this.zcwidth = val.value / max * 100 + '%'
                this.zccontent = val.name + ':' + val.value
            } else if (val.level === 0) {
                this.wzwidth = val.value / max * 100 + '%'
                this.wzcontent = val.name + ':' + val.value
            }
          })
        });
      },
      Administration() {
        this.$router.push({name: 'logCenter_systemgeneral'})
      },
      opera() {
        this.$router.push({name: 'logCenter_userOnline', query: {pan: 'pane2'}})
      }

    }
  }
</script>
