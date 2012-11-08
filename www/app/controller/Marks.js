Ext.define("GMarks.controller.Marks", {
    extend: "Ext.app.Controller",
    
    config: {
        refs: {
            // We're going to lookup our views by xtype.
            markEditor:         "markeditor",
            mapContainer:       "mapcontainer",
            marksListContainer: "markslistcontainer"
         },
        control: {
            markEditor: {
                // The commands fired by the mark editor.
                saveMarkCommand:    "onSaveMarkerCommand",
                sendMarkCommand:    "onSendMarkCommand",
                deleteMarkCommand:  "onDeleteMarkCommand",
                backToHomeCommand:  "onBackToHomeCommand",
                editorBackCommand:  "onEditorBackCommand"

            },            
            mapContainer: {
                // The commands fired by the map container.
                showMarksCommand:       "onShowMarksCommand",
                maprenderCommand:       "onMapRenderCommand",
                currentLocationCommand: "onCurrentLocationCommand",
                editMarkerCommand:      "onEditMarkerCommand",
                listMarksCommand:       "onListMarksCommand",
                keyUpCommand:           "onKeyUpCommand",
                itemTapCommand:         "onItemTapCommand"
            },
            marksListContainer:{
                // The commands fired by the marks list container.
                editMarkerCommand:  "onEditSavedMarkerCommand",
                backToHomeCommand:  "onBackToHomeCommand"
            }
        }
    },

    ZOOM_LEVEL: 16,

    currentMarker:  null,

    currentMark:  null,

    currentMarkerIcon: null,

    defaultMarkerIconURL:   'resources/icons/star-3.png',

    selectedMarkerIconURL:  'resources/icons/direction_down.png',

    editMarkerCallerComponent: 'HOME',

    onKeyUpCommand: function(fld, e, eOpts) {
        console.log("onKeyUpCommand");
        var addressStore = Ext.getStore("addressStore");
        var charPressed = fld.getValue();

        var searchResultsList = this.getMapContainer().down('#search_results');
        // searchResultsPopup = this.getMapContainer().down('#search_results_panel');
        console.log('searchResultsList=');
        console.log(Ext.getClassName(searchResultsList));

        console.log('charPressed=');
        console.log(charPressed);
        // console.log('searchResultsList is a ' + Ext.getClassName(searchResultsList));
        addressStore.getResults(charPressed, function(results){
            //debugger;
            if(results){
                console.log('SHOW');
                searchResultsList.show();
                addressStore.loadData(newResults, false);
                // ?????
                // Ext.Viewport.add(searchResultsPopup);// ?????
                // Ext.Viewport.add(searchResultsList);// ?????
                // searchResultsList.show(true);// wtf
                // searchResultsPopup.show();
                // console.log('SHOW');
                // searchResultsList.show();
                console.log(newResults);//alert(newResults);
                //fld.setData({text: "hello", leaf: true});
                console.log("fld.getData()=");
                console.log(fld.getData());
                //alert("results:" + results);
                console.log('results(onKeyUpCommand)=');
                console.log(results);
            }else{
                //alert('no results');
                console.log('no results');
                //searchResultsPopup.hide();
                searchResultsList.hide();
            }
        });
        //debugger;
    },

    onItemTapCommand: function( list, index, element, event) {
        // var record = list.getRecord(element);
        var address = list.getStore().getAt(index);
        var mainController = this;
        var map, marker,
       
        map = this.getMap().getMap();

        var getInfoCallback = function(response){
            // var data = response.responseText;
            console.log('getInfo callback');
            console.log(response);
            console.log('latitude: ' + response.y);
            console.log('longitude: ' + response.x);
            // mainController.setMapCentre(response.y, response.x);

            console.log(response.a.replace(/\,/g,"<br />"));
            if (marker){
               marker.setMap(null);
            }
            var point = new google.maps.LatLng(response.y,response.x);
            map.setCenter(point);
            // mainController.setMapCentre(response.y, response.x);
            map.setZoom(18);
            marker = new google.maps.Marker({
                position: point,
                map: map
            });
            console.log('AAAAAAAAAAAinfowindow1');
            var infowindow = new google.maps.InfoWindow({
                content: response.a.replace(/\,/g,"<br />")
            });
            console.log('AAAAAAAAAAAAAAAinfowindow2');
            infowindow.open(map,marker);
            mainController.loadTitles();

        };

        address.getInfo(getInfoCallback);

        console.log(address.get('a'));
        console.log(address.get('pxid'));
        console.log(address.get('v'));

        console.log(Ext.getClassName(list.getStore().getAt(index)));

        console.log(Ext.getClassName(list.getStore()));
        var addressStore = Ext.getStore("addressStore");
        console.log('onItemTapCommand');
 
        console.log('list= ' + Ext.getClassName(list));
        console.log('index=' + index.toString()); 
        console.log('element=' + Ext.getClassName(element));
        // var searchResultsPopup = this.getMapContainer().down('#search_results_panel');
        list.hide();
        // searchResultsPopup.hide();
        
    }, 

    onMapRenderCommand: function () {
        console.log("onMapRenderCommand");

        var mapContainer = this.getMapContainer();
        
    },

    onCurrentLocationCommand: function(){
        console.log("onCurrentLocationCommand");

        this.centreMapOnCurrentLocation();

    },

    onShowMarksCommand: function () {
        console.log("onShowMarksCommand");

        try{
            this.loadGeodeticMarks();
        }catch(e){
            Ext.Msg.alert('Offline!', 'Cannot connect to LINZ data service', Ext.emptyFn);
        }
    },

    onBackToHomeCommand: function () {
        console.log("onBackToHomeCommand");
        this.activateMapContainer();
    },

    // utility functions
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    slideLeftTransition: { type: 'slide', direction: 'left' },

    slideRightTransition: { type: 'slide', direction: 'right' },

    activateMapContainer: function () {
        Ext.Viewport.animateActiveItem(this.getMapContainer(), this.slideRightTransition);
    },


    centreMapOnCurrentLocation: function(){
        var mainController = this,
            locationupdateFn = function(geo) {
                lat = geo.getLatitude(),
                lng = geo.getLongitude();
                mainController.setMapCentre(lat, lng);

            };
        console.log('centreMapOnCurrentLocation');
        mainController.getLocation(locationupdateFn);
        mainController.loadTitles(); 
        
    },     

    getLocation: function(locationupdateFn){
        var mainController = this;
        var geo = Ext.create('Ext.util.Geolocation', {
            autoUpdate: false,
            listeners: {
                locationupdate: locationupdateFn,
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

    getMapCentre: function(){

        var map = this.getMap();
        var centrePointLatLng = map.getMap().getCenter();

        var lat = centrePointLatLng.lat();
        // var lng = centrePointLatLng.lng() + 360;
        var lng = centrePointLatLng.lng() ;
        return {
            "lat": lat,
            "lng": lng
        };
    },

    getMap: function(){
        return this.getMapContainer().down('.map');
    },

    setMapCentre: function(lat, lng){
        var map = this.getMap();
        map.setMapCenter({
                latitude: lat,
                longitude: lng
            });
        map.setMapOptions({
            zoom: this.ZOOM_LEVEL
        });
    },

    startLoadingIndicator: function(){
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'loading...',
            indicator: true
        });
    },

    stopLoadingIndicator: function(){
        Ext.Viewport.setMasked(false);
    },

    loadLINZData: function(lat, lng, layerType, successFn){
        
        var mainController = this;
        
        Ext.data.JsonP.request({
            url: 'http://api.data.linz.govt.nz/api/vectorQuery.json/',
            callbackKey: 'callback',
            params: {
                key: 'ab6a12cfff0e43f2bc17491efff37f7b',
                layer: layerType,
                v: 1.2,
                x: lng,
                y: lat ,
                radius: 100,
                max_results: 5,
                geometry: true,
                with_field_names: true
            },
            success: successFn
        });
    },

    loadTitles: function(){
            console.log("loadTitles");
            var mainController = this;
            var mapCentre = this.getMapCentre();
            var TITLES_LAYER = 804;
            
            var successFn = function(result, request){
                debugger;            
                var titles = result.vectorQuery.layers["804"].features;

                mainController.showTitlesOnMap(titles);
                
                // set map centre to where the LINZ data is obtained from.
                mainController.setMapCentre(mapCentre.lat, mapCentre.lng);
                mainController.getMap().getMap().setZoom(18);
            };
            mainController.loadLINZData( mapCentre.lat, mapCentre.lng, TITLES_LAYER, successFn);

            // this.getMap().getMap().setZoom(25);
        },

        showTitlesOnMap: function(titles){
            var mainController = this;
            // var map = mainController.getMainFormPanel().down('#theMap');
            var map = mainController.getMap().getMap();
            
            var showTitles = function(map){
                for (var i = 0; i < titles.length; i++) {
                    showTitle(map, titles[i]);
                };
            };

            var showTitle = function(map, title){
                //console.log(title);
                //var title, point, polygons, polygon;//, polygonShape;, polygonCoords;
                var infowindow;// = new google.maps.InfoWindow();
                console.log('TITLE DESCRIPTION:' + title.properties.estate_description);
                var title_coordinates = title.geometry.coordinates;
                for (var J = 0; J < title_coordinates.length; J++) {
                    var polygons = title_coordinates[J];
                    //console.log(polygons);
                    for (var k = 0; k < polygons.length; k++) {
                        var polygon = polygons[k];
                        //console.log('polygon:'+ polygon);
                        var polygonCoords = [];
                        for (var l = 0; l < polygon.length; l++) {
                            var point = polygon[l];
                            console.log('x=' + point[0] + ' y=' + point[1]);
                            polygonCoords.push( new google.maps.LatLng(point[1], point[0]) );
                        };
                        var polygonShape = new google.maps.Polygon({
                            paths: polygonCoords,
                            strokeColor: "#FF0000",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: "#FF0000",
                            fillOpacity: 0.35
                        });
                        // polygonShape.setMap(map.getMap()); 
                        polygonShape.setMap(map); 
                        console.log(polygonShape);
                          // Add a listener for the click event
                        infowindow = new google.maps.InfoWindow();
                        google.maps.event.addListener(polygonShape, 'click', showTitleData);
                        

                    };
                };
                function showTitleData(event) {
                  debugger;  
                  // Since this Polygon only has one path, we can call getPath()
                  // to return the MVCArray of LatLngs
                  var vertices = this.getPath();

                  var contentString = "<b>Title</b><br />";
                  // contentString += "Clicked Location: <br />" + event.latLng.lat() + "," + event.latLng.lng() + "<br />";
                  //debugger;  
                  // // Iterate over the vertices.
                  // for (var i =0; i < vertices.length; i++) {
                  //   var xy = vertices.getAt(i);
                  //   contentString += "<br />" + "Coordinate: " + i + "<br />" + xy.lat() +"," + xy.lng();
                  // }
                  contentString += "<br />" + 'estate description:' + title.properties.estate_description;
                  contentString += "<br />" + 'guarantee status:' + title.properties.guarantee_status;
                  contentString += "<br />" + 'id:' + title.properties.id;
                  contentString += "<br />" + 'issue date:' + title.properties.issue_date;
                  contentString += "<br />" + 'land district:' + title.properties.land_district;
                  contentString += "<br />" + 'no. of owners:' + title.properties.number_owners;
                  contentString += "<br />" + 'spatial extents shared:' + title.properties.spatial_extents_shared;
                  contentString += "<br />" + 'status:' + title.properties.status;
                  contentString += "<br />" + 'title no:' + title.properties.title_no;
                  contentString += "<br />" + 'type:' + title.properties.type;

                  infowindow.setContent(contentString);
                  infowindow.setPosition(event.latLng);

                  infowindow.open(mainController.getMap());
                }
            };

            showTitles(map);
        },

    loadAddressFinder: function(){
        var widget, map, marker,
        searchFieldHtmlId = document.getElementsByName("search_field")[0].id,
        mainController = this;
        widget = new AddressFinder.Widget(document.getElementById(searchFieldHtmlId), "8VPB3L6U9XD4WKYECH7M");
        map = this.getMap().getMap();

        
        widget.on("result:select", function(value,data){
            if (marker){
               marker.setMap(null);
            }
            var point = new google.maps.LatLng(data.y,data.x);
            map.setCenter(point);
            map.setZoom(18);
            marker = new google.maps.Marker({
                position: point,
                map: map
            });
            var infowindow = new google.maps.InfoWindow({
                content: data.a.replace(/\,/g,"<br />")
            });
            infowindow.open(map,marker);
            mainController.loadTitles();
        });         
    },

    launch: function () {
        console.log("launch");

        this.callParent();
        Ext.getStore("Marks").load();  

        //Ext.onReady(this.loadAddressFinder, this, {single: true});
    },

    init: function () {
        console.log("init");
        
        this.callParent();
    }
});
