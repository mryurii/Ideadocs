import React, { Component } from 'react'
import axios from 'axios'
import { ActionCable } from 'react-actioncable-provider'

class BoardTitle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      editMode: false,
      id: null
    }

    this.handleBoardEvents = this.handleBoardEvents.bind(this)
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/v1/boards.json')
    .then(response => {
      const title = response.data[0].boardtitle

      this.setState({boards: response.data,
        title: title === "" ? "DEFAULT TITLE" : title,
        id: response.data[0].id
      })
    })
    .catch(error => console.log(error))
  }

  editTitle = (title) => {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  unFocus = (e) => {
    if (e.target.value !== "") {
      this.setState({
        editMode: false,
        title: e.target.value
      })
    } else {
      this.setState({
        editMode: false,
        title: "DEFAULT TITLE"
      })
    }
    axios
      .put(`http://localhost:3001/api/v1/boards/${this.state.id}`, {board: {boardtitle: e.target.value}})
      .then( res => {
    })
    .catch(error => console.log(error))
  }

  handleKey = (e) => {
    if (e.key === 'Enter') {
      if (e.target.value === "") {
        this.setState({
          title: "DEFAULT TITLE",
          editMode: false
        })
      } else {
        this.setState({
          editMode: false,
          title: e.target.value
        })
      }

      axios
        .put(`http://localhost:3001/api/v1/boards/${this.state.id}`, { board: { boardtitle: e.target.value } })
        .then( res => {
          console.log(res);
          console.log(res.data)
        })
        .catch(error => console.log(error))
    }
  }

  handleBoardEvents = ({event, board}) => {
    switch(event) {
      case 'updated':
        this.setState({title: board.boardtitle})
        break
      default:
        console.warn("Unhandled event type")
    }
  }

  render(){
    return(
      <div className="title">
        <ActionCable
          channel={{channel: "BoardsChannel"}}
          onReceived={this.handleBoardEvents}
        />
        {
          this.state.editMode ?
          <input defaultValue={this.state.title} onBlur={this.unFocus} onKeyDown={this.handleKey} style={{width:"100%", height:"30px", fontSize:"30px"}}  onClick={this.changeTitle}/>
          :
          <div className = "titlediv" align="center">
          <h1 className="boardtitle" onClick={this.editTitle}>{this.state.title}</h1>
          </div>
        }
      </div>

    );
  }
}

export default BoardTitle
