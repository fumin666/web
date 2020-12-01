<script>
  export default {
    data() {
      return {
        currentIndex: 0
      }
    },
    props: {
      menu: {
        type: Object,
        default: {}
      },
      activeIndex: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.currentIndex = this.activeIndex;
    },
    render: function (h) {
      let list = this.menu.list;
      let children = list.map((menu, index) => {
        return h('s-row', {
          class: {
            'active': index === this.currentIndex
          },
          nativeOn: {
            click: () => {
              this.currentIndex = index;
              this.menu.click && this.menu.click(index);
            }
          }
        }, [h('span', menu.name || '')]);
      });
      let node = h('div', {
        class: 'simpleMenu'
      }, children);
      return node;
    }
  }
</script>
