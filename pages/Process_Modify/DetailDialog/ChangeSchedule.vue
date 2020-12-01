<template>
  <s-scrollbar wrap-style="max-height:500px;">
    <s-form
      ref="scheduleForm"
      :model="scheduleForm"
      :rules="scheduleFormRules"
      label-width="100px">
      <s-form-item label="排期时间：" prop="schedule">
        <s-date-picker
          v-model="scheduleForm.schedule"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="disTodayBefore"
          range-separator="至"
          start-placeholder="计划开始时间"
          end-placeholder="计划结束时间">
        </s-date-picker>
      </s-form-item>
    </s-form>

    <s-row style="text-align: right;">
      <s-button @click="checkSchedule">保存</s-button>
      <s-button type="cancel" @click="cancelSchedule">取消</s-button>
    </s-row>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      let checkStartTime = (rule, value, callback) => {
        if (!value) {
          callback('不能为空')
        } else {
          if (new Date(value) < Date.now()) {
            callback('开始时间不能小于当前时间')
          } else {
            callback()
          }
        }
      };
      return {
        scheduleForm: {
          schedule: ''
        },
        scheduleFormRules: {
          schedule: [{
            validator: checkStartTime, trigger: 'blur'
          }]
        },
        disTodayBefore: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 3600 * 1000
          }
        }
      }
    },
    props: {
      orderUuid: {
        type: String,
        required: true
      }
    },
    methods: {
      // 检测排期是否冲突
      checkSchedule() {
        this.$refs.scheduleForm.validate((valid) => {
          if (valid) {
            let planStartTime = this.scheduleForm.schedule[0];
            let planEndTime = this.scheduleForm.schedule[1];
            $axios.get(`/itilChangeOrder/checkIsConflict/${planStartTime}/${planEndTime}`).then(({data}) => {
              if (data.state === false) {
                this.saveSchedule(planStartTime, planEndTime)
              } else {
                this.$confirm('变更排期有冲突，是否保存？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.saveSchedule(planStartTime, planEndTime)
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '排期操作已取消！'
                  })
                })
              }
            })
          } else {
            return false
          }
        })
      },
      // 取消
      cancelSchedule() {
        this.$emit('closeSchedule', 'cancle')
      },
      // 保存排期
      saveSchedule(planStartTime, planEndTime) {
        $axios.get(`/itilChangeOrder/changeOrderPlan/${this.orderUuid}/${planStartTime}/${planEndTime}`).then(({data}) => {
          if (data.state === true) {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$emit('closeSchedule')
          } else {
            this.$message({
              type: 'error',
              message: data.errormsg
            })
          }
        })
      }
    },
    created() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
