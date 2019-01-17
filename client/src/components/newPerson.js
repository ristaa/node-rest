import React, { Component } from "react";
import { render } from "react-dom";

class newPerson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      yourEmail: "",
      yourName: "",
      yourAge: "",
      yourMessage: "",
      renderMessage: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.postDataFromApi();
    alert(
      "You are now able to sent messages as: " +
        this.state.yourName +
        " (" +
        this.state.yourEmail +
        ")"
    );
    event.preventDefault();
  }

  postMessage(event) {
    this.handlePostMessage();
    alert("Your message is successfully submitted!");
    event.preventDefault();
  }

  postDataFromApi = () => {
    const that = this;

    fetch("/person", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: that.state.yourEmail,
        name: this.state.yourName,
        age: this.state.yourAge
      })
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        localStorage.setItem("personId", data.createdPerson._id.toString());
        localStorage.setItem("personMail", data.createdPerson.email.toString());
        that.setState({ renderMessage: true });
        that.sendMail(); 
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handlePostMessage = () => {
    const that = this;

    fetch("/motivation/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personId: localStorage.getItem("personId"),
        content: that.state.yourMessage
      })
    })
      .then(function(response) {
        return response.json();
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  sendMail = () => {
    fetch("/person/send", {
      method: "POST",
      headers: {
        Accept: "application/text",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: JSON.stringify({
        name: "Motivational: You created account successfully!",
        email: localStorage.getItem("personMail"),
        message: localStorage.getItem("personId")
      })
    })
      .then(function(response) {
        return response.json();
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  componentWillMount() {
    if (localStorage.getItem("personId")) {
      this.setState({ renderMessage: true });
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.renderMessage ? (
          <div>
            <form onSubmit={this.postMessage}>
              <label>
                Message:
                <textarea
                  name="yourMessage"
                  value={this.state.yourMessage}
                  onChange={this.handleChange}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <label>
              Email:
              <input
                type="text"
                name="yourEmail"
                value={this.state.yourEmail}
                onChange={this.handleChange}
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="yourName"
                value={this.state.yourName}
                onChange={this.handleChange}
              />
            </label>
            <label>
              Age:
              <input
                type="text"
                name="yourAge"
                value={this.state.yourAge}
                onChange={this.handleChange}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        )}
      </div>
    );
  }
}

export default newPerson;