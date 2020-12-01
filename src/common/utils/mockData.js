/* 此文件是为了生成假数据方便测试 */
// 用法参考http://mockjs.com/examples.html
import Mock from 'mockjs';
export let selectData = Mock.mock({'data|100001': [{'id|+1': 0, 'label': function() { return this.id + '' }, 'uuid': function() { return this.id + '' }}]});

// 随机生成100个对象数组。格式 [{uuid:'',name:'',status:true/false}]
export let objectArrayData = Mock.mock({'data|100': [{'uuid': () => { return Mock.mock('@guid') }, 'name': () => { return Mock.mock('@first') }, 'status': () => { return Mock.mock('@boolean') }}]});
