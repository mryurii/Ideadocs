import React, { Component } from 'react'
import axios from 'axios'
import Idea from './Idea'
import update from 'immutability-helper'
import Color from './Color'
import { ActionCable } from 'react-actioncable-provider';

class IdeasContainer extends Component {
  state =  {
    ideas: [] ,
    editingIdeaID: null,
    editingTitleID: null,
    notification: '',
    selected: null,
    color: " ",
    displayColorPicker: false
  }

  constructor(props) {
    super(props)
    this.references = new Map()
    this.selected = this.selected.bind(this)
    this.handleReceivedIdeaEvent = this.handleReceivedIdeaEvent.bind(this)
  }

  componentDidMount() {
   axios.get('http://localhost:3001/api/v1/ideas.json')
    .then(response => { this.setState({ ideas: response.data }) })
    .catch(error => console.log(error))
  }

  handleReceivedIdeaEvent = ({ event, idea }) => {
    switch(event) {
      case 'created':
        this.setState(prevState => {
          const currentIds = prevState.ideas.map(i => i.id)
          const isIdeaNotRendered = !currentIds.includes(idea.id)

          if (isIdeaNotRendered) {
            const ideas = update(this.state.ideas, {$push: [idea]})
            this.setState({ideas})
          }
        })
        break
      case 'updated':
        this.setState(prevState => {
          const ideas = prevState.ideas.map((item) => {
            if (item.id === idea.id) {
              return Object.assign(item, idea)
            } else {
              return item
            }
          })

          return { ideas }
        })
        break
      case 'deleted':
        this.setState(prevState => {
          const ideas = prevState.ideas.filter((item) => {
            if (item.id !== idea.id) {
              return item
            }
          })

          return { ideas }
        })
        break
      default:
        console.warn("Unhandled event type")
    }
    console.log("XXXXXx")
  }

  addNewIdea = () => {
    axios.post(
      'http://localhost:3001/api/v1/ideas',
      {
        idea: {
          title: '',
          body: '',
          color: ''
        }
      }
    )
    .then(response => {
      const ideas = update(this.state.ideas, {$push: [response.data]})
      this.setState({ideas: ideas, editingIdeaID: response.data.id})
    })
    .catch(error => console.log(error))
  }

  updateIdea = (idea) => {
    const ideaIndex = this.state.ideas.findIndex(x => x.id === idea.id)
    const ideas = update(this.state.ideas, {[ideaIndex]: {$set:idea}})
    this.setState({ideas: ideas})

    this.props.onChange("All changes saved");
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

  enableEditing = (id) => {
    this.setState({editingIdeaID: id}, () => {this.title.focus() })
  }

  // color

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  selected(e) {
    let selectedRef = this.references.get(e)
    this.setState({ selected: selectedRef, displayColorPicker: true })
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
    const ideas = this.state.ideas.map((idea) => {
      return(
        <Idea
          color={this.state.color}
          closeBox={ this.closeBox }
          className="tile"
          idea={idea}
          key={`${idea.id}-${idea.updated_at}`}
          handleChangeStateColor={this.handleChangeStateColor}
          updateIdea={this.updateIdea}
          titleRef = {input => this.title = input}
          resetNotification={this.props.resetNotification}
          onDelete={this.deleteIdea}
          onChangeComplete={ this.handleChangeComplete }
          ref = {c => this.references.set(idea.id, c)}
          onClick={() => {this.enableEditing && this.selected(idea.id)}}
        />
      )
    })

    return (
      <div>
        <ActionCable
          channel={{channel: 'IdeasChannel'}}
          onReceived={this.handleReceivedIdeaEvent}
        />

        <div className="main-div">
          <div className="board-title" onClick={this.handleEditing}>
          </div>
          <div className="newideabtn-div">
          </div>
          <div className="color-div">
            <div onClick={ this.handleUnselect }/>
            <Color
              changeColor={this.changeColor}
              className="color-div"
              selected={this.state.selected}
              color={this.state.color}
              displayColorPicker={this.state.displayColorPicker}
            />
          </div>

          <div className="pretty-div"></div>
        </div>

        <div>
          {ideas}
        </div>

        <button className= "newIdeaButton" onClick={this.addNewIdea}>+</button>
      </div>
    )
  }
}

export default IdeasContainer
