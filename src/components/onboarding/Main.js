import React, { Component } from "react";
import PersonalInfo from "./PersonalInfoForm";
import VehicleLoginForm from "./VehicleLoginForm";
import RoutingPref from "./Routing-Pref";
import { connect } from "react-redux";
import { register, login } from "../../store/actions/index";
import { withRouter } from "react-router-dom";
import axios from "axios";

const validateForm = errors => {
  let valid = true;
  return valid;
};

class Main extends Component {
  state = {
    step: 1,

    //step 1
    firstName: "",
    lastName: "",
    userName: "",
    age: "",

    //step: 2
    name: "",
    heightFeet: "",
    heightInches: "",
    widthFeet: "",
    widthInches: "",
    lengthFeet: "",
    lengthInches: "",
    weight: "",
    axel_count: "",
    vehicle_class: "", //controlled input of one letter
    //created_at: '', //check BE for format, generate date with js
    dual_tires: false, //Bool, checkbox
    trailer: false, //Bool, checkbox
    isSignedIn: false,

    //step 3
    DirtRoads: false,
    SteepGrade: false,
    Potholes: false
  };

  vehicleSubmit = event => {
    // event.preventDefault();
    //Google analytics tracking
    window.gtag("event", "create vehicle", {
      event_category: "submit",
      event_label: "create vehicle"
    });

    let height = this.combineDistanceUnits(
      this.state.heightInches,
      this.state.heightFeet
    );
    let width = this.combineDistanceUnits(
      this.state.widthInches,
      this.state.widthFeet
    );
    let length = this.combineDistanceUnits(
      this.state.lengthInches,
      this.state.lengthFeet
    );
    let weight = this.state.weight;
    let axel_count = this.state.axel_count;
    let vehicle_class = this.state.vehicle_class;
    let trailer = this.state.trailer;
    if (vehicle_class === "Trailer") {
      vehicle_class = "";
      trailer = true;
    }
    if (weight === "") {
      weight = 0;
    }
    if (axel_count === "") {
      axel_count = 0;
    }
    //make sure all values entered are sent as the correct data type to the back end
    parseFloat(height);
    parseFloat(length);
    parseFloat(width);
    parseFloat(weight);
    parseInt(axel_count);

    //send is the object that is sent to the web backend to be stored
    //it is made using values from the form, some of which are processed and converted before being assigned to the keys here
    let send = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      userName: this.state.userName,
      age: this.state.age,
      name: this.state.name,
      height: height,
      width: width,
      length: length,
      weight: weight,
      axel_count: axel_count,
      vehicle_class: vehicle_class,
      trailer: trailer,
      dual_tires: this.state.dual_tires,
      DirtRoads: this.state.DirtRoads,
      SteepGrade: this.state.SteepGrade,
      Potholes: this.state.Potholes
    };
    console.log("sent", send);
    console.log("ID MAIN FORM", this.props.id);
    // if (this.props.editing) {
    //   this.props.updateVehicle(send, this.props.id);
    //   this.props.editVehicleToggle(this.props.id);
    // } else {
    //   this.props.addVehicle(send);
    //   this.closeVehicleForm();
    // }
    // this.props.onboarding(send).then(res => {
    //   if (res) {
    //     return <Redirect to="/map" />;

    // });

    // this.setState({
    //   // name: "",
    //   // height: "",
    //   // width: "",
    //   // length: "",
    //   // weight: "",
    //   // axel_count: "",
    //   // vehicle_class: "",
    //   // trailer: false,
    //   // dual_tires: false,
    //   // DirtRoads: false,
    //   // SteepGrade: false,
    //   // Potholes: false
    // });
  };

  //combines feet and inch units into feet only, to be sent to the backend
  combineDistanceUnits = (inchesIn, feetIn) => {
    let inches = inchesIn;
    let feet = feetIn;
    if (feet === "") {
      feet = 0;
    }
    if (inches === "") {
      inches = 0;
    }
    const inchesCombined = feet + inches / 12;
    return inchesCombined;
  };

  onSubmit = e => {
    e.preventDefault();
    const { firstName, lastName, userName, age } = this.state;

    axios
      .put(`http://localhost:5000/users/user/${this.props.id}`, {
        firstName,
        lastName,
        userName,
        age
      })
      .then(res => {
        console.log("ID FROM AXIOS IN MAIN", this.props.id);
        if (res) {
          this.setState({}); // No need to setState.
        }
      })
      .catch(err => console.log(err.response));
    const {
      name,
      heightFeet,
      heightInches,
      widthFeet,
      widthInches,
      lengthFeet,
      lengthInches,
      weight,
      axel_count,
      vehicle_class,
      dual_tires,
      class_A,
      class_B,
      class_C,
      fifth_wheel,
      pull_behind,
      trailer,
      isSignedIn,
      DirtRoads,
      SteepGrade,
      Potholes
    } = this.state;
    let height = this.combineDistanceUnits(
      this.state.heightInches,
      this.state.heightFeet
    );
    let width = this.combineDistanceUnits(
      this.state.widthInches,
      this.state.widthFeet
    );
    let length = this.combineDistanceUnits(
      this.state.lengthInches,
      this.state.lengthFeet
    );
    axios
      .post(
        "http://localhost:5000/vehicle",
        {
          name,
          height: Number(height),

          width: Number(width),

          length: Number(length),

          weight: Number(weight),
          axel_count: Number(axel_count),
          vehicle_class,
          dual_tires,
          class_A,
          class_B,
          class_C,
          fifth_wheel,
          pull_behind,
          trailer,

          DirtRoads,
          SteepGrade,
          Potholes,
          user_id: this.props.id
        }
        // { headers: { authorization: token } }
      )
      .then(res => {
        console.log("response", res);
      })
      .catch(err => console.log(err));
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };

  //assigns state to a value based on which radio button has been clicked
  handleRadio = event => {
    // const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      ...this.state,
      vehicle_class: event.target.value
    });
  };

  handleCheck = event => {
    //const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: event.target.checked
    });
  };

  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };

  showStep = () => {
    const {
      step,
      firstName,
      lastName,
      userName,
      age,
      name,
      heightFeet,
      heightInches,
      widthFeet,
      widthInches,
      lengthFeet,
      lengthInches,
      weight,
      axel_count,
      vehicle_class,
      dual_tires,
      class_A,
      class_B,
      class_C,
      fifth_wheel,
      pull_behind,
      trailer,
      isSignedIn,
      DirtRoads,
      SteepGrade,
      Potholes
    } = this.state;

    if (step === 1)
      return (
        <PersonalInfo
          handleChange={this.handleChange}
          nextStep={this.nextStep}
          firstName={firstName}
          lastName={lastName}
          username={userName}
          age={age}
        />
      );
    if (step === 2)
      return (
        <VehicleLoginForm
          handleChange={this.handleChange}
          handleRadio={this.handleRadio}
          handleCheck={this.handleCheck}
          nextStep={this.nextStep}
          prevStep={this.prevStep}
          firstName={firstName}
          name={name}
          heightFeet={heightFeet}
          heightInches={heightInches}
          widthFeet={widthFeet}
          widthInches={widthInches}
          lengthFeet={lengthFeet}
          lengthInches={lengthInches}
          weightPounds={weight}
          axel_count={axel_count}
          vehicle_class={vehicle_class}
          dual_tires={dual_tires}
          class_A={class_A}
          class_B={class_B}
          class_C={class_C}
          fifth_wheel={fifth_wheel}
          pull_behind={pull_behind}
          trailer={trailer}
          isSignedIn={isSignedIn}
        />
      );
    if (step === 3)
      return (
        <RoutingPref
          state={this.state}
          prevStep={this.prevStep}
          handleCheck={this.handleCheck}
          vehicleSubmit={this.vehicleSubmit}
          onSubmit={this.onSubmit}
          mainSubmit={this.mainSubmit}
          DirtRoads={DirtRoads}
          SteepGrade={SteepGrade}
          Potholes={Potholes}
        />
      );
  };

  render() {
    const { step } = this.state;
    return (
      <>
        {/* <h2> Step {step} of 3.</h2> */}
        {this.showStep()}
      </>
    );
  }
}

const mapStateToProps = state => {
  console.log("state", state);
  return { id: state.data[0].value.id, token: state.token[0] };
};

export default withRouter(connect(mapStateToProps, { register, login })(Main));
