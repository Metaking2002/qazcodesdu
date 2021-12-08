import React from 'react';
import logo from './logo.svg';
import './App.css';
import './Course.css';
import laptop from './imgs/laptop.png'
import Typed from 'react-typed';
import language from './language'
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import {Redirect} from 'react-router-dom'
import Loading from './Loading'
import scrollToComponent from 'react-scroll-to-component';
import errors from './errors.json'
import Mycourse from './comp/Mycourses'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import Calendar from './comp/Calendar'
import Bounce from 'react-reveal/Bounce';
import {DAEModel,DirectionLight } from 'react-3d-viewer'



export default class App extends  React.Component{
  constructor(props) {
    super(props);
    this.state = {
        language: "RU",
        email: "",
        pw: "",
        models: [false, false, false],
        user: "loading",
        loginBtn: true,
        success: false,
        role: "",
        offset: 0,
        forgot: false
    }

    let self = this
    firebase.auth().onAuthStateChanged(function(user) {
          if (user != null ){
            // console.log("OGG")
            console.log("THERE IS A USER")
            self.checkForAdmins(firebase.auth().currentUser.uid)
          } else {
            console.log("THERE IS A NO USER")
            self.setState({user: false}) 
          }
    });
  }

  componentDidMount() {
    //  САЙТ ЗАГРУЗИЛСЯ
      window.addEventListener('scroll', this.parallax);
  }
  componentWillUnmount() {
      window.removeEventListener('scroll', this.parallax);
  }
  functionForFun = () => {
    let uid = firebase.auth().currentUser.uid
    if (uid != undefined)  {
      // we do not have any user. let's register it. 
    } else {
      // we have a user. let's take his data 
    }
  }
  checkForAdmins = (uid) => {
      let self = this
      console.log(uid)
      console.log("CHECK IF IT IS AN ADMIN")
      firebase.firestore().collection("admin").doc(uid).get().then(function (data) {
          if (!data.exists){
              // NOT ADMIN
              console.log("NOT ADMIN")
              self.checkForTeachers(uid)
              console.log(data)
          } else {
              console.log("IS ADMIN")
              self.setState({role: "admin", user: true})
          }
      })
  }
  parallax = () => {
    this.setState({
      offset: window.pageYOffset
    });
  };

  checkForTeachers = (uid) => {
      let self = this
      firebase.firestore().collection("teacher").doc(uid).get().then(function (data) {
          if (!data.exists){
              // NOT ADMIN and STUDENT
              self.setState({role: "account"})
          } else {
              self.setState({role: "teacher"})
          }
          self.setState({
              user: true
          })
      })
  }




  errorShow = (e) => {
    console.log(e)
      this.setState({loginBtn: true});
      Alert.error(errors[e], {
            position: 'bottom-right',
            effect: 'slide',
            timeout: 3000
      });
  }
  signIn = () => {
      console.log("GOING TO LOGin")
      let self = this
      if (this.state.forgot) {
        this.forgot()
      } else {
        self.setState({
          user: "loading"
        })
        firebase.auth().signInWithEmailAndPassword(self.state.email,self.state.pw)
            .catch(function(e){
                console.log(e)
                self.setState({user: false})
                self.errorShow(e.code)
            })
      }
  }



  /*
    UI/UX:
  */
  mobile = () => {
    return (
      <div className="mobile" ref={(section) => { this.mobileapp = section; }}>
            <div className="stores">
            </div>
      </div>
    )
  }
  intro = () => {
    return (
      <div className="intro">
        <div className={this.state.offset > 200 ? "intro-nav" : "intro-nav intro-nav-white"}>
            <img className="logo-txt" src={require("./imgs/qazcode.png")}/>
            <button onClick={()=>scrollToComponent(this.mobileapp, { offset: 0, align: 'bottom', duration: 1000})}>Наши клиенты</button>
            <button className="btn" onClick={()=>scrollToComponent(this.mycourseref, { offset: 0, align: 'bottom', duration: 1500})}>Курсы</button>
            <button onClick={()=>scrollToComponent(this.login, { offset: 0, align: 'top', duration: 1500})}>Войти</button>
        </div>
        <img style={{left: this.state.offset + 200/5 }} className="intro-element" src={require("./imgs/element1.png")}/>
        <img style={{right: this.state.offset + 200/5 }} className="intro-element2" src={require("./imgs/element2.png")}/>
        <label className="intro-type">
          <span>
             Учимся добывать<br/>
          </span>{" "}
          <Typed
            className="typed"
            typedRef={(typed) => { this.typed = typed; }}
            strings={['Мұнай', "Нефть", "Oil"]}
            typeSpeed={100}
            backSpeed={100}
            loop
          />
        </label>
        <label className="intro-des">Быстро. Эффективно. Полезно.</label>
        <Bounce bottom>
          <img style={{marginBottom: this.state.offset / 6}} className="laptop" src={laptop}/>
        </Bounce>
        
      </div>
    )
  }
  forgot = () => {
      let e = this.state.email
      if (e != "") {
        let s = this
        s.setState({user: "loading"})
        firebase.auth().sendPasswordResetEmail(e).then(function() {
          s.setState({
            user: false
          })
          Alert.success("Проверьте почту", {
            position: 'bottom-right',
            effect: 'slide',
            timeout: 3000
          })
        }).catch(function(e) {
          Alert.error("Произошла неизвестная ошибка", {
            position: 'bottom-right',
            effect: 'slide',
            timeout: 3000
          });
        })
      } else {
        Alert.error("Введите email", {
          position: 'bottom-right',
          effect: 'slide',
          timeout: 3000
        });
      }
  }
  auth = () => {
    return (
      <div className="app-login" ref={(section) => { this.login = section; }}>
        <div className="app-mob">{this.mobile()}</div>
        <div className="auth">
            <label className="auth-title">Войти</label>
            <label className="auth-bigger-title">Присоединяйтесь к нашему сообществу</label>
            <label className="auth-subtitle">
               Введите адрес электронной почты чтобы войти в систему.
            </label>
            <input placeholder="Email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>
            {this.state.forgot ? null : <input type="password" placeholder="Пароль" value={this.state.pw} onChange={(e) => this.setState({pw: e.target.value})}/>}
            <button onClick={()=>{
                this.setState({ forgot: !this.state.forgot})
            }} className="login-forgot-psw">{this.state.forgot ? "Отмена": "Забыли пароль?"}</button>
            <button className={this.state.loginBtn ? "login-btn" : "none"} onClick={this.signIn}>{this.state.forgot ? "Восстановить" : language[0][this.state.language]["submit"]}</button>
        </div>
      </div>
    )
  }

  render() {
      if (this.state.user == "loading") {
          return <Loading />
      } else if (this.state.user) {
          return <Redirect to={"/" + this.state.role}/>
      } else {
          return (
              <div className="App">
                 <Alert stack={{limit: 5}} />
                  {this.intro()}
                  <div style={{backgroundColor: "#fff"}}>
                    <Calendar/>
                  </div>
                 <div className="models">
                    <div className="model">
                      <div className={this.state.models[0] == false ? "lds-hourglass" : "none"}/>
                    <DAEModel 
                      src={'https://raw.githubusercontent.com/dwqdaiwenqi/react-3d-viewer/master/site/src/lib/model/Ruins_dae.dae'}
                      onLoad={()=>{
                        var a = this.state.models 
                        a[0] = true; this.setState({models: a})
                      }}
                    >
                    <DirectionLight color={0xffffff}/>
                  </DAEModel>
                    </div>
                    <div className="model">
                    <div className={this.state.models[1] == false ? "lds-hourglass" : "none"}/>
                    <DAEModel 
                      src={'https://raw.githubusercontent.com/030131550542/models/master/barrel.dae'}
                      onLoad={()=>{
                        var a = this.state.models 
                        a[1] = true; this.setState({models: a})
                      }}
                    >
                    <DirectionLight color={0x000000}/>
                  </DAEModel>
                    </div>
                    <div className="model">
                    <div className={this.state.models[2] == false ? "lds-hourglass" : "none"}/>
                    <DAEModel 
                      src={'https://raw.githubusercontent.com/030131550542/models/master/barrel.dae'}
                      onLoad={()=>{
                        var a = this.state.models 
                        a[2] = true; this.setState({models: a})
                      }}
                    >
                    <DirectionLight color={0xffffff}/>
                  </DAEModel>
                    </div>
                 </div>
                  {this.auth()}
                  <Mycourse ref={(section) => { this.mycourseref = section; }}/>
                  
                  <div className="footer">
                      <label>TECEDU - 2021</label>
                  </div>
              </div>
          );
      }
  }
}

