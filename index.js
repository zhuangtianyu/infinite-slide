const state = {
  index: 0,
  length: 0,
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
  // 挂载 width 到 state
  Object.assign(state, { width: clientWidth })

  // 挂载 prev, next
  append(slide, 'span', 'prev').innerHTML = 'prev'
  append(slide, 'span', 'next').innerHTML = 'next'

  // 挂载 slide-container
  const width = `${clientWidth * (data.length + 1)}px`
  const container = append(slide, 'div', 'slide-container', { width })
  Object.assign(state, { container })

  // 挂载 slide-item
  data.concat(data[0]).map(url => {
    const style = {
      'background-image': `url(${url})`,
      'width': `${clientWidth}px`,
      'height': `${height}px`
    }
    append(container, 'div', 'slide-item', style)
  })

  const length = data.length
  Object.assign(state, { length })
}

const calculate = {
  left: () => {
    return 0
  },
  speed: () => {
    return 0
  }
}

const get = {
  left: () => -state.index * state.width
}

const set = {
  left: (step) => {
    const { index, length, container, width } = state
    if (index + step > length) {
      Object.assign(state, { index: 0 })
    }
    if (index + step < 0) {
      Object.assign(state, { index: length })
    }
    Object.assign(container.style, { left: `${-state.index * width}px` })
  }
}

const move = (target, speed, step) => {
  console.time('move')
  Object.assign(state, { moving: true })
  const { index, container } = state
  // fake interval start
  const interval = () => setTimeout(() => {
    const { offsetLeft } = container
    if (Math.abs(target - offsetLeft) < Math.abs(speed)) {
      Object.assign(container.style, { left: `${target}px` })
      Object.assign(state, { index: index + step, moving: false })
      // fake interval end
      return console.timeEnd('move')
    }
    Object.assign(container.style, { left: `${offsetLeft + speed}px` })
    interval()
  }, 1)
  interval()
}

const trigger = (step) => {
  if (state.moving) { return }
  // 修正 container left
  set.left(step)
  // calculate target && speed => move(target, speed, step)
  const { width, duration, container, index } = state
  const target = get.left() - step * width
  const speed = Math.round(-step * width / duration)
  move(target, speed, step)
}

const declare = () => {
  const prev = document.querySelector('.prev')
  const next = document.querySelector('.next')
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
  // position: absulote 的 slide-item 无法撑起 height
  Object.assign(slide.style, { height: `${height}px` })

  // 挂载 slide, frequency, duration 到 state
  Object.assign(state, { slide, frequency, duration })

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


