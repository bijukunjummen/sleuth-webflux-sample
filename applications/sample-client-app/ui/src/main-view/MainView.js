import React from "react";
import * as restCalls from "./client-calls";

export const FormErrors = ({formErrors}) =>
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

export const ProgressBar = ({loading}) =>
  <div className="row">
    <div className="col-sm-2">
    </div>
    <div className="col-sm-8">
      {loading &&
      <div className="progress">
        <div className="progress-bar progress-bar-striped progress-bar-animated w-100" role="progressbar"
             aria-valuenow="100"
             aria-valuemin="0"
             aria-valuemax="100"></div>
      </div>
      }
      <div className="col-sm-2">
      </div>
    </div>
  </div>

export const ResponseDisplay = ({responseMessage, responseError}) => {
  return <div className="row mt-3">
    <div className="col-sm-12">
      {responseMessage &&
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
        <div className="row">
          <label htmlFor="errorMessage" className="col-sm-2">Error Message From Backend : </label>
          <span className="col-sm-4">{responseMessage.error_message}</span>
        </div>
      </div>
      }

      {responseError &&
      <div className="alert alert-warning">
        <div className="row">
          <span className="col-sm-4">{responseError}</span>
        </div>
      </div>
      }
    </div>
  </div>
};

export class MainForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: "dummy payload",
      delay: 100,
      throw_exception: false,
      formErrors: {payload: '', delay: ''},
      loading: false,
      payloadValid: true,
      delayValid: true,
      formValid: true,
      responseMessage: "",
      responseError: ""
    }

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleChangeExceptionState = this.handleChangeExceptionState.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(e) {
    if (this.state.loading) {
      e.preventDefault();
      return;
    }
    this.setState({responseError: ""});
    this.setState({responseMessage: null});

    this.passthroughCallAndSetState(this.state.payload, this.state.delay, this.state.throw_exception);
    e.preventDefault()
  }

  passthroughCallAndSetState(payload, delay, throw_exception) {
    this.setState({loading: true});
    restCalls
      .makePassthroughCall(payload, delay, throw_exception)
      .then(resp => {
        this.setState({responseMessage: resp.data, loading: false});
      }).catch(error => {
      this.setState({responseError: error.message, loading: false});
    });
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value}, () => {
      this.validateField(name, value)
    });
  }

  handleChangeExceptionState(e) {
    const name = e.target.name;
    const value = e.target.value;

    let currentState = this.state[name];

    this.setState({[name]: !currentState})
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
              The request will be received by a "client-application" which will direct it to a
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
                         value={this.state.delay} onChange={this.handleUserInput}/>

                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-2"></div>
                <div className="col-sm-10">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" name="throw_exception"
                           checked={this.state.throw_exception} onChange={this.handleChangeExceptionState}/>
                      <label className="form-check-label" htmlFor="throw_exception">
                        Throw an Exception?
                      </label>
                  </div>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-sm-10">
                  {!this.state.loading &&
                  <button name="submit" className="btn btn-primary" disabled={!this.state.formValid}>Submit</button>
                  }
                  {this.state.loading &&
                  <button name="submit" className="btn btn-primary disabled"
                          disabled={!this.state.formValid}>Submit</button>
                  }
                </div>
              </div>
            </form>
          </div>
        </div>
        <ProgressBar loading={this.state.loading}/>
        <ResponseDisplay responseMessage={this.state.responseMessage} responseError={this.state.responseError}/>
      </div>
    );
  }
}
