exports.runTest = function(cm){
  describe('#extractFilePaths()',function(){
    it('should extract single files',
      function(){
        var f = cm.extractFilePaths([],{_load:'file'});

        expect(f).to.deep.equal([ { path: 'file', opath: [] } ]);
    });

    it('should extract file arrays',
      function(){
        var f = cm.extractFilePaths([],{_load:['file1','file2']});

        expect(f).to.deep.equal([ { path: 'file1', opath: [] }, { path: 'file2', opath: [] } ]);
    });

    it('should deeply extract file arrays',
      function(){
        var f = cm.extractFilePaths([],{
          a:{
            b:{
              _load:['file1','file2'],
              c:{_load:'file3'}
            },
            d:{d:'d'}
          }
        });

        expect(f).to.deep.equal([
          { path: 'file1', opath: ['a','b'] },
          { path: 'file2', opath: ['a','b'] },
          { path: 'file3', opath: ['a','b','c'] }
        ]);
    });
  });

  describe('#merge()', function () {

    it('should contain properties from both items', function () {
      var d = cm.merge({a:'a',b:'b'},{c:'c',d:'d'});

      expect(d).to.deep.equal({a:'a',b:'b',c:'c',d:'d'});
    });

    it('should only contain matched values from the second item', function(){
      var m = cm.merge({a:1,b:2},{a:11,b:22,d:44});

      expect(m).to.deep.equal({a:11,b:22,d:44});
    });

    it('should deeply merge',function(){
      var m = cm.merge({a:{b:'b',c:'c'}},{a:{b:'bb',d:'dd'}});
      expect(m).to.deep.equal({a:{b:'bb',c:'c',d:'dd'}});
    });
  });

  describe('#fixFilePath()',function(){
    var slash = require('path').sep;

    it('should pass through paths starting with /',function(){
      var p = cm.fixFilePath('/from/root.js','./currDir');
      expect(p).to.equal('/from/root.js');
    });
    it('should pin to cwd paths starting with ~',function(){
      var p = cm.fixFilePath('~/from/cwd.js','./currDir');
      expect(p).to.equal([process.cwd(),'from' ,'cwd.js'].join(slash));
    });
    it('should pin to currDir other paths',function(){
      var p = cm.fixFilePath('from/cwd.js','./currDir');
      expect(p).to.equal(['currDir','from','cwd.js' ].join(slash));
    });
  });

  describe('#getObjFromPath()',function(){
    it('should handle strings, strings with . separator, and arrays of strings',function(){
      var p = cm.getObjFromPath({a:{b:{c:{d:{e:{f:'success'}}}}}},'a',['b','c','d.e']);
      expect(p).to.deep.equal({ f: 'success' });
    });
    it('should return the full object on empty',function(){
      var obj = {a:{b:'b'}};
      var p = cm.getObjFromPath(obj);
      expect(p).to.deep.equal({a:{b:'b'}});
    });
  });

  describe('#createObjFromPath()',function(){
    var obj;
    before(function(){
      obj = {
        a:{
          b:{
            c:'d'
          }
        }
      };
    });

    it('should return an existing object',function(){
      var p = cm.createObjFromPath(obj,'a.b.c');
      expect(p).to.equal('d');
      expect(obj).to.deep.equal({a:{b:{c:'d'}}});
    });

    it('should add an empty object when one doesnt exist',function(){
      var p = cm.createObjFromPath(obj,'a.b.g.d.e.f');
      console.log(obj);

      expect(p).to.deep.equal({});
      expect(p).to.equal(obj.a.b.g.d.e.f);
      expect(obj).to.deep.equal({a:{b:{c:'d',g:{d:{e:{f:{}}}}}}});

      p.a = 'test';

      expect(obj.a.b.g.d.e.f.a,'test if object was added').to.equal('test');

    });
  });

}
