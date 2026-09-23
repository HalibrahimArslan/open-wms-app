import { useLayoutEffect, useState } from 'react'

export default function useFillHeight(ref, minHeight = 0) {
  const [height, setHeight] = useState(minHeight)

  useLayoutEffect(() => {
    const element = ref.current
    const scroller = element?.closest('main')
    if (!element || !scroller) {
      return
    }

    let frame
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let bottomSpace = parseFloat(getComputedStyle(scroller).paddingBottom)
        for (let parent = element.parentElement; parent && parent !== scroller; parent = parent.parentElement) {
          const style = getComputedStyle(parent)
          bottomSpace += parseFloat(style.paddingBottom) + parseFloat(style.borderBottomWidth) + parseFloat(style.marginBottom)
        }
        const contentBottom = scroller.clientHeight - bottomSpace
        const top = element.getBoundingClientRect().top - scroller.getBoundingClientRect().top - scroller.clientTop + scroller.scrollTop
        setHeight(Math.max(minHeight, Math.floor(contentBottom - top)))
      })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(scroller)
    observer.observe(element.parentElement)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [ref, minHeight])

  return height
}
