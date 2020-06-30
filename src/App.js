import React from 'react';
import Stores from './components/Stores';
import { faAtom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'fontsource-roboto';
import { Switch } from '@material-ui/core';
import './styels/login.css'
class App extends React.Component {
  state = {
    isLoggedIn: false,
    isAdmin: false,
    useremail: "",
    password: "",
    emailInput: false,
    passwordInput: false,
    displayText: '',
    loading: false
  }

  toggle() {
    console.log("toggle");
    this.setState({ isAdmin: !this.state.isAdmin });
  }

  loginButton = () => {
    if (!this.state.useremail) {
      this.setState({ emailInput: true });
      this.setState({ displayText: 'Email Id Cannot be empty !' });
    }
    else if (!this.state.password) {
      this.setState({ passwordInput: true });
      this.setState({ displayText: 'Password Cannot be empty !' });
    }
    else if (!this.validateEmail(this.state.useremail)) {
      this.setState({ emailInput: true });
      this.setState({ displayText: 'Invalid email id!' });
    }
    else {
      this.loginUser(this.state.useremail, this.state.password, this.state.isAdmin);
    }
  }

  loginUser(userEmail, password, admin) {
    console.log(userEmail + "," + password);
    this.setState({ loading: true });
    let userObj = {
      userName: userEmail,
      passWord: password,
      admin: admin
    }

    let headder = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userObj)
    }
    fetch("https://nameless-wildwood-21485.herokuapp.com",headder)
    .then(res => res.json())
    .then(res =>{
        this.setState({loading: false});
        console.log(res);
        if(res.response){
            console.log("into respoonse if");
            this.setState({isLoggedIn:true});
            this.render();
        }
        else{
            this.setState({displayText:res.message});
        }
    })
  }

  validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  changeEmail(e) {
    this.changeWarningSign();
    this.setState({ useremail: e.target.value });
  }

  changePassword(e) {
    this.changeWarningSign();
    this.setState({ password: e.target.value });
  }

  changeWarningSign() {
    if (this.state.emailInput) {
      this.setState({ emailInput: false });
    }
    if (this.state.passwordInput) {
      this.setState({ passwordInput: false });
    }
    this.setState({ displayText: '' });
  }


  render() {
    const emailStyle = { border: this.state.emailInput ? 'solid' : 'none', borderColor: this.state.emailInput ? 'red' : '' };
    const passwordStyle = { border: this.state.passwordInput ? 'solid' : 'none', borderColor: this.state.passwordInput ? 'red' : '' };
    const loadingStyle = { display: this.state.loading ? '' : 'none', height: '40px' }

    if (this.state.isLoggedIn) {
      return <Stores loggedIn={this.state.isLoggedIn} userName={this.state.userName}></Stores>
    }
    else {
      return (
        <div className="loginMainContaier">
          <div className="loginContainer">
            <span id="topMargin"></span>
            <span id="logo">
              <FontAwesomeIcon icon={faAtom} style={{ color: "grey" }} />
            </span>
            <input style={emailStyle} id="inputText" placeholder="Email" type="text" onInput={e => this.changeEmail(e)} />
            <input style={passwordStyle} id="inputText" placeholder="Password" type="password" onChange={e => this.changePassword(e)} />
            <br></br>
            <button id="inButton" onClick={this.loginButton}>Log in</button>
            <p style={{ color: 'white' }}>Admin Toggle here 
            <Switch
              checked={this.state.isAdmin} 
              onChange={e => this.toggle()}
            ></Switch></p>
            <p style={{ color: 'white' }}>{this.state.displayText}</p>
            <img src="https://i.ya-webdesign.com/images/loading-png-gif.gif"
              style={loadingStyle}
            />
          </div>
        </div>
      )
    }
  }
}

export default App;
