/**
* Created by dgunzi on 2018/8/24.
*/

<template>
  <div class="sceneItemList">
    <div class="search"><s-input
      placeholder="请输入物品名称"
      prefix-icon="magnifier"
      v-model="inputValue">
    </s-input></div>
    <s-scrollbar wrap-style="height: calc(100vh - 228px);">
      <div class="sceneItem" v-if="filterItems.length > 0">
        <div v-for="item in filterItems">
          <div :key="item.uuid" @click="editItem(item)" class="item" :class="{currentItem: item.selected && isView}">
            <s-row v-if="!isView">
              <s-col span="16" class="itemName" :title="item.metadata.name">
                {{ item.metadata.name }}
              </s-col>
              <s-col span="8" style="text-align: right;">
                <s-button icon="edit" size="mini" title="修改" @click.stop="editItem(item)"></s-button>
                <s-button icon="delete" size="mini" title="删除" @click.stop="deleteItem(item)"></s-button>
              </s-col>
            </s-row>
            <s-row v-if="isView">
              <s-col span="24" class="itemName" :title="item.metadata.name">
                {{ item.metadata.name }}
              </s-col>
            </s-row>
          </div>
        </div>
      </div>
      <div v-if="filterItems.length == 0" style="text-align: center; line-height: 35px;height: 35px;">
        暂无数据
      </div>
    </s-scrollbar>
  </div>
</template>
<script type="text/babel">
  import {debounce} from 'lodash';

  export default {
    data () {
      return {
        inputValue: '',
        items: [],
        filterItems: []
      }
    },
    props: {
      isView: {
        required: true,
        default: false
      }
    },
    components: {},
    methods: {
      editItem(item) {
        if (this.isView) {
          if (!item.selected) {
            item.setSelected();
          } else {
            item.setUnselected();
          }
          window.oasis3d.three.needsUpdate();
        } else {
          window.oasis3d.three.getController().setSelectedObject(item);
        }
      },
      deleteItem(item) {
        this.$confirm('确定删除该物品？', '提示', {
          confirmButonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.oasis3d.model.scene.removeItem(item);
          window.oasis3d.three.needsUpdate();
        }).catch(() => {});
      },
      init() {
        this.items = window.oasis3d.model.scene.items;
        this.filterItems = this.items;
        this.inputValue = '';
      }
    },
    created() {
      this.init();
    },
    watch: {
      inputValue: debounce(function() {
        this.filterItems = this.items.filter((item) => {
          if (this.inputValue === '') {
            return true;
          } else if (item.metadata.name.indexOf(this.inputValue) !== -1) {
            return true;
          } else {
            return false;
          }
        });
      }, 500)
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .sceneItemList
    .sceneItem
      .item
        margin-bottom 5px
        font-size 15px
        padding-left 5px
        padding-right 5px
        line-height 28px
        height 28px
        cursor pointer
        .itemName
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          word-break keep-all
</style>
