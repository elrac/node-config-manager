exports.runTest = function(cm){

  var testObj = {
    _file:"filepath",
    a:'a',
    b:{
      c:3,
      d:{
        e:'e',
        array:['a','b',2,{a:'a',b:'b'}]
      }
    }
  }

  describe('#readYaml()',function(){
    it('should read a yml file',function(){
      var y = cm.readYaml('./test/config/fileTypes/yamlTest.yml');
      expect(testObj).to.deep.equal(y);
    });
  });

  describe('#readJson()',function(){
    it('should read a json file',function(){
      var y = cm.readJson('./test/config/fileTypes/jsonTest.json');
      expect(testObj).to.deep.equal(y);
    });
  });

  describe('#readPropertiesFile()',function(){
    it('should read a properties file',function(){
      var y = cm.readPropertiesFile('./test/config/fileTypes/propTest.properties');
      expect(testObj).to.deep.equal(y);
    });
  });
};
