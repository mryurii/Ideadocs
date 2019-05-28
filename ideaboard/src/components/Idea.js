import React, { Component } from 'react'
import axios from 'axios'


class Idea extends Component {
	constructor(props) {
	super(props)
	this.state = {
	title:this.props.idea.title,
	body: this.props.idea.body,
	color: this.props.idea.color
  }
   this.changeBackground = this.changeBackground.bind(this);
 }

changeBackground(color) {
  this.setState({color});
 }

handleInput = (e) => {
	this.props.resetNotification()
	this.setState({[e.target.name]: e.target.value})
}

componentDidUpdate(prevProps) {
	if(prevProps.color !== this.props.color) {
		this.handleChangeColor();
	}
}

handleChangeColor = () => {
    axios.put(
      `http://localhost:3001/api/v1/ideas/${this.props.idea.id}`,
      {
        idea: {
          title: this.state.title,
          body: this.state.body,
          color: this.state.color
        }
      }
    )
    .then(response => {
      this.props.updateIdea(response.data)
      this.props.handleChangeStateColor(this.state.color)
    })
    .catch(error => console.log(error))
    this.props.closeBox()
  }

handleDelete = () => {this.props.onDelete(this.props.idea.id)}

handleClick = () => {this.props.onClick(this.props.idea.id)}

	render () {
		return(
			<div className="tile" onClick={this.props.onClick} style={{background: this.state.color}}>
				<span className="deleteButton" onClick={this.handleDelete}> x </span>
					<form onBlur={this.handleChangeColor}>
					<input style={{fontSize: "16px", fontWeight: "bold"}}className='input' type="text" name="title" placeholder='Enter a Title'
					value={this.state.title} onChange={this.handleInput} 
					ref={this.props.titleRef} onClick={this.handleColor} onClick={this.handleClick} />

					<textarea style={{fontSize: "14px"}}className='input' name="body" placeholder='Describe your idea'
					value={this.state.body} onChange={this.handleInput} onClick={this.handleClick} > </textarea>
      			</form>
      		</div>
   		)
	}
}

export default Idea
