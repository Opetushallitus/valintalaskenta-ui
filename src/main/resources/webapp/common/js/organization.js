angular
  .module('valintalaskenta')

  .service('OrganizationUtility', [
    '$log',
    'OPH_ORG',
    'MyRolesModel',
    '_',
    function ($log, OPH_ORG, MyRolesModel, _) {
      this.isKorkeakouluOrganization = function () {
        MyRolesModel.then(
          function (myroles) {
            return _.some(myroles, function (role) {
              return role.indexOf('APP_VALINTOJENTOTEUTTAMINENKK') > -1
            })
          },
          function (error) {
            $log.error(
              'Käyttäjän roolien hakeminen korkeakoulukäyttöoikeuksien tarkistuksessa epäonnistui'
            )
          }
        )
      }

      this.isOphOrganization = function (organization) {
        return organization.oid === OPH_ORG
      }

      this.notKorkeakouluOrganization = function (organization) {
        return !(
          !organization.oppilaitosTyyppiUri ||
          organization.oppilaitosTyyppiUri.indexOf('_41') > -1 ||
          organization.oppilaitosTyyppiUri.indexOf('_42') > -1 ||
          organization.oppilaitosTyyppiUri.indexOf('_43') > -1
        )
      }
    },
  ])
