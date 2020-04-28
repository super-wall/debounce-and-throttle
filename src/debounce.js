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

  // 默认参数
  options = {
    leading: false,
    trailing: true,
    ...options
  }

  // 延时器id
  let timer = null;
  // 绑定this
  let context = null;
  // 参数
  let args = null;
  // 上一次执行的时间
  let prev = 0;

  function debounced() {
    context = this;
    args = arguments;
    // 延时前执行，timer不存在时说明没有被触发，可以执行
    if (options.leading && !timer) {
      fn.apply(context, args);
    }
    // throttle的prev初始值为当前时间，防止多触发一次
    if (options.maxWait && !prev) {
      prev = Date.now();
    }
    // 重置timer
    if (timer) {
      clearTimeout(timer);
    }
    // 距离上一次被真正执行超过maxWait
    if (options.maxWait && Date.now() - prev > options.maxWait) {
      prev = Date.now();
      fn.apply(context, args);
    }
    // 将函数执行的时间推迟到wait之后
    timer = setTimeout(() => {
      if (options.trailing) {
        fn.apply(context, args);
        prev = Date.now();
      }
      timer = null;
    }, wait)
  }

  // 返回被防抖控制后的函数
  return debounced;
}