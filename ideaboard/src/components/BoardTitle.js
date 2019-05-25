import React, { Component } from 'react'
import ReactDOM from 'react-dom'
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
      this.setState({boards: response.data,
        title: response.data[0].boardtitle,
        id: response.data[0].id
      })
      console.log(response.data)
      console.log("TITLE! ", response.data[0].boardtitle)
    })
    .catch(error => console.log(error))
  }

   editTitle = (e) => {
    if (e.target.value == " ") {
       this.setState({
      title: "TITLE"
    })
    } else {
    this.setState({
      editMode: !this.state.editMode
      })
    }
    console.log(e.target.value)
   }
 

   unFocus = (e) => {
    console.log(e.target.value);
    this.setState({
      editMode: false,
      title: e.target.value
      })
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
    console.log(e.target.value);
    this.setState({
      editMode: false,
      title: e.target.value
      })
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
          <h1 onClick={this.editTitle}>{this.state.title}</h1>
        }
      </div>
      
    );
  }
}

export default BoardTitle