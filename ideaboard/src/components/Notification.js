import React from 'react'
import Transition from 'react-transition-group/Transition'

const duration = 1000

const defaultStyle = {
  transition: `background ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
  opacity: 0,
  padding: '10px'
}

const transitionStyles = {
  entering: { opacity: 1, background: 'lightgreen' },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0, background: 'lightgreen' },
  exited:  { opacity: 0 }
}

const Notification = ({ in: inProp, notification }) =>
  <Transition in={inProp} timeout={duration}>
    {state => (
      <span style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        {notification}
      </span>
    )}
  </Transition>

export default Notification
