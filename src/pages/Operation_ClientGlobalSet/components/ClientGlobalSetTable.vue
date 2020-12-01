<!--
 * @Author: alex
 * @Date: 2017-08-31
 * @LastEditors: shifeng
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-02-22 11:19:06
 * @Description: 初版为只支持win客户端，后续版本支持linux 和macos
 -->

<template>
  <div>
    <s-table :data="downLoadData">
      <s-table-column prop="protoname" label="协议名称" width="300">
      </s-table-column>
      <s-table-column label="任意" width="80">
        <template slot-scope="scope">
          <s-radio v-model="scope.row.selectType" label="" :key="scope.$index"></s-radio>
        </template>
      </s-table-column>
      <s-table-column label="客户端名称">
        <template slot-scope="scope">
          <s-radio v-for="item in scope.row.clients" :key="item.id" v-model="scope.row.selectType" :label="item.uuid">{{item.clientName}}</s-radio>
        </template>
      </s-table-column>
    </s-table>
    <s-row class="downloadBtn" style="margin-top: 15px">
      <s-col span="4" offset="10">
        <s-button @click="saveDownLoadData">保存</s-button>
      </s-col>
    </s-row>
  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax'

export default {
  data() {
    return {
      downLoadData: [],
      clientType: 'win'
    }
  },
  props: {
    selectedIndex: {
      type: Number,
      default() {
        return 0;
      }
    }
  },
  methods: {
    getDownLoadData(index) {
      let path = '';
      if (index === 0) {
        path = '/operationSettings/getWinClientList';
        this.clientType = 'win'
      } else if (index === 1) {
        this.clientType = 'linux'
        path = '/operationSettings/getLinuxClientList';
      } else if (index === 2) {
        this.clientType = 'mac'
        path = '/operationSettings/getMacClientList';
      }
      $axios.get(path).then((res) => {
        this.downLoadData = res.data
      })
    },
    saveDownLoadData() {
      $axios.post(`/operationSettings/saveUserClient/${this.clientType}`, this.downLoadData, {
        logTemplate: '配置|客户端全局设置'
      }).then((res) => {
        if (res.data === true) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: '保存失败，请检查后重试',
            type: 'error'
          });
        }
      })
    }
  },
  created() {
    this.getDownLoadData(this.selectedIndex)
  }
}
</script>
