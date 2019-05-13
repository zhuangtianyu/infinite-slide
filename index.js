const state = {
  left: 0,
  index: 0,
  length: 0,
  moving: false
}

const config = {
  frequency: void 0,
  duration: void 0
}

const element = {
  slide: void 0,
  container: void 0,
  prev: void 0,
  next: void 0
}

const style = { width: 0, height: 0 }

const append = (parent, element, klass, style = {}) => {
  const child = document.createElement(element)
  child.classList.add(klass)
  Object.assign(child.style, style)
  parent.appendChild(child)
  return child
}

const mount = (data) => {
  const { slide } = element
  const { clientWidth: width } = slide
  const { height } = style
  // 挂载 width 到 style
  Object.assign(style, { width })

  // 挂载 prev, next
  const prev = append(slide, 'span', 'prev')
  const next = append(slide, 'span', 'next')
  prev.innerHTML = 'prev'
  next.innerHTML = 'next'
  Object.assign(element, { prev, next })

  // 挂载 slide-container
  const containerStyle = {
    width: `${width * (data.length + 1)}px`,
    height: `${style.height}px`
  }
  const container = append(slide, 'div', 'slide-container', containerStyle)
  Object.assign(element, { container })

  // 挂载 slide-item
  data.concat(data[0]).map(url => {
    const style = {
      'background-image': `url(${url})`,
      'width': `${width}px`,
      'height': `${height}px`
    }
    append(container, 'div', 'slide-item', style)
  })

  const length = data.length
  Object.assign(state, { length })
}

const get = {
  left: () => - state.index * style.width
}

const set = {
  left: (step) => {
    const { index, length } = state
    const { container } = element
    const { width } = style
    index + step > length
      ? Object.assign(state, { index: 0 })
      : void 0
    index + step < 0
      ? Object.assign(state, { index: length })
      : void 0
    const left = `${- state.index * width}px`
    Object.assign(container.style, { left })
  }
}

const calculate = (step) => {
  const { index } = state
  const { width } = style
  const { duration } = config
  // speed * 4 => 修正 browser setTimeout delay min 4ms
  return {
    target: get.left() - step * width,
    speed: Math.round(- step * width / duration) * 4
  }
}

const move = (target, speed, step) => {
  console.time('move')
  Object.assign(state, { moving: true })
  const { index } = state
  const { container } = element
  // virtual interval start
  const interval = () => setTimeout(() => {
    const { offsetLeft } = container
    if (Math.abs(target - offsetLeft) < Math.abs(speed)) {
      Object.assign(container.style, { left: `${target}px` })
      Object.assign(state, { index: index + step, moving: false })
      return console.timeEnd('move')
    }
    Object.assign(container.style, { left: `${offsetLeft + speed}px` })
    interval()
  }, 4)
  interval()
}

const trigger = (step) => {
  if (state.moving) { return }
  // 修正 container left
  set.left(step)
  // calculate target && speed
  const { target, speed } = calculate(step)
  move(target, speed, step)
}

const declare = () => {
  const { prev, next } = element
  prev.onclick = () => trigger(-1)
  next.onclick = () => trigger(1)
}

/**
 * @param selector  选择器
 * @param data      background-image[]
 * @param frequency 切换频率
 * @param duration  过渡时间
 * @param mode      模式
 * @param height    高度
 */

const slide = ({
  selector,
  data,
  frequency = 2000, // 频率
  duration = 300, // 过渡时间
  mode,
  height = 200
}) => {
  const slide = document.querySelector(selector)
  // assign slide to element
  Object.assign(element, { slide })
  // position: absulote 的 slide-container 无法撑起 height
  Object.assign(slide.style, { height: `${height}px` })
  // assign height to style
  Object.assign(style, { height })
  // assign config to config
  Object.assign(config, { frequency, duration })

  // get slide array classlist
  const classList = Array.from(slide.classList)
  // add slide class to slide element
  classList.indexOf('slide') === -1
    ? slide.classList.add('slide')
    : void 0

  // mount container + item + prev + next
  mount(data)

  // declare event
  declare()
}


