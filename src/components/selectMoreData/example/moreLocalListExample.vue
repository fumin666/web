<!--
 * @Author: 高建鹏
 * @Description: 本地分批渲染列表(作为例子使用)
 * @Position:
 * @Date: 2019-09-02 17:38:30
 * @LastEditors: 高建鹏
 -->
<template>
  <div>
    <s-col :span="4" class="left-border" id="leftMenu">
      <section class="left-nav">
        <s-row style="margin-bottom: 7px; margin-top: 9px;font-weight: bold;font-size: 14px;">
          <span>用户列表</span>
        </s-row>
        <s-row>
          <s-input style="width:90%" v-model="input" prefix-icon="magnifier" placeholder="请输入内容"></s-input>
        </s-row>
        <s-row>
            <ul class="list" style="width:90%;">
              <s-scrollbar wrap-style="height:calc(100vh - 240px);" v-loadmoredata="scrolldata">
                <li v-for="item in userArr" :key="item.uuid">
                  {{ item.userLoginName}}
                </li>
              </s-scrollbar>
            </ul>
        </s-row>
      </section>
    </s-col>
  </div>
</template>

<script>
  import {cloneDeep, debounce} from 'lodash'
  export default {
    props: {
    },
    data() {
      return {
        input: '',
        scrolldata: {id: '.s-scrollbar-wrap', callback: this.loadMoreCreate, arg: {page: 0, onceCount: 50}},
        userArr: [],
        userList: [],
        userListCopy: []
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        let data = [];
        for (let i = 0; i < 1000; i++) {
          data.push({uuid: 'uuid' + i, userLoginName: i})
        }
        this.userList = cloneDeep(data);
        this.userListCopy = cloneDeep(data);
        this.loadMoreCreate(this.scrolldata.arg.page, this.scrolldata.arg.onceCount)
      },
      inputchange(query) {
        if (query !== '') {
          setTimeout(() => {
            let data = this.userListCopy.filter(item => {
              return item.userLoginName.includes(query)
            })
            if (data.length) {
              this.userList = cloneDeep(data);
            } else {
              this.userList = []
            }
            this.scrolldata.arg.page = 0;
            this.loadMoreCreate(this.scrolldata.arg.page, this.scrolldata.arg.onceCount)
          }, 200);
        } else {
          this.userList = cloneDeep(this.userListCopy);
          this.scrolldata.page = 0;
          this.loadMoreCreate(this.scrolldata.arg.page, this.scrolldata.arg.onceCount)
        }
      },
      loadMoreCreate(count, onceCount) {
        let total = this.userList.length;
        let loopCount = Math.ceil(total / onceCount) // 渲染次数
        if (total) {
          if (count < loopCount) {
            let batchdata = cloneDeep(this.userList.slice(count * onceCount, (count + 1) * onceCount));
            if (count === 0) {
              this.$set(this, 'userArr', batchdata)
            } else {
              this.userArr.push(...batchdata);
            }
            this.scrolldata.arg.page += 1
          }
        } else {
          this.$set(this, 'userArr', [])
        }
      }
    },
    watch: {
      input: debounce(function(newVal, oldVal) {
        this.inputchange(newVal)
      }, 1000)
    }
  }
</script>

<style scoped>
.list li{
 height:30px;
 line-height: 30px;
 cursor: pointer;
 font-size: 14px;
}
</style>
