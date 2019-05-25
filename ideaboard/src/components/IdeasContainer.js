import React, { Component } from 'react'
import axios from 'axios' 
import Idea from './Idea'
import update from 'immutability-helper'
import Notification from './Notification'
import $ from 'jquery';
import Color from './Color'
import BoardTitle from './BoardTitle' 
import firebaseConfig from './fbConfig'
import  * as firebase from 'firebase' 



firebase.initializeApp(firebaseConfig);

const dbRefObject = firebase.database().ref().child('object')
    
class IdeasContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideas: [] ,
      editingIdeaID: null,
      editingTitleID: null,
      notification: '', 
      selected: null,
      color: " ",
      displayColorPicker: false
    }
    this.references = new Map();
    this.selected = this.selected.bind(this);

  }

  componentDidMount() {
   axios.get('http://localhost:3001/api/v1/ideas.json')
    .then(response => {
      this.setState({ideas: response.data})
    })
    .catch(error => console.log(error))
  }

  addNewIdea = () => {
    axios.post('http://localhost:3001/api/v1/ideas', {idea: {title: '', body: '', color: ''}})
    .then(response => {
      const ideas = update(this.state.ideas, {$push: [response.data]})
      this.setState({ideas: ideas, editingIdeaID: response.data.id})
    })
    .catch(error => console.log(error))
  }

  updateIdea = (idea) => {
    const ideaIndex = this.state.ideas.findIndex(x => x.id === idea.id)
    const ideas = update(this.state.ideas, {[ideaIndex]: {$set:idea}})
    this.setState({ideas: ideas, notification: 'All changes saved'})
    this.props.setTransitionIn(true)
    this.sub.send({ ideas: idea.target.value, id: idea.id})
  }

  deleteIdea = (id) => {
    axios.delete(`http://localhost:3001/api/v1/ideas/${id}`)
    .then(response => {
      const ideaIndex = this.state.ideas.findIndex(x => x.id === id)
      const ideas = update(this.state.ideas, { $splice: [[ideaIndex, 1]]})
      this.setState({ideas: ideas})
    })
    .catch(error => console.log(error))
  }

  resetNotification = () => { 
    this.props.setTransitionIn(false)
    this.setState({notification: ''})
  }


  enableEditing = (id) => {
    this.setState({editingIdeaID: id}, () => {this.title.focus() })
  }

  // color 

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  selected(e) {
    let selectedRef = this.references.get(e);
    // console.log("SELECTED: ", selectedRef)
    this.setState({ selected: selectedRef, displayColorPicker: true }, () => console.log('this.state = ', this.state));
  }

  handleEditing = (id) => {
    this.setState({editingTitleID: id})
  }

  closeBox = () => {
    setTimeout(() => {
      this.setState({ displayColorPicker: false })
    }, 200);
  }
  changeColor = (color) => {
    this.setState({color});
  }

handleChangeStateColor = (color) => {
  console.log(color)
}


  render() {
    return (
      <div>
        <div className="main-div" >
        <div className="board-title" onClick={this.handleEditing}>
         </div>
          <div className="newideabtn-div">
          </div>
          <div>
          <Notification className="notification" in={true} notification={this.state.notification} />
          </div>
          <div className="color-div">
            <div onClick={ this.handleUnselect }/>
            <Color changeColor={this.changeColor} className="color-div" selected={this.state.selected} color={this.state.color} displayColorPicker={ this.state.displayColorPicker } />
          </div>
           <div className="pretty-div">
          </div>
        </div>
        {this.state.ideas.map((idea) => {
            return( <Idea
              color={this.state.color}
              closeBox={ this.closeBox } 
              className="tile"
              idea={idea} 
              key={idea.id} 
              handleChangeStateColor={this.handleChangeStateColor}
              updateIdea={this.updateIdea}
              titleRef = {input => this.title = input}
              resetNotification={this.resetNotification}
              onClick={this.enableEditing}
              onDelete={this.deleteIdea} 
              onChangeComplete={ this.handleChangeComplete }
              ref = {c => this.references.set(idea.id, c)}
              onClick={() => {this.selected(idea.id)}} />)   
              }
             )}
           <button className= "newIdeaButton" onClick={this.addNewIdea}>
              +
            </button>
          </div>
      );
   }
}

export default IdeasContainer
