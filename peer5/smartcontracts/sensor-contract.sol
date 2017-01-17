/**
*  Dsensor sensor api
*  Smart Contract
*
**/
pragma solidity ^0.4.4;

contract sensorContract {

  string sensorBrand;
  string sensorMeasure;
  string sensorUnit;

  mapping (address => uint) owners;
  // sensorType = {};

  function setSensorOwner(address receiver) returns(bool successful) {
  	owners[msg.sender] = 1;
  	return true;
  }

  function setSensorBrand(string x) {
     sensorBrand = x;
  }

  function setSensorMeasure(string x) {
     sensorMeasure = x;
  }

  function setSensorUnit(string x) {
     sensorUnit = x;
  }

  function getBrand() constant returns(string) {
     return sensorBrand;
  }

  function getOwner(address addr) constant returns(uint owner) {
     return owners[addr];
  }

}
