'use strict'

var app = angular
  .module('valintalaskenta')
  .constant('READ', 'READ')
  .constant('UPDATE', 'READ_UPDATE')
  .constant('CRUD', 'CRUD')
  .constant('MUSIIKKI', 'TOISEN_ASTEEN_MUSIIKKIALAN_VALINTAKAYTTAJA')
  .constant('OPH_ORG', '1.2.246.562.10.00000000001')
  .constant('PERUUNTUNEIDEN_HYVAKSYNTA', 'PERUUNTUNEIDEN_HYVAKSYNTA')

app.factory('MyRolesModel', function ($q, $http, $timeout) {
  var deferred = $q.defer()

  var refresh = function () {
    $http.get(window.url('cas.myroles')).then(
      function (result) {
        if (result.data.length > 0) {
          deferred.resolve(result.data)
        } else {
          $timeout(function () {
            refresh()
          }, 1000)
        }
      },
      function () {
        $timeout(function () {
          refresh()
        }, 1000)
      }
    )
  }

  refresh()

  return deferred.promise
})

app.factory('ParametriService', function ($q, Parametrit) {
  var hakuOid = null
  var p = null
  return function (newHakuOid) {
    if (hakuOid != newHakuOid) {
      p = Parametrit.list({ hakuOid: newHakuOid }).$promise.then(
        function (x) {
          return x
        },
        function (e) {
          console.log(e)
          alert('Parametri-service ei vastaan: ' + JSON.stringify(e))
        }
      )
      hakuOid = newHakuOid
    }
    return p
  }
})

app.factory('AuthService', function (
  $q,
  $http,
  $timeout,
  MyRolesModel,
  _,
  CRUD,
  READ,
  UPDATE,
  OPH_ORG,
  MUSIIKKI,
  PERUUNTUNEIDEN_HYVAKSYNTA
) {
  // organisation check
  var roleCheck = function (service, org, model, roles) {
    if (!service) {
      console.error('roleCheck called with undefined auth-service')
    }
    var found = false
    roles.forEach(function (role) {
      var fullRole = service + '_' + role + '_' + org
      if (model.indexOf(fullRole) > -1) {
        found = true
      }
    })
    if (!found) {
      console.log(
        'Could not find any of the roles ' +
          roles +
          ' for service ' +
          service +
          ' and org ' +
          org
      )
    }
    return found
  }

  var accessCheck = function (service, orgOids, roles) {
    console.debug(
      'AuthService : Checking access to',
      service,
      roles,
      'for organisations',
      orgOids
    )
    if (!orgOids || orgOids.length < 1) {
      var message = 'accessCheck called with no orgOids'
      console.warn(message)
      return $q.reject(message)
    }

    var deferred = $q.defer()

    MyRolesModel.then(function (model) {
      $q.all(
        orgOids.map(function (oid) {
          if (!oid) {
            console.warn(
              'accessCheck called with undefined orgOid. The whole org oid list is: ',
              orgOids
            )
            return $q.when([])
          } else {
            return $http.get(
              window.url('organisaatio-service.organisaatio.parentoids', oid)
            )
          }
        })
      ).then(function (results) {
        var found = false
        results.forEach(function (singleResult) {
          var parentOids =
            typeof singleResult.data === 'string'
              ? singleResult.data.split('/')
              : []
          parentOids.forEach(function (org) {
            if (roleCheck(service, org, model, roles)) {
              found = true
            }
          })
        })
        if (found) {
          deferred.resolve()
        } else {
          deferred.reject('Not found: ' + service + ', ' + orgOids)
        }
      })
    })

    return deferred.promise
  }

  // OPH check -- voidaan ohittaa organisaatioiden haku
  var ophAccessCheck = function (service, roles) {
    var deferred = $q.defer()
    MyRolesModel.then(function (model) {
      if (roleCheck(service, OPH_ORG, model, roles)) {
        deferred.resolve()
      } else {
        deferred.reject()
      }
    })

    return deferred.promise
  }

  return {
    check: function (roles, service, orgOids) {
      return accessCheck(service, orgOids, roles)
    },

    readOrg: function (service, orgOids) {
      return accessCheck(service, orgOids, [READ, UPDATE, CRUD])
    },

    updateOrg: function (service, orgOids) {
      return accessCheck(service, orgOids, [UPDATE, CRUD])
    },

    musiikkiOrg: function (service, orgOids) {
      return accessCheck(service, orgOids, [MUSIIKKI])
    },

    varasijaHyvaksyntaOrg: function (service, orgOids) {
      return accessCheck(service, orgOids, [HYVAKSYMINEN_VARASIJALTA])
    },

    crudOrg: function (service, orgOids) {
      return accessCheck(service, orgOids, [CRUD])
    },

    readOph: function (service) {
      return ophAccessCheck(service, [READ, UPDATE, CRUD])
    },

    updateOph: function (service) {
      return ophAccessCheck(service, [UPDATE, CRUD])
    },

    crudOph: function (service) {
      return ophAccessCheck(service, [CRUD])
    },

    peruuntuneidenHyvaksyntaOph: function (service) {
      return ophAccessCheck(service, [PERUUNTUNEIDEN_HYVAKSYNTA])
    },

    getOrganizations: function (service, targetRoles) {
      var deferred = $q.defer()
      MyRolesModel.then(function (model) {
        var organizations = []

        model.forEach(function (role) {
          // TODO: refaktor..
          targetRoles.forEach(function (targetRole) {
            var org
            if (role.indexOf(service + '_' + targetRole) > -1) {
              var split = role.split('_')
              org = split[split.length - 1]
            }

            if (
              org &&
              org.indexOf('.') != -1 &&
              organizations.indexOf(org) == -1
            ) {
              organizations.push(org)
            }
          })
        })

        deferred.resolve(organizations)
      })
      return deferred.promise
    },
  }
})

app.directive('auth', function (
  $animate,
  $timeout,
  $routeParams,
  AuthService,
  ParametriService,
  UserModel,
  _,
  HakukohdeModel,
  HakuModel
) {
  return {
    link: function ($scope, element, attrs) {
      $animate.addClass(element, 'ng-hide')
      UserModel.refreshIfNeeded()

      var success = function (result) {
        if (attrs.authAdditionalCheck) {
          ParametriService($routeParams.hakuOid).then(function (privileges) {
            attrs.$observe('korkeakouluCheck', function (value) {
              if (value === 'true') {
                $animate.addClass(element, 'ng-hide')
              }
            })
            if (privileges[attrs.authAdditionalCheck]) {
              $animate.removeClass(element, 'ng-hide')
            }
          })
        } else {
          $animate.removeClass(element, 'ng-hide')
        }
      }

      var failure = function (error) {
        console.info(
          'Auth check failure for ' + attrs.auth + '. Error: ' + error
        )
        $animate.addClass(element, 'ng-hide')
      }

      function handleOphAuth() {
        switch (attrs.auth) {
          case 'crudOph':
            AuthService.crudOph(attrs.authService).then(success, failure)
            break

          case 'updateOph':
            AuthService.updateOph(attrs.authService).then(success, failure)
            break

          case 'readOph':
            AuthService.readOph(attrs.authService).then(success, failure)
            break

          default:
            break
        }
      }

      function handleHakukohdeAuthorisationByOrganisation() {
        if (HakukohdeModel.hakukohde) {
          handleOrgAuth(HakukohdeModel.organisationOidsForAuthorisation)
        }
      }

      function handleOrgAuth(orgOids) {
        switch (attrs.auth) {
          case 'crud':
            AuthService.crudOrg(attrs.authService, orgOids).then(
              success,
              failure
            )
            break

          case 'update':
            AuthService.updateOrg(attrs.authService, orgOids).then(
              success,
              failure
            )
            break

          case 'read':
            AuthService.readOrg(attrs.authService, orgOids).then(
              success,
              failure
            )
            break

          default:
            console.info(
              'handleAuth switch case went to default case for parameter ' +
                attrs.auth
            )
            AuthService.check(
              attrs.auth.split(' '),
              attrs.authService,
              orgOids
            ).then(success, failure)
            break
        }
      }

      if (attrs.authKkUser) {
        UserModel.organizationsDeferred.promise.then(function () {
          if (UserModel.isKKUser || UserModel.isOphUser) {
            $animate.removeClass(element, 'ng-hide')
          } else {
            $timeout(function () {
              handleOphAuth()
            }, 0)

            attrs.$observe('authOrgs', function () {
              if (attrs.authOrgs) {
                var authOrgs = JSON.parse(attrs.authOrgs)
                switch (attrs.auth) {
                  case 'crud':
                    AuthService.crudOrg(attrs.authService, authOrgs).then(
                      success,
                      failure
                    )
                    break

                  case 'update':
                    AuthService.updateOrg(attrs.authService, [
                      attrs.authHakukohdeOrg,
                    ]).then(success, failure)
                    break

                  case 'read':
                    AuthService.readOrg(attrs.authService, authOrgs).then(
                      success,
                      failure
                    )
                    break

                  default:
                    AuthService.check(
                      attrs.auth.split(' '),
                      attrs.authService,
                      authOrgs
                    ).then(success, failure)
                    break
                }
              }
            })
          }

          if ($routeParams.hakukohdeOid) {
            HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(
              function () {
                handleHakukohdeAuthorisationByOrganisation()
              }
            )
          }
        })
      } else if (attrs.authHakuTarjoajaUser) {
        HakuModel.refreshIfNeeded($routeParams.hakuOid).then(function () {
          handleOrgAuth(HakuModel.hakuOid.organisaatioOids)
        })
      } else if ($routeParams.hakukohdeOid) {
        HakukohdeModel.refreshIfNeeded($routeParams.hakukohdeOid).then(
          function () {
            $timeout(function () {
              handleOphAuth()
            }, 0)
            handleHakukohdeAuthorisationByOrganisation()
          }
        )
      } else {
        $timeout(function () {
          handleOphAuth()
        }, 0)

        attrs.$observe('authOrgs', function () {
          if (attrs.authOrgs) {
            var authOrgs = JSON.parse(attrs.authOrgs)
            handleOrgAuth(authOrgs)
          }
        })
      }
    },
  }
})
