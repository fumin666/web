<template>
  <div class="sysSet">
    <s-form ref="sysData" :model='Sysform' :rules="SysRule">
      <div style="font-size:14px;font-weight:600;margin:10px 0"><i class="icon iconfont icon-set"></i> 通信属性</div>
      <s-row>
        <s-col :span="12" class="grid-content bg-purple"><div class="setFont required-tips"><span>服务器地址</span></div></s-col>
        <s-col :span="12" class="grid-content bg-purple-light">
          <s-form-item  prop="ip">
            <s-input v-model="Sysform.ip" style="width:190px"></s-input>
          </s-form-item>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="12" class="grid-content bg-purple"><div class="setFont required-tips"> <span>端口</span></div></s-col>
        <s-col :span="12" class="grid-content bg-purple-light">
          <s-form-item prop="port">
            <s-input v-model="Sysform.port" style="width:190px" ></s-input>
          </s-form-item>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="12" class="grid-content bg-purple"><div class="setFont required-tips"><span>通信协议</span></div></s-col>
        <s-col :span="12" class="grid-content bg-purple-light">
          <s-form-item prop="protocalType">
            <s-select v-model="Sysform.protocalType" clearable>
              <s-option label='TCP' :value='1'></s-option>
              <s-option label='UDP' :value='0'></s-option>
            </s-select>
          </s-form-item>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="12" class="grid-content bg-purple"><div class="setFont required-tips"><span>状态</span></div></s-col>
        <s-col :span="12" class="grid-content bg-purple-light">
          <s-form-item prop="status">
            <s-select v-model="Sysform.status" >
              <s-option label='激活' :value='1'></s-option>
              <s-option label='未激活' :value='0'></s-option>
            </s-select>
          </s-form-item>
        </s-col>
      </s-row>
      <div style="font-size:14px;font-weight:600;margin:10px 0"><i class="icon iconfont icon-set"></i> 日志属性</div>
      <s-row>
        <s-col :span="12" class="grid-content bg-purple"><div class="setFont required-tips"><span>日志类型</span></div></s-col>
        <s-col :span="12" class="grid-content bg-purple-light">
          <s-form-item prop="logType">
            <s-select v-model="Sysform.logType">
              <s-option :value='val.valueInt' :label='val.name' v-for=" (val,index) in sysLogData" :key='index'></s-option>
            </s-select>
          </s-form-item>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="12" class="grid-content bg-purple"><div class="setFont">日志级别</div></s-col>
        <s-col :span="12" class="grid-content bg-purple-light">
          <s-form-item prop="logAttrList">
            <s-checkbox-group v-model="Sysform.logAttrList">
              <s-checkbox v-for="(val,index) in SysType" :key="index" :label="val.name"></s-checkbox>
            </s-checkbox-group>
          </s-form-item>
        </s-col>
      </s-row>
    </s-form>
    <s-row style="text-align: center;margin-top:10px">
      <s-button @click="submitForm">保存</s-button>
    </s-row>
  </div>

</template>
<style lang="stylus">
.sysSet
  width: 60%
  .setFont
    float right
    font-size 14px
  .s-form-item
      margin-bottom: 0;
    .s-form-item-content
      .s-form-item-error
          top: 40%;
          left: 196px;
</style>
<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import { Validaters } from 'sunflower-common-utils';
  export default {
    components: {
    },
    data() {
      return {
        Sysform: {
          uuid: null,
          ip: null,
          port: null,
          protocalType: null,
          status: 1,
          logType: null,
          logAttrList: []
        },
        sysLogData: [],
        SysRule: {
          protocalType: [Validaters.SelectValNotNull],
          logType: [Validaters.SelectValNotNull],
          status: [Validaters.SelectValNotNull],
          ip: [Validaters.IP, Validaters.NotNull],
          port: [ Validaters.MaxNum(65535), Validaters.MinNum(1), Validaters.NotNull, Validaters.Number ]
        },
        SysType: []
      }
    },
    created() {
      this.getList()
      $axios.get('/sysSyslog/getLogTypeList').then((res) => {
          this.sysLogData = res.data
        })
    },
    methods: {
      getList() {
        $axios.get('/sysSyslog/getSyslogInfo').then((res) => {
          this.Sysform = res.data
          this.SysType = res.data.logAttrList
          let arr = []
          res.data.logAttrList.map(val => {
            if (val.valueInt === 1) {
              arr.push(val.name)
            }
            return arr
          })
          this.Sysform.logAttrList = arr
        })
      },
      submitForm() {
        this.$refs['sysData'].validate((valid) => {
          if (valid) {
            let parms = {
              ip: this.Sysform.ip,
              port: this.Sysform.port,
              protocalType: this.Sysform.protocalType,
              status: this.Sysform.status,
              logType: this.Sysform.logType,
              attrs: this.Sysform.logAttrList
            }
            $axios.post('/sysSyslog/saveSyslogSetting', parms).then((res) => {
              if (res.data.state) {
                this.$message({message: res.data.errormsg, type: 'success'});
                this.getList()
              } else {
                this.$message({message: res.data.errormsg, type: 'error'});
              }
            })
          }
        });
      }
    }
  }
</script>
<style lang="stylus">
  .sysSet
    .required-tips
      span
        &:before
          content: "*"!important;
          color: #f51131;
          margin-right: 4px;
</style>
