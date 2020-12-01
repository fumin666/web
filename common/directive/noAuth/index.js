export default {
  bind(el, binding, vnode) {
    if (!binding.value) {
      let mainTheme = localStorage.getItem('theme') || 'fanta'
      let imgDom = document.createElement('img');
      el.style.position = 'relative'
      el.style.height === '' ? el.style.height = '100%' : ''
      el.style.width === '' ? el.style.width = '100%' : ''
      mainTheme === 'tea' ? mainTheme = 'chalk' : ''
      mainTheme === 'fanta' ? mainTheme = 'chalk' : ''
      imgDom.style.cssText = 'margin: auto;position: absolute;top: 0; left: 0; bottom: 0; right: 0;'
      imgDom.src = `/static/images/system/noAuth-${mainTheme}.png`
      el.innerHTML = ''
      el.appendChild(imgDom)
    }
  },
  update(el, binding, vnode) {
    if (!binding.value && binding.oldValue) {
      el.querySelector('img').style.display = 'none'
    }
  }
}
