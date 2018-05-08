let sinon = require('sinon');
let fs = require('fs')
let VCR = require('vcr-class')

class StubCase {

  constructor() {

    this.stubItems = [];
    this.stubMethod = null;

    this.obj = null;
    this.method = null;

  }

  setObjMethod() {

    this.obj = null;
    this.method = null;
    this.successType = "resolves"
    this.failureType = "rejects"

  }

  beforeAll() {}

  async init(renewStubData = false) {

    this.setObjMethod()

    let vcr = new VCR({ filePath: this.filePath })
    vcr.delegate = this

    if (renewStubData) {

      await vcr.run()
      await vcr.storeToFile()

    }else {

      await vcr.readFromFile()

    }

    let tmpItems = vcr.items.concat(this.extraStub() || [])

    let items = []

    tmpItems.forEach( (item) => {

      items.push(this.overrideStubItem(item))

    })

    this.stubItems = items

    return this

  }

  async run() {

    return this.stubItems.forEach( (item) => this.stubItem(item) );

  }

  getParams() {

    return [];

  }

  extraStub() {

    return []

  }

  stubItem(item) {

    this.stubMethod = this.stubMethod || sinon.stub(this.obj, this.method)

    this.stubMethod.withArgs(...item.args)[item.type](item.res)

  }


  restore() {

    if (!this.stubMethod) return;

    this.stubMethod.restore()
    this.stubMethod = null

  }

  /* to be overrid */

  overrideStubItem(item) {

    return item

  }

  /* VCR deletage call */

  vcrItemForCall(vcr, args, res, isError) {

    return {
      args,
      res,
      type: isError ? this.successType : this.failureType
    }

  }

  async vcrCallMethod(vcr, args) {

    let res = await this.callMethod(args)

    return res

  }

  vcrGetArrayOfArgs(vcr) {

    return this.getParams() || []
  }

}

module.exports = StubCase
