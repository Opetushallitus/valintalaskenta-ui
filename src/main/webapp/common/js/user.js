angular.module('valintalaskenta')

    .factory('UserModel', ['$q', '$log', '_', 'AuthService', 'OrganizationByOid', 'OPH_ORG', function ($q, $log, _, AuthService, OrganizationByOid, OPH_ORG) {
        var model = new function () {
            this.organizationsDeferred = undefined;

            this.organizationOids = [];
            this.organizations = [];
            this.isKKUser = false;
            this.hasOtherThanKKUserOrgs = false;
            this.isOphUser = false;

            this.refresh = function () {
                model.organizationsDeferred = $q.defer();

                AuthService.getOrganizations('APP_VALINTOJENTOTEUTTAMINEN', ['READ', 'READ_UPDATE', 'CRUD']).then(function (oidList) {
                    model.organizationOids = oidList;

                    var organizationPromises = [];
                    _.forEach(oidList, function (oid) {
                        var deferred = $q.defer();
                        organizationPromises.push(deferred.promise);
                        OrganizationByOid.get({oid: oid}, function (organization) {
                            model.organizations.push(organization);
                            deferred.resolve();
                        }, function (error) {
                            $log.error('Organisaation tietojen hakeminen epäonnistui:', error);
                            deferred.reject(error);
                        });
                    });

                    $q.all(organizationPromises).then(function () {
                        model.analyzeOrganizations();

                        model.organizationsDeferred.resolve();
                    }, function () {
                        model.organizationsDeferred.reject();
                    });

                }, function (error) {
                    $log.error('Käyttäjän organisaatiolistan hakeminen epäonnistui:', error);
                    model.organizationsDeferred.reject(error);
                });

                return model.organizationsDeferred.promise;
            };

            this.refreshIfNeeded = function () {
                if (_.isEmpty(model.organizationsDeferred)) {
                    model.refresh();
                } else {
                    return model.organizationsDeferred.promise;
                }
            };

            this.analyzeOrganizations = function () {
                var isKKUser = false;
                _.some(model.organizations, function (organisaatioData) {
                    if(model.isKKOrganization(organisaatioData)) {
                        model.isKKUser = true;
                    } else if(model.isOphOrganization(organisaatioData)) {
                        model.isOphUser = true;
                    } else {
                        model.hasOtherThanKKUserOrgs = true;
                    }
                });
            };

            this.isKKOrganization = function (organization) {
                var kkTunnisteet = ['_41', '_42', '_43']; // 41 == AMK, 42 = Yliopistot, 43 = Sotilaskorkeakoulut
                return _.some(kkTunnisteet, function (kkTunniste) {
                    if(organization.oppilaitosTyyppiUri && organization.oppilaitosTyyppiUri.indexOf(kkTunniste) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
            };

            this.isOphOrganization = function (organization) {
                return organization.oid === OPH_ORG;
            };


        };

        return model;
    }]);
