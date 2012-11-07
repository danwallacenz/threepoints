Ext.define("GMarks.store.Address", {
  extend: "Ext.data.Store",
  requires: ["GMarks.model.Address", 'Ext.data.proxy.JsonP'],
  config: {
    model: "GMarks.model.Address",
    storeId: 'addressStore'
  },

  //Call this function on the "keyup" event
  getResults: function(query, gr_callback) {
    this.gr_callback = gr_callback;
    this.address_ready = this.location_ready = false;
    this.last_query = query;
    if (query !== '') {
      this.getAddresses(query);
      this.getLocations(query);
    } else {
      this.gr_callback([]);
    }
    //debugger;
  },
  showResults: function() {
    var results,
      _this = this;
    if (this.address_ready && this.location_ready) {
      this.removeAll();
      results = Ext.Array.merge(this.location_data, this.address_data).slice(0, 10);
      Ext.Array.each(results, function(result) {
        _this.add(result);
      });
      return this.gr_callback(results);
    }
  },
  getAddresses: function(query) {
    var _this = this;
    Ext.data.JsonP.request({
      url: "http://addressfinder.co.nz/api/address",
      callbackKey: 'callback',
      params: {
        // key: "ADDRESSFINDER_API_KEY",
        key: "8VPB3L6U9XD4WKYECH7M",
         // secret: "ADDRESSFINDER_SECRET_KEY",
        secret: "KWNTMJHC3R4PUAY6LD78",
        format: "json",
        q: query
      },
      success: function(response) {
        if (_this.last_query === query) {
          _this.address_data = response.completions.slice(0, 10);
          _this.address_ready = true;
          _this.showResults();
        }
      }
    });
  },
  getLocations: function(query) {
    var _this = this;
    Ext.data.JsonP.request({
      url: "http://addressfinder.co.nz/api/location",
      callbackKey: 'callback',
      params: {
        // key: "ADDRESSFINDER_API_KEY",
        // secret: "ADDRESSFINDER_SECRET_KEY",
        key: "8VPB3L6U9XD4WKYECH7M",
        secret: "KWNTMJHC3R4PUAY6LD78",        
        format: "json",
        q: query
      },
      success: function(response) {
        if (_this.last_query === query) {
          _this.location_data = response.completions.slice(0, 10);
          _this.location_ready = true;
          _this.showResults();
        }
      }
    });
  }
});