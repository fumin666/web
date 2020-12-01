/**
 * Created by caoLiXin on 2017/11/15.
 */
import $axios from 'sunflower-ajax'
import createEventOrder from '@/home/ProcessCenter/ProcessCreatOrder/EventOrderDialog'
import addReleaseBulletin from '@/pages/Safety_BulletinTask/components/dialog/AddReleaseBulletin';
export default {
  data() {
    return {
      dynaColSetDialog: false,        // 动态列设置弹框
      dynaColSetOptions: [],          // 动态列设置展示选项，
      createEventOrderDialog: false,  // 最新事件，手动创建事件单
      addReleaseBulletinFlag: false,
      eventUuid: '',                   // 创建事件单走ITSM流程的事件的uuid
      bulletinTypeUuid: '', // 通报类型uuid
      incidentUuid: '', // 事件的uuid
      rowData: {},
      authSafetyBulletin: 1 // 通报下发权限控制
    }
  },
  components: {
    createEventOrder,
    addReleaseBulletin
  },
  created() {
    this.authSafetyBulletin = this.$store.state.authSafetyBulletin
  },
  methods: {
    /**
     * 时间格式化(s -> yyyy-MM-dd HH:mm:ss)
     * @param seconds
     * @returns {string}
     */
    formatDate(seconds) {
      if (seconds) {
        let date = new Date()
        date.setTime(seconds * 1000)
        let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
        return dateStr
      } else {
        return ''
      }
    },
    /**
     * 将时间长度的秒数转化为 HH:mm:ss 格式
     * @param value
     * @returns {string}
     */
    formatSeconds(value) {
      if (value < 0 || isNaN(parseInt(value))) return '00:00:00'
      let seconds = parseInt(value)     // 秒
      let minutes = 0                   // 分
      let hours = 0                     // 小时
      if (seconds > 60) {
        minutes = parseInt(seconds / 60)
        seconds = parseInt(seconds % 60)
        if (minutes > 60) {
          hours = parseInt(minutes / 60)
          minutes = parseInt(minutes % 60)
        }
      }
      // 结果格式化(小于10的用0补够两位)
      let result = seconds < 10 ? `0${parseInt(seconds)}` : `${parseInt(seconds)}`
      if (minutes > 0) result = minutes < 10 ? `0${parseInt(minutes)}:${result}` : `${parseInt(minutes)}:${result}`
      else result = `00:${result}`
      if (hours > 0) result = hours < 10 ? `0${parseInt(hours)}:${result}` : `${parseInt(hours)}:${result}`
      else result = `00:${result}`
      return result;
    },
    /**
     * 获取当日凌晨时间
     */
    getTodayZeroTime() {
      let date = new Date()
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    },
    /**
     * 计算事件状态列文字
     */
    calEventStatus(status) {
      switch (parseInt(status)) {
        case 2:
          return '处理中'
        case 3:
          return '已处理'
        case 4:
          return '已忽略'
        default:
          return '未处理'
      }
    },
    /**
     * 计算事件状态列文字
     */
    calIconOption(status) {
      switch (parseInt(status)) {
        case 2:
          return {str: '处理中', icon: 'underway'}
        case 3:
          return {str: '处理完成', icon: 'finish'}
        case 4:
          return {str: '已忽略', icon: 'ban'}
        default:
          return {str: '处理', icon: 'config-rule'}
      }
    },
    /**
     * 打开表格动态列设置弹框
     */
    showDynamicColSet() {
      this.dynaColSetDialog = true
    },
    /**
     * 关闭表格动态列设置弹框
     * @param data    动态列设置弹框关闭回传数据(勾选项)
     */
    _closeDynColSet(data) {
      this.dynaColSetDialog = false
      if (data) {
        this.dynaColSetOptions = data
      }
    },
    /**
     * 获取动态列设置信息，初始化表格展示列
     * @param eventType   事件类型
     */
    initDynamicCol(eventType) {
      $axios.get(`/eventColSet/getSelectedColByType/${eventType}`).then(({data}) => {
        if (data && data instanceof Array) {
          this.dynaColSetOptions = data
        }
      })
    },
    /**
     * 获取动态列设置信息，初始化表格展示列，过滤掉资产相关列，用于资产不同视角，展示当前资产的事件
     * @param eventType   事件类型
     */
    initItcompDynamicCol(eventType) {
      $axios.get(`/eventColSet/getFilterSelectedColByType/${eventType}`).then(({data}) => {
        if (data && data instanceof Array) {
          this.dynaColSetOptions = data
        }
      })
    },
    /**
     * 最新事件走ITSM流程
     */
    handelProcess(row, index, eventIdKeyName = 'uuid') {
      if (row.itilIncidentOrderUuid) {
        $axios.get(`itilIncidentCenter/getSerialCodeByUuid/${row.itilIncidentOrderUuid}`).then(({data}) => {
          if (data && typeof data === 'string') {
            this.$router.push(`/ProcessCenter/eventFlowchart/${data}/${row.itilIncidentOrderUuid}`)
          }
        })
      } else {
        $axios.get('/iamUserInfo/hasItilIncidentIamUserInfo').then(({data}) => {
          if (data && data === true) {
            this.createEventOrderDialog = true
            /**
             * 获取事件的主键ID(走流程时上传的sysIncidentUuid字段)
             * 数据库审计事件，主键为alarm_id，
             * 运维审计事件，主键为sessionCmdUuid，
             * 业务审计事件，主键为alarm_id，
             * 其他事件类型的事件主键为uuid
             */
            this.eventUuid = row[eventIdKeyName]
          } else {
            this.$message.error('系统中无流程人员，无法执行此操作！')
          }
        })
      }
    },
    /**
     * 最新事件,手动创建事件单-保存
     */
    saveCreateEventOrder(val) {
      this.$refs['createEventOrder'].$refs['Form'].validate(valid => {
        if (valid) {
          let form = this.$refs['createEventOrder'].form
          if (isNaN(val) === false) {
            form.sysIncidentType = val
          }
          let param = {};
          for (let i in form) {
            if (form[i] || form[i] === 0) {
              param[i] = form[i]
            }
          }
          param.attachuuid = this.$refs['createEventOrder'].fileList.map(item => {
            return item.response.attachuuid;
          }).join(',');
          // 上传sysIncidentUuid(事件的uuid)
          param.sysIncidentUuid = this.eventUuid
          let txt = ''
          if (form.sysIncidentType === 1) {
            txt = '处理|监控事件'
          } else if (form.sysIncidentType === 2) {
            txt = '处理|运维审计事件'
          } else if (form.sysIncidentType === 3) {
            txt = '处理|数据库审计事件'
          } else if (form.sysIncidentType === 4) {
            txt = '处理|业务审计事件'
          } else if (form.sysIncidentType === 5) {
            txt = '处理|日志审计事件'
          } else if (form.sysIncidentType === 6) {
            txt = '处理|登录重要资产事件'
          }
          let obj = {
            data: [],
            logTemplate: txt
          }
          $axios.post('/itilIncidentCenter/saveIncidentOrderUser', param, obj).then((res) => {
            if (res.data.state) {
              this.$message.success('创建成功')
              this._closeDialog()
              this.createEventOrderDialog = false
            } else {
              this.$message.error(res.data.errormsg)
            }
          })
        } else {
          return false
        }
      })
    },
    bulletinHandle(row, index, eventIdKeyName = 'uuid') { // 通报下发
      if (row.safeOrderUuid !== null) {
        this.$message({type: 'warning', message: '通报中'});
        return
      }
      $axios.get(`/safetyPlatform/bulletinIssuedTask/getSafeAvailableUser`).then(({data}) => {
        if (data.state) {
          this.addReleaseBulletinFlag = true
          this.incidentUuid = row[eventIdKeyName]
        } else {
          this.$message({type: 'error', message: data.errormsg});
        }
      })
    },
    switchUuid(val) {
      switch (val) {
        case 1:
          return 'uuid';
        case 2:
          return 'sessionCmdUuid';
        case 3:
          return 'alarm_id';
        case 4:
          return 'alarm_id';
        default:
          return 'uuid';
      }
    }
  }
}
