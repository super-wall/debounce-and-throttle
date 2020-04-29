/**
 * 对函数增加防抖，将函数执行的时间推迟到wait之后（自上次被触发往后退） 或者 推迟到 下一次页面渲染（通过requestAnimationFrame）
 * @param {Function} fn 要频繁执行的函数
 * @param {Number} wait 推迟到都长时间
 * @param {Boolean} options.leading 延时前是否执行
 * @param {Boolean} options.trailing 延时后是否执行
 * @param {Number} options.maxWait 最大的延时等待时间，debounce 传入 maxWait可以实现 throttle
 * @returns {Function} 返回被防抖控制后的函数
 */
function debounce(fn, wait, options) {

  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function')
  }

  // 默认参数
  options = {
    leading: false,
    trailing: true,
    ...options
  }

  // 延时器Id
  let timerId = null;
  // 函数执行结果
  let result = null;
  // 绑定的this
  let lastContext = null;
  // 函数传入的参数
  let lastArgs = null;
  // 上一次执行的时间
  let lastInvokeTime = 0;

  
  // 执行真正的函数
  function invokeFunc(time) {
    const currContext = lastContext;
    const currArgs = lastArgs;
    // 置空this、参数
    lastContext = lastArgs = null;
    // 更新上一次执行时间
    lastInvokeTime = time;
    result = fn.apply(currContext, currArgs);
    return result;
  }

  // 延时前阶段
  function leadingEdge(time) {
    lastInvokeTime = time;
    if (options.leading) {
      result = invokeFunc(time);
    }
  }

  // 延时后阶段
  function trailingEdge() {
    const time = Date.now();

    timerId = null;
    // trailing为true执行
    if (options.trailing && lastArgs) {
      result = invokeFunc(time);
    }
    // 置空this、参数
    lastContext = lastArgs = null;
  }


  // 取消当前防抖控制
  function cancel() {
    if (timerId !== null) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastContext = timerId = null
  }

  // 立即执行函数
  function flush() {
    if (timerId !== null) {
      trailingEdge();
    }
  }

  // 是否防抖控制中
  function pending() {
    return timerId !== null;
  }

  function debounced(...args) {
    const time = Date.now();

    lastArgs = args;
    lastContext = this;

    // 首次被调用，进入延时前阶段
    if (timerId == null) {
      leadingEdge(time);
    }

    // throttle传入maxWait，maxWait内至少执行一次
    const timeSinceLastInvoke = time - lastInvokeTime;
    if (options.maxWait && timeSinceLastInvoke >= options.maxWait) {
      invokeFunc(time);
    }
    
    // 每次被调用，重置定时器
    clearTimeout(timerId);
    timerId = setTimeout(trailingEdge, wait);

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}