export default {
  bind(el, binding, vnode) {
    let totalCountDom = document.createElement('span');
    totalCountDom.className = 'totalNum';
    el.querySelector('span.s-pagination__sizes').appendChild(totalCountDom);
    if (binding.value.show) {
      let totalCountTextNode = document.createTextNode(`，共 ${binding.value.total} 条`);
      totalCountDom.appendChild(totalCountTextNode);
    }
  },
  update(el, binding, vnode) {
    binding.value.show
      ? el.querySelector('span.totalNum').textContent = `，共 ${binding.value.total} 条`
      : el.querySelector('span.totalNum').textContent = '';
  }
}
