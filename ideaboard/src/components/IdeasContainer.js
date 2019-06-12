import React, { Component } from 'react'
import axios from 'axios'
import Idea from './Idea'
import update from 'immutability-helper'
import Color from './Color'
import { ActionCableConsumer } from 'react-actioncable-provider'

class IdeasContainer extends Component {
  state =  {
    ideas: [] ,
    selected: null,
    displayColorPicker: false
  }

  references = new Map()
  title = null

  componentDidMount() {
   axios.get('http://localhost:3001/api/v1/ideas.json')
    .then(response => { this.setState({ ideas: response.data }) })
    .catch(error => console.warn(error))
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
          const ideas = prevState.ideas.filter((item) => item.id !== idea.id)

          return { ideas }
        })
        break
      default:
        console.warn("Unhandled event type")
    }
  }

  addNewIdea = () => {
    axios.post(
      'http://localhost:3001/api/v1/ideas',
      { idea: { title: null, body: null, color: null } }
    )
    .then(response => {
      const currentIds = this.state.ideas.map(i => i.id)
      const isIdeaNotRendered = !currentIds.includes(response.data.id)

      if (isIdeaNotRendered) {
        const ideas = update(this.state.ideas, { $push: [response.data] })
        this.setState(
          { ideas: ideas },
          () => this.selected(response.data.id, true)
        )
      }
    })
    .catch(error => console.error(error))
  }

  updateIdea = (idea) => {
    this.props.onChange("All changes saved");
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

  // color

  selected(ideaId, enforceFocus = false) {
    let selectedRef = this.references.get(ideaId)
    this.setState(
      {
        selected: selectedRef,
        displayColorPicker: true,
      },
      () => enforceFocus ? this.title.focus() : null

    )
  }

  closeBox = () => {
    setTimeout(() => {
      this.setState({ displayColorPicker: false })
    }, 200);
  }

  render() {
    const ideas = this.state.ideas.map((idea) => {
      return(
        <Idea
          closeBox={ this.closeBox }
          className="tile"
          idea={idea}
          key={`${idea.id}-${idea.updated_at}`}
          updateIdea={this.updateIdea}
          titleRef = {input => this.title = input}
          onDelete={this.deleteIdea}
          onChangeComplete={ this.handleChangeComplete }
          ref = {c => this.references.set(idea.id, c)}
          onClick={() => { this.selected(idea.id) }}
        />
      )
    })

    return (
      <div>
        <ActionCableConsumer
          channel={{channel: 'IdeasChannel'}}
          onReceived={this.handleReceivedIdeaEvent}
        />

        <div className="main-div">
          <div className="newideabtn-div"></div>

          <div className="color-div">
            <div onClick={ this.handleUnselect }/>

            <Color
              className="color-div"
              selected={this.state.selected}
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
