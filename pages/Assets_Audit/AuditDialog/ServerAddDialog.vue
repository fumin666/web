<template>
  <div>
    <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑' : '添加'" width="700px" class="serverAddDialog">
      <s-tab v-model="activeTab">
        <s-tab-pane label="基本信息" class="baseTab">
          <s-scrollbar wrap-class="serverAddScrollbar">
            <s-form :model="serverForm1" :rules="serverRules1" ref="serverForm1" label-width="120px">
              <s-form-item label="中间件系统">
                <s-select v-model="serverForm1.assetUuid" placeholder="请选择">
                  <s-option-group v-for="(group,index) in appOptions"
                                  :label="group.name" :key="group.name + index">
                    <s-option v-for="(item,index) in group.childrenList"
                              :label="item.name" :value="item.uuid" :key="item.name + index">
                    </s-option>
                  </s-option-group>
                </s-select>
              </s-form-item>
              <s-form-item label="协议">
                <s-select v-model="serverForm1.protocol" @visible-change="protocolShow" @change="protocolChange" value-key="uuid">
                  <s-option v-for="(option,index) in protocolOptions" :key="'protocol' + index"
                            :label="option.protocolName + '/' + option.port" :value="option"></s-option>
                </s-select>
              </s-form-item>
              <template v-if="serverForm1.protocol.protocolName === 'HTTP' || serverForm1.protocol.protocolName === 'HTTPS' || serverForm1.protocol.protocolName === '未知'">
                <s-form-item label="字符集">
                  <s-select v-model="serverForm1.charactercoll">
                    <s-option label="自动识别" value="AUTO"></s-option>
                    <s-option v-for="(option,index) in charsetOptions" :key="'charset' + index" :label="option" :value="option">
                    </s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="业务操作大小写">
                  <s-radio-group v-model="serverForm1.caseSensitive">
                    <s-radio :label="1">敏感</s-radio>
                    <s-radio :label="0">不敏感</s-radio>
                  </s-radio-group>
                </s-form-item>
                <s-form-item label="SSL" v-if="showSSL">
                  <s-radio-group v-model="serverForm1.sslEnabled">
                    <s-radio :label="1">是</s-radio>
                    <s-radio :label="0">否</s-radio>
                  </s-radio-group>
                </s-form-item>
                <template v-if="serverForm1.sslEnabled === 1">
                  <s-form-item label="文件类型">
                    <s-radio-group v-model="serverForm1.isPfx">
                      <s-radio :label="0">pem</s-radio>
                      <s-radio :label="1">pfx</s-radio>
                    </s-radio-group>
                  </s-form-item>
                  <s-form-item label="密钥文件">
                    <s-upload
                      ref="upload"
                      :action="upLoadUrl"
                      :on-success="uploadSuccess"
                      :before-upload="beforeUpload"
                      :on-remove="uploadRemove"
                      :on-error="uploadError"
                      :file-list="fileList">
                      <s-button slot="trigger">点击上传</s-button>
                    </s-upload>
                  </s-form-item>
                  <s-form-item label="文件密码">
                    <s-input v-model="serverForm1.privatekeyPasswd"></s-input>
                  </s-form-item>
                </template>
              </template>
              <s-form-item label="描述" prop="descr">
                <s-input v-model="serverForm1.descr" type="textarea" :rows="3"></s-input>
              </s-form-item>
            </s-form>
          </s-scrollbar>
        </s-tab-pane>
        <s-tab-pane label="数据库关联">
          <s-scrollbar wrap-class="serverAddScrollbar">
            <s-form :model="serverForm2" label-width="120px">
              <s-form-item label="数据库关联">
                <s-checkbox v-model="serverForm2.dbassocEnabled" :true-label="1" :false-label="0">启用业务与数据库关联分析</s-checkbox>
              </s-form-item>
              <template v-if="serverForm2.dbassocEnabled === 1">
                <s-form-item label="连接数据库IP">
                  <s-radio-group v-model="serverForm2.connectIpType">
                    <s-radio :label="0">不限</s-radio>
                    <s-radio :label="1">与应用服务器IP相同</s-radio>
                    <s-radio :label="2">下列IP</s-radio>
                    <s-radio :label="3">除下列IP外</s-radio>
                  </s-radio-group>
                </s-form-item>
                <s-form-item  v-show="serverForm2.connectIpType===2 || serverForm2.connectIpType === 3">
                  <s-col span="21">
                    <ul class="ipBox">
                      <li v-for="(item,index) in connectIpArr" :key="'ip' + index"
                          :class="{checked: item.checked}" @click="selectIp(item)">
                        {{item.ip}}
                      </li>
                    </ul>
                  </s-col>
                  <s-col span="3" style="text-align: right;">
                    <s-button @click="ipAdd">添加</s-button>
                    <s-button @click="ipDel">删除</s-button>
                  </s-col>
                </s-form-item>
                <s-form-item label="绑定数据库">
                  <input-tree v-model="serverForm2.dbiUuids" name="uuid" :data="serverOptions"
                              :props="defaultProps"
                              style="width: 185px"
                              :muti="true">
                  </input-tree>
                </s-form-item>
                <s-form-item label="关联策略	">
                  <s-select v-model="serverForm2.dbassocPolicy">
                    <s-option label="准确度优先" :value="0"></s-option>
                    <s-option label="忽略规则模型" :value="1"></s-option>
                    <s-option label="忽略时间模型" :value="2"></s-option>
                    <s-option label="用户规则优先" :value="3"></s-option>
                  </s-select>
                </s-form-item>
              </template>
            </s-form>
            <div style="height: 80px;"></div>
          </s-scrollbar>
        </s-tab-pane>
      </s-tab>
      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogOk">确定</s-button>
        <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
      </template>
    </s-dialog>

    <ip-add-dialog v-if="ipAddDialogFlag" v-model="ipAddDialogFlag" @finish="addIpFinish">
    </ip-add-dialog>

  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import inputTree from '@/components/inputTree/InputTree';
  import ipAddDialog from './IpAddDialog';

  export default {
    data() {
      return {
        dialogFlag: false,
        ipAddDialogFlag: false,
        activeTab: 0,
        serverForm1: {
          assetUuid: '',
          protocol: {},
          charactercoll: 'AUTO',
          caseSensitive: 0,
          sslEnabled: 0,
          isPfx: 0,
          privatekeyPasswd: '',
          privatekeyPath: '',
          descr: ''
        },
        serverRules1: {
          descr: [ Validaters.Max(1000) ]
        },
        serverForm2: {
          dbassocEnabled: 1,
          connectIpType: 0,
          connectIp: '',
          dbiUuids: '',
          dbassocPolicy: 0
        },
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        appOptions: [],
        protocolOptions: [],
        charsetOptions: ['GB2312', 'GB2312', 'BIG5', 'UTF-8', 'UTF-8'],
        engine: '默认引擎',
        upLoadUrl: '',
        fileList: [],
        serverOptions: [],
        showSSL: true,
        connectIpArr: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curServer: {
        type: Object
      }
    },
    computed: {
      isEdit() {
        return Object.keys(this.curServer).length > 0;
      }
    },
    created() {
      this.upLoadUrl = $axios.basePath() + '/sysDbauditObject/uploadSslFile';
      if (this.isEdit) {
        this.assignObj(this.serverForm1, this.curServer);
        this.assignObj(this.serverForm2, this.curServer);
        this.serverForm1.descr = this.curServer.appDesc;
        this.serverForm1.charactercoll = this.curServer.serverCharset;
        this.serverForm2.dbiUuids = this.curServer.dbiUuid;
        if (this.curServer.privatekeyPath) {
          let fileArr = this.curServer.privatekeyPath.split('/');
          this.fileList = [{name: fileArr[fileArr.length - 1]}]
        }
      }
      // 获取：应用系统下拉选项
      $axios.get(`/sysDbauditObject/getCentItcompTreeList`).then(({data}) => {
        this.appOptions = data;
      });
      // 获取：绑定数据库下拉树
      $axios.get(`/sysDbauditObject/getConnectSetLists`).then(({data}) => {
        this.serverOptions = data.dbList;
      });
    },
    methods: {
      assignObj(toObj, fromObj) {
        for (let i in toObj) {
          if (fromObj.hasOwnProperty(i)) {
            toObj[i] = fromObj[i];
          }
        }
      },
      protocolShow(flag) {
        if (flag && !this.serverForm1.assetUuid) {
          this.$message({showClose: true, message: '请先选择应用系统!', type: 'warning'});
        }
      },
      protocolChange(option) {
        if (option.protocolName === '未知' && option.port === null) {
          this.showSSL = false;
        } else {
          this.showSSL = true;
        }
      },
      beforeUpload(file) {
        if (this.fileList.length === 1) {
          this.$message({showClose: true, message: '只能上传一个密钥文件', type: 'error'});
//          this.$refs.upload.uploadFiles.pop();
          return false;
        }
      },
      uploadSuccess(res, file, fileList) {
        fileList[0].name = res.fileName;
        this.fileList = fileList;
      },
      uploadRemove(file, fileList) {
        this.fileList = fileList;
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      },
      axiosProtocolOptions() {
        $axios.get(`/sysDbauditObject/getAppProtocolAndPortByUuid/${this.serverForm1.assetUuid}`).then(({data}) => {
          this.protocolOptions = data;
          if (this.isEdit) {
            this.protocolOptions.forEach(item => {
              if (item.portUuid === this.curServer.portUuid) {
                this.serverForm1.protocol = item;
              }
            });
          } else {
            this.protocolOptions.forEach(item => {
              if (item.protocolName === '未知') {
                this.serverForm1.protocol = item;
              }
            });
          }
        })
      },
      transArr(str) {
        return str ? str.split(',') : [];
      },
      ipAdd() {
        this.ipAddDialogFlag = true;
      },
      ipDel() {
        let delFlag = this.connectIpArr.some(item => {
          return item.checked;
        });
        if (delFlag) {
          this.connectIpArr.forEach((item, index) => {
            if (item.checked) {
              this.connectIpArr.splice(index, 1);
            }
          });
          this.serverForm2.connectIp = this.connectIpArr.map(item => {
            return item.ip;
          }).join(',');
        } else { // 没有选中的时候删除最后一个
          let arr = this.transArr(this.serverForm2.connectIp);
          this.serverForm2.connectIp = arr.slice(0, arr.length - 1).join(',');
        }
      },
      addIpFinish(ip) {
        let arr = this.transArr(this.serverForm2.connectIp);
        arr.push(ip);
        this.serverForm2.connectIp = arr.join(',');
      },
      selectIp(item) {
        this.connectIpArr.forEach(item => {
          item.checked = false;
        });
        item.checked = true;
      },
      copyObj(obj) {
        let newObj = {};
        let cycle = (obj, result) => {
          for (let i in obj) {
            if (Object.prototype.toString.call(obj[i]).indexOf('Object') !== -1) {
              result[i] = {};
              cycle(obj[i], result[i]);
            } else {
              result[i] = obj[i];
            }
          }
        };
        cycle(obj, newObj);
        return newObj;
      },
      dialogOk() {
        this.$refs.serverForm1.validate(valid => {
          if (!valid) return;
          this.fileList[0] && (this.serverForm1.privatekeyPath = this.fileList[0].name);
          let param = this.copyObj(this.serverForm1);
          Object.assign(param, this.serverForm2);
          param.portUuid = param.protocol.portUuid || '';
          delete param.protocol;
          param.isPortFixed = 0;
          if (this.isEdit) {
            param.uuid = this.curServer.appUuid;
          }
          param.isAudit = this.isEdit ? this.curServer.isAudit : 0;
          let logParam = {
            logTemplate: (this.isEdit ? '编辑' : '添加') + '|应用服务器(#name#)'
          };
          this.appOptions.forEach(item => {
            if (item.childrenList.find(innerItem => innerItem.uuid === param.assetUuid)) {
              logParam.data = item.childrenList.filter(innerItem => innerItem.uuid === param.assetUuid);
            }
          });
          if (this.serverForm1.sslEnabled === 1) {
            if (this.fileList.length < 1) {
              this.$message({showClose: true, message: '最少上传一个密钥文件', type: 'error'});
              return
            }
          }
          $axios.post(`/sysDbauditObject/saveDbauditApp`, param, logParam).then(({data}) => {
            if (data === true) {
              this.$message({type: 'success', message: '保存成功!'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({type: 'error', message: '数据不能重复，保存失败!'});
            }
          });
        });
      }
    },
    watch: {
      'serverForm1.assetUuid': {
        handler(val) {
          if (val) {
            this.axiosProtocolOptions();
          }
        }
      },
      'serverForm1.isPfx': function(val) {
        if (val === 1) {
          this.serverRules1.privatekeyPasswd = [Validaters.NotNull]
        } else {
          this.serverRules1.privatekeyPasswd = []
        }
      },
      'serverForm2.connectIp': {
        handler(val) {
          if (!val) {
            this.connectIpArr = [];
          } else {
            let arr = this.serverForm2.connectIp.split(',');
            let result = [];
            arr.forEach(item => {
              result.push({
                ip: item,
                checked: false
              })
            });
            this.connectIpArr = result;
          }
        }
      },
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    components: {
      inputTree,
      ipAddDialog
    }
  }
</script>

<style lang="stylus">
/*  .serverAddDialog
    .serverAddScrollbar
      padding-right 17px
      max-height 500px
    .baseTab
      .s-form-item-content
        & > .s-radio-group
          width 100%
          .s-radio
            width: 30%
          .s-radio + .s-radio
            margin-left 0
        .filePath
          margin-left: 5px
    .ipBox
      width: 100%
      height: 90px
      border: 1px solid #344458
      border-radius: 5px
      li
        padding-left 5px
        float: left
        width: 50%
        height: 30px
        line-height 30px
        box-sizing border-box
        &.checked
          box-shadow: inset 0px 0px 15px 2px #31aaff */

</style>
