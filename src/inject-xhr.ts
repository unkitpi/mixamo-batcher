const script = document.createElement('script')
script.src = chrome.runtime.getURL('xhr.js')
script.dataset.mixamoBatcher = 'true'
script.onload = () => script.remove()
;(document.head || document.documentElement).prepend(script)
