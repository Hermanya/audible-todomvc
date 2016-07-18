import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './screen/containers/App'
import configureStore from './redux/store/configureStore'
import 'todomvc-app-css/index.css'
import { doAudio } from './audio'

window.store = configureStore()

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

doAudio(`Welcome to ${document.title}; type help to hear what you can do`)
document.body.style.filter = 'blur(2px)'
document.body.style['-webkit-filter'] = 'blur(2px)'
