
<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表->报表配置->添加编辑操作->操作指令弹窗
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog class="log_custom_command" v-model="selectCommandDialog" title="选择操作指令" width="700px" append-to-body :before-close="dialogClose">
    <s-scrollbar wrap-style="max-height:600px;padding-right:10px;">
      <div class="bgGray grid" style="height:40px;line-height:40px;font-size:15px;font-weight:bold;text-align:center;">
        <div class="gridleft">操作类型</div>
        <div class="gridright">操作指令</div>
      </div>
      <div v-for="(items, name) in list" :key="name" class="grid">
        <div style="padding:10px;display:flex;align-items:center;" class="gridleft">
          <div>
            <s-checkbox v-model="selectName[name]" @change="setSelect($event,name)" :label="name"></s-checkbox>
          </div>
        </div>
        <div style="padding:10px;" class="gridright">
          <s-checkbox-group v-model="selectList[name]">
            <s-checkbox style="width:45%;height:30px;ling-height;30px;margin-right:0;" v-for="item in items" :key="item.dbo_id"  :label="item.dbo_id+'-'+item.dboKeyAndDboExpand">{{item.dboKeyAndDboExpand}}</s-checkbox>
          </s-checkbox-group>
        </div>
      </div>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="save">确 定</s-button>
      <s-button type="cancel" @click="dialogClose">取 消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    props: {
      selectCommandDialog: Boolean,
      data: Array,
      selectData: Object
    },
    data() {
      return {
        list: {},
        selectList: {},
        selectName: {
          'DML': false,
          'DDL': false,
          'DCL': false,
          'TCL': false,
          'OTHER': false
        },
        obj: {
          '1': 'DML',
          '2': 'DDL',
          '3': 'DCL',
          '4': 'TCL',
          '5': 'OTHER'
        }
      }
    },
    created() {
      $axios.post('/dbaCustomReport/getOperations', this.data).then(res => {
        let data = res.data || [];
        let arr = {};
        for (let key in data) {
          arr[this.obj[key]] = data[key];
        }
        Object.keys(arr).forEach((item) => {
          this.$set(this.selectList, item, [])
        })
        this.list = arr;
        Object.keys(this.selectData).forEach(name => {
          if (this.selectList[name]) {
            this.selectList[name] = this.selectData[name];
            if (this.selectData[name].length === arr[name].length) {
              this.selectName[name] = true;
            }
          }
        })
      })
    },
    methods: {
      setSelect(e, name) {
        if (e) {
          this.selectList[name] = this.list[name].map(item => { return item.dbo_id + '-' + item.dboKeyAndDboExpand });
        } else {
          this.selectList[name] = [];
        }
      },
      save() {
        this.$emit('commandReload', this.selectList);
        this.$emit('update:selectCommandDialog', false)
      },
      dialogClose() {
        this.$emit('update:selectCommandDialog', false)
      }
    }
  }
</script>

<style lang="stylus">
// .log_custom_command{
//   .grid{
//     display grid;
//     border-top:1px solid #303943;
//     grid-template-columns 20% 80%;
//     .gridleft{
//       border-left:1px solid #303943;
//       border-right:1px solid #303943;
//       border-bottom:1px solid #303943;
//     }
//     .gridright{
//       border-right:1px solid #303943;
//       border-bottom:1px solid #303943;
//     }
//   }
// }
</style>
