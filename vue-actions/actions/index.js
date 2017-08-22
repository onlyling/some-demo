let DOM_BODY = document.body

const removeDOM = (dom) => {
    DOM_BODY.removeChild(dom)
}

const addDOM = (dom) => {
    DOM_BODY.appendChild(dom)
}

const createOverlayDOM = () => {
    let __dom = document.createElement('div')
    __dom.className = 'mobile-modal-overlay'
    return __dom
}

const createActionsDOM = () => {
    let __dom = document.createElement('div')
    __dom.className = 'mobile-actions'
    return __dom
}

const createGroupDOM = (arr = [], closeActions) => {
    let __dom = document.createElement('div')
    __dom.className = 'action-group'

    arr.forEach((action) => {
        __dom.appendChild(createButtonDOM(action, closeActions))
    })

    return __dom
}

const createButtonDOM = (obj, closeActions) => {
    let __dom = document.createElement('span')

    __dom.innerText = obj.text

    if (obj.label) {
        __dom.className = 'actions-modal-label'
    } else {

        let __className = 'actions-modal-button'

        if (obj.bg) {
            __className += ' bg-' +obj.bg
        }

        __dom.className = __className
        __dom.addEventListener('click', function(e) {
            closeActions()
            obj.onClick && obj.onClick(obj.params)
        })
    }

    return __dom
}


function Actions(buttons) {

    let actionDOM = createActionsDOM()
    let overlayDOM = createOverlayDOM()

    const closeActions = () => {
        actionDOM.classList.remove('actions-active')
        overlayDOM.classList.remove('modal-overlay-visible')

        setTimeout(() => {
            removeDOM(actionDOM)
            removeDOM(overlayDOM)
        }, 400)
    }

    let __closeButtons = [{
        text: '取消',
        bg: 'danger'
    }]

    let actionGroup = createGroupDOM(buttons, closeActions)
    let closeGroup = createGroupDOM(__closeButtons, closeActions)

    actionDOM.appendChild(actionGroup)
    actionDOM.appendChild(closeGroup)


    addDOM(actionDOM)
    addDOM(overlayDOM)

    setTimeout(() => {
        actionDOM.classList.add('actions-active')
        overlayDOM.classList.add('modal-overlay-visible')
    }, 300)

}

export default Actions