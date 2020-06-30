import React from 'react';
import '../styels/stores.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faLocationArrow, faBars, faAd, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

class Stores extends React.Component{
    state = {
        loading:false,
        stores:[],
        displayText:'',
        isStoresDisplay:true,
        isAddDisplay: false,
        name:'',
        address:'',
        lattitue:'',
        longitutue:'',
    }
    componentDidMount(){
        this.setState({loading:true});
        fetch("https://nameless-wildwood-21485.herokuapp.com")
        .then(res => res.json())
        .then(res => {
            this.setState({loading: false});
            console.log(res);
            this.setState({stores:res.datas});
        })
    }

    getElement(e){
        return (
            <div className="questionsLifter" style={{marginTop:"80px"}}>
        <div key={e.id} className="questionsContainer">
                <p>{e.name}</p>
                <p>{e.address}</p>
                <p>{e.categories}</p>
                <a><FontAwesomeIcon icon={faLocationArrow}></FontAwesomeIcon></a>
        </div>
        </div>);
    }

    addName(e){
        this.setState({name:e.target.value});
    }

    address(e){
        this.setState({address:e.target.value});
    }
    
    lattitue(e){
        this.setState({lattitue:e.target.value});
    }
    
    longitutue(e){
        this.setState({longitutue:e.target.value});
    }

    addButton(val){
        if(val){
            this.setState({isStoresDisplay:false});
            this.setState({isAddDisplay:true});
        }
        else{
            {
                this.setState({isStoresDisplay:true});
                this.setState({isAddDisplay:false});
            }
        }
    }

    addStore(){
        let userObj = {
            name: this.state.name,
            address: this.state.address,
          }
      
          let headder = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userObj)
          }
        fetch("https://nameless-wildwood-21485.herokuapp.com", headder)
    }


    getAddDisplay(){
        return (<div className="questionsLifter" style={{marginTop:"80px"}}>
        <div className="AddContainer">
            <p>Add Store</p>
            <input className="addInputType" type="text" placeholder="Name" onChange={e => this.addName()}></input>
            <input className="addInputType" type="text" placeholder="Address" onChange={e => this.address()}></input>
            <input className="addInputType" type="number" placeholder="Lattitue" onChange={e => this.lattitue()}></input>
            <input className="addInputType" type="number" placeholder="Longitute" onChange={e => this.longitutue()}></input>
            <button className="addStore" onClick={e => this.addStore} >Add Store</button>
        </div>
        </div>  )
    }

    render(){
        const toDisplayStores = this.state.isStoresDisplay ? {display:''} : {display:'none'};
        const toDisplayAdd = this.state.isAddDisplay ? {display:''} : {display:'none'};
        const submiButton = this.state.showSubmitButton ? {display:''} : {display:'none'}
        const iconStyle = { fontSize: '40px', color: 'white', marginTop: '30px' }
        return(
            <div className="mainQuestionsContainer">
                <div className="navBar">
                    <div className="sideBarSelector" onClick={this.sideToggle}>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <p style={{ fontSize: '20px', marginLeft: '40px', padding: '8px' }}>Stores</p>
                </div>
                <div className="sideBar" style={this.state.sideBarToggle ? {marginLeft:'0px'}: {}}>
                    <div className="iconDisplay">
                        <FontAwesomeIcon icon={faGamepad} style={iconStyle} onClick={e => this.addButton(false)} />
                    </div>
                    <div className="iconDisplay">
                        <FontAwesomeIcon icon={faAd} style={iconStyle} onClick={e => this.addButton(true)}/>
                    </div>
                </div>
                <div className="mainContainer">
                    <div className="storesHolder" style={toDisplayStores}>
                    {this.state.stores.map(e => this.getElement(e))}
                    </div>
                    <div className="storesHolder" style={toDisplayAdd}>
                        {this.getAddDisplay()}
                    </div>
                    <div className="loadingImage" style={this.state.isLoding ?{display:'block'} : {display:'none'}}><img id="imageGIF" alt='' src="https://animaloilmaker.com/images/gif-red-loading-4.gif"></img></div>
                    <button className="ansWerButton" style={submiButton} onClick={() => this.checkAnswers()}>Submit</button>
                </div>
            </div>
        )
    }
}

export default Stores;