/**
 * Chrome 调用摄像头拍照
 */
(function (win) {
  /**
   * 访问用户媒体设备的兼容方法
   * @param {{audio:boolean; video:boolean|{width:number; height:number;}}} constrains
   * @param {Function} success
   * @param {Function} error
   */
  function getUserMedia(constrains, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
      // 最新标准API
      navigator.mediaDevices
        .getUserMedia(constrains)
        .then(success)
        .catch(error);
    } else if (navigator.webkitGetUserMedia) {
      // webkit内核浏览器
      navigator.webkitGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator.mozGetUserMedia) {
      // Firefox浏览器
      navagator.mozGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator.getUserMedia) {
      // 旧版API
      navigator.getUserMedia(constrains).then(success).catch(error);
    }
  }

  /**
   * CameraPhotos 默认配置
   */
  var CameraPhotosDefaultOptions = {
    width: 600,
    height: 600,
  };

  /**
   * 摄像头调用
   * @param {Element} ele 容器元素
   * @param {{width:number; height:number;}} options 参数配置
   */
  function CameraPhotos(ele, options) {
    this.wrapper = ele;

    // 此处有使用 jQuery 的静态函数
    this.options = $.extend(true, {}, CameraPhotosDefaultOptions, options);

    // 初始化
    this.init();
  }

  CameraPhotos.prototype = {
    constructor: CameraPhotos,

    /**
     * 创建、初始化元素
     */
    init() {
      // 避免反复初始化
      if (this.video) {
        this.destroy();
      }

      this.runing = false;
      this.mediaStreamTrack = null;
      this.video = null;
      this.canvas = null;

      this.createVideo();
      // 插入 video 元素
      this.wrapper.appendChild(this.video);

      this.createCanvas();
      // 插入 canvas 元素
      this.wrapper.appendChild(this.canvas);
    },

    /**
     * 创建 video 元素
     */
    createVideo() {
      // 缓存 this，避免作用域问题
      var _this = this;

      _this.video = document.createElement("video");
      _this.video.setAttribute("autoplay", true);
      _this.video.style.width = _this.options.width + "px";
      _this.video.style.height = _this.options.height + "px";
    },

    /**
     * 创建 canvas 元素
     */
    createCanvas() {
      // 缓存 this，避免作用域问题
      var _this = this;

      _this.canvas = document.createElement("canvas");
      _this.canvas.width = _this.options.width;
      _this.canvas.height = _this.options.height;
      _this.canvas.style.position = "absolute";
      _this.canvas.style.top = "-10000px";
      _this.canvas.style.left = "-10000px";
    },

    /**
     * 开启摄像头
     * @returns Promise<any>
     */
    startVideo: function () {
      // 缓存 this，避免作用域问题
      var _this = this;

      _this.stopVideo();

      _this.runing = true;

      return new Promise(function (resolve, reject) {
        if (!_this.video) {
          _this.runing = false;
          reject("请先创建 video 元素");
        }

        // 调用涉嫌头
        getUserMedia(
          {
            audio: false,
            video: { width: _this.options.width, height: _this.options.height },
          },
          function (stream) {
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in _this.video) {
              _this.video.srcObject = stream;
            } else {
              // 防止在新的浏览器里使用它，应为它已经不再支持了
              _this.video.src = window.URL.createObjectURL(stream);
            }

            _this.video.onloadedmetadata = function (e) {
              _this.video.play();
              resolve();
            };

            _this.mediaStreamTrack =
              typeof stream.stop === "function"
                ? stream
                : stream.getTracks()[0];
          },
          function (e) {
            _this.runing = false;
            console.log("调用摄像头失败");
            console.log(e);
            reject(e);
          }
        );
      });
    },

    /**
     * 关闭摄像头
     */
    stopVideo: function () {
      // 缓存 this，避免作用域问题
      var _this = this;

      _this.video && _this.video.pause();
      _this.mediaStreamTrack &&
        _this.mediaStreamTrack.stop &&
        _this.mediaStreamTrack.stop();

      _this.runing = false;
    },

    /**
     * 拍照
     * @param {'image/png'|'image/jpeg'|'image/webp'} type 生成什么类似的图片。 默认 'image/jpeg'
     * @param {number} encoderOptions 在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择图片的质量。默认 0.8
     * @returns {Promise<string>}
     */
    photograph: function (type, encoderOptions) {
      // 缓存 this，避免作用域问题
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (!_this.runing) {
          return reject("请先运行 startVideo");
        }

        var context = _this.canvas.getContext("2d");
        // 绘制画面
        context.drawImage(
          _this.video,
          0,
          0,
          _this.options.width,
          _this.options.height
        );

        const imgUrl = _this.canvas.toDataURL(
          type || "image/jpeg",
          encoderOptions || 0.8
        );

        resolve(imgUrl);
      });
    },

    /**
     * 销毁
     */
    destroy: function () {
      // 缓存 this，避免作用域问题
      var _this = this;

      // 停止调用摄像头
      _this.stopVideo();

      if (_this.video) {
        // 移除元素
        _this.wrapper.removeChild(_this.video);
        _this.wrapper.removeChild(_this.canvas);

        // 变量制空/删除
        _this.video = null;
        _this.canvas = null;
      }
    },
  };

  win.CameraPhotos = CameraPhotos;
})(window);
