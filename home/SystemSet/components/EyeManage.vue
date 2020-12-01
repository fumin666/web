<template>
    <section>
        <s-scrollbar warp-style="max-height:450px;">
            <s-tab label="代理">
                <p style="margin-bottom:10px; font-size:15px;"> <span class="iconfont icon-info"></span> 代理信息</p>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">代理名称</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.name">{{rowData.agent_info.name}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.name === ''">无</div>
                      </s-col>
                  </s-row>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">代理IP</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.ip">{{rowData.agent_info.ip}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.ip === ''">无</div>
                      </s-col>
                  </s-row>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">代理SSID</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.ssid">{{rowData.agent_info.ssid}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.ssid === ''">无</div>
                      </s-col>
                  </s-row>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">代理状态</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.online">{{rowData.agent_info.online}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.online === ''">无</div>
                      </s-col>
                  </s-row>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">服务状态</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.service_status">{{rowData.agent_info.service_status}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.service_status === ''">无</div>
                      </s-col>
                  </s-row>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">代理版本</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.version">{{rowData.agent_info.version}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.version">无</div>
                      </s-col>
                  </s-row>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">审计引擎</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.engine_ip">{{rowData.agent_info.engine_ip}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.engine_ip">无</div>
                      </s-col>
                  </s-row>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">代理启动时间</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.startup_time">{{rowData.agent_info.startup_time}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.startup_time">无</div>
                      </s-col>
                  </s-row>
                  <s-row>
                      <s-col :span="10">
                          <div class="grid-content bg-purple">备注</div>
                      </s-col>
                      <s-col :span="14">
                          <div class="grid-content bg-purple-light" v-if="rowData.agent_info.remarks">{{rowData.agent_info.remarks}}</div>
                          <div class="grid-content bg-purple-light" v-if="!rowData.agent_info.remarks">无</div>
                      </s-col>
                  </s-row>
            </s-tab>
            <s-tab>
                <p style="margin-bottom:10px; font-size:15px;"> <span class="iconfont icon-info"></span> 主机信息</p>
                <s-row>
                    <s-col :span="10">
                        <div class="grid-content bg-purple">主机名称</div>
                    </s-col>
                    <s-col :span="14">
                        <div class="grid-content bg-purple-light" v-if="rowData.agent_status.host">{{rowData.agent_status.host}}</div>
                        <div class="grid-content bg-purple-light" v-if="!rowData.agent_status.host">无</div>
                    </s-col>
                </s-row>
                <s-row>
                    <s-col :span="10">
                        <div class="grid-content bg-purple">系统时间</div>
                    </s-col>
                    <s-col :span="14">
                        <div class="grid-content bg-purple-light" v-if="rowData.agent_status.system_time">{{rowData.agent_status.system_time}}</div>
                        <div class="grid-content bg-purple-light" v-if="!rowData.agent_status.system_time">无</div>
                    </s-col>
                </s-row>
                <s-row>
                    <s-col :span="10">
                        <div class="grid-content bg-purple">操作系统</div>
                    </s-col>
                    <s-col :span="14">
                        <div class="grid-content bg-purple-light" v-if="rowData.agent_status.os">{{rowData.agent_status.os}}</div>
                        <div class="grid-content bg-purple-light" v-if="!rowData.agent_status.os">无</div>
                    </s-col>
                </s-row>
                <s-row>
                    <s-col :span="10">
                        <div class="grid-content bg-purple">系统平台</div>
                    </s-col>
                    <s-col :span="14">
                        <div class="grid-content bg-purple-light" v-if="rowData.agent_status.platform">{{rowData.agent_status.platform}}</div>
                        <div class="grid-content bg-purple-light" v-if="!rowData.agent_status.platform">无</div>
                    </s-col>
                </s-row>
                <s-row>
                    <s-col :span="10">
                        <div class="grid-content bg-purple">CPU使用率</div>
                    </s-col>
                    <s-col :span="14">
                        <div class="grid-content bg-purple-light cpuclass" style="overflow:hidden; padding-right:0px" v-if="rowData.agent_status.cpu_usage">
                            <div class="progress">
                                <s-progress :text-inside="true" :stroke-width="20" :percentage="rowData.agent_status.cpu_usage" status="warning"></s-progress>
                            </div>
                            <div class="cpumessage">CPU核数&nbsp;:&nbsp;{{rowData.agent_status.cpu_cores}}核</div>
                        </div>
                        
                        <div class="grid-content bg-purple-light" v-if="!rowData.agent_status.cpu_usage">无</div>
                    </s-col>
                </s-row>
                <s-row>
                    <s-col :span="10">
                        <div class="grid-content bg-purple">内存使用率</div>
                    </s-col>
                    <s-col :span="14" >
                          <div class="grid-content bg-purple-light cpuclass" style="overflow:hidden;" v-if="rowData.agent_status.mem_used_ratio">
                            <div class="progress">
                                <s-progress :text-inside="true" :stroke-width="20" :percentage="rowData.agent_status.mem_used_ratio" status="error"></s-progress>
                            </div>
                            <div class="cpumessage">使用&nbsp;:&nbsp;{{rowData.agent_status.mem_used}}G,内存总量&nbsp;:{{rowData.agent_status.mem_total}}G</div>
                        </div>
                        <div class="grid-content bg-purple-light" v-if="!rowData.agent_status.mem_used_ratio">无</div>
                    </s-col>
                </s-row>
            </s-tab>
        </s-scrollbar>
    </section>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    props: ['rowData'],
    methods: {
        // 时间戳转换
        getTime(timeStamp) {
            let time = new Date(timeStamp * 1000);
            let year = time.getFullYear();
            let monthStr = String(time.getMonth() + 1);
            let month = monthStr.length === 1 ? '0' + monthStr : monthStr;
            let dateStr = String(time.getDate());
            let date = dateStr.length === 1 ? '0' + dateStr : dateStr;
            let hourStr = String(time.getHours());
            let hour = hourStr.length === 1 ? '0' + hourStr : hourStr;
            let minuteStr = String(time.getMinutes());
            let minute = minuteStr.length === 1 ? '0' + minuteStr : minuteStr;
            let secondStr = String(time.getSeconds());
            let second = secondStr.length === 1 ? '0' + secondStr : secondStr;
            return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
        },
        handleData() {
            this.rowData.agent_info.service_status = this.rowData.agent_info.service_status === 1 ? '已停止' : '进行中'
            this.rowData.agent_info.online = this.rowData.agent_info.online === 0 ? '离线' : '在线'
            this.rowData.agent_status.mem_used = (this.rowData.agent_status.mem_used / 1000 / 1024 / 1024).toFixed(2)
            this.rowData.agent_status.mem_total = (this.rowData.agent_status.mem_total / 1000 / 1024 / 1024).toFixed(2)
            this.rowData.agent_status.system_time = this.getTime(this.rowData.agent_status.system_time)
            this.rowData.agent_info.startup_time = this.getTime(this.rowData.agent_info.startup_time)
        }
    },
    created() {
        this.handleData()
    }
}
</script>

<style>
.cpuclass{
    display: flex;
    flex-direction: row;
}
.progress {
    width: 100px;
    margin-top: 7px;
    padding:0px; 
}
.s-progress-bar{
    width: 100%
}
.cpumessage{
    margin-left: 10px;
}

</style>

