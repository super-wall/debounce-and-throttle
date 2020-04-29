# 实现防抖、节流函数

[demo地址](https://super-wall.github.io/debounce-and-throttle/index.html)

> demo是根据[贼好的文章](https://css-tricks.com/debouncing-throttling-explained-examples/)进行扩展，增加了修改参数的交互。

## 防抖

### 适用场景

防抖是指控制函数被执行的频率，保证在一段时间内(wait)频繁的被触发时，只会执行一次。例如：输入框模糊搜索频繁的调用接口、防止用户多次点击提交按钮、监听鼠标移动、dom的resize等。

### 代码实现

```javascript
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
  function trailingEdge(time) {
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
      trailingEdge(Date.now());
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
```

## 节流

### 适用场景

> throttle不单控制了函数频率，而且会wait时间内至少执行一次。

防抖技巧解决了大部分频繁调用的场景，但例如**滚动加载更多**的、个别场景就不适合。加载更多需要监听滚动距离，如果使用`debounce`函数，滑动到底部，wait时间后才会触发，会造成页面交互的卡顿，其实我们需要的是滑动的过程中就要检测，并且不要频繁检测。

### 代码实现

```javascript
// debounce函数传入maxWait 就可以实现throttle
function throttle(func, wait, options) {
  return debounce(func, wait, { ...options, maxWait: wait })
}
```