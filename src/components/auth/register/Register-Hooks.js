import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import { register, login, clearError } from "../../../store/actions";
import { withRouter } from "react-router-dom";
import "./Register.css"
import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import styled from 'styled-components';


const Header = styled.div`
  height: 80px;
  width: auto
  background: #2A2E43;
`
const Text = styled.span`
  position: absolute;
  left: 0.74%;
  // right: 90.31%;
  top: 1.25%;
  bottom: 12.5%;
  color: rgba(53, 195, 226, 0.95);
  font-size: 36px;
  font-weight: bold;
  font-family: Heebo;
  height: 60px;
`

/* eslint-disable no-useless-escape */
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};



  
  function RegisterForm(props){
      console.log("props", props)
      
      const [newUser,setNewUser] = useState({ error: null,
        credentials: {
          email: "",
          password: "",
          confirmPassword: "",
          errors: {
            email: "",
            password: "",
            confirmPassword: ""
          }
        },
        loading: false,
        isSignedIn: false
      });  

//did not touch v
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/map',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
  };
//////////////////////////////////////////

const handleChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = newUser.credentials.errors;
//// did not touch v 
    switch (name) {

      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid";
        break;

      case "password":
        errors.password =
          value.length < 8 ? "Password must be at least 8 characters long" : "";
        break;

      default:
        break;
    }
///////////
    setNewUser({...newUser.credentials, errors, [name]: value })
  };

    
  const registerSubmit = e => {
    e.preventDefault();
    //Google analytics tracking
    const { password, confirmPassword } = newUser.credentials;

    if (password !== confirmPassword) {
      // document.querySelector('#confirm-password-error').innerHTML = 'Passwords Must match!';
      alert("** Passwords don't match **")
    } else {
      window.gtag("event", "register", {
        event_category: "access",
        event_label: "register"
      });
      if (validateForm(newUser.credentials.errors)) {
        console.info("Valid Form");
      } else {
        console.error("Invalid Form");
      }
      setNewUser({loading:true});
      props.register({password: newUser.credentials.password,
        email: newUser.credentials.email})
        .then(res => {
            if (res) {
              RegisterForm.props
              .props
                .login({
                  email: newUser.credentials.email,
                  password: newUser.credentials.password
                })
                .then(res => {
                  if (res) {
                    setNewUser({
        
                    });
                    RegisterForm.props.history.push("/map");
                  }
                });
            }
          })
          .catch(err => {
            setTimeout(function () {
              return RegisterForm.props.clearError();
            }, 3000);
          });
        }
        };





useEffect(() =>{
     const unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => setNewUser({ isSignedIn: !!user })
    );
  });

  
  function unmaskPassword  () {
    var passwordInput = document.querySelector('#password-input');
    var passwordStatus = document.querySelector('.password-mask');
    // if (document.querySelector('#password-eye')) {
    passwordStatus.backgroundImage = 'none';
    // }
    if (passwordStatus && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passwordStatus.classList.add('password-eye-off')
      passwordStatus.classList.remove('password-eye')
    }
    else {
      passwordInput.type = 'password';
      passwordStatus.classList.remove('password-eye-off')
      passwordStatus.classList.add('password-eye')
    }
  };


   function unmaskConfirmPassword() {
    var passwordInput = document.querySelector('#confirm-password-input');
    var passwordStatus = document.querySelector('.password-mask-confirm');
    // if (document.querySelector('#password-eye')) {
    passwordStatus.backgroundImage = 'none';
    // }
    if (passwordStatus && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passwordStatus.classList.add('password-eye-off')
      passwordStatus.classList.remove('password-eye')
    }
    else {
      passwordInput.type = 'password';
      passwordStatus.classList.remove('password-eye-off')
      passwordStatus.classList.add('password-eye')
    }
  };





  



  
    const { errors } = newUser.credentials;
    

    // const isEnabled = this.state.credentials.username.length >= 5 && this.state.credentials.email.length > 2 && this.state.credentials.password.length >= 8;
    return (
      <div className="register-wrapper">
        <Header className="rv-way-header">
          <Text className="rv-way-header-text">RV WAY</Text>
        </Header>
        <div className="register-main">
        {newUser.loading === true ?
            (
            <p className="register-auth-loading">Loading...</p>
          ) : (
              <form className="register-main-form">
                <div className="register-header">
                  <h2 className="register-welcome-home">Welcome Home!</h2>
                  <h4 className="register-lets-get-you-settled">Lets get you settled</h4>
                  <h6 className="register-sign-up-with-social-media">Signup with social media</h6>
                </div>
                <div className="register-social-media">
                {newUser.isSignedIn ?
                            (
                              <div>
                                {newUser.isSignedIn ? (
                          

                          <>
                            <h6>Welcome  {firebase.auth().currentUser.displayName}</h6>
                            <button onClick={() => firebase.auth().signOut()}>Logout</button>
                          </>
                          
                        ) : localStorage.getItem('firebaseui::rememberedAccounts') ? localStorage.removeItem('firebaseui::rememberedAccounts') : null}
                      </div>
                    ) :
                    (<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />)}
                </div>
                <div className="or">
                  <span>or</span>
                </div>
                <div className="register-input-and-button">
                  <label className="register-main-form-label">Email</label>
                  <input
                    className="register-main-form-input"
                    name="email"
                    // placeholder="Enter email"
                    type="email"
                    value={newUser.credentials.email}
                    onChange={newUser.handleChange}
                    noValidate
                  ></input>
                  
                  {errors.email.length > 0 && (
            
                    <p className="register-main-form-error">{errors.email}</p>
                  )}
                  {RegisterForm.props.error === "Email already taken" &&
                  
                  (
                    <p className="register-main-form-error">Email already taken</p>
                  )}
                
                <span className="password-mask" onClick={unmaskPassword}>MASK</span>
                  <label className="register-main-form-label" id="password">Password</label>
                  <input
                    className="register-main-form-input"
                    id="password-input"
                    type="password"
                    name="password"
                    value={newUser.credentials.password}
                    onChange={handleChange}
                    noValidate
                  ></input>
                  {errors.password.length > 0 && (
                    <p className="register-main-form-error">{errors.password}</p>
                  )}
                  <div>
                    <span className="password-mask-confirm" onClick={unmaskConfirmPassword}>MASK</span>
                    <label className="register-main-form-label" id="confirm-password">Confirm Password</label>
                    <input
                      className="register-main-form-input"
                      id="confirm-password-input"
                      type="password"
                      name="confirmPassword"
                      value={newUser.credentials.confirmPassword}
                      onChange={handleChange}
                    // noValidate
                    ></input>
                    {errors.confirmPassword.length > 0 && (
                      <p id="confirm-password-error" className="register-main-form-error">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <button
                    className="register-lets-go-button"
                    variant="warning"
                    onClick={registerSubmit}
                    type="submit"
                  >
                    Let's Go
                    </button>
                  
                  <div className="already-have-an-account">
                    <span>Already have an account? <a id="sign-in" href="/login">Sign In</a></span>
                  </div>
                </div>
              </form>
            )}
        </div>
      </div>
    );
  }


const mapStateToProps = state => {
    console.log("state",state);
  return { error: state.error };
  
};

export default withRouter(
  connect(
    mapStateToProps,
    { register, login, clearError }
  )(RegisterForm)
);