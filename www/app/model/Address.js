Ext.define('GMarks.model.Address', {
  extend: 'Ext.data.Model',
  config: {
    fields: [
      {
        name: 'a'
      }, {
        name: 'pxid'
      }, {
        name: 'v'
      }
    ]
  },
  //Call this function to get extended data about the location (e.g when the user taps the result)
  getInfo: function(callback) {
    Ext.data.JsonP.request({
      // url: "http://addressfinder.co.nz/api/address/info",
      url: "addressfinder.co.nz/api/address/info",
      callbackKey: "callback",
      params: {
        pxid: this.get("pxid"),
        key: "8VPB3L6U9XD4WKYECH7M",
        // key: "ADDRESSFINDER_API_KEY",
        // secret: "ADDRESSFINDER_SECRET_KEY",
        secret: "KWNTMJHC3R4PUAY6LD78",
        format: "json"
      },
      success: function(response) {
        callback(response);
      }
    });
  }
});