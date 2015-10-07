var propertiesParser;

module.exports = function(filePath){
  if(!propertiesParser){
    propertiesParser = require('properties-parser');
  }

  var rawJson = propertiesParser.read(filePath);

  var json = {};
  var currObj;
  var path;
  var i;

  for (var key in rawJson) {
    path = key.split('.');
    currObj = json;

    for(i = 0;i<path.length-1;i++){
      if(!currObj[path[i]]){
        if(isNaN(path[i+1])){
          currObj[path[i]] = {};
        }else{
          currObj[path[i]] = [];
        }

      }
      currObj = currObj[path[i]];
    }
    currObj[path[i]] = fixValue(rawJson[key]);
  }
  return json;
}

function fixValue(value){
  if(value != '' && !isNaN(value)){
    return +value;
  }

  return value;
}
