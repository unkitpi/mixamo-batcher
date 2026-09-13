import { Message, MessageType } from './types'

interface MutableXMLHttpRequest extends XMLHttpRequest {
  _mbuUrl?: string
}

function safeJson<T = any>(value: string): T | null {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function dispatchMessageEvent(message: Message) {
  window.dispatchEvent(new CustomEvent<Message>('mbu_Message', { detail: message }))
}

window.addEventListener('message', (event: MessageEvent) => {
  if (event.source !== window || event.origin !== window.location.origin) return
  if (event.data?.source === 'mixamo-batcher' && event.data.type === 'set-product') {
    ;(window as any).mbu_Product = event.data.product ?? null
  }
})

function handleResponse(url: string, text: string, request: XMLHttpRequest) {
  const payload = safeJson<any>(text)
  if (!payload) return

  if (/\/api\/v1\/products\/[^/?]+/.test(url)) {
    dispatchMessageEvent({ type: MessageType.ProductFetched, payload })

    const win = window as any
    if (win.mbu_Product && payload.details) {
      payload.details.gms_hash = win.mbu_Product.details?.gms_hash ?? payload.details.gms_hash
      win.mbu_Product = null
    }

    // Mixamo reads responseText after the request completes. Replace it only when possible;
    // browsers may expose it as a non-configurable property for some response types.
    try {
      Object.defineProperty(request, 'response', { configurable: true, value: JSON.stringify(payload) })
      Object.defineProperty(request, 'responseText', { configurable: true, value: JSON.stringify(payload) })
    } catch {
      // The event above is still useful even if the native response cannot be rewritten.
    }
  } else if (/\/api\/v1\/products(?:[/?]|$)/.test(url)) {
    const ids = Array.isArray(payload?.results) ? payload.results.map((p: any) => p.id) : []
    dispatchMessageEvent({ type: MessageType.ProductsFetched, payload: ids })
  } else if (url.includes('/api/v1/characters/update_primary')) {
    dispatchMessageEvent({ type: MessageType.PrimaryUpdated, payload })
  }
}

function handleRequestBody(url: string, data: unknown) {
  if (!url.includes('/api/v1/animations/stream') || data == null) return
  if (typeof data !== 'string') return
  const payload = safeJson(data)
  if (payload) dispatchMessageEvent({ type: MessageType.StreamFetched, payload })
}

;(function installBridge() {
  const proto = XMLHttpRequest.prototype
  const originalOpen = proto.open
  const originalSend = proto.send

  proto.open = function (method: string, url: string | URL, async = true, username?: string | null, password?: string | null) {
    ;(this as MutableXMLHttpRequest)._mbuUrl = String(url)
    return (originalOpen as any).call(this, method, url, async, username, password)
  }

  proto.send = function (body?: Document | XMLHttpRequestBodyInit | null) {
    const request = this as MutableXMLHttpRequest
    const url = request._mbuUrl ?? ''
    if (url) {
      this.addEventListener('readystatechange', () => {
        if (this.readyState === XMLHttpRequest.DONE && this.status >= 200 && this.status < 400) {
          handleResponse(url, this.responseText, this)
        }
      })
      handleRequestBody(url, body)
    }
    return (originalSend as any).call(this, body)
  }

  const originalFetch = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init)
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    if (url.includes('/api/v1/animations/stream')) {
      handleRequestBody(url, init?.body)
    }
    if (response.ok && /\/api\/v1\/products(?:[/?]|$)/.test(url)) {
      const clone = response.clone()
      clone.text().then((text) => handleResponse(url, text, response as any)).catch(() => undefined)
    }
    return response
  }
})()
