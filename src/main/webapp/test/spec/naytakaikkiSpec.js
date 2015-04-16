(function () {
  function asyncPrint(s) {
    return function() {
      console.log(s)
    }
  }

  describe('Näytä kaikki', function() {
    var page = nayta_kaikkiPage()

    beforeEach(function(done) {
      page.openPage(done)
    })

    afterEach(function() {
      if (this.currentTest.state == 'failed') {
        takeScreenshot()
      }
    })

    describe('Näyttää', function() {
      it('kaikki tiedot', seqDone(
        wait.forAngular,
        function() {
          expect(page.allStudentsTable().length).to.equal(1)
        }
      ))
    })
  })
})