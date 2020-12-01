<template>
  <section id="check-self">
    <section v-if="checkSelfStart">
      <s-row type="flex" justify="center" align="middle">
        <s-col :span="8">
          <div class="checkSelfImg scan-static"></div>
        </s-col>
        <s-col :span="12">
          <div class="top-info">已经{{startInfo.days}}天未进行自检了,建议立即自检</div>
          <div class="bot-info">上次自检时间:{{startInfo.scanTime}}</div>
        </s-col>
        <s-col :span="4">
          <s-button @click="runNow">立即自检</s-button>
        </s-col>
      </s-row>
    </section>
    <section v-if="checkSelfIng">
      <s-row type="flex" justify="center" align="middle">
        <s-col :span="7">
          <div v-show="!imgShow" class="checkSelfImg scan-static"></div>
          <div v-show="imgShow" class="checkSelfImg scan-animation"></div>
        </s-col>
        <s-col :span="13">
          <div class="top-info">{{endMsg}}</div>
          <div class="bot-info">已发现{{questionNum}}个问题,建议扫描结束后根据建议修复</div>
        </s-col>
        <s-col :span="4">
          <s-button v-if="btnShow" @click="stopNow">取消自检</s-button>
        </s-col>
      </s-row>
      <s-row>
        <s-scrollbar wrap-class="authoriseScrollbar">
          <s-table :data="dataList">
            <s-table-column label="项目">
              <template slot-scope="scope">
                <span :style="checkStyle(scope.row.solution)">{{scope.row.item_name}}</span>
              </template>
            </s-table-column>
            <s-table-column label="问题">
              <template slot-scope="scope">
                <span :style="checkStyle(scope.row.solution)">{{scope.row.detail}}</span>
              </template>
            </s-table-column>
            <s-table-column label="建议">
              <template slot-scope="scope">
                <span :style="checkStyle(scope.row.solution)">{{scope.row.solution}}</span>
              </template>
            </s-table-column>
          </s-table>
        </s-scrollbar>
      </s-row>
    </section>
    <scan-socket v-if="socketFlag" :name-space="nameSpace" ref="socket"
                 @message-callback="messageCallback">
    </scan-socket>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import scanSocket from '@/components/socketClient/SocketClient'
  export default {
    data() {
      return {
        imgShow: true,
        btnShow: true,
        checkSelfStart: true,
        checkSelfIng: false,
        socketFlag: false,
        resultData: '',
        nameSpace: '',
        dataList: [],
        questionNum: '0',
        intercheck: null,
        startInfo: {
          days: '0',
          scanTime: '未进行过自检'
        },
        endMsg: '正在进行检测,请稍等......'
      }
    },
    components: {
      scanSocket
    },
    methods: {
      clear() {
          window.clearInterval(this.intercheck)
      },
      checkStyle(solution) {
        if (solution !== '无') {
          return 'color: #ff5353'
        }
      },
      messageCallback(data) {
        console.log(data.message)
        this.clear()
        let message = JSON.parse(data.message);
        this.dataList.push(message);
        this.questionNum = this.dataList.length
        if (this.questionNum === 5) {
           this.endMsg = '检测结束!'
           this.imgShow = false
           this.btnShow = false
           this.socketFlag = false
        }
      },
      runNow() {
        this.selfcheck()
        this.intercheck = window.setInterval(() => {
          if (this.questionNum === '0') {
            this.selfcheck()
          }
        }, 30000)
      },
      selfcheck() {
        $axios.get('/system/selfchecking').then(({data}) => {
          this.checkSelfIng = true
          this.checkSelfStart = false
        });
      },
      stopNow() {
        this.clear()
        $axios.get('/system/stopSelfChecking').then((res) => {
          if (res.data === true) {
            this.checkSelfIng = false
            this.checkSelfStart = true
          }
        });
      }
    },
    created() {
      // 创建聊天室
      this.nameSpace = 'dbaSelfCheck'
      $axios.get('/iamUserInfo/createPageConnection/dbaSelfCheck').then(({data}) => {
        this.socketFlag = true
      });
      $axios.get('/system/getSelfCheckingInfo').then((res) => {
        this.startInfo = res.data
      });
    },
    destroyed() {
      this.clear()
    }
  }
</script>
