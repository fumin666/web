<template>
  <div class="tvwall-portlet-add">
    <s-form :model="info" label-width="100px">
      <s-form-item label="区块类型">
        <s-select v-model="index" @change="handleTypeChange">
          <s-option v-for="(item, index) in paramArr" :label="item.tvshowName" :value="index" :key="index"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="区块内容" v-if="showChild">
        <input-tree v-model="info.requestParm" :data="childList" :props="myProps" muti name="uuid" style="width: 100%;"></input-tree>
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import InputTree from '@/components/inputTree/InputTree'

  export default {
    components: {
      InputTree
    },
    props: {
      name: String,
      id: String
    },
    data() {
      return {
        paramArr: [],
        childList: [],
        showChild: false,
        info: {
          tvshowtypeId: '',
          requestParm: ''
        },
        index: '',
        myProps: {
          children: 'childrenList',
          label: 'name',
          disabled: function(data) {
            return data.node.type === 1 && data.childrenList.length < 1;
          }
        }
      }
    },
    methods: {
      handleTypeChange(val) {
        this.info.tvshowtypeId = this.paramArr[val].uuid;
        if (this.paramArr[val].tvshowChildUrl) {
          this.showChild = true;
          $axios.post(this.paramArr[val].tvshowChildUrl.substr(1)).then((res) => {
            if (res.data && res.data instanceof Array) {
              this.childList = res.data;
            }
          });
        } else {
          this.info.requestParm = '';
          this.showChild = false;
        }
      },
      handleContentChange() {},
      initValue() {
        for (let i = 0; i < this.paramArr.length; i++) {
          if (this.name === this.paramArr[i].tvshowName) {
            this.index = i;
            this.handleTypeChange(i);
            break;
          }
        }
      }
    },
    created() {
      $axios.get('/systemManager/staticTvWall/getTvShowType').then((res) => {
        if (res.data && res.data instanceof Array) {
          this.paramArr = res.data;
          if (this.paramArr.length > 0) {
            this.index = 0;
            this.handleTypeChange(0);
          }
          if (this.name) {
            this.initValue();
          }
        } else {
          this.$message({type: 'error', message: '区块内容请求失败'});
        }
      });
      if (this.name === '拓扑图') {
        this.info.requestParm = this.id;
      }
    }
  }
</script>
