let StubManager = require(path.resolve(process.cwd(), './lib/models/StubManager.js'))

class TestSuite extends MochaCombo {

  constructor() {

    super()

    this.methodName = 'StubManager.loadCases -'

    this.args = ['dir']

    this.argTypes = {

      dir: ['correct', 'notExist', 'null'],

    }

  }

  extraCombinations() {

    return [ ];

  };

  before(test, combination) {

  }

  beforeEach(test, combination) {

    return this.runTest(test, combination);

  }

  after(test, combination) {}

  afterEach(test, combination) {

    test.stubImportDir.restore()

  }

  only(combination) {

    return false;

  }

  skip(combination) {

  }

  stub(test, combination) {


  }

  setFixtures(test, combination) {


  }

  getArgValues(test, combination, arg, argType) {

    var argValues = {

      dir: {
        correct: ['./test/stubCases'],
        notExist: [''],
        null: null
      }

    }

    return argValues[arg][argType];

  }

  testMethod(test, combination, argsValues) {

    let [dir] = argsValues


    let manager = new StubManager({
      caseDirs: dir
    })

    test.manager = manager

    let stubImportDir = sinon.stub(manager, 'importDir')
    test.stubImportDir = stubImportDir

    stubImportDir.withArgs('./test/stubCases').returns({test: "hehehhh"})

    return manager.loadCases()

  }

  clearData(test, combination) {}

  shouldSuccess(combination) {

    let [dir] = combination

    return dir == 'correct'

  }

  successAssert(combination) {

    it('should return the stub manager itself', function() {

      assert.equal(this.res, this.manager)

    })

    it('should call StubManager.importDir once', function() {

      sinon.assert.calledOnce(this.stubImportDir)

    })

  }

  failureAssert(combination) {

  }

}

module.exports = TestSuite;

let testSuite = new TestSuite;
testSuite.run()
