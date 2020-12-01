<template>
  <section class="logSessionDetail">
    <s-scrollbar wrap-style="max-height: 600px;">
      <s-form :inline="true">
        <s-form-item label="导出类型">
          <s-select v-model="exportType">
            <s-option label="Word报表导出" value="word"></s-option>
            <s-option label="PDF报表导出" value="pdf"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="导出内容">
          <s-select v-model="exportContentChecked" multiple placeholder="请选择(可多选)">
            <s-option
              v-for="item in param.tabs"
              :label="item.name"
              :value="item.value"
              :key="item.name">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item>
          <s-button icon="export" title="导出" @click="exportContent">导出</s-button>
        </s-form-item>
      </s-form>
      <s-tab>
        <s-tab-pane label="会话回显">
          <s-table-page
          :data="param.sessionDetail.cmdList"
          :header-search="getListSearchDef()">
          <s-table-column type="expand">
            <template slot-scope="scope">
              <s-form>
                <s-form-item v-if="scope.row.command_cont"><span v-html="scope.row.command_cont"></span></s-form-item>
              </s-form>
            </template>
          </s-table-column>
          <s-table-column label="内容" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status === 1">{{scope.row.command_name}}</span>    <!--正常-->
              <span v-if="scope.row.status === 2" style="color: #3f8dff">{{scope.row.command_name}}</span>    <!--命令告警-->
              <span v-if="scope.row.status === 3" style="color: #ec9813">{{scope.row.command_name}}</span>    <!--命令阻断-->
              <span v-if="scope.row.status === 4" style="color: #e8504e">{{scope.row.command_name}}</span>    <!--会话阻断-->
            </template>
          </s-table-column>
          <s-table-column label="指令业务描述" v-if="!param.showTab" prop="cmdTranslate"></s-table-column>
          <s-table-column label="时间" prop="time"></s-table-column>
          <s-table-column label="操作" v-if="notShowVcr" width="100">
            <template slot-scope="scope">
              <i class="iconfont icon-vcr" @click="vcrAction(scope.row)" title="键盘定位回放"></i>
            </template>
          </s-table-column>
        </s-table-page>
        </s-tab-pane>
        <s-tab-pane label="会话属性">
          <s-row><span class="title"><i class="iconfont icon-tag"></i>基本信息</span></s-row>
          <s-table :data="param.userDetail">
            <s-table-column label="会话ID" prop="sessionId"></s-table-column>
            <s-table-column label="协议" prop="protocolName" show-overflow-tooltip></s-table-column>
            <s-table-column label="访问日期" prop="createTime" width="180px"></s-table-column>
            <s-table-column label="时长" prop="sessionTimeLongView" width="100px"></s-table-column>
            <s-table-column label="流量（字节）" prop="sessionFlow"></s-table-column>
            <s-table-column label="命令数" prop="cmdNum"></s-table-column>
            <s-table-column label="告警数" prop="alertCnt"></s-table-column>
            <s-table-column label="命令阻断数" prop="cmdBlockCnt" width="120px"></s-table-column>
            <s-table-column label="会话阻断数" prop="sessionBlockCnt" width="120px"></s-table-column>
          </s-table>
          <s-row><span class="title"><i class="iconfont icon-tag"></i>操作端信息</span></s-row>
          <s-table :data="param.userDetail">
            <s-table-column label="操作人" prop="userLoginName"></s-table-column>
            <s-table-column label="客户端IP" prop="sessionClientIp"></s-table-column>
          </s-table>
          <s-row><span class="title"><i class="iconfont icon-tag"></i>资产端信息</span></s-row>
          <s-table :data="param.userDetail">
            <s-table-column label="目标资产IP" prop="deviceIp"></s-table-column>
            <s-table-column label="端口" prop="port"></s-table-column>
            <s-table-column label="账号名" prop="accountName"></s-table-column>
          </s-table>
          <s-row><span class="title"><i class="iconfont icon-tag"></i>其他</span></s-row>
          <s-table :data="param.userDetail">
            <s-table-column label="审核状态">
              <template slot-scope="scope">
                <div v-if="scope.row.sessionAuditResult === 1">合规</div>
                <div v-else-if="scope.row.sessionAuditResult === 2">违规</div>
                <div v-else>未审核</div>
              </template>
            </s-table-column>
            <s-table-column label="审核批注" prop="sessionAuditRemark"></s-table-column>
            <s-table-column label="会话类型" prop="sessionTypeUuid"></s-table-column>
            <s-table-column label="运维号" prop="sessionOpnumber"></s-table-column>
          </s-table>
        </s-tab-pane>
        <s-tab-pane v-if="param.showTab" label="剪贴板审计">
          <s-table-page
            :data="param.clip"

            :header-search='getListSearchDef()'
            :row-actions='getListRowActionsDef1()'>
            <s-table-column label="会话ID" width="80px">
              <template slot-scope="scope">
                <div>{{param.talkId}}</div>
              </template>
            </s-table-column>
            <s-table-column label="类型" width="80px">
              <template slot-scope="scope">
                <div v-if="scope.row.clipboardDirection === 0">拷贝</div>
                <div v-else="scope.row.clipboardDirection === 1">粘贴</div>
              </template>
            </s-table-column>
            <s-table-column label="文件名称" prop="clipboardName" width="200px" show-overflow-tooltip></s-table-column>
            <s-table-column label="文件内容" prop="clipboardCnt" show-overflow-tooltip></s-table-column>
            <s-table-column label="存储时间" prop="createTime" width="180px"></s-table-column>
            <s-table-column label="查看详情">
              <template slot-scope="scope">
                <div class="check" @click="clipCheck(scope.row.clipboardName)">查看</div>
              </template>
            </s-table-column>
          </s-table-page>
        </s-tab-pane>
        <s-tab-pane v-if="param.showTab" label="标题审计">
          <s-table-page
            :data="param.title"

            :header-search='getListSearchDef()'
            :row-actions='getListRowActionsDef2()'>
            <s-table-column label="会话ID" width="80px">
              <template slot-scope="scope">
                <div>{{param.talkId}}</div>
              </template>
            </s-table-column>
            <s-table-column label="标题内容" prop="titleText" width="600px" show-overflow-tooltip></s-table-column>
            <s-table-column label="操作时间" prop="createTime" width="180px"></s-table-column>
          </s-table-page>
        </s-tab-pane>
        <s-tab-pane v-if="param.showTab" label="鼠标审计">
          <s-table-page
            :data="param.mouse"

            :header-search='{show: false}'
            :row-actions='getListRowActionsDef3()'>
            <s-table-column label="点击时间" prop="createTime"></s-table-column>
            <s-table-column label="按键类型">
              <template slot-scope="scope">
                <div v-if="scope.row.commandClick === 4096">左键</div>
                <div v-else-if="scope.row.commandClick === 8192">右键</div>
                <div v-else>中键</div>
              </template>
            </s-table-column>
            <s-table-column label="位置坐标" prop="commandPos"></s-table-column>
          </s-table-page>
        </s-tab-pane>
        <s-tab-pane v-if="param.showTab" label="缩略图审计">
          <s-button icon="layout" v-if="param.bitmap.length > 0" @click="changeImgSize"></s-button>
          <div v-else style="text-align: center">无缩略图</div>
          <div v-for="item in param.bitmap">
            <div class="processmanage-img">
              <img v-if="imgResize === false" :src="item.bmpPath + '/' + item.originalBmp" alt="缩略图">
              <img v-else :src="item.bmpPath + '/' + item.resizeBmp" alt="缩略图">
              <span style="font-size: 12px;">{{item.createTime}}</span>
            </div>
          </div>
        </s-tab-pane>
      </s-tab>
    </s-scrollbar>
  </section>
</template>
<script>

  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default{
    components: {

      // Download
    },
    data() {
      return {
        exportType: 'word',              // 导出类型
        exportContentChecked: [],   // 导出内容选中列表
        imgResize: false
        // protocolType1: ['SSH', 'TELNET', 'FTP', 'SFTP', 'ORACLE', 'DB2', 'INFORMIX', 'MYSQL', 'SQLSERVER', 'SYBASE', 'NETTERM TELNET'],
        // protocolType2: ['RDP', 'cspsclient', 'easyView', 'smartDashBoard', 'web', 'postgreAdmin', 'mssqlserver', 'plsql', 'radmin', 'sqlyog', 'vmwareVsphereClient5.5', 'mysqlfront', 'nsm', 'toadoracle', 'vmwareVsphereClient5.0', 'vncviewer', 'vmwareVsphereClient6.0', 'xwin']
      }
    },
    // props: ['session', 'user', 'clip', 'title', 'mouse', 'talkId', 'protocolType'],
    props: ['param', 'notShowVcr'],
    methods: {
      getListSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询内容'
        }
      },
      vcrAction(row) { // 键盘定位回放
          // /operationLogStat/videoReplay/{sessionUuid}/{type}/{extendUuid}
          $axios.get(`/operationLogStat/videoReplay/${row.session_uuid}/cmd/${row.uuid}`).then((res) => {
            if (res.data.indexOf('ssi') > -1) {
              window.location.href = res.data.substring(8);
            }
          });
      },
      getListRowActionsDef1() {
        let def = [{
          name: '播放',
          icon: 'vcr',
          click(row) {
            $axios.get(`/operationLogStat/videoReplay/${row.sessionUuid}/clipboard/${row.uuid}`).then((res) => {
              if (res.data.indexOf('ssi') > -1) {
                window.location.href = res.data.substring(8);
              }
            });
          }
        }]
        return def
      },
      getListRowActionsDef2() {
        let def = [{
          name: '播放',
          icon: 'vcr',
          click(row) {
            $axios.get(`/operationLogStat/videoReplay/${row.sessionUuid}/title/${row.uuid}`).then((res) => {
              if (res.data.indexOf('ssi') > -1) {
                window.location.href = res.data.substring(8);
              }
            });
          }
        }]
        return def
      },
      getListRowActionsDef3() {
        let def = [{
          name: '播放',
          icon: 'vcr',
          click(row) {
            $axios.get(`/operationLogStat/videoReplay/${row.sessionUuid}/mouse/${row.uuid}`).then((res) => {
              if (res.data.indexOf('ssi') > -1) {
                window.location.href = res.data.substring(8);
              }
            });
          }
        }]
        return def
      },
      changeImgSize() {
        this.imgResize = !this.imgResize;
      },
      clipCheck(val) {
        this.$emit('setClip', val)
      },
      exportContent() {
        if (this.exportContentChecked.length > 0) {
          Download(`/operationLogStat/exportSessionInfo/${this.param.uuid}/${this.exportType}/${this.exportContentChecked}?t=${new Date().getTime()}`);
        } else {
          this.$message('请选择要导出的内容');
        }
      }
    },
    created() {
    }
  }
</script>
