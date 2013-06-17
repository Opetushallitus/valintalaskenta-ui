// Ei tämä toimi, mutta muut filterit varmaan tänne, jos niitä tulee
app.filter('matchOrg', function(AuthService) {
  return function( items) {
    var filtered = [];

    items.forEach(function(item){
        AuthService.readOrg(item.tarjoajaOid).then(function(){
            console.log("new: " + items.length);
            filtered.push(item);
        });
    });
    return filtered;
  }
});