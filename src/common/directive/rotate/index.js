export default {
  bind (el, binding, vnode) {
    let rotateInter = null
    let second = new Date().getSeconds()
    let index = second * 6
    let num = binding.value.getLen()
    if (rotateInter === null) {
      rotateInter = setInterval(function () {
        if (index === 360) {
          index = 0
        }
        el.style.transform = `rotate(${index}deg)`
        index++
        if (index % Math.round(360 / num) === 0) {
          let arrIndex = ''
          parseInt(index / Math.round(360 / num)) >= num ? arrIndex = 0 : arrIndex = parseInt(index / Math.round(360 / num))
          binding.value.getCurrentNode(arrIndex)
        }
      }, '500')
    } else {
      clearInterval(rotateInter)
    }
  }
}
