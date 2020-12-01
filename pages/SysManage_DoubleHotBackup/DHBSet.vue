/*
create by YOU
*/
<template>
  <s-form v-if="isRealIP" ref="form" :model="form" :rules="rules"
          label-width="100px">
    <s-form-item label="主机IP地址" prop="nginxMasterIp">
      <s-input v-model="form.nginxMasterIp" style="width:620px"></s-input>
    </s-form-item>
    <s-form-item label="备机IP地址" prop="nginxBackupIp">
      <s-input v-model="form.nginxBackupIp" style="width:620px"></s-input>
    </s-form-item>
    <s-form-item label="浮动IP地址" prop="nginxVip">
      <s-input v-model="form.nginxVip" style="width:620px"></s-input>
    </s-form-item>
    <s-form-item label="主状态" prop="masterStatus">
      <s-select style="width: 200px" v-model="form.masterStatus">
        <s-option label="激活" :value="1"></s-option>
        <s-option label="未激活" :value="0"></s-option>
      </s-select>
    </s-form-item>


    <s-form-item label="从状态" prop="backupStatus">
      <s-select style="width: 200px" v-model="form.backupStatus">
        <s-option label="激活" :value="1"></s-option>
        <s-option label="未激活" :value="0"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="备注" prop="floatMysqlIP">
      <s-input type="textarea" v-model="form.mark" style="width:620px"></s-input>
    </s-form-item>
    <s-form-item>
      <s-button :disabled="saving" @click="save">保存<span v-show="saving">中...</span></s-button>
      <s-button v-if="canRestart" @click="reboot">立即重启</s-button>
    </s-form-item>
  </s-form>
  <s-form v-else ref="form" :model="form"
          label-width="200px">
    <s-form-item label="主机Nginx服务IP地址" prop="nginxMasterIp">
      <s-input disabled v-model="form.nginxMasterIp" style="width:620px"></s-input>
    </s-form-item>
    <s-form-item label="备机Nginx服务IP地址" prop="nginxBackupIp">
      <s-input disabled v-model="form.nginxBackupIp" style="width:620px"></s-input>
    </s-form-item>
    <s-form-item label="浮动Nginx服务IP地址" prop="nginxVip">
      <s-input disabled v-model="form.nginxVip" style="width:620px"></s-input>
    </s-form-item>
    <!--<s-form-item label="浮动Tomcat服务IP地址" prop="tomcatVip">-->
      <!--<s-input disabled v-model="form.tomcatVip"></s-input>-->
    <!--</s-form-item>-->
    <!--<s-form-item label="浮动Mysql服务IP地址" prop="mysqlVip">-->
      <!--<s-input disabled v-model="form.mysqlVip"></s-input>-->
    <!--</s-form-item>-->
    <!--<s-form-item label="浮动MongoDB服务IP地址" prop="mongodbVip">-->
      <!--<s-input disabled v-model="form.mongodbVip"></s-input>-->
    <!--</s-form-item>-->
    <!--<s-form-item label="浮动zookeeper服务IP地址" prop="zookeeperVip">-->
      <!--<s-input disabled v-model="form.zookeeperVip"></s-input>-->
    <!--</s-form-item>-->
    <!--<s-form-item label="浮动RabbitMQ服务IP地址" prop="rabbitmqVip">-->
      <!--<s-input disabled v-model="form.rabbitmqVip"></s-input>-->
    <!--</s-form-item>-->
    <!--<s-form-item label="浮动Memcache服务IP地址" prop="memcachedVip">-->
      <!--<s-input disabled v-model="form.memcachedVip"></s-input>-->
    <!--</s-form-item>-->
    <!--<s-form-item label="浮动DBACenter服务IP地址" prop="dbacenterVip">-->
      <!--<s-input disabled v-model="form.dbacenterVip"></s-input>-->
    <!--</s-form-item>-->
    <s-form-item label="主状态" prop="masterStatus">
      <s-select disabled style="width: 200px" v-model="form.masterStatus" placeholder="未设置">
        <s-option label="激活" :value="1"></s-option>
        <s-option label="未激活" :value="0"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="从状态" prop="backupStatus">
      <s-select disabled style="width: 200px" v-model="form.backupStatus" placeholder="未设置">
        <s-option label="激活" :value="1"></s-option>
        <s-option label="未激活" :value="0"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="备注" prop="floatMysqlIP">
      <s-input disabled type="textarea" v-model="form.mark" style="width:620px"></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import {Validaters} from 'sunflower-common-utils';
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        form: {
          nginxMasterIp: '',
          nginxBackupIp: '',
          nginxVip: '',
//          tomcatVip: '',
//          mysqlVip: '',
//          mongodbVip: '',
//          zookeeperVip: '',
//          rabbitmqVip: '',
//          memcachedVip: '',
//          dbacenterVip: '',
          masterStatus: '',
          backupStatus: '',
//          isMaster: 1,
//          isActive: 1,
          mark: ''
        },
        rules: {
          nginxMasterIp: [Validaters.NotNull, Validaters.IP],
          nginxBackupIp: [Validaters.NotNull, Validaters.IP],
          nginxVip: [Validaters.NotNull, Validaters.IP],
//          tomcatVip: [Validaters.NotNull, Validaters.IP],
//          mysqlVip: [Validaters.NotNull, Validaters.IP],
//          mongodbVip: [Validaters.NotNull, Validaters.IP],
//          zookeeperVip: [Validaters.NotNull, Validaters.IP],
//          rabbitmqVip: [Validaters.NotNull, Validaters.IP],
//          memcachedVip: [Validaters.NotNull, Validaters.IP],
//          dbacenterVip: [Validaters.NotNull, Validaters.IP],
          masterStatus: [Validaters.NotNull],
          backupStatus: [Validaters.NotNull]
        },
        canRestart: false,
        saving: false,
        message(data, type) {
          type = type || 'success'
          this.$message[type](data)
        }
      }
    },
    props: {
      isRealIP: true
    },
    created() {
      this.init()
    },
    beforeDestroy() {
      this.message = () => {}
    },
    methods: {
      init() {
        if (!this.isRealIP) {
          this.rules = {}
        }
        $axios.get('/systemmanager/sysConfig/getHaSet').then(({data}) => {
          if (data) {
            this.form = data
          }
        })
      },
      save() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.saving = true
            $axios.post('/systemmanager/sysConfig/saveHaSet', this.form, {
              timeout: 300000
            }, {
              logTemplate: '设置|双机热备设置'
            }).then(({data}) => {
              this.saving = false
              this.message = this.message || (() => {})
              if (data === true) {
                this.message('保存成功')
                this.canRestart = true
              } else {
                this.message('保存失败', 'error')
              }
            })
          }
        })
      },
      reboot() {
        this.$confirm('确定重启?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get('/systemmanager/sysConfig/reboot').then(({data}) => {
            if (data === false) {
              this.$message.error('重启失败')
            }
          })
        }).catch(() => {});
      }
    }
  };
</script>
