app.factory('ValintalaskentatulosModel', function(ValinnanvaiheListByHakukohde, JarjestyskriteeriArvo) {
	var model;
	model = new function() {

		this.hakukohdeOid = {};
		this.valinnanvaiheet = [];
		
		this.refresh = function(hakukohdeOid) {
            model.hakukohdeOid = hakukohdeOid;
			ValinnanvaiheListByHakukohde.get({hakukohdeoid: hakukohdeOid}, function(result) {
			     model.valinnanvaiheet = result;
			});
		}

		this.updateJarjestyskriteerinArvo = function(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, kriteerinArvo) {
			var updateParams = {
				valintatapajonoOid: valintatapajonoOid,
        		hakemusOid: hakemusOid,
        		jarjestyskriteeriprioriteetti: jarjestyskriteeriprioriteetti
			}

			JarjestyskriteeriArvo.post(updateParams, kriteerinArvo, function(result) {});
		}
	};

	return model;
});


function ValintalaskentatulosController($scope, $location, $routeParams, ValintalaskentatulosModel, HakukohdeModel) {
    $scope.hakukohdeOid = $routeParams.hakukohdeOid;
    $scope.hakuOid =  $routeParams.hakuOid;;
    $scope.HAKEMUS_UI_URL_BASE = HAKEMUS_UI_URL_BASE;
    $scope.model = ValintalaskentatulosModel;
    $scope.hakukohdeModel = HakukohdeModel;
    HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid);
    $scope.model.refresh($scope.hakukohdeOid);
    $scope.valintalaskentatulosExcelExport = SERVICE_EXCEL_URL_BASE + "export/valintalaskentatulos.xls?hakukohdeOid=" + $routeParams.hakukohdeOid;
    
    $scope.showHistory = function(msg) {
    	// historia on taulukko merkkijonoja. konvertoidaan jsoniksi
    	var historiat = [];
    	angular.forEach(msg, function(historiaString){
    		historiat.push(angular.fromJson(historiaString));          
    	});
    	
    	function to_ul(historiat) {
    	    var ul = document.createElement("ul");

    	  for (var i=0, n=historiat.length; i<n; i++) {
    	      var historia = historiat[i];
    	      var li = document.createElement("li");

    	        var text = document.createTextNode(historia.funktio+ " ");
    	        
    	        var tulos = document.createElement("strong");
    	        tulos.appendChild(document.createTextNode(" "+historia.tulos));
    	        
    	        li.appendChild(text );
    	        
    	        angular.forEach(historia.avaimet, function(arvo,avain){
    	        	var span = document.createElement("span");
    	        	$(span).attr("style", "color:red;");
        	        span.appendChild(document.createTextNode(" " + avain + "=" + arvo + " "));
        	        li.appendChild(span);    
    	    	});
    	        
    	        
    	        
    	        li.appendChild(tulos );
    	        if (historia.historiat) {
    	             li.appendChild(to_ul(historia.historiat));
    	        }

    	        ul.appendChild(li);
    	    }

    	    return ul;
    	}
    	//
    	
    	var my_window = window.open("", "Historia", "status=1,width=1600,height=900");
        my_window.document.write($(to_ul(historiat)).html());
        //alert(msg);
   };
    /*
    $scope.updateJarjestyskriteerinArvo = function(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, kriteerinArvo) {
    	$scope.model.updateJarjestyskriteerinArvo(valintatapajonoOid, hakemusOid, jarjestyskriteeriprioriteetti, kriteerinArvo);
    }
    */
}