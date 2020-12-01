/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:43
 * @LastEditTime: 2019-09-20 13:18:26
 * @LastEditors: Please set LastEditors
 */

export default {
  data() {
    return {
      disbledHost: false,
      scriptDataFilter: []
    }
  },
  computed: {
  },
  methods: {
    // 过滤后的表格数据
    filterHostListLibrary(scriptForm, scriptName) {
      // 根据所选脚本的path判断显示windows还是其他
      if (this[scriptForm][scriptName]) {
        // let CurrentScript = this.scriptList.filter((item) => {
        //   return item.uuid === this[scriptForm][scriptName]
        // })
        // // .py都可以执行
        // if (['ps1', 'bat'].indexOf(CurrentScript[0].path.toLowerCase().split('.')[1]) > -1) {
        //   this.scriptData = this.scriptDataFilter.filter((item) => {
        //     return item.productname.indexOf('Windows') > -1
        //   })
        // } else if (['sh'].indexOf(CurrentScript[0].path.toLowerCase().split('.')[1]) > -1) {
        //   this.scriptData = this.scriptDataFilter.filter((item) => {
        //     return item.productname.indexOf('Windows') < 0
        //   })
        // } else {
        //   this.scriptData = this.scriptDataFilter
        // }
        this.disbledHost = true
      } else {
        this.scriptData = this.scriptDataFilter
        this.disbledHost = false
      }
    }
  }
}
