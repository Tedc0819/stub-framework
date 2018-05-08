let fs = require('fs')
let requireAll = require('require-all')
let path = require('path')

class StubManager {

  constructor(opts) {

    this.sinon = opts.sinon
    this.caseDirs = opts.caseDirs
    this.dataDir = opts.dataDir
    this.stubCases = []

  }

  importDir(dirname) {

    dirname = path.resolve(process.cwd(), dirname)

    return requireAll({ dirname })

  }

  loadCases() {

    let cases = {}

    this.caseDirs.forEach( (dir) => {

      if (dir == '') return

      let casesInDir = this.importDir(dir)

      cases = Object.assign(cases, casesInDir)

    })

    this.stubCases = cases.map( (stubCase) => new stubCase(this.sinon) )

    return this

  }

  restoreAll() {

    Object.keys(this.stubCases).forEach((key) => {
      this.stubCases[key].restore();
    });

  }

  stub(...cases) {

    return Promise.map(cases, (stubCase) => { this.stubCases[stubCase].run() })

  }

  getStubMethod(stubCase) {

    return this.stubCases[stubCase].stubMethod

  }

  init(renewStubData = false) {

    this.loadCases()

    return Promise.map(Object.keys(this.stubCases), (key, idx) => {

      let file = path.resolve(process.cwd(), `${this.dataDir}/${key}.json`)

      let stubCase = this.stubCases[key]
      stubCase.filePath = file

      return stubCase.init(renewStubData)

    })

  }

}

module.exports = StubManager

