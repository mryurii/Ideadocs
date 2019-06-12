import React, { Component } from 'react'
import './App.css'
import IdeasContainer from './components/IdeasContainer'
import { Navbar, Container } from 'react-bootstrap'
import BoardTitle from './components/BoardTitle'
import Notification from './components/Notification'

class App extends Component {
  state = {
    transisitonIn: false,
    notification: null
  }

  setNotification = (notification) => {
    this.setState(
      { notification, transisitonIn: true },
      this.hideNotificationWithDelay
    )
  }

  hideNotificationWithDelay = () => {
    setTimeout(() => this.setState({ transisitonIn: false }), 1000)
  }

  render() {
    return (
      <div className="App">
        <Navbar expand="lg" variant="light" bg="light">
          <Container>
            <Navbar.Brand href="/" className="navbar">IDEADOCS</Navbar.Brand>

            <div className="notification">
              <Notification
                in={this.state.transisitonIn}
                notification={this.state.notification}
              />
            </div>
          </Container>
        </Navbar>

        <div className="title-container">
        </div>

        <BoardTitle onChange={this.setNotification} />

        <div className="App-header">
        </div>

        <IdeasContainer onChange={this.setNotification} />
      </div>
    )
  }
}

export default App
