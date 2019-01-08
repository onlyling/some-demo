window.addEventListener('DOMContentLoaded', () => {
    const ELE_PROGRESS = document.querySelector('#j-progress');
    const CTX_PROGRESS = ELE_PROGRESS.getContext('2d');
    const ARC_WIDTH = 4; // 圆弧宽
    const WhiteValue = '#fff';
    const FillingValue = '#c64e40';

    const devicePixelRatio = window.devicePixelRatio || 1;
    const getPixelRatio = function(context) {
        let backingStore =
            context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
        return (devicePixelRatio || 1) / backingStore;
    };
    const RATIO_PROGRESS = getPixelRatio(CTX_PROGRESS);

    // 适配 canvas
    const adaptiveCanvas = (el, ctx, ratio) => {
        ctx.scale(ratio, ratio);
        ctx.translate(0.5, 0.5);

        el.style.width = el.width + 'px';
        el.style.height = el.height + 'px';

        el.width = el.width * ratio;
        el.height = el.height * ratio;
    };

    /**
     * 画圆弧进度
     * @param  {[type]} ctx      [description]
     * @param  {[type]} SIZE     [description]
     * @param  {Number} progress [description]
     * @return {[type]}          [description]
     */
    const drawBarProgress = (ctx, SIZE, progress = 0) => {
        // 大小，正方形，长、宽一样
        const SIZE_HALF = SIZE / 2;
        const lineWidth = ARC_WIDTH * RATIO_PROGRESS; // 适配高清屏，画布放大N倍，再缩小。圆弧的宽也应该放大
        const startAngle = (3 / 2) * Math.PI; // 开始位置弧度
        const diffAngle = (progress / 100) * Math.PI * 2; // 完成进度弧度值

        ctx.beginPath();

        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'butt';

        // canvas 画线的时候，是从绘制的中间开始，向两边伸展到线宽
        // 例如 在 1,1 10,1 两点绘制绘制宽为2的线，线的坐标是  1,0 1,2起，10,0 10,2止
        // 如果是奇数宽，会存在0.5的情况，看起来比较模糊
        ctx.arc(SIZE_HALF, SIZE_HALF, SIZE_HALF - lineWidth / 2, 0, 2 * Math.PI, false);
        ctx.strokeStyle = WhiteValue;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(SIZE_HALF, SIZE_HALF, SIZE_HALF - lineWidth / 2, startAngle, diffAngle + startAngle, false);
        ctx.strokeStyle = FillingValue;
        ctx.stroke();
    };

    /**
     * 画按钮
     * @param  {[type]} ctx  [description]
     * @param  {[type]} SIZE [description]
     * @return {[type]}      [description]
     */
    const drawBarIcon = (ctx, SIZE) => {
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - ARC_WIDTH * RATIO_PROGRESS, 0, 2 * Math.PI);
        ctx.fillStyle = FillingValue;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(SIZE / 3, SIZE / 4);
        ctx.lineTo((SIZE / 4) * 3, SIZE / 2);
        ctx.lineTo(SIZE / 3, (SIZE / 4) * 3);
        ctx.closePath();

        ctx.fillStyle = WhiteValue;
        ctx.fill();
    };

    /**
     * 画动态的波
     * @param  {[type]} ctx   [description]
     * @param  {[type]} OSIZE [description]
     * @return {[type]}       [description]
     */
    const drawBarWave = (ctx, OSIZE) => {
        const PARTITION_SIZE = Math.floor(OSIZE / 4);
        const BOX_SIZE = OSIZE - PARTITION_SIZE * 2;
        const BEAR_SIZE = 4;
        const MAX_Y = OSIZE - PARTITION_SIZE;
        const SIZE31 = Math.floor(BOX_SIZE / 3);
        const itemWidth = SIZE31 % 2 === 0 ? SIZE31 : SIZE31 - 1;
        const getX = (i) => {
            return PARTITION_SIZE + i * SIZE31 + itemWidth / 2;
        };
        const getRandomY = (Min = PARTITION_SIZE + BEAR_SIZE, Max = MAX_Y - BEAR_SIZE) => {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range); //四舍五入
            return num;
        };

        ctx.beginPath();
        ctx.lineWidth = 4 * RATIO_PROGRESS;
        ctx.strokeStyle = WhiteValue;
        ctx.lineCap = 'round';

        ctx.moveTo(getX(0), MAX_Y);
        ctx.lineTo(getX(0), getRandomY());

        ctx.moveTo(getX(1), MAX_Y);
        ctx.lineTo(getX(1), getRandomY());

        ctx.moveTo(getX(2), MAX_Y);
        ctx.lineTo(getX(2), getRandomY());

        ctx.stroke();
    };

    /**
     * 画图
     * @param  {Boolean} play     [description]
     * @param  {Number}  progress [description]
     * @return {[type]}           [description]
     */
    const drawBar = (play = false, progress = 0) => {
        const SIZE = ELE_PROGRESS.width;
        // 清空画布
        CTX_PROGRESS.clearRect(0, 0, SIZE, SIZE);

        drawBarProgress(CTX_PROGRESS, SIZE, progress);

        if (play) {
            drawBarWave(CTX_PROGRESS, SIZE);
        } else {
            drawBarIcon(CTX_PROGRESS, SIZE);
        }
    };

    // 避免 canvas 模糊
    adaptiveCanvas(ELE_PROGRESS, CTX_PROGRESS, RATIO_PROGRESS);

    let Playing = false;
    let pppp = 0;
    let palyTimer;
    let palyUpdate = () => {
        pppp += 1;
        drawBar(Playing, pppp);

        palyTimer = setTimeout(() => {
            palyUpdate();
        }, 300);
    };

    drawBar(Playing, pppp);

    ELE_PROGRESS.addEventListener('click', () => {
        Playing = !Playing;

        if (!Playing) {
            // 停止
            clearTimeout(palyTimer);
            drawBar(Playing, pppp);
        } else {
            palyUpdate();
        }
    });
});