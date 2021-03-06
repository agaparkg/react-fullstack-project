import React, { Component } from "react";

const errorStyle = {
  textAlign: "center",
  color: "red",
  fontStyle: "italic",
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: "",
      success: "",
      person: {},
      hint: false,
    };
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = this.email.value;
    const password = this.password.value;

    fetch("https://react-fullstack-backend.herokuapp.com/api/v1/person/login", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          this.setState({ error: data.error, success: "" });
        }

        if (data.success) {
          this.setState({
            success: data.success,
            person: data.person,
            error: "",
          });
          this.setTime = setTimeout(() => {
            this.setState({ success: "" });
            this.props.history.push("/home");
            this.props.handleUserAccess();
          }, 2000);
        }
      })
      .catch((err) => console.log(err));
  };

  componentWillUnmount() {
    clearTimeout(this.setTime);
  }

  showHint = () => {
    this.setState({ hint: !this.state.hint });
  };

  render() {
    const { error, success, person, hint } = this.state;
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={this.handleLoginSubmit}>
            {success && (
              <div className="greeting">
                {success} {person.fname + " " + person.lname}
              </div>
            )}
            <h3 className="signin">
              Sign In{" "}
              <i
                onMouseOver={this.showHint}
                onMouseOut={this.showHint}
                className="fa fa-question-circle"
              ></i>
              {hint && (
                <div className="card card-body">
                  Test credentials: <br /> email: t@t.com password: 123456
                </div>
              )}
            </h3>

            <div className="form-group">
              <label>Email address</label>
              <input
                ref={(input) => (this.email = input)}
                type="email"
                className="form-control"
                placeholder="Enter email"
              />
            </div>
            {error.toLowerCase().includes("email") && (
              <div style={errorStyle}>{error}</div>
            )}

            <div className="form-group">
              <label>Password</label>
              <input
                ref={(input) => (this.password = input)}
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
            </div>
            {error.toLowerCase().includes("password") && (
              <div style={errorStyle}>{error}</div>
            )}
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>

            <button
              disabled={success}
              type="submit"
              className="btn btn-primary btn-block"
            >
              Submit
            </button>
            <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
