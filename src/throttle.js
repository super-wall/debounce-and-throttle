function throttle(func, wait, options) {
   return debounce(func, wait, { ...options, maxWait: wait })
}