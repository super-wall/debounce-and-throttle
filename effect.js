// 模拟事件触发渲染竖条（副作用）

(function(window) {
  const COLORS = ["#FFE589", "#B9C6FF", "#99FF7E", "#FFB38A", "#A5FCFF", "#FF8E9B", "#E3FF7E", "#FFA3D8", "#5ca6ff", "#9BFFBB"];

  var Effect = function(container, debounce) {
    this.container = container; 
    this.initialized = false;
    this.data = [];
    this.timer = null;
    this.maxWidth = container.getBoundingClientRect().width;
    this.invokeTimes = 0;
    if (debounce) {
      this.fillColor = debounce(this.fillColor);
    }
  }
  
  Effect.prototype.invoke = function(color, callback) {
    if (!this.initialized) {
      this.begin();
      return;
    }
    if (!this.timer) return;
    this.fillColor(color, callback);
  }

  Effect.prototype.begin = function() {
    this.initialized = true;
    this.timer = setInterval(() => {
      if (this.data.length * 9 >= this.maxWidth - 18) {
        clearInterval(this.timer);
      }
      this.data.push('none');
      this.render();
    }, 200)
  }

  Effect.prototype.reset = function() {
    this.initialized = false;
    this.data = [];
    this.render();
    clearInterval(this.timer)
  }

  Effect.prototype.fillColor = function (color, callback) {
    this.data[this.data.length - 1] = color;
    callback && callback();
  }

  Effect.prototype.render = function() {
    let html = '';
    for (let i = 0; i < this.data.length; i++) {
      html += `<span style="background: ${this.data[i]}"></span>`
    }
    this.container.innerHTML = html;
  }

  window.Effect = Effect;
})(window)