import React from 'react';
import '../styels/stores.css';
import { text } from '@fortawesome/fontawesome-svg-core';
import Select from '@material-ui/core/Select';

class Popup extends React.Component {

  state = {
    id: '',
    choosenValue1: "",
    choosenValue2: "",
    choosenValue3:"",
    name: '',
    address: '',
    element: {},
    changed: false,
    showText: '',
    categories:[]
  }

  componentWillMount() {
    console.log(this.props.element)
    if (!this.props.element) {
      this.props.closePopup();
    }
    this.setState({ element: this.props.element, categories:this.props.categories });
    console.log(this.state.element);
  }

  handleSubmit() {
    this.setState({ showText: 'Loading' });
    let element = this.state.element;
    if (this.state.address)
      element.address = this.state.address;
    if (this.state.name)
      element.name = this.state.name;
    

    let headder = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(element)
    }

    if (this.state.address || this.state.name) {
      console.log(element);
      fetch("http://localhost:8081/edit/store", headder)
        .then(res => res.json())
        .then(res => {
          console.log(res);
          this.setState({showText: "Changes Added"})
          this.props.closePopup();
          this.props.render();
        })
        .catch(err => console.log(err))
    }
  }

choosenValue2Handler(e){
  this.changeValue(this.state.choosenValue2, e.target.value);
}

choosenValue1Handler(e){
  this.changeValue(this.state.choosenValue1, e.target.value);
}

changeValue(choosenValue1, value){
  if (choosenValue1) {
    if (choosenValue1 == "Address")
      this.setState({ address: value });
    else
      this.setState({ name: value });
  } else {
    alert("Please select vale to enter");
  }
}

handleChange(e, value){
  this.setState({ changed: true });
  if (value == 1)
    this.setState({ choosenValue1: e.target.value });
  else 
    this.setState({choosenValue2 :e.target.value});
}

render() {
  return (
    <div className='popup'>
      <div className='popup_inner'>
        <p>Choose the value to be altered !</p>
        <Select
          native
          value={this.state.choosenValue1}
          onChange={e => this.handleChange(e, 1)}
          inputProps={{
            name: 'age',
            id: 'age-native-simple',
          }}>
          <option aria-label="None" value="" />
          <option value="Name">Name</option>
          <option value="Address">Address</option>
        </Select>
        <input type={text} className="popup_Input" placeholder={"Input Value"} onChange={e => this.choosenValue1Handler(e)} ></input>
        <Select
          native
          value={this.state.choosenValue2}
          onChange={e => this.handleChange(e, 2)}
          inputProps={{
            name: 'age',
            id: 'age-native-simple',
          }}>
           <option value="Name">Name</option>
          <option value="Address">Address</option>
        </Select>
        <input type={text} className="popup_Input" placeholder={"Input Value"} onChange={e => this.choosenValue2Handler(e)} ></input>
        <button className="popup_Button" onClick={this.props.closePopup}>Cancel</button>
        <button className="popup_Button" onClick={e => this.handleSubmit()}>Submit</button>
      </div>
      <p style={{ textAlign: 'center', fontSize: '15px' }}>{this.state.showText}</p>
    </div>
  );
}
}
export default Popup;
