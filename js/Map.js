var map,infoWindow
var tableau = []
var tab1 =[]
var tab2= []
function myMap () {
this.map = "";
this.PlaceService = "";
}

myMap.prototype.initMap = function () {
  this.map = new google.maps.Map(document.getElementById('map'), {
      center: {
          lat: 48.8534100,
          lng: 2.3488000
      },
      zoom: 16,
  });
  var pos = {
      lat: 48.8534100,
      lng: 2.3488000
  }
  var marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      title:"Paris !",
      animation: google.maps.Animation.DROP,
      icon: 'http://maps.google.com/mapfiles/arrow.png'
  })
 this.getJson("../js/Restaurant.json");
  this.PlaceService = new google.maps.places.PlacesService(this.map);
  this.geolocation();
  this.autocomplete();
  this.addMarkerClick();
  this.validResto()
  this.dragg()
}

myMap.prototype.ajaxGet = function (url, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", url);
  req.addEventListener("load", function () {
      if (req.status >= 200 && req.status < 400) { //status===200 = ok 403===forbiden 404===page introuvable
          // Appelle la fonction callback en lui passant la réponse de la requête
          callback(req.responseText);
      } else {
          console.error(req.status + " " + req.statusText + " " + url);

      }
  });
  req.addEventListener("error", function () {
      console.error("Erreur réseau avec l'URL " + url);

  });
  req.send(null);
}


myMap.prototype.getJson = function (url) {
  this.ajaxGet(url, function (results) {
      result = JSON.parse(results);
      for (var i = 0; i < result.length; i++) {
          var self = this;
          var num1 = result[i].ratings[0].stars;
          var num2 = result[i].ratings[1].stars;
          var somme = num1 + num2;
        
          var x = Math.round(somme / result[i].ratings.length);
    
          var item = new Item(self.map,
                      null,
                      null,
                      new google.maps.LatLng(result[i].lat, result[i].long), // retourne l'objet formater googlemap
                      result[i].restaurantName,
                      result[i].address,
                      x,
                      null,
                      result[i].ratings
                      );
          item.createMarker();
          item.initHtml();
      };
  });
}


myMap.prototype.geolocation = function () {
  var self = this;
  if (navigator.geolocation) {
    var infoWindow = new google.maps.InfoWindow({
      content: name,
  });
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);

      self.map.setCenter(pos);
      var marker = new google.maps.Marker({
          position: pos,
          map: self.map,
          title:"Vous êtes ici !",
          animation: google.maps.Animation.DROP,
          icon: 'https://img.icons8.com/cotton/45/000000/gingerbread-man--v2.png',

      })
      var service = self.PlaceService;
            service.nearbySearch({ //renvoie une liste autour de l'utilisateur
                location:pos,
                radius: 500,
                type: ['restaurant']
              }, self.callback);
    }, 
    function() {
      handleLocationError(true, infoWindow, self.map.getCenter())
      })
  } else {

  handleLocationError(false, infoWindow.setContent('La geolocalisation ne marche pas'), self.map.getCenter())
  console.log('lag')
}
}



myMap.prototype.dragg= function(){
  var self = this;

  google.maps.event.addListener(myMap.map,'dragend',function(event){
    var idleListener = self.map.addListener('idle', function () {
      google.maps.event.removeListener(idleListener);
     
      var lat1= self.map.getCenter().lat()
      var lng2= self.map.getCenter().lng()
      var centre = {lat: lat1, lng :lng2}
      self.map.setCenter(centre)
      console.log(centre)
      var service = self.PlaceService;
      service.nearbySearch({ 
          location:centre,
          radius: 2500,
          type: ['restaurant']
        }, self.callback);

  });
  })
}


myMap.prototype.autocomplete = function () { // cette fonction permet l'autocomplete dans la barre de recherche
    var self = this;
    var input = document.querySelector('#autocompleteId')
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', function () {
        App.listItem.innerHTML = "";
        var position = autocomplete.getPlace().geometry.location;
        var marker = new google.maps.Marker({
            position: position,
            map: self.map,
            title:"Here",
            animation: google.maps.Animation.DROP,
            icon: 'https://cdn3.iconfinder.com/data/icons/mapicons/icons/hospital.png'
        })
  
        var service = self.PlaceService;
        service.nearbySearch({
            location :position,
            radius : 2500,
            type : ['restaurant']
        }, self.callback)
        self.map.setCenter(position);
        self.map.setZoom(16);
    })
};

var bool = false;



var newRestau;   

myMap.prototype.addMarkerClick = function () {
  var self = this;
  google.maps.event.addListener(myMap.map, 'click', function (event) {
    var $modal = $('#myModal1');
      $modal.modal('toggle');
      $(".modal-body input").val("");

        newRestau = new Item(self.map,
        self.PlaceService,
        null, //id
        event.latLng   
        );
      newRestau.createMarker() // Créer un marqueur restaurant
    })
  document.body.querySelector('#buttonModalAddCloseId').addEventListener('click', function (){
      var $modal = $('#myModal1');
      var modal = document.body.querySelector('#myModal1');
      $modal.modal('toggle');
    
  })
  document.body.querySelector('#buttonModalValidItemId').addEventListener('click', function (){
    bool=false
})
}

myMap.prototype.validResto = function(){
  var self=this;
  document.body.querySelector('#buttonModalAddCloseId').addEventListener('click', function (){
    var $modal = $('#myModal1');
    var modal = document.body.querySelector('#myModal1');
    var title = modal.querySelector('#nameItem').value;
    var adress = modal.querySelector('#adressItem').value;
    var rating = modal.querySelector('#ratingItem').value;
    newRestau.name=title;
    newRestau.vicinity=adress;
    newRestau.rating=rating;
    newRestau.initHtml()
    newRestau.createMarker()
  })

}

var item;
var index=[]
myMap.prototype.callback = function(results, status) {
  var self = this;
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
          var PlaceService = new google.maps.places.PlacesService(document.body.appendChild(document.createElement('div')));
        // On utilise le constructor item pour classer les restaurants récupérer via l'api google maps
          var modal = document.body.querySelector('#myModal1');
          var note = modal.querySelector('#ratingItem').value;
          // recupere toutes les informations via l'api le nom l'adresse les notes etc et créer un item avec toutes ces informations
          var x;
           item = new Item(self.map,
                                PlaceService,
                                results[i].place_id,
                                results[i].geometry.location, // les coordonnées gps
                                results[i].name, //le nom du restaurant
                                results[i].vicinity, //l'adresse du restaurant
                                results[i].rating ,  // la note
                                results[i].photos,   //la photo du commentaire
                                );  
                       
        item.createMarker(); // ajoute le marqueur du restaurant récuperer via l'api
        item.initHtml();
      }
  }
};
