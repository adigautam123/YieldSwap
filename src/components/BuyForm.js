import React, { Component } from 'react'
import { DropdownButton } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

const options = ["SLP-WBTC-BADGER", "SLP-WBTC-DIGG", "SLP-WBTC-ETH", "LP-WBTC-DIGG", "LP-WBTC-BADGER"];

const options1 = ["SLP-WBTC-DIGG", "SLP-WBTC-BADGER", "SLP-WBTC-ETH", "LP-WBTC-DIGG", "LP-WBTC-BADGER"];

class BuyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0',
      selectedOption: options[0] ,
      selectedOption1: options1[0] 
    }
  }

  handleSelect(eventKey, event) {
    this.setState({ selectedOption: options[eventKey] });
  }
  handleSelect1(eventKey, event) {
    this.setState({ selectedOption1: options1[eventKey] });
  }

  render() {
    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = this.input.value.toString()
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          this.props.buyTokens(etherAmount)
        }}>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={(event) => {
              const etherAmount = this.input.value.toString()
              this.setState({
                output: etherAmount * 100
              })
            }}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="select_option">
            <DropdownButton
              title={this.state.selectedOption}
              id="document-type"
              onSelect={this.handleSelect.bind(this)}
            >
             {options.map((opt, i) => (
            <Dropdown.Item key={i} eventKey={i}>{opt}</Dropdown.Item>
            ))}
            </DropdownButton>
            </div>          
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.selectedOption1, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
             <div className="select_option">
            <DropdownButton
              title={this.state.selectedOption1}
              id="document-type"
              onSelect={this.handleSelect1.bind(this)}
            >
             {options1.map((opt, i) => (
            <Dropdown.Item key={i} eventKey={i}>{opt}</Dropdown.Item>
            ))}
            </DropdownButton>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">1 ETH = 100 DApp</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
      </form>
    );
  }
}

export default BuyForm;