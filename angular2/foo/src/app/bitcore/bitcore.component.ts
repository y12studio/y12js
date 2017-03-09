import { Component, OnInit } from '@angular/core';
declare var BitcoreLib:any;
const bitcorelib = BitcoreLib.bitcorelib;
const PrivateKey = bitcorelib.PrivateKey;

@Component({
  selector: 'app-bitcore',
  templateUrl: './bitcore.component.html',
  styleUrls: ['./bitcore.component.css']
})
export class BitcoreComponent implements OnInit {

  address = '0x0002';
  key='0x00';

  constructor() { }

  ngOnInit() {
    var pkey = new PrivateKey();
    this.address = pkey.toAddress().toString();
    this.key = pkey.toString();
  }
}
