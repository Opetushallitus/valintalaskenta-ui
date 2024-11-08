function ohjausparametritFixtures(PH_VEH) {
    return function() {
        var httpBackend = testFrame().httpBackend
        httpBackend.when('GET', /.*\/v1\/rest\/parametri\/.*/).respond({
                "target": "1.2.246.562.29.92175749016",
                "__modified__": 1431671946746,
                "__modifiedBy__": "1.2.246.562.24.12763979990",
                "PH_TJT": {"date": 1409291683168},
                "PH_HKLPT": {"date": null},
                "PH_HKMT": {"date": null},
                "PH_KKM": {
                    "dateStart": null,
                    "dateEnd": null
                },
                "PH_HVVPTP": {"date": null},
                "PH_KTT": {
                    "dateStart": null,
                    "dateEnd": null
                },
                "PH_OLVVPKE": {
                    "dateStart": null,
                    "dateEnd": null
                },
                "PH_VLS": {
                    "dateStart": null,
                    "dateEnd": null
                },
                "PH_SS": {
                    "dateStart": null,
                    "dateEnd": null
                },
                "PH_JKLIP": {"date": null},
                "PH_HKP": {"date": 1425204000000},
                "PH_YNH": {
                    "dateStart": null,
                    "dateEnd": null
                },
                "PH_OPVP": {"date": null},
                "PH_VEH": {"date": PH_VEH ? PH_VEH : null}
            }
        )
    }
};

