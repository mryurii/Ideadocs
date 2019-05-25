import React, { Component } from 'react'
import './App.css'
import IdeasContainer from './components/IdeasContainer'
import {Navbar, Container} from 'react-bootstrap';
import BoardTitle from './components/BoardTitle'
import Notification from './components/Notification'
import $ from 'jquery';



class App extends Component {
    constructor(props) {
    super(props);
    this.state = {
      transisitonIn: false,
      notification: ''
    }
    this.setTransitionIn = this.setTransitionIn.bind(this)
  }

  setTransitionIn = (e) => {
    this.setState({transisitonIn: e})
  }


  render() {
    return (

      <div className="App">
      
      <Navbar expand="lg" variant="light" bg="light">
      <Container>
     <Navbar.Brand href="/" className="navbar">IDEADOCS</Navbar.Brand>
    <Notification className="notification" in={true} notification={this.state.notification} />
      </Container>
      </Navbar>
      <div className="title-container">
      </div>
      <BoardTitle />
      <div className="App-header">
      </div>
     <IdeasContainer setTransitionIn = {this.setTransitionIn}/>

      </div>
    )
  }
}

export default App