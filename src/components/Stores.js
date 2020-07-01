import React from 'react';
import '../styels/stores.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from './PopUp';
import StarRatingComponent from 'react-star-rating-component';
import Select from '@material-ui/core/Select';
import { faGamepad, faLocationArrow, faBars, faAd, faSyncAlt, faTimes, faEdit, faStore } from '@fortawesome/free-solid-svg-icons';

class Stores extends React.Component {

    state = {
        stores: {},
        sideBarToggle: false,
        displayText: '',
        isStoresDisplay: true,
        isAddDisplay: false,
        addStoreElement: {},
        lattitude: '',
        longitude: '',
        isAdmin: true,
        categories: '',
        toAddCategory: '',
        showPopup: false,
        popUpElement: {},
        user: {},
        ratingHolder:{},
        rating: 0,
        categoriesAvailable: [],
        AddStoreText: ''
    }

    componentDidMount() {
        //this.setState({ user: this.props.user, isAdmin: this.props.user.adminLogin });
        this.fetchStores();
        fetch("http://localhost:8081/get/categoris")
            .then(res => res.json())
            .then(res => {
                this.setState({ categoriesAvailable: res.datas });
                console.log(this.state.categoriesAvailable)
            })
    }

    fetchStores() {
        fetch("http://localhost:8081/get/stores")
            .then(res => res.json())
            .then(res => {
                this.setState({ loading: false });
                console.log(res);
                this.setState({ stores: res.datas[0] });
                console.log(this.state.stores)
            })
    }

    onStarClick(nextValue) {
        this.setState({ rating: nextValue });
    }

    handleRatingSubmit(e) {
        let id = e.target.id
        console.log(e.target.id);
        console.log(this.state.user);
        if (id && this.state.user.userName && this.state.rating && this.state.rating <= 10) {
            fetch("http://localhost:8081/add/rating?storeId=" + id + "&userName=" + this.state.user.userName + "&rating=" + this.state.rating)
                .then(res => res.json())
                .then(res =>{
                    alert("Review added");
                    console.log(res);
                })
            }else {
            alert("Try Again later");
        }
    }


    getUserRating(ele) {
        console.log(ele)
        let rating = 0;
        if (!this.state.isAdmin) {
            if (ele.ratingsMap && ele.ratingsMap[this.state.user.userName]) {
                rating = ele.ratingsMap[this.state.user.userName];
            }
            return (<div className="starComponent">
                <input className={ele.id} type='number' max={10} onChange={e => this.onStarClick(e.target.value)}></input>
                <button style={{ marginTop: '10px' }} id={ele.id} className="submitButton" onClick={e => this.handleRatingSubmit(e)}>Submit Review</button>
            </div>)
        }
        return '';
    }

    mapsAPI(e){
        console.log(e.target.id);
        let value = e.target.id;
        if(value){
            let url = "https://www.google.com/maps/search/?api=1&query="+this.state.stores[value].geoLocations[0]+","+this.state.stores[value].geoLocations[1]
            window.open(url, "_blank");
        }
    }



    getElement(e) {
        return (
            <div className="storesLifter">
                <div key={e.id} className="storesContainer">
                    <div className="editIcon" style={this.state.isAdmin ? {display:''} : {display:'none'}}>
                        <FontAwesomeIcon id={e.id} icon={faEdit} onClick={e => this.editHanlder(e)}></FontAwesomeIcon>
                    </div>
                    <p className="sotoreName">{e.name}</p>
                    <p className="sotoreAddress">Address : {e.address}</p>
                    <a className="storeIcon"><FontAwesomeIcon
                        icon={faStore}
                    /></a>
                    <p className="sotoreCategory">
                        {e.categories}</p>
                    <div className="storeLocation">
                        <FontAwesomeIcon id={e.id} icon={faLocationArrow} onClick={e => this.mapsAPI(e)}></FontAwesomeIcon>
                    </div>
                    <di>
                        {this.getUserRating(e)}
                    </di>
                </div>
            </div>);
    }

    editHanlder(e) {
        console.log(this.state.stores[e.target.id]);
        this.setState({ popUpElement: this.state.stores[e.target.id] });
        this.togglePopup();
    }

    addButton(val) {
        if (val) {
            this.setState({ isStoresDisplay: false });
            this.setState({ isAddDisplay: true });
        }
        else {
            this.setState({ isStoresDisplay: true });
            this.setState({ isAddDisplay: false });
        }
    }

    addStore() {
        let userObj = this.state.addStoreElement;
        if (!userObj.name) {
            alert("Please Enter the Name");
        }
        else if (!userObj.address) {
            alert("Please Enter the address");
        }
        else if (!userObj.categories) {
            alert("Select a Categories");
        }
        else if (!this.state.lattitude) {
            alert("Please Enter Lattitude");
        }
        else if (!this.state.longitude) {
            alert("Please Enter Longittude");
        }
        else {
            this.setState({ AddStoreText: 'Processing Please Wait' })
            userObj.geoLocations = [this.state.lattitude, this.state.longitude];
            let headder = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userObj)
            }
            console.log(userObj);
            fetch("http://localhost:8081/add/store", headder)
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    this.setState({ AddStoreText: 'Store Added' });
                    this.fetchStores();
                })
                .catch(er => console.log(er))
        }
    }

    sideToggle() {
        this.setState({ sideBarToggle: !this.state.sideBarToggle });
    }

    togglePopup() {
        console.log('Into popup');
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        const toDisplayStores = this.state.isStoresDisplay ? { display: '' } : { display: 'none' };
        const toDisplayAdd = this.state.isAddDisplay ? { display: '' } : { display: 'none' };
        const submiButton = this.state.showSubmitButton ? { display: '' } : { display: 'none' }
        const iconStyle = { fontSize: '40px', color: 'white', marginTop: '30px' }
        return (
            <div className="mainQuestionsContainer">
                <div className="navBar">
                    <div className="sideBarSelector" onClick={this.sideToggle}>
                        <FontAwesomeIcon icon={faBars} />
                    </div>
                    <p style={{ fontSize: '20px', marginLeft: '40px', padding: '8px' }}>Stores</p>
                </div>
                <div className="sideBar" style={this.state.sideBarToggle ? { marginLeft: '0px' } : {}}>
                    <div className="iconDisplay">
                        <FontAwesomeIcon icon={faGamepad} style={iconStyle} onClick={e => this.addButton(false)} />
                    </div>
                    <div className="iconDisplay" style={this.state.isAdmin ? {} : { display: 'none' }}>
                        <FontAwesomeIcon icon={faAd} style={iconStyle} onClick={e => this.addButton(true)} />
                    </div>
                </div>
                <div className="mainContainer">
                    <div className="storesHolder" style={toDisplayStores}>
                        {Object.keys(this.state.stores).map(e => this.getElement(this.state.stores[e]))}
                    </div>
                    <div className="AddContainer" style={toDisplayAdd}>
                        {this.getAddDisplay(this.state.displayText)}
                    </div>
                    {this.state.showPopup ? <Popup
                        element={this.state.popUpElement}
                        render={this.render}
                        categories={this.state.categoriesAvailable}
                        closePopup={this.togglePopup.bind(this)}
                    />
                        : null
                    }
                    <div className="loadingImage" style={this.state.isLoding ? { display: 'block' } : { display: 'none' }}><img id="imageGIF" alt='' src="https://animaloilmaker.com/images/gif-red-loading-4.gif"></img></div>
                    <button className="ansWerButton" style={submiButton} onClick={() => this.checkAnswers()}>Submit</button>
                </div>
            </div>
        )
    }

    changeValue(e, value) {
        let addStoreElement = this.state.addStoreElement;
        if (value == "Name") {
            addStoreElement.name = e.target.value
            this.setState({ addStoreElement: addStoreElement });
        }
        else if (value == "Address") {
            addStoreElement.address = e.target.value
            this.setState({ addStoreElement: addStoreElement });
        }
        else if (value == "Lattitude") {
            this.setState({ lattitude: e.target.value });
        }
        else if (value == "Longitude") {
            this.setState({ longitude: e.target.value });
        }
        else if (value == "Category") {
            let value = e.target.value;
            addStoreElement.categories = value;
            this.setState({ addStoreElement: addStoreElement, categories: value });
            this.setState({ displayText: '' });
        }
        console.log(this.state.addStoreElement);
    }

    addCategory() {
        let value = this.state.toAddCategory
        if (value) {
            fetch("http://localhost:8081/add?category=" + value)
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    this.setState({ displayText: 'Category Added' })
                    this.setState({ categoriesAvailable: [...this.state.categoriesAvailable, this.state.toAddCategory] })
                }
                )
        }
        else {
            alert("Please add input category");
        }
    }

    getCategoriesMap() {
        return this.state.categoriesAvailable.map(e => <option value={e}>{e}</option>)
    }

    getAddDisplay(text) {
        return (<div className="addDisplayElement">
            <div className="AddContainer">
                <p>Add Store</p>
                <input className="addInputType" type="text" placeholder="Name" onChange={e => this.changeValue(e, "Name")}></input>
                <input className="addInputType" type="text" placeholder="Address" onChange={e => this.changeValue(e, "Address")}></input>
                <input className="addInputType" type="number" placeholder="Lattitude" onChange={e => this.changeValue(e, "Lattitude")}></input>
                <input className="addInputType" type="number" placeholder="Longitude" onChange={e => this.changeValue(e, "Longitude")}></input>
                <br></br>
                <Select
                    native
                    value={this.state.categories}
                    onChange={e => this.changeValue(e, "Category")}
                    inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                    }}
                >
                    {this.getCategoriesMap()}
                </Select>
                <button className="addStore" onClick={e => this.addStore()} >Add Store</button>
                <p>{this.state.AddStoreText}</p>
            </div>

            <div className="AddContainer">
                <input className="addInputType" type="text" placeholder="Add Category" onChange={e => this.setState({ displayText: '', toAddCategory: e.target.value })}></input>
                <button className="addStore" onClick={e => this.addCategory(e)} >Add Category</button>
                <p>{this.state.displayText}</p>
            </div>
        </div>)
    }
}

export default Stores;