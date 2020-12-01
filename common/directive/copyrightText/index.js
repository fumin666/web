import {getConfig} from 'sunflower-common-utils'

export default {
  bind(el, binding, vnode) {
    let year = new Date().getFullYear();
    if (binding.value && binding.value.lang === 'en') {
      el.innerHTML = `Copyright&copy;${year} ` + getConfig('copyrightEn');
    } else {
      el.innerHTML = `版权所有&copy;${year} ` + getConfig('copyrightCn');
    }
  }
}
