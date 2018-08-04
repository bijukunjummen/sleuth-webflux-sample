import React from "react";
import {BrowserRouter as Router, Link, Route} from "react-router-dom";

import * as backendCalls from "./backend-calls"

const Root = () => (
    <Router>
        <div>
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <Link to="/" className="navbar-brand">Sleuth Client</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarsExampleDefault"
                        aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="containerFluid">
                <div className="row">
                    <div className="col-sm-10 offset-sm-1">
                        <Route exact path="/" component={MainForm}/>
                    </div>

                </div>
            </div>
        </div>
    </Router>
);

const FormErrors = ({formErrors}) =>
    <div>
        {Object.keys(formErrors).map((fieldName, i) => {
            if (formErrors[fieldName].length > 0) {
                return (
                    <p key={fieldName} className="alert alert-warning">{fieldName} {formErrors[fieldName]}</p>
                )
            } else {
                return '';
            }
        })}
    </div>

const ResponseDisplay = ({responseMessage, responseError}) => {
    return <div className="row mt-3">
        <div className="col-sm-12">
            {responseMessage  &&
            <div className="alert alert-success">
                <div className="row">
                    <label htmlFor="id" className="col-sm-2">Id : </label>
                    <span className="col-sm-4">{responseMessage.id}</span>
                </div>
                <div className="row">
                    <label htmlFor="message" className="col-sm-2">Recieved : </label>
                    <span className="col-sm-4">{responseMessage.received}</span>
                </div>
                <div className="row">
                    <label htmlFor="acked" className="col-sm-2">Acked : </label>
                    <span className="col-sm-4">{responseMessage.ack}</span>
                </div>
            </div>
            }

            {responseError  &&
            <div className="alert alert-warning">
                <div className="row">
                    <span className="col-sm-4">{responseError}</span>
                </div>
            </div>
            }
        </div>
    </div>
};

class MainForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            payload: "dummy payload",
            delay: 0,
            formErrors: {payload: '', delay: ''},
            payloadValid: true,
            delayValid: true,
            formValid: true,
            responseMessage: "",
            responseError: ""
        }

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormSubmit(e) {
        this.setState({responseError: ""});
        this.setState({responseMessage: null})

        backendCalls
            .makePassthroughCall(this.state.payload, this.state.delay)
            .then(resp => {
                this.setState({responseMessage: resp.data})
            }).catch(error => {
            this.setState({responseError: error.message})
        });
        e.preventDefault()
    }

    handleUserInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value}, () => {
            this.validateField(name, value)
        });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let payloadValid = this.state.payloadValid;
        let delayValid = this.state.delayValid;

        switch (fieldName) {
            case 'payload':
                payloadValid = value.length >= 2;
                fieldValidationErrors.payload = payloadValid ? '' : ' should have atleast 2 characters';
                break;
            case 'delay':
                delayValid = !isNaN(value)
                fieldValidationErrors.delay = delayValid ? '' : ' is not valid';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            payloadValid: payloadValid,
            delayValid: delayValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.payloadValid && this.state.delayValid});
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        <h3>Send a request</h3>
                        <p className="lead alert alert-info">
                            The request will be recieved by a "client-application" which will direct it to a
                            "backend-application".
                            The "backend-application" responds after the user specified delay.
                        </p>
                    </div>
                    <div>
                        <FormErrors formErrors={this.state.formErrors}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <form onSubmit={this.handleFormSubmit}>
                            <div className="form-group row">
                                <label htmlFor="payload" className="col-sm-2 col-form-label">Payload</label>
                                <div className="col-sm-10">
                                    <textarea name="payload" className="form-control" placeholder="Payload"
                                              onChange={this.handleUserInput} value={this.state.payload}></textarea>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="delay" className="col-sm-2 col-form-label">Delay (in ms)</label>
                                <div className="col-sm-10">
                                    <input name="delay" type="number" className="form-control" placeholder="delay"
                                           value={this.state.delay} onChange={(event) => this.handleUserInput(event)}/>

                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-sm-10">
                                    <button className="btn btn-primary" disabled={!this.state.formValid}>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <ResponseDisplay responseMessage={this.state.responseMessage} responseError={this.state.responseError}/>
            </div>
        );
    }
}

export default Root;