const state = {
  index: 0,
  moving: false
}

const append = (parent, element, klass, style = {}) => {
  const child = document.createElement(element)
  child.classList.add(klass)
  Object.assign(child.style, style)
  parent.appendChild(child)
  return child
}

const mount = (slide, data, height) => {
  // 获取 slide clientWidth
  const { clientWidth } = slide

  // 挂载 prev, next
  append(slide, 'span', 'prev').innerHTML = 'prev'
  append(slide, 'span', 'next').innerHTML = 'next'

  // 挂载 slide-container
  const width = `${clientWidth * data.length}px`
  const container = append(slide, 'div', 'slide-container', { width })

  // 挂载 slide-item
  data.map(url => {
    const style = {
      'background-image': `url(${url})`,
      'width': `${clientWidth}px`,
      'height': `${height}px`
    }
    append(container, 'div', 'slide-item', style)
  })
}

const move = (step) => {
  console.log(step)
}

const declare = () => {
  const prev = document.querySelector('.prev')
  const next = document.querySelector('.next')
  prev.onclick = () => move(-1)
  next.onclick = () => move(1)
}

const slide = ({
  selector,
  data,
  speed,
  duration,
  mode,
  height = 200
}) => {
  const slide = document.querySelector(selector)
  // position: absulote 的 slide-item 无法撑起 height
  Object.assign(slide.style, { height: `${height}px` })

  // get slide array classlist
  const classList = Array.from(slide.classList)
  if (classList.indexOf('slide') === -1) {
    slide.classList.add('slide')
  }

  // mount dom
  mount(slide, data, height)

  // declare event
  declare()
}


