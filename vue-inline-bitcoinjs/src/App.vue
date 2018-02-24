<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <h2>{{ key }}</h2>
    <b-jumbotron header="BIP39" :lead="mnemonic" >
  <p>{{mnemonic}}</p>
  <b-btn variant="primary" href="#">More Info</b-btn>
</b-jumbotron>
  <div>
    <b-card title="Card title"
            sub-title="Card subtitle">
        <p class="card-text">
            Some quick example text to build on the <em>card title</em> and make up the bulk of the card's content.
        </p>
         <b-button disabled variant="success">Disabled</b-button>
  <b-button variant="success">Not Disabled</b-button>
        <a href="#"
           class="card-link">Card link</a>
        <b-link href="#"
                class="card-link">Another link</b-link>
    </b-card>
</div>
  </div>
</template>

<script>
const bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39')
let key = bitcoin.ECPair.makeRandom().toWIF();
let mnemonic = bip39.generateMnemonic();
export default {
  name: 'app',
  data () {
    return {
      msg: 'Vue.js App ....',
      key: key,
      mnemonic: mnemonic
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
