import {h, render} from "vue";
import {pan} from "./method";

export function createController(dom) {
  const container = document.createElement("div");
  const list = [
    {
      type: "up",
      icon: "top"
    },
    {
      type: "down",
      icon: "bottom"
    },
    {
      type: "left",
      icon: "left"
    },
    {
      type: "right",
      icon: "right"
    }
  ];
  const vnode = h("div",
    { class: "d-control" },
    list.map(item => {
      return h("div", {
          class: `d-btn d-${item.icon}`,
          onClick: () => pan(item.type)
        },
        [
          h("i", { class: `iconfont el-icon-caret-${item.icon}` })
        ]);
    }));
  render(vnode, container);
  dom.append(container.firstElementChild);
}
