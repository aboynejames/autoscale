/**
*  Dsensor sampling protocol
*  Smart Contract
*
**/
contract samplingContract {

  struct sampleDetail {

    string sdmap;
    string sstart;
    string sstop;
    string sresult;

  }

  sampleDetail sampleLive;

  mapping (address => uint) public dsample;

  // the dmap ID that will contain link back to original science
  function sampleAuthor(address dmapIn) {

    dsample[msg.sender] = dmapIn;

  }

  function setDmapid (string x) {

    sampleLive.sdmap = x;

  }

  function startSample(address receiver, uint sampletime) returns(bool successful) {


  }

  function computation(uint a) constant returns(uint d) {

    return a * 7;

  }

  function showSample(address receiver) constant returns(uint d) {

    return dsample[receiver];

  }

  function getSampledmap() constant returns(string) {

   return sampleLive.sdmap;

  }

}
