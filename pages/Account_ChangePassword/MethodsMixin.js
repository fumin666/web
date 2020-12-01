/**
 * Created by caoLiXin on 2018/12/18.
 */
import { cloneDeep } from 'lodash';

export default {
  methods: {
    /**
     * 构造时间调度组件上传参数
     * @param obj
     * @returns {*}
     */
    formattScheduleTime(obj) {
      const notPeriod = ['timeType', 'firstFireTime']
      const dayKeys = ['timeType', 'firstFireTime', 'endFireTime', 'day']
      const dayKeysForever = ['timeType', 'firstFireTime', 'isForever', 'day']
      const weekKeys = ['timeType', 'firstFireTime', 'endFireTime', 'week', 'dayOfWeek']
      const weekKeysForever = ['timeType', 'firstFireTime', 'isForever', 'week', 'dayOfWeek']
      const monthKeys = ['timeType', 'firstFireTime', 'endFireTime', 'month', 'dayOfMonth']
      const monthKeysForever = ['timeType', 'firstFireTime', 'isForever', 'month', 'dayOfMonth']
      const yearKeys = ['timeType', 'firstFireTime', 'endFireTime', 'year', 'dayOfMonth', 'monthOfYear']
      const yearKeysForever = ['timeType', 'firstFireTime', 'isForever', 'year', 'dayOfMonth', 'monthOfYear']
      let newForm = cloneDeep(obj)
      if (newForm.isPeriod === 0) {
        newForm.tScheduleTime = this.delNotNeedKey(notPeriod, newForm.tScheduleTime)
        newForm.tScheduleTime.timeType = 7
      } else {
        let type = newForm.tScheduleTime.timeType
        let forever = newForm.tScheduleTime.isForever
        if (type === 1) {
          if (forever === 1) {
            newForm.tScheduleTime = this.delNotNeedKey(dayKeysForever, newForm.tScheduleTime)
          } else {
            newForm.tScheduleTime = this.delNotNeedKey(dayKeys, newForm.tScheduleTime)
          }
        }
        if (type === 2) {
          if (forever === 1) {
            newForm.tScheduleTime = this.delNotNeedKey(weekKeysForever, newForm.tScheduleTime)
          } else {
            newForm.tScheduleTime = this.delNotNeedKey(weekKeys, newForm.tScheduleTime)
          }
        }
        if (type === 3) {
          if (forever === 1) {
            newForm.tScheduleTime = this.delNotNeedKey(monthKeysForever, newForm.tScheduleTime)
          } else {
            newForm.tScheduleTime = this.delNotNeedKey(monthKeys, newForm.tScheduleTime)
          }
        }
        if (type === 4) {
          if (forever === 1) {
            newForm.tScheduleTime = this.delNotNeedKey(yearKeysForever, newForm.tScheduleTime)
          } else {
            newForm.tScheduleTime = this.delNotNeedKey(yearKeys, newForm.tScheduleTime)
          }
        }
      }
      for (let key in newForm.tScheduleTime) {
        // 转日期为int
        if ((key === 'firstFireTime' || key === 'endFireTime') && newForm.tScheduleTime[key] !== null) {
          newForm.tScheduleTime[key] = parseInt(new Date(newForm.tScheduleTime[key]).getTime() / 1000)
        }
        // 转数组为字符串
        if ((key === 'dayOfWeek' || key === 'dayOfMonth') && newForm.tScheduleTime[key].length > 0) {
          newForm.tScheduleTime[key] = newForm.tScheduleTime[key].join(',')
        }
        // 依据不同情况删除多余字段
      }
      return newForm
    },
    delNotNeedKey(arr, target) {
      for (let key in target) {
        if (arr.indexOf(key) < 0) {
          delete target[key]
        }
      }
      return target
    }
  }
}
