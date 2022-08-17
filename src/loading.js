import { h, render } from "vue";

const loading = (message,el) => {
  const container = document.createElement('div')
  const vnode = h('div',{class: 'd-loading'},[h('i',{class: 'el-icon-loading'}),h('div',{class: 'd-message'},message)])
  render(vnode,container)
  const d = document.querySelector(el)
  if(!d){
    console.error(`${el} notfound`);
    return
  }
  d.append(container.firstElementChild)
  return {
    close() {
      setTimeout(() => {
        render(null,container)
      },300)
    }
  }
}

export default loading
