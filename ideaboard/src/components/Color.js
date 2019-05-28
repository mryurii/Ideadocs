import React from 'react';
import { TwitterPicker } from 'react-color';

class Color extends React.Component {
  state = {
    color: ''
  };

  handleChangeComplete = (color) => {
    if (this.props.selected) {
      // console.log('this.selected.changeBackground ', this.props.selected);
      this.props.selected.changeBackground(color.hex);
    }
    this.setState({ background: color.hex });
    this.props.changeColor(color.hex)
  };

 render() {
    return (
      <div hidden={ this.props.selected === null ? true : false }>
        <div style={{ display: (this.props.displayColorPicker ? 'block' : 'none') }}>
          <TwitterPicker
            className= "colorpicker"
            color={ this.state.color}
            onChangeComplete={ this.handleChangeComplete }
          />
        </div>
      </div>
    );
  }
}

export default Color
