
var testData = {
  "d":"",
  "file1":"file1",
  "a":"file2",
  "b":{"b":"file2"},
  "file2":"file2",
  "c":"file3",
  "deep":{
    "deep":{
      "file5":"file5"
    }
  },
  "file5":"file5",
  "d":"file4",
  "dArray":[1,"A",{"a":"a"}]
};
exports.runTest = function(cm){

  describe('#load()',function(){


    beforeEach(function(){
        for (var member in cm.config) delete cm.config[member];

        cm.load('./test/config/baseConfig.json');
      });
    after(function(){
      for (var member in cm.config) delete cm.config[member];
    });

    it('should load files',function(){
      expect(cm.config).to.deep.equal(testData);
    });

    it('should deep load a file',function(){
      cm.load('./test/config/deepLoad.yml','b.c.d');

      expect(cm.config.b.c.d).to.deep.equal({a:{b:['c','d'],c:'file was loaded'}});
    });
  });

  describe('#get()',function(){
    beforeEach(function(){
      for (var member in cm.config) delete cm.config[member];
        cm.load('./test/config/baseConfig.json');
      });
    after(function(){
      for (var member in cm.config) delete cm.config[member];
    });

    it('should get config parts',function(){
      expect(cm.get("b.b")).to.equal("file2");
      expect(cm.get('b','b')).to.equal("file2");
      expect(cm.get(['b','b'])).to.equal("file2");
      expect(cm.get(['deep','deep.file5'])).to.equal("file5");
      expect(cm.get('dArray.2.a')).to.equal('a');
      expect(cm.get('b.b.c')).to.be.null;

      expect(cm.get()).to.deep.equal(testData);
    });
  });
}
