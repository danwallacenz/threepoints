Ext.define("GMarks.view.MapContainer", {
    extend: "Ext.Container",
    alias: "widget.mapcontainer",
    
    requires: [
        'Ext.Toolbar',
        'Ext.Map',
        'Ext.field.Search'//,
        // 'GMarks.view.MarksList'
    ],

    initialize: function () {
        console.log("MapContainer-initialize start");
        this.callParent(arguments);

        try{
            var position = new google.maps.LatLng(37.44885, -122.158592);
        }
        catch(e){
            Ext.Msg.alert('Offline!', 'Cannot connect to Google Maps', Ext.emptyFn);
        }

        var currentLocationButton = {
            xtype: "button",
            iconMask: true,
            iconCls: 'locate',
            handler: this.onCurrentLocationButtonTap//,
            // scope: this
        };

        var searchField = {
                xtype: 'searchfield',
                name : 'search_field',
                label: 'search_field',
                id: 'search_field',
                itemId: 'search_field',
                // autoCapitalize: false,
                autoComplete: true,
                //data: Ext.getStore("addressStore"),
                // autoCorrect: false,
                placeHolder: 'Enter an address...',
                listeners: {
                    keyup: this.onKeyup, 
                    scope: this
                }
        };

        var searchResults = {
                xtype: 'list',
                name : 'search_results',
                label: 'search_results',
                id: 'search_results',
                itemId: 'search_results',
                itemTpl: '{a}',
                layout : 'fit',
                store: Ext.getStore("addressStore"),
                  listeners:  {
                    itemtap: this.onItemTap,
                    show: function(list, opts){
                        console.log('******** SHOW');
                        this.getStore().load();
                    }, 
                    scope: this
                }
        };

        var topToolbar = {
            xtype: "toolbar",
            docked: "top",
            items: [
                searchField,
                // searchResults,
                currentLocationButton
                // editButton,
                // { xtype: 'spacer' },
                // showMarksButton,
                // listMarksButton
            ]
        };

        var map = {
            xtype: "map",
            mapOptions : {
                autoUpdate: false,
                zoom : 12,
                mapTypeId : google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.DEFAULT
                }
            },
            listeners: {
                maprender: this.onMapRender
            }
        };
        // this.add([topToolbar, map]);
        this.add([topToolbar, map, searchResults]);
        // this.add([topToolbar, searchResults, map]);
        
         console.log("MapContainer-initialize end");
    },


    onKeyup: function(fld, e, eOpts){
        console.log('onKeyup');
        // console.log(fld.toString());
        // console.log(e.toString());
        // console.log(eOpts.toString());
        
        this.fireEvent('keyUpCommand', fld, e, eOpts);
    },

    onItemTap: function (list, index, element, event) {
        this.fireEvent('itemTapCommand', list, index, element, event);
    },

    onMapRender: function(comp, map){
        console.log("onMapRender");

        // START OF EXPERIMENTAL CODE

        var markers = [];
        var infowindow = new google.maps.InfoWindow();

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.MARKER
            ]
          },
          markerOptions: {
            draggable: true
          }
        });
        drawingManager.setMap(map);  
         drawingManager.setOptions({
           drawingControl: false
         })      

        google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {

          console.log('marker dropped at lat: ' + marker.position.lat() + ' long: ' +  marker.position.lng());
          //console.log(this.drawingControlOptions);
          
            if( markers.length < 3 ){
                 if(markers.length == 0){
                    marker.setIcon('resources/icons/firemen.png');
                    marker.content = "Emergency services access";
                 }
                 if(markers.length == 1){
                     marker.setIcon('resources/icons/postal.png');
                     marker.content = "Letterbox";
                 }
                 if(markers.length == 2){
                    marker.setIcon('resources/icons/entrance.png');
                    marker.content = "Front door";
                    drawingManager.setMap( null );
                 }                 
                markers.push( marker );

            }else{
                marker.setMap( null );
                drawingManager.setMap( null );
                return;
            }
           
            // marker.content = "marker #" + markers.length;
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(this.content);
                infowindow.open(map, this);
            });
        });


        // END OF EXPERIMENTAL CODE


        this.fireEvent("maprenderCommand", this);
        var geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: function(geo){
                    comp.setMapCenter({
                            latitude: geo.getLatitude(),
                            longitude: geo.getLongitude()
                        });
                    comp.setMapOptions({
                        zoom: 16
                    });
                },
                locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
                    if(bTimeout){
                        alert('Timeout occurred.');
                    } else {
                        alert('Error occurred.');
                    }
                }
            }
        });
        geo.updateLocation();

    },

    onShowMarksButtonTap: function () {
        console.log("showMarksCommand");
        this.fireEvent("showMarksCommand", this);
    },

    onCurrentLocationButtonTap: function () {
        console.log("currentLocationCommand");
        this.fireEvent("currentLocationCommand", this);
    },

    onEditButtonTap: function () {
        console.log("editMarkerCommand");
        this.fireEvent('editMarkerCommand', this);
    },

    onListMarksButtonTap: function () {
        console.log("listMarksCommand");
        this.fireEvent('listMarksCommand', this);
    },

    config: {
        layout: {
            type: 'fit'
        }
    }
});
