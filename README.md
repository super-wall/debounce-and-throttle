# 实现防抖、节流函数

[demo地址](https://super-wall.github.io/debounce-and-throttle/index.html)

> demo是根据[贼好的文章](https://css-tricks.com/debouncing-throttling-explained-examples/)进行扩展，增加了修改参数的交互。

## 防抖

### 适用场景

防抖是指控制函数被执行的频率，保证在一段时间内(wait)频繁的被触发时，只会执行一次。例如：输入框模糊搜索频繁的调用接口、防止用户多次点击提交按钮、监听鼠标移动、dom的resize等。

### 代码实现

> 以下是简易版，详细版查看src下代码，或阅读lodash源码

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
```

## 节流

### 适用场景

> throttle不单控制了函数频率，而且会wait时间内至少执行一次。

防抖技巧解决了大部分频繁调用的场景，但例如**滚动加载更多**的、个别场景就不适合。加载更多需要监听滚动距离，如果使用`debounce`函数，滑动到底部，wait时间后才会触发，会造成页面交互的卡顿，其实我们需要的是滑动的过程中就要检测，并且不要频繁检测。

### 代码实现

> 以下是简易版，详细版查看src下代码，或阅读lodash源码

```javascript
// debounce函数传入maxWait 就可以实现throttle
function throttle(func, wait, options) {
  return debounce(func, wait, { ...options, maxWait: wait })
}
```