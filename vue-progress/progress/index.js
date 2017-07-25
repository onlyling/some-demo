import Vue from 'vue'
import modalVue from './progress.vue'

const ModalConstructor = Vue.extend(modalVue)

let instance

const initInstance = () => {
    instance = new ModalConstructor({
        el: document.createElement('div')
    })
}

const startProgress = (show, width, err) => {
    if (!!!instance) {
        initInstance()
        document.body.appendChild(instance.$el)
    }

    Vue.nextTick(() => {
        instance.show = show
        if (err) {
            instance.styled = errorStyle
        } else {
            instance.styled = defaultStyle
            instance.width = width + '%'
        }
    })
}

const defaultStyle = {}

const errorStyle = {
    'background-color': '#f6383a'
}

const defaultSpeed = 1 // 普通过渡速度
const endSpeed = defaultSpeed * 5 // 加速过渡速度

let progressEndTimer = null // 结束的时候
let progressTimer = null // 进度过渡的时候
let progressEnd = 0 // 截止的进度
let progressCurrent = 0 // 当前的进度

const setProgress = (progress, end) => {

    clearTimeout(progressEndTimer)
    clearTimeout(progressTimer)

    progressEnd = progress
    const isAgainst = (progressEnd - progressCurrent) >= 0 // 是否是正向 100%方向
    const currentSpead = end ? endSpeed : defaultSpeed

    const doSet = () => {
        if (progressCurrent > progressEnd) {
            progressCurrent -= currentSpead
        } else {
            progressCurrent += currentSpead
        }

        startProgress(true, progressCurrent, false)

        if ((isAgainst && progressCurrent >= progressEnd) || (!isAgainst && progressCurrent <= progressEnd)) {
            if (end) {
                progressEndTimer = setTimeout(() => {
                    startProgress(false, '100', false)
                    setTimeout(() => {
                        startProgress(false, '0', false)
                        Progress.reset()
                    }, 20)
                }, 200)
            }
            return
        }

        progressTimer = setTimeout(() => {
            doSet()
        }, 17)
    }

    doSet()

}


function Progress() {}

Progress.start = (progress) => {
    let __progress = progress || 80
    __progress = +('' + __progress).replace(/[^\d]/g, '')
    if (__progress > 100) {
        __progress = 100
    }
    if (__progress < 0) {
        __progress = 0
    }

    setProgress(__progress, false)
}

Progress.end = () => {
    setProgress(100, true)
}

Progress.fail = () => {
    clearTimeout(progressEndTimer)
    clearTimeout(progressTimer)

    startProgress(true, '100%', true)
}

Progress.reset = () => {
    progressEnd = 0
    progressCurrent = 0
}

export default Progress