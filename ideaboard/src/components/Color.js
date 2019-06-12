import React from 'react'
import { TwitterPicker } from 'react-color'

class Color extends React.Component {
  state = {
    color: ""
  }

  handleChangeComplete = (color) => {
    this.props.selected.changeBackground(color.hex);
  }

 render() {
    return (
      <div hidden={ !this.props.selected }>
        <div style={{ display: (this.props.displayColorPicker ? 'block' : 'none') }}>
          <TwitterPicker
            className= "colorpicker"
            onChangeComplete={ this.handleChangeComplete }
          />
        </div>
      </div>
    );
  }
}

export default Color
