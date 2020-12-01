<template>
  <section class="content logCenterBase autoOpsfix" style="height: calc(100vh - 45px);" id="process-center">
    <s-row :gutter="10" id="process-main-card" style="height: 100%">
      <s-col span="19" style="height: 100%;padding-right: 0;" class="ProcessLeft">
        <section class="autoOperation logCard main-card-content" style="height: 100%;box-shadow: inset -1px 0 0 rgba(123, 134, 164, .2);">
          <s-row style="height: 100%;">
            <s-card class="box-card card-line" style="height: 100%;"
                    id="boxCardItem">
              <div slot="header">
                <div class="clearfix">
                  <s-col class="card-title" style="float: left;">
                    等级保护控制点统计图
                  </s-col>
                  <s-col style="float: right;">
                    <s-select v-model="gradeLevel" style="opacity: 0.65;">
                      <s-option label="三级等保" value="0"></s-option>
                      <s-option label="二级等保" value="1"></s-option>
                    </s-select>
                  </s-col>
                </div>
              </div>
              <chart-component :gradeLevel="gradeLevel"></chart-component>
            </s-card>
          </s-row>
        </section>
      </s-col>
      <s-col span="5" class="processRight logCenterBase logCard">
        <navs :modelName="'gradeProtect'" @goto="goto" @buttonCount='buttonCount' style="margin: 20px 20px 10px 10px"></navs>
        <s-scrollbar :wrap-style="wrapstyle" class="clr right-scroll">
          <s-card class="box-card card-line" v-if="judgeRoleBtn('gradeProtect_workRemind')">
            <div class="ys processTit" style="padding: 0 16px 0 0;border: none;">
              <span class="card-title">
                等保工作提醒
              </span>
              <div class="card-enter more-info" @click="jumpto('/GradeProtect/gradeProtect_workRemind')">更多</div>
            </div>
            <div style="margin-left: 10px;border: none;">
              <deal-work-item
                v-if="pendingLists.length > 0"
                v-for="(item, index) in pendingLists"
                :key="index + 'inner'"
                :num="index"
                style="width: 91%;"
                :spanHeight="spanHeight"
                :model="item"
                :flowType='1'
                @receive='receive'
                :userData='userData'
              ></deal-work-item>
              <deal-work-item
                v-if="pendingApprovalLists.length > 0"
                v-for="(item, index) in pendingApprovalLists"
                :key="index + 'inner'"
                :num="index"
                style="width: 91%;"
                :spanHeight="spanHeight"
                :model="item"
                :flowType='2'
                @receive='receive'
                :userData='userData'
              ></deal-work-item>
              <div v-nodata="true" v-if="pendingLists.length === 0 && pendingApprovalLists.length === 0" style="height: 300px;"></div>
            </div>
          </s-card>
        </s-scrollbar>
      </s-col>
    </s-row>
  </section>
</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import navs from '@/components/navButton/NavButton.vue'
  import chartComponent from './ChartComponent.vue'
  import dealWorkItem from './SafeWorkItem.vue'
  export default {
    data() {
      return {
        btncount: 6,
        maxheight: 170,
        pendingLists: [],
        pendingApprovalLists: [],
        userData: {},
        spanHeight: 20,
        gradeLevel: '0'
      }
    },
    components: {
      navs,
      chartComponent,
      dealWorkItem
    },
    watch: {
    },
    computed: {
      wrapstyle() {
        return 'max-height:' + this.maxheight + 'px;';
      }
    },
    created() {
      $axios.get(`/safetyPlatform/safeOrder/getGradeProtectUserList`).then(res => {
        this.userData = res.data
      })
      this.getData('getNeedMineDoOrder')
      this.getApprovalData('getNeedMineApproval')
    },
    methods: {
      // 获取我的待办列表
      getData(num) {
        let parms = {
          currentPage: 1,
          pageSize: 45,
          condition: {
            safeId: '',
            title: '',
            typeUuid: null,
            userName: '',
            startTime: '',
            endTime: ''
          }
        }
        $axios.post(`/safetyPlatform/safeOrder/${num}`, parms).then(({data}) => {
          this.pendingLists = data.pageList.filter(item => {
            return (item.typeUuid === 'f0f7c587fc1b483d9727173c77df27a5') || (item.typeUuid === '5822bc7958314f8196875070ce0da5e3');
          })
        })
      },
      getApprovalData(num) {
        let parms = {
          currentPage: 1,
          pageSize: 45,
          condition: {
            safeId: '',
            title: '',
            typeUuid: null,
            userName: '',
            startTime: '',
            endTime: ''
          }
        }
        $axios.post(`/safetyPlatform/safeOrder/${num}`, parms).then(({data}) => {
          this.pendingApprovalLists = data.pageList.filter(item => {
            return (item.typeUuid === 'f0f7c587fc1b483d9727173c77df27a5') || (item.typeUuid === '5822bc7958314f8196875070ce0da5e3');
          })
        })
      },
      receive(val) {
        if (val) {
          this.getData('getNeedMineDoOrder')
          this.getApprovalData('getNeedMineApproval')
        }
      },
      // 计算右侧按钮的高度
      buttonCount(count) {
        this.btncount = count;
        this.computeAssetHeight();
      },
      computeAssetHeight() {
        let navbuttonheight = Math.ceil(this.btncount / 2) * 40;
        // eslint-disable-next-line no-undef
        let sreenheight = $('#app').height();
        this.maxheight = sreenheight - navbuttonheight - 75;
      },
      // 跳转
      goto(path) {
        this.$router.push('/GradeProtect/' + path)
      },
      initDivHeight () {
        var mainCardContentHeight = document.getElementsByClassName('main-card-content')[0].offsetHeight;
        var sCardHeader = document.getElementsByClassName('s-card-header')[0].offsetHeight;
        var tempSpanHeight = (mainCardContentHeight - sCardHeader - 300) / 4;
        this.spanHeight = tempSpanHeight > 18 ? tempSpanHeight : 18;
      },
      jumpto(path) {
        this.$router.push(path)
      }
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    mounted() {
      let _this = this
      _this.initDivHeight();
      _this.$nextTick(() => {
        window.addEventListener('resize', _this.initDivHeight);
        window.addEventListener('resize', _this.computeAssetHeight);
      });
    }
  }
</script>
<style lang="stylus">
</style>
