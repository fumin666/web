/**
* Created by dgunzi on 2018/7/30.
*/

<template>
<div>
  <div class="search"><s-input
    placeholder="请输入物品名称"
    prefix-icon="magnifier"
    v-model="inputValue">
  </s-input></div>
  <s-scrollbar wrap-style="height: calc(100vh - 228px);">
    <div class="item" v-if="filterItems.length !== 0" v-for="(item, index) in filterItems" v-on:click.stop="addToScene(index, $event)">
      <img :src="item.image"/>
      <span>{{item.name}}</span>
    </div>
    <div v-if="filterItems.length === 0">
      <div class="noData">查不到名称为<span class="noName">"{{inputValue}}"</span>的物品</div>
    </div>
  </s-scrollbar>
</div>
</template>
<script type="text/babel">
  import {debounce} from 'lodash';
  import itemsMixin from './ItemsMixin';

  export default {
    mixins: [itemsMixin],
    data () {
      return {
        inputValue: null,
        filterItems: []
      }
    },
    mounted() {
      this.inputValue = '';
    },
    watch: {
      inputValue: debounce(function() {
        this.filterItems = this.items.filter((item) => {
          if (this.inputValue === '') {
            return true;
          } else if (item.name.indexOf(this.inputValue) !== -1) {
            return true;
          } else {
            return false;
          }
        });
      }, 500)
    },
    methods: {
      addToScene(index, event) {
        if (!window.oasis3d_loading) {
          let metadata = this.filterItems[index];
          window.oasis3d.model.scene.addItem(metadata);
        }
      }
    }
  }
</script>
