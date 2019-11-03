
var tableau = [];
var rating;
var ztab= [];
var marker
function Item (map, service, id, location, name, vicinity, rating, photos, commentsJson) {
    this.map = map;
    this.service = service;
    this.id = id;
    this.location = location;
    this.name = name;
    this.vicinity = vicinity;
    this.rating = rating;

    if(photos != undefined) {

        var stringLoc ="location="+this.location;
        var firstReplace= stringLoc.replace("(","");
        secondReplace=firstReplace.replace(")","");
        var streetView=secondReplace.replace(" ","");
        //this.photos = photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150});
        this.photos= "https://maps.googleapis.com/maps/api/streetview?size=150x150&heading=151.78&pitch=-0.76&key=AIzaSyB5GRHv_2Aa4lJvIcq2UcZZzO6uvL1w5zQ&"+streetView
  
    } else {
        this.photos = "http://racine.cccommunication.biz/v1/img/photo/photos_defaut/pas0BRnew.png";
    }
    if (commentsJson != undefined) {
        this.commentsJson = commentsJson;
    }
}

Item.prototype.createMarker = function () {
    var self = this;
    rating = self.rating
    var placeLoc = self.location;
    var titleInfo =  `
        ${self.name}
        ${self.vicinity}
      `;
     marker = new google.maps.Marker({
        map: myMap.map,
        position: placeLoc,
        title: titleInfo,
        animation: google.maps.Animation.DROP,
        icon: 'https://img.icons8.com/color/40/000000/restaurant-building.png',
        zIndex: Math.round(rating)
    })
    ztab.push(Math.round(rating))
    tableau.push(marker)
}



Item.prototype.initHtml = function () {

    this.itemNode = document.querySelector('.item').cloneNode(true);
    var self = this;
    var a = 0;
    self.itemNode.classList.remove('.item');
    self.itemNode.removeAttribute('block');
    self.itemNode.querySelector('.itemNameClass').textContent = `  ${self.name}`; // le nom du restaurant html
    self.itemNode.querySelector('.itemVicinityClass').textContent = `${self.vicinity}`; // l'adresse du restaurant 
    x = Math.round(self.rating);
    self.itemNode.querySelector('.itemRatingClass').textContent = `${x}`;
    self.itemNode.querySelector('.itemRatingClass').style.display = "none";
    var starElm = self.itemNode.querySelector('.itemRatingImg');
        if (x === 1) {starElm.src = "../img/1_star.png";}
        else if (x === 2) {starElm.src = "../img/2_stars.png";}
        else if (x === 3) {starElm.src = "../img/3_stars.png";}
        else if (x === 4) {starElm.src = "../img/4_stars.png";}
        else if (x === 5) {starElm.src = "../img/5_stars.png";}
        else if (x === 0) {starElm.src = "../img/0_star.png";};

    var starElm = self.itemNode.insertBefore(starElm, self.itemNode.querySelector('.itemVicinityClass'));//insere l'image en premier

    var imageElm = document.createElement('img');
    imageElm.src = self.photos;
    imageElm.style.display = "none";
    var imageElm = self.itemNode.insertBefore(imageElm, self.itemNode.querySelector('.itemRatingClass'));

    var closeElm = document.createElement('img');
    closeElm.className = "close";
    closeElm.src = "../img/close.png";
    closeElm.style.display = "none";
    var closeElm = self.itemNode.insertBefore(closeElm, self.itemNode.querySelector('.itemVicinityClass'));

    self.itemNode.style.height = "90px";
    self.itemNode.style.overflow = "hidden";
    
     // Charge un bouton pour ajouter des commentaires et le masque

    self.itemNode.querySelector('#buttonModalAddCommentId').style.display = "none";


    
    self.itemNode.querySelector('.itemNameClass').addEventListener('click', function(evt){
        evt.target.style.color = "#FC6354";
        self.itemNode.style.backgroundColor = "#EFEEE4";
        self.itemNode.style.height = "500px";
        self.itemNode.style.overflow = "auto";
        imageElm.style.display = "block";
        closeElm.style.display = "block";
       
         // Affiche les commentaires de l' API
         
        if( a == 0) {
            self.getDetails();
            a = 1;
        } if ( a== 1) {
            console.log('pas de nouvel request');
        };
        
          //Affiche les commentaires ajoutés par l' utilisateur.
       
        var commentNode = document.body.querySelector('.commentClass');
        commentNode.style.display= "block";
        
         //Affiche le bouton qui permet l' ajout de commentaire par l' utilisateur via l' ouverture d'une modal.
        
        var modalElm = self.itemNode.querySelector('#buttonModalAddCommentId');
        modalElm.style.display = "block";
        document.body.querySelector('#buttonModalValidCommentId').addEventListener('click', validation)
        var modalElm = self.itemNode.insertBefore(modalElm, self.itemNode.querySelector('.itemCommentClassNode'));
   
        function validation (evt) { // la fonction evenement lorsque on ajoute le commentaire en cliquant sur "Validez"
            var $modal = $('#myModal');
            var modal = document.body.querySelector('#myModal');
            var pseudo = modal.querySelector('#pseudoId').value;
            var commentaire = modal.querySelector('#commentaireId').value;
            var note = modal.querySelector('#ratingId').value;
    
            var comment = new Comment(pseudo, note, commentaire, self.itemNode);
            comment.initHtml();
           if (comment == true) {
                self.itemNode.querySelector('#buttonModalAddCommentId').style.display = "none";
                console.log('salut')
            }
            console.log(comment)
            self.itemNode.querySelector('#buttonModalAddCommentId').style.display = "none";
            //$modal.modal('toggle');
            alert('Votre commentaire à bien été ajouté ')
            $(".modal-body input").val(""); // remplace l'input de la modal par un élement vide 
            document.body.querySelector('#buttonModalValidCommentId').removeEventListener('click', validation); // lorsqu'on clique sur le bouton fermer on remove l'evenement
        }
   
        closeElm.addEventListener('click', function(evt){
            setTimeout(function() {
                self.itemNode.querySelector('.itemNameClass').style.color = "#2D5BE3";
                self.itemNode.style.backgroundColor = '#FFFFFF';
                self.itemNode.querySelector('#buttonModalAddCommentId').style.display = "none";
            },2000);
            self.itemNode.style.height = "90px";
            self.itemNode.style.overflow = "hidden";
            closeElm.style.display = "none";
            var commentNode = document.body.querySelector('.commentClass');
            commentNode.style.display = "none";
        })
    })
    App.listItem.appendChild(self.itemNode);
}




Item.prototype.getDetails = function() {
    var self = this;

    if (self.commentsJson) {
        self.commentsJson.forEach(function(comment) {
            var commentObject = new Comment("Anonyme", comment.stars, comment.comment, self.itemNode);
            commentObject.initHtml();
        });
    } else {
 
        self.service.getDetails({"placeId": self.id}, detailsCallback);
    

        
        function detailsCallback(place, status) { // commentaire récuperer via l'api
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for(var i = 0; i < place.reviews.length; i++ ) {
                    // place.reviews permet de récuperer toute les informations des commentaires laisser par l'api(commentaire,date,pseudo,photos...)
                    self.commentNode = document.querySelector('.itemCommentClassNode').cloneNode(true);
                    self.commentNode.style.display = "block";
                    self.commentNode.querySelector('.itemCommentInfoClass').textContent =`Ce commentaire à été écrit par : `
                    self.commentNode.querySelector('.itemCommentAuthorClass').textContent = ` ${place.reviews[i].author_name} `;//auteur commentaire
                    self.commentNode.querySelector('.itemCommentClass').textContent =  `" ${place.reviews[i].text} " `;// texte commentaire     
                    self.commentNode.querySelector('.itemCommentClass').style.textAlign = "justify-all"; 
                    self.commentNode.querySelector('.itemCommentTimeClass').textContent = `${place.reviews[i].relative_time_description}.`;//date commentaire
                             
                    x = Math.round(place.reviews[i].rating);//permet de créer une moyenne aux commentaires
                    self.commentNode.querySelector('.itemCommentRatingClass').textContent = `${x}`;
                    self.commentNode.querySelector('.itemCommentRatingClass').style.display = "none";
                    var starElm = self.commentNode.querySelector('.itemCommentImg');
              
                    if (x === 1) {starElm.src = "../img/1_star.png";}
                    else if (x === 2) {starElm.src = "../img/2_stars.png";}
                    else if (x === 3) {starElm.src = "../img/3_stars.png";}
                    else if (x === 4) {starElm.src = "../img/4_stars.png";}
                    else if (x === 5) {starElm.src = "../img/5_stars.png";}
                    else if (x ===0)  {starElm.src = "../img/0_star.png";};
                    var starElm = self.commentNode.insertBefore(starElm, self.commentNode.querySelector('.itemCommentClass')); //permet d'insérer l'iamge avant le commentaire
                    self.itemNode.appendChild(self.commentNode);
                }
            } else {
                console.log('request status :' ,status);
            }
        }
    }

}
