<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-30 10:34:54
 * @LastEditTime: 2019-09-09 15:15:51
 * @LastEditors: Please set LastEditors
 -->
<template>
  <s-dialog v-model="dialogFlag" title="系统启动信息"  width="800px">
        <s-form :inline="true">
          <s-form-item label="类型" width=100>
            <s-select v-model="form.type" clearable>
              <s-option label='关机' value='关机'></s-option>
              <s-option label='重启' value='重启'></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="时间">
            <s-date-picker
              :editable='false'
              v-model="form.time"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </s-date-picker>
          </s-form-item>
          <s-form-item>
            <s-button @click="search">查询</s-button>
          </s-form-item>

        </s-form>
      <s-table-page
        :data="tableData"
        :hasActionCol='false'
        max-height=360
        >
        <s-table-column prop="type" label="类型"></s-table-column>
        <s-table-column prop="time" label="时间"></s-table-column>
      </s-table-page>
  </s-dialog>
</template>
<script>
  import $axios from 'sunflower-ajax';

  export default {

    data() {
      return {
        dialogFlag: false,
        tableData: [],
        ArrData: [],
        sysData: [],
        form: {
          type: '',
          time: []
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.getRegisterInfo()
    },
    methods: {
      getRegisterInfo() {
          $axios.get('/omaIndex/getAllRebbotLog').then(({data}) => {
            this.tableData = data
            this.sysData = data
          })
      },
      search() {
        if (this.form.time === null) {
          this.form.time = []
        }
        if (this.form.type === '' && this.form.time.length === 0) {
            this.tableData = this.sysData
        } else {
            let arr = []
            let str = this.form.time[0]
            let str4 = this.form.time[1]
            let str2 = Date.parse(new Date(str));
            let str5 = Date.parse(new Date(str4));
            let str6 = str5 / 1000;
            let str3 = str2 / 1000;

            this.ArrData.filter(val => {
              let str7 = Date.parse(new Date(val.time));
              let str8 = str7 / 1000;

              if (this.form.type === val.type && this.form.time.length === 0) {
                  arr.push(val)
              }
              if (this.form.time.length > 0 && this.form.type === '') {
                if (str3 < str8 && str8 < str6) {
                    arr.push(val)
                  }
              }
              if (this.form.type === val.type && str3 < str8 && str8 < str6) {
                    arr.push(val)
              }
          })
            this.tableData = arr
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      },
      'form.type': {
        click() {
          this.ArrData = this.sysData
        }
      },
      'form.time': {
        handler(val) {
          this.ArrData = this.sysData
        }
      }
    }
  }
</script>
