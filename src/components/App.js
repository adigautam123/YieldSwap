import React, { Component } from 'react'
import Web3 from 'web3'
import WBTCBadger from '../abis/WBTCBadger.json'
import WBTCDigg from '../abis/SLP-WBTC-Digg.json'
import WBTCETH from '../abis/SLP-WBTC-ETH.json'
import Yieldswap from '../abis/Yieldswap.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })

    // Load Token
    const networkId =  await web3.eth.net.getId()
    //const tokenData = WBTCBadger.networks[networkId]
    //const tokenData1 = WBTCDigg.networks[networkId]
    //const tokenData2 = WBTCETH.networks[networkId]
    const address = '0x110492b31c59716AC47337E616804E3E3AdC0b4a';
    const address1 = '0x9a13867048e01c663ce8Ce2fE0cDAE69Ff9F35E3';
    const address2 = '0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58';
    //if(tokenData) {
      const token = new web3.eth.Contract(WBTCBadger.abi, address)
      this.setState({ token })
      const token1 = new web3.eth.Contract(WBTCDigg.abi, address1)
      this.setState({ token1 })
      const token2 = new web3.eth.Contract(WBTCETH.abi, address2)
      this.setState({ token2 })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: tokenBalance })
      let tokenBalance1 = await token1.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance1: tokenBalance1 })
      let tokenBalance2 = await token2.methods.balanceOf(this.state.account).call()
      this.setState({ tokenBalance2: tokenBalance2.toString() })
    //} else {
     // window.alert('Token contract not deployed to detected network.')
    //}

    // Load EthSwap
    const Yield = '0x58862391ab3146145cE01C2891E8674B4Cf481f4';
    const YieldswapData = Yieldswap.networks[networkId]
    if(YieldswapData) {
      const Yieldswa = new web3.eth.Contract(Yieldswap.abi, Yield)
      this.setState({ Yieldswa })
    } else {
      window.alert('EthSwap contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                
                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
