/*
  @Author: songyf
  @Date: 2019-12-10 11:11:11
  @LastEditors: songyf
  @Description: 运维中心-运维资产-公共方法 */

import $axios from 'sunflower-ajax'
import {chunk} from 'lodash';

import opsAdd from '@/pages/Operation_Equipment/OpsAdd'
import rapidAdd from '@/pages/Operation_Equipment/RapidOpsAdd'
import OpsAccessNew from '@/pages/Operation_Equipment/OpsAccessNew';

const VNC = '00000000000000000000000000000078';
const RDP = '00000000000000000000000000000077';
const account = 'noneaccount000000000000000000000';
const mysql = '00000000000000000000000000000084';
const sqlserver = '00000000000000000000000000000085';
const db2 = '00000000000000000000000000000081';
const informix = '00000000000000000000000000000082';
const sybase = '00000000000000000000000000000086';
const oracle = '00000000000000000000000000000080';
const plsql = '00000000000000000000000000000114';
const toadoracle = '00000000000000000000000000000120';
const SSH = '00000000000000000000000000000072';
const SFTP = '00000000000000000000000000000074';
const mssqlserver = '00000000000000000000000000000113';
export default {
  data() {
    return {
      carouselContainerHeight: 370,
      operationalEquipItemHeight: 100,
      itemContentPaddingTop: 7,
      specialOrderHeight: 30,
      equipmentList: [],
      opsDialog: false,
      opsAccessNewDialog: false, // 运维访问(new)
      RapidopsDialog: false,
      usershow: '',
      showModel: '',
      rowData: [],
      isOpen: 0,
      searchKey: ''
    }
  },
  components: {
    opsAdd,
    rapidAdd,
    OpsAccessNew
  },
  mounted() {
    this.getEquipmentList()
    this.getSwitch()
  },
  methods: {
    goto(path) {
      this.$router.push('/OperationCenter/' + path)
    },
    getEquipmentList() {
      $axios.post('/operationCenter/getVMaintatinedDeviceList', {content: this.searchKey}).then(({data}) => {
        if (data) {
          this.equipmentList = chunk(data, 9);
        }
      });
    },
    // 获取开关状态
    getSwitch() {
      $axios.get('/basicOperation/getAutoSetInfo').then((res) => {
        this.isOpen = res.data
      })
    },
    // 能否快速运维
    startOps(row) {
      if (row.canOperate === false) {
        this.$message({
          message: '禁止运维',
          type: 'error'
        });
        return false
      }
      let pid = row.protocolUuid
      let ppType = row.protocolType
      if (pid === VNC || pid === RDP || ppType === 1) {
        row.arguments !== null ? this.handleRapid(row) : this.handleOps(row)
      } else {
        if (!row.portUuid) {
          this.rowData = row
          this.opsAccessNewDialog = true
        } else {
          this.handleOps(row)
        }
      }
    },
    handleOps(row) {
      this.rowData = row
      let isAutoRecord = 1
      let opsForm = {
        accountuuid: row.accountUuid,
        diskMapping: row.disk_mappingNum,
        operationuuid: row.uuid,
        oprationIp: row.device_ip,
        portuuid: row.portUuid,
        protocluuid: row.protocolUuid,
        clipboard: row.clipboardNum,
        isAutoRecord: isAutoRecord,
        accountName: '',
        accountPwd: '',
        colorDepth: '',
        rdpConsole: '',
        dbname: row.dbName || row.dbServerName,
        resolution: ''
      }
      let pid = row.protocolUuid
      let pType = row.protocolType
      let aid = row.accountUuid
      let authorized = false
      if (aid === account || aid === null) {
        authorized = true
      }   // 未授权
      if (pType === 2 || pType === 5 || pid === db2 || pid === informix || pid === sybase || pid === sqlserver || pid === mysql) {
        if (authorized) {
          if (pid === SSH || pid === SFTP) {
            this.showModel = 8
            this.opsDialog = true
          } else {
            this.showModel = 1
            this.opsDialog = true
          }
        } else {
          opsForm.isAutoRecord = null
          this.goToOperation(opsForm)
        }
      } else if (pid === oracle || pid === plsql || pid === toadoracle || pid === mssqlserver) {
        if (authorized) {
          this.showModel = 3
          this.opsDialog = true
        } else {
          this.showModel = 2
          this.opsDialog = true
        }
      } else if (pid === RDP || (pType === 1 && pid !== toadoracle && pid !== plsql && pid !== mssqlserver)) {
        if (authorized) {
          this.showModel = 5
          this.opsDialog = true
        } else {
          this.showModel = 4
          this.opsDialog = true
        }
      } else if (pid === VNC) {
        if (authorized) {
          this.showModel = 7
          this.opsDialog = true
        } else {
          this.showModel = 6
          this.opsDialog = true
        }
      } else {
        if (authorized) {
          this.showModel = 1
          this.opsDialog = true
        } else {
          opsForm.isAutoRecord = null
          this.goToOperation(opsForm)
        }
      }
    },
    handleRapid(row) {
      this.rowData = row
      const arg = JSON.parse(row.arguments)
      arg.params.strClipboard = row.clipboardNum.toString()
      arg.params.strDiskMapping = row.disk_mappingNum.toString()
      let isAutoRecord = 1
      let quickForm = {
        isAutoRecord: isAutoRecord,
        accountName: row.accountName,
        accountPwd: row.accountPwd,
        arguments: JSON.stringify(arg),
        operationuuid: row.uuid
      }
      let pid = row.protocolUuid
      let pType = row.protocolType
      let aid = row.accountUuid
      let authorized = false
      if (aid === account || aid === null) {
        authorized = true
      }   // 未授权
      if (pid === RDP || pType === 1) {
        if (!authorized) {
          quickForm.isAutoRecord = null
          this.goQuickOperation(quickForm)
        } else {
          this.RapidopsDialog = true
        }
      } else if (pid === VNC) {
        if (authorized) {
          this.RapidopsDialog = true
          this.usershow = false
        } else {
          quickForm.isAutoRecord = null
          this.goQuickOperation(quickForm)
        }
      } else {
        if (authorized) {
          this.showModel = 1
          this.opsDialog = true
        } else {
          quickForm.isAutoRecord = null
          this.goQuickOperation(quickForm)
        }
      }
    },
    saveRapidops() {
      let form = this.$refs['Rapidops'].form
      let row = this.$refs['Rapidops'].decisionData
      let argumentObj = JSON.parse(row.arguments)
      if (form.accountName !== '') {
        argumentObj.params.strAccount = form.accountName
      }
      if (!this.RapidopsDialog) {
        form.isAutoRecord = null
      }
      argumentObj.params.strPw = form.accountPwd
      argumentObj.params.strClipboard = row.clipboardNum.toString()
      argumentObj.params.strDiskMapping = row.disk_mappingNum.toString()
      let argumentStr = JSON.stringify(argumentObj)
      let formObj = {
        isAutoRecord: form.isAutoRecord,
        accountName: form.accountName,
        accountPwd: form.accountPwd,
        arguments: argumentStr,
        operationuuid: row.uuid
      }
      this.$refs['Rapidops'].$refs['rapid'].validate(valid => {
        if (!valid) return;
        this.goQuickOperation(formObj)
      })
    },
    saveOps() {
      let form = this.$refs.ops.form
      if (!this.opsDialog) {
        form.isAutoRecord = null
      } else if (!this.$refs.ops.userShow && !this.$refs.ops.pwdShow) {
        form.isAutoRecord = null
      }
      this.$refs['ops'].$refs['addForm'].validate(valid => {
        if (!valid) return;
        if (form.passwordType === 1 && form.strKeyPath === '') {
          this.$message({type: 'warning', message: '请先上传文件'});
          return
        }
        this.goToOperation(form)
      })
    },
    saveOpsAccessNew() { // 保存运维访问（new）
      let form = this.$refs.opsAccessNew.searchForm
      if (!this.opsAccessNewDialog) {
        form.isAutoRecord = 0
      } else if (!this.$refs.opsAccessNew.userShow && !this.$refs.opsAccessNew.pwdShow) {
        form.isAutoRecord = 0
      }
      this.$refs['opsAccessNew'].$refs['searchForm'].validate(valid => {
        if (!valid) return;
        if (form.passwordType === 1 && form.strKeyPath === '') {
          this.$message({type: 'warning', message: '请先上传文件'});
          return
        }
        this.goToOperation(form)
      })
    },
    goQuickOperation(form) {
      $axios.post('/basicOperation/quickWebOperation', form).then((res) => {
        if (res.status === 200) {
          if (res.data !== '') {
            if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
              window.location.href = res.data
              this.RapidopsDialog = false
            } else {
              this.RapidopsDialog = false
              this.$message({
                type: 'error',
                message: res.data
              });
            }
          } else {
            this.RapidopsDialog = false
            this.$message({
              type: 'error',
              message: '快速运维失败,请检查！'
            });
          }
        }
      });
    },
    goToOperation(form) {
      $axios.post('/basicOperation/webOperation', form).then((res) => {
        if (res.status === 200) {
          if (res.data !== '' || res.data !== null || res.data !== undefined) {
            if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
              window.location.href = res.data
              this.opsDialog = false
              this.opsAccessNewDialog = false
              this.getEquipmentList()
            } else {
              this.opsDialog = false
              this.opsAccessNewDialog = false
              this.$message({
                type: 'error',
                message: res.data
              });
            }
          } else {
            this.opsDialog = false
            this.opsAccessNewDialog = false
            this.$message({
              type: 'error',
              message: '无法运维,请检查！'
            });
          }
        }
      });
    }
  }
}
