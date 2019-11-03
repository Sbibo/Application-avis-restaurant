function App () {
  this.listItem = document.querySelector('#sidebarId');
  this.itemNode = document.querySelector('.item');
  this.refreshButton = document.getElementById('refreshId');
  this.filterButton = document.getElementById('filterId');
  this.filterButton2 = document.getElementById('filterId2');

  this.refresh();
  this.filterListener();
  this.filterListener2();

}


// actualiser la page
App.prototype.refresh = function () {
  var self = this;
  self.refreshButton.addEventListener('click', function () {
      window.location.reload();
  })
}

// filtrer les notes
var selectedStars 
var selectedStars2

App.prototype.filterListener = function () {
  var self = this;
  self.filterButton.addEventListener('change', function (event) {

      selectedStars = event.target.selectedOptions[0].attributes[0].nodeValue;
      tab1.push(selectedStars)
      self.filter(selectedStars);

  })
}

App.prototype.filterListener2 = function () {
  var self = this;
  self.filterButton2.addEventListener('change', function (event) {
      selectedStars2 = event.target.selectedOptions[0].attributes[0].nodeValue;
      tab2.push(selectedStars2)
      self.filter(selectedStars2);

  })
}



var itemStars;


App.prototype.filter = function(maxStars){
var self = this;
  for(var i = 0; i < self.listItem.children.length; i++ ) {
      itemStars = self.listItem.children[i].querySelector('.itemRatingClass');
      itemStars = itemStars.innerHTML;
      console.log(selectedStars)
      console.log(selectedStars2)
      console.log(tableau)
      console.log(ztab)
      x = Math.round(itemStars);

      if (itemStars >= selectedStars2 && itemStars<=selectedStars || selectedStars2==="noFilter" ||selectedStars==="noFilter" ){
        self.listItem.children[i].style.display = 'block'
      }
      else {
        // hidde item
        self.listItem.children[i].style.display = 'none';
      }
    }

    for (var i=0;i<ztab.length;i++){ // condition pour afficher ou non les marqueurs
      if (ztab[i] >= selectedStars2 && ztab[i]<=selectedStars  || selectedStars2==="noFilter" ||selectedStars==="noFilter" ){

      tableau[i].setVisible(true);
             
      } else {
      tableau[i].setVisible(false);
      }
      }   
     
}
 






/*
window.addEventListener("beforeunload", function (e) { // fonction qui permet de demander confirmation avant de quitter la page
  var message = "";
  e.returnValue = message;
  console.log(message)
  return message; 
});

*/
