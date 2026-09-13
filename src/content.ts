import { Message, MessageType, Product } from './types'

let viewProduct: Product | null = null
let iframe: HTMLIFrameElement | null = null

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === MessageType.Init) {
    chrome.runtime.sendMessage({
      type: MessageType.SetAccessToken,
      payload: localStorage.getItem('access_token') ?? '',
    })
  } else if (message.type === MessageType.ViewProduct) {
    viewProduct = message.payload
    injectProductScript(viewProduct)
  }
})

window.addEventListener('mbu_Message', ((event: CustomEvent<Message>) => {
  chrome.runtime.sendMessage(event.detail)

  if (event.detail.type === MessageType.ProductsFetched && viewProduct) {
    const index = event.detail.payload.indexOf(viewProduct.id)
    if (index >= 0) setTimeout(() => clickOnViewProduct(index), 500)
  }
}) as EventListener)

function injectProductScript(product: Product | null) {
  window.postMessage(
    {
      source: 'mixamo-batcher',
      type: 'set-product',
      product,
    },
    window.location.origin,
  )
}

function clickOnViewProduct(index: number) {
  const candidates = document.querySelectorAll('.product li, [data-product-id], .product-results li')
  candidates[index]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
}

function shouldShowPanel() {
  const hash = location.hash
  return /type=(Motion|Motion%2CMotionPack|Character)/i.test(hash) ||
    document.querySelector('.sidebar-list, .product-results, [class*="sidebar"]') !== null
}

function mountIframe() {
  if (!document.body || iframe) return
  iframe = document.createElement('iframe')
  iframe.id = 'mixamo-batch'
  iframe.title = 'Mixamo Batcher'
  iframe.src = chrome.runtime.getURL('index.html')
  Object.assign(iframe.style, {
    border: '0',
    top: '255px',
    bottom: '0',
    display: 'none',
    position: 'fixed',
    right: '0',
    width: 'clamp(260px, 13.5vw, 300px)',
    height: 'auto',
    minWidth: '260px',
    zIndex: '2147483647',
    background: '#fff',
    borderLeft: '1px solid #d5d5d5',
    boxShadow: '-2px 0 8px rgba(0,0,0,.12)',
  })
  document.body.appendChild(iframe)

  const updateVisibility = () => {
    if (iframe) iframe.style.display = shouldShowPanel() ? 'block' : 'none'
  }
  updateVisibility()
  window.addEventListener('hashchange', updateVisibility)
  new MutationObserver(updateVisibility).observe(document.body, { childList: true, subtree: true })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountIframe, { once: true })
} else {
  mountIframe()
}
