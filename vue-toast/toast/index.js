import './toast.less'

let DOM_BODY = document.body

const createToastDOM = (text='') => {

    let __DOM = document.createElement('div')
    __DOM.className = 'mobile-toast'
    __DOM.innerText = text

    return __DOM
}

function Toast(title, second) {
    let __text = title || ''
    let __time = second || 2 * 1000

    let __DOM = createToastDOM(__text)

    DOM_BODY.appendChild(__DOM)

    setTimeout(() => {
        __DOM.classList.add('toast-active')

        setTimeout(() => {
            __DOM.classList.remove('toast-active')
            setTimeout(() => {
                DOM_BODY.removeChild(__DOM)
            }, 400)
        }, __time)
    }, 0)

}

export default Toast