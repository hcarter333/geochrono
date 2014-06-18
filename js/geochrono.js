    var g_pms = [],                   // Array to hold satellite objects
        g_TLE = [],
        g_numOfSats = 0,              // Number of satellites
        g_altitudeMode = false,        // altitude mode: true = absolute,  false = clampToGround
        g_extrudeMode = true,         // extrude:  true = on

        g_updatePeriod = 1000,        // Time between calls to fetchNewData function (in ms)  HBC originally 1000
        g_features, g_features_l, g_feature_r,                  // performance hack. Variable to hold ge.getFeatures()
        g_speed = 1,                // set this to 1 to update the satellite in real time
 
        g_curTime,
        g_fetchNew = null,
        g_lastMillis,
        g_lastUpdate,
        position,
        slider,
        xmlHttp;
        resetinProgress = false;
        
        earthradius = 20925524.9;    //earth radus in feet
        eradm = 6378100;

       

 	var my_lat = 40.9583819592;
	var my_lng = -72.9725646973;
	var cannonball;
	var pm_cnt = 79;
     



var req;




function bang_begin(){
	
	  // Look at the placemark we created.
	  var la = ge.createLookAt('');
	  la.set(my_lat, my_lng, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 10000000);
	  ge.getView().setAbstractView(la);
	  
      //setup_marker_move_1();	  
	  
      ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
      ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
      ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
      ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);    
      ge.getOptions().setScaleLegendVisibility(true);
      
}


armory_select = [];




var animRunning = false;
var ANIM_ALTITUDE = 100;
var up_vel = 1000; //m/s
var alt  = ANIM_ALTITUDE;
var tick_cnt = 0;
var camera;
var pm1;
var point;
var shot_heading = 80.0;
var shot_vel = 0.0;
var shot_angle = 0.0;
var shot_cnt = 0;
var across_vel = 1000.0;
var time_step = 0;
var init_time_step = 2;
var slowed = false;

var scamlat;
var scamlng;
var scamalt;
var scamheading;   
var scamtilt;




	
	
	var latest_hit;

//array for holding the hit placemarks
	var hitarray = [];
	var munitionsarray = [];
	var hacnt = 0;

	


var gex;

function my_sat_test(){
    
    g_features = ge.getFeatures();
    g_getview = ge.getView();
    //createStyles();       
    ge.getWindow().setVisibility(true); 
    
    gex = new GEarthExtensions(ge);

    ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
    ge.getOptions().setStatusBarVisibility(true);
    //updateOptions();

    var la = ge.createLookAt(''); 
    la.set(0, 0, 0, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 20000000); 
    ge.getView().setAbstractView(la);     
   
    //google.earth.addEventListener(ge.getGlobe(), "mousedown", function(event) { draw(event); }); 
    //google.earth.addEventListener(ge.getGlobe(), "mousemove", function(event) { movePMLoc(event); }); 
    
    bang_begin();
	
}



var target_id = '';
var target_name = '';
var target_location = '';




     
     function about() {
      if(ge){
        var balloon = ge.createHtmlStringBalloon('');
        balloon.setMaxWidth(350);
        balloon.setContentString('Real-time Amateur Satellite Tracker.<br /><br />' +
            'Currently tracking ' + g_numOfSats + ' objects.');
        ge.setBalloon(balloon);
      }
    }    
  
     function fetchCurTime()
     {
       var timex = new Date();
       return timex.getTime()
     }
 


     function updateOptions()
     {
       var options = ge.getOptions();
       var form = el("options");
       var mode;

       if (form.altitude.checked != g_altitudeMode)
       {
         g_altitudeMode = form.altitude.checked;
         for (var i =0; i< g_numOfSats;i++){g_pms[i].altMode(g_altitudeMode)}
       }
 
  
       ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
       ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
       ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN, true);
       ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);    
       }
 
     function el(e) { return document.getElementById(e); }





//State variables and functions for the lofting animation
//the hit is already stored in latest_hit
//copy the coordinate figuring from show_field
var loft_end;
var loft_tick = 0;
//Take about two seconds to do this assuming 15fps
var rev_dur = 2;
var rev_fps = 15;
var time_steps = 0;
var animLoftRunning = false;
var hitpoint;
var fieldpoint;
//center on the southern most point
var swllat;
var swllng;



	
	var targetmarker;
	function init_map() {
	    //alert('init map');
	    map = new GMap2(document.getElementById("targetmap"), {   size:new GSize(250,250)});
	    //alert('exit init map');
	    var point = new GLatLng(37.71859, 6.679688);
	    map.setCenter(point, 3);
	    //var mapControl = new GMapTypeControl();
	    //map.addControl(mapControl);
	    map.addControl(new GSmallMapControl());    //map = new GMap2( document.getElementById('map_canvas') );
	    map.setMapType(G_PHYSICAL_MAP );
	    
	    //add the targeting placemark
	    targetmarker = new GMarker(point);

	    map.addOverlay(targetmarker);
	    
	}
	

//=======================================================================
//New initialization of v3 map
//=======================================================================
  //only initialize once
  var map_init_b = false;
  function map_initialize() {
    if(!map_init_b){
	  var mapOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 8
        };
        var map = new google.maps.Map(document.getElementById("friend_list"),
          mapOptions);
    map_init_b = true;
    }
  }
  //google.maps.event.addDomListener(window, 'load', initialize);

  function showLocMap(){
	  Effect.SlideDown('slidedown_demo');
	  setTimeout(map_initialize, 1001);
	  return false;
  }
	
	//Date handling functions
  function isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
	  return false;
	return !isNaN(d.getTime());
  }
    
	var so_three;
	var so_two;
	var so_one;
	var so_zero;
	
	var countdown_cnt = 0;
	var old_countdown = null;
	
	
	var munition_index = 0;
    //munitions packs
	animal_munitions = [];
	animal_munitions[0] = ['flower.JPG', 'flowertfade.JPG', 'flowert.JPG', 'flower', 'http://copaseticflows.appspot.com/img/flower2.dae'];
	animal_munitions[1] = ['bombsel.JPG', 'bombtfade.JPG', 'bombt.JPG', 'bomb', 'http://copaseticflows.appspot.com/img/practicebomb4.dae'];
	animal_munitions[2] = ['boulder.JPG', 'bouldertfade.JPG', 'bouldert.JPG', 'boulder', 'http://copaseticflows.appspot.com/img/verticalboulder.dae'];
	
	