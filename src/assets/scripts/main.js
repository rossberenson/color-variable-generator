import 'focus-visible'
import 'alpinejs'
import Processor from './components/processor'
import TextareaAutoSize from './components/textarea'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
  })
}

Processor();
TextareaAutoSize();