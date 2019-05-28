import React, { Component } from 'react'
import axios from 'axios'

class BoardTitle extends Component {
  state = {
    title: "",
    editMode: false,
    id: null
  }

  componentDidMount() {
   axios.get('http://localhost:3001/api/v1/boards.json')
    .then(response => {
      const title = response.data[0].boardtitle;
      this.setState({boards: response.data,
        title: title === "" ? "DEFAULT TITLE" : title,
        id: response.data[0].id
      })
      console.log(response.data)
      console.log("TITLE! ", response.data[0].boardtitle)
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

      console.log(res);
      console.log(res.data)
    })
     .catch(error => console.log(error))
   }


   handleKey = (e) => {
    if (e.key === 'Enter') {
    console.log(e.target.value)
     if (e.target.value === "") {
       console.log("dissapear")
       this.setState({
        title: "DEFAULT TITLE",
        editMode: false
      })
     } else {
      console.log("nooo")
      this.setState({
        editMode: false,
        title: e.target.value
      })
     }
    axios
      .put(`http://localhost:3001/api/v1/boards/${this.state.id}`, {board: {boardtitle: e.target.value}})
      .then( res => {
      console.log(res);
      console.log(res.data)
    })
     .catch(error => console.log(error))
   }
   }


  render(){
    return(
      <div className="title">
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
