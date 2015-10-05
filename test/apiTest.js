
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
  "d":"file4"
};
exports.runTest = function(cm){
  describe('#load()',function(){


    before(function(){
        cm.load('./test/config/baseConfig.js');
      });

    it('should load files',function(){
    expect(cm.config).to.deep.equal(testData);
    });
  });

  describe('#get()',function(){
    it('should get config parts',function(){
      expect(cm.get("b:b")).to.equal("file2");
      expect(cm.get('b','b')).to.equal("file2");
      expect(cm.get(['b','b'])).to.equal("file2");
      expect(cm.get(['deep','deep:file5'])).to.equal("file5");

      expect(cm.get()).to.deep.equal(testData);
    });
  });
}
