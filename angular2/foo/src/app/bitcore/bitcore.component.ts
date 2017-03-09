import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
declare var BitcoreLib: any;
const bitcorelib = BitcoreLib.bitcorelib;
const PrivateKey = bitcorelib.PrivateKey;

@Component({
  selector: 'app-bitcore',
  templateUrl: './bitcore.component.html',
  styleUrls: ['./bitcore.component.css']
})
export class BitcoreComponent implements OnInit {

  address = '0x0006';
  key = '0x00';

  constructor() { }

  ngOnInit() {
    var pkey = new PrivateKey();
    this.address = pkey.toAddress().toString();
    this.key = pkey.toString();
  }
}
