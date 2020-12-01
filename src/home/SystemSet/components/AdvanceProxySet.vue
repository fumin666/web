<template>
    <section class="clearfix">
        <s-scrollbar warp-style="max-height:450px">
            <s-tab>
                <s-tab-pane
                  label="性能监控配置">
                  <div class="clearfix">
                      <s-form :model="performanceData" :rules="rules" ref="performanceData">
                          <div class="contain1 clearfix">
                              <span>暂停审计</span>
                                  <div class="condition">
                                      <div class="check1">
                                          <s-checkbox v-model="pauseCheck">达到以下条件暂停审计</s-checkbox>
                                      </div>
                                      <div class="check1">
                                          <s-form-item style="display:inline-block; width:130px" label="连续" prop="heavy_duration">
                                              <s-input v-model="performanceData.heavy_duration" :disabled="!pauseCheck" class="inputnum" type="number"></s-input>
                                          </s-form-item>
                                          <s-form-item style="display:inline-block; width:240px" label="分钟，CPU占有率超过" prop="heavy_threshold">
                                              <s-input v-model="performanceData.heavy_threshold" :disabled="!pauseCheck" class="inputnum" type="number"></s-input>
                                          </s-form-item>
                                          <s-form-item style="display:inline-block; width:20px">
                                              <p>%</p>
                                          </s-form-item>
                                      </div>
                                  </div>
                          </div>
                          <div class="contain1 clearfix">
                              <span>恢复审计</span>
                                  <div class="condition">
                                      <div class="check1">
                                          <s-checkbox v-model="recoveryCheck">达到以下条件恢复审计</s-checkbox>
                                      </div>
                                      <div class="check1">
                                          <s-form-item style="display:inline-block; width:130px" label="连续" prop="light_duration">
                                              <s-input v-model="performanceData.light_duration" :disabled="!recoveryCheck" class="inputnum" type="number"></s-input>
                                          </s-form-item>
                                          <s-form-item style="display:inline-block; width:240px" label="分钟，CPU占有率低于" prop="light_threshold">
                                              <s-input v-model="performanceData.light_threshold" :disabled="!recoveryCheck" class="inputnum" type="number"></s-input>
                                          </s-form-item>
                                          <s-form-item style="display:inline-block; width:20px">
                                              <p>%</p>
                                          </s-form-item>
                                      </div>
                                  </div>
                          </div>
                      </s-form>
                  </div>
                  <div class="floatright footer">
                    <s-button @click="savePerformance(rowData, 'performanceData')">保存</s-button>
                  </div>
                </s-tab-pane>
                <s-tab-pane
                  label="数据接口配置">
                  <div>
                    <p style="margin-bottom:5px"><span class="iconfont icon-info"></span>&nbsp;&nbsp;数据接口</p>
                    <s-table-page :data="interfaceInfo">
                        <s-table-column
                          prop="ifName"
                          label="接口名称"
                          width='100'
                          show-over-tooltip>
                        </s-table-column>
                        <s-table-column
                          prop="ifAttr"
                          label="接口属性"
                          width='370'
                          show-over-tooltip>
                        </s-table-column>
                        <s-table-column
                          label="监控状态">
                            <template slot-scope="scope">
                                <s-switch v-model="scope.row.monit" size="small" @change="changeMonit(scope.row)"></s-switch>
                            </template>
                        </s-table-column>
                    </s-table-page>
                  </div>
                  <div class="bottomcontent clearfix">
                    <p style="margin-bottom: 20px"><span class="iconfont icon-position"></span>&nbsp;&nbsp;例外地址</p>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;IP地址</span>
                    <div class="floatright inputip">
                        <div class="floatright">
                            <s-button @click="add('addIp')">添加</s-button>
                        </div>
                        <div class="floatright">
                            <s-form :model="addIp" :rules="rules2" ref="addIp">
                                <s-form-item prop="addExceptIp">
                                    <s-input v-model="addIp.addExceptIp" class="addinput"></s-input>
                                </s-form-item>
                            </s-form>
                        </div>
                    </div>
                    <div class="iplist">
                     <s-table-page :data="formatExceptIpData"
                               :hasActionCol='false'
                               :paginationShow='false'
                               :show-header='false'
                               width="450px">
                        <s-table-column
                          prop="ip"
                          show-over-tooltip
                          >
                        </s-table-column>
                        <s-table-column
                          align="right"
                          show-over-tooltip>
                            <template slot-scope="scope">
                                <i class="iconfont icon-error" @click="deleteExceptIp(scope.row)"></i>
                            </template>
                        </s-table-column>
                    </s-table-page>
                    </div>
                  </div>
                  <div class="floatright footer">
                    <s-button @click="saveDataStatus()">保存</s-button>
                </div>
                </s-tab-pane>
            </s-tab>
        </s-scrollbar>
    </section>
</template>
<script>
  import $axios from 'sunflower-ajax'

  export default {
    data() {
        let checkDurtation = (rule, value, callback) => {
            if (value.match(/^[0-9]*$/) === null) {
                return callback(new Error('请输入大于0的整数'))
            }
            if (!value) {
                return callback(new Error('请输入要修改的数据'))
            }
            callback();
        }
        let checkThreshold = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入要修改的数据'))
            }
            if (value.match(/^(?:[1-9]?\d|100)$/) === null) {
                return callback(new Error('请输入大于0小于100的数字'))
            }
            callback();
        }
        let checkIp = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入要添加的IP'))
            }
            var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            if (!reg.test(value)) {
                return callback(new Error('请输入正确的IP格式'))
            }
            callback();
        }
      return {
          pauseCheck: false,
          recoveryCheck: false,
          formatExceptIpData: [], // 格式化之后的例外ip
          addIp: {}, // 添加的ip
          performanceData: {}, // 性能监控配置数据
          exceptIp: [], // 例外ip地址
          rules: { // 性能监控内容填写规则
              heavy_duration: [
                  { validator: checkDurtation }
              ],
              heavy_threshold: [
                  { validator: checkThreshold }
              ],
              light_duration: [
                  { validator: checkDurtation }
              ],
              light_threshold: [
                  { validator: checkThreshold }
              ]
          },
          rules2: { // ip地址填写规则
              addExceptIp: [
                  { validator: checkIp }
              ]
          }
      }
    },
    props: ['interfaceInfo', 'rowData'],
    methods: {
        // 改变监控状态
        changeMonit(row) {
            let monit = row.monit === true ? 'start' : 'stop'
            $axios.post(`/proxyManager/chgDataStatus/${row.ifId}/${monit}`).then(({data}) => {
                if (!data.state) {
                    row.monit = !row.monit
                    this.$message.error('失败，请重试')
                } else {
                    if (row.monit === true) {
                        this.$message.success('开启监控成功')
                    } else {
                        this.$message.success('关闭监控成功')
                    }
                }
            })
        },
        // 将获取到的例外ip转换为对象数组
        formatExceptIp() {
            $axios.get(`/proxyManager/getExceptIpList/${this.rowData.id}`).then(({data}) => {
                this.exceptIp = data
                for (let i = 0; i < this.exceptIp.length; i++) {
                    this.formatExceptIpData.push({ip: this.exceptIp[i]})
                }
            })
        },
        // 将输入的ip添加到展示表格中
        add(addIp) {
            this.$refs[addIp].validate((valid) => {
                if (valid) {
                    this.exceptIp.push(this.addIp.addExceptIp)
                    this.formatExceptIpData.push({ip: this.addIp.addExceptIp})
                    this.addIp.addExceptIp = ''
                    this.$refs[addIp].resetFields();
                }
            })
        },
        // 删除已有的例外ip地址
        deleteExceptIp(row) {
            let i = this.exceptIp.indexOf(row.ip);
            if (i !== -1) {
                this.exceptIp.splice(i, 1)
                this.formatExceptIpData.splice(i, 1)
            }
        },
        // 保存性能监控配置
        savePerformance(row, performanceData) {
            let pause = this.pauseCheck === false ? '2' : '1'
            let resume = this.recoveryCheck === false ? '2' : '1'
            this.$refs[performanceData].validate((valid) => {
                if (valid) {
                    $axios.post(`/proxyManager/uptPerformance/${this.rowData.id}`, {heavy_threshold: this.performanceData.heavy_threshold, heavy_duration: this.performanceData.heavy_duration, light_duration: this.performanceData.light_duration, light_threshold: this.performanceData.light_threshold, pause_on_heavy: pause, resume_on_light: resume}).then(({data}) => {
                        if (data.state) {
                            this.$message.success('保存配置成功')
                        } else {
                            this.$message.error('保存配置失败')
                        }
                        this.$emit('colseSet')
                    })
                }
            })
        },
        // 保存例外ip地址
        saveDataStatus() {
            $axios.post(`/proxyManager/chgIpList/${this.rowData.id}`, this.exceptIp, {headers: {'Content-Type': 'application/json'}}).then(({data}) => {
                if (data.state) {
                    this.$message.success('保存例外地址成功')
                } else {
                    this.$message.error('保存例外地址失败')
                }
                this.$emit('colseSet')
            })
        },
        // 初始化数据
        getInitData() {
            $axios.get(`/proxyManager/getPerformance/${this.rowData.id}`).then(({data}) => {
                this.performanceData = data
                if (this.performanceData.pause_on_heavy === '1') {
                    this.pauseCheck = true
                } else {
                    this.pauseCheck = false
                }
                if (this.performanceData.resume_on_light === '1') {
                    this.recoveryCheck = true
                } else {
                    this.recovery = false
                }
            })
        }
    },
    created() {
        this.getInitData()
        this.formatExceptIp()
    }
  }
</script>


<style scoped>
.inputnum {
    width: 65px;
    height: 20px;
    margin-left: 5px;
}
.bottomcontent {
    margin-top: 15px
}
.condition {
    margin-right: 170px;
    width: 300px;
    float: right;
}
.floatright {
    float: right;
}
.inputip {
    margin-top: -4px;
}
.iplist {
    width: 400px;
    float: right;
    margin-right: 64px;
    margin-top: 5px;
}
.title {
    margin: 10px;
    padding: 0;
    width: 60px;
}
 .clearfix:before,
   .clearfix:after {
      content:"";
      display:table;
   }
   .clearfix:after {
     clear:both;
     overflow:hidden;
   }
  .clearfix {
     zoom:1; /* IE < 8 */
  }
.check {
    height: 40px;
}
.contain1 {
    margin-bottom: 30px;
}
.addinput {
    width: 400px;
    margin-right: 10px
}
.footer {
    margin-top: 20px;
    margin-bottom: 10px;
}
.check1 {
    width: 600px
}
</style>

