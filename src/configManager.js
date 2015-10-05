var fs = require('fs');
var path = require('path');

var config = {};

var load = function(filepath,obj,params){
  var filepaths = [{
    path:filepath,
    opath:[]
  }];

  while(filepaths.length > 0){
      var pathObj = filepaths.shift();

      try{
        var json = JSON.parse(fs.readFileSync(pathObj.path, 'utf8'));
      }catch(e){
        throw e;
      }
      var fpt = extractFilePaths([],json);
      var currDir = path.dirname(pathObj.path);
      fpt.forEach( item => item.path = fixFilePath(item.path,currDir));

      addAll(filepaths,fpt);

      merge(getObjFromPath(config,pathObj.opath),json);
  }
}

exports.load = function(filepath){
  var params = {
    baseDir:path.dirname(filepath)
  };

  load(filepath,config,params);
}

exports.get = function(){
  return getObjFromPath(config,Array.prototype.slice.call(arguments));
}

var merge = function(toObj,fromObj){
  if(fromObj == null || typeof(fromObj) == 'undefined'){
    return toObj;
  }

  if(isObject(fromObj) && isObject(toObj)){
    for(n in fromObj){
      toObj[n] = merge(toObj[n],fromObj[n]);
    }

    return toObj;
  }

  return fromObj;
}

function isObject (item) {
  return (item !== null && typeof item === "object" && !Array.isArray(item));
}

function extractFilePaths(fileArray,obj,opath){
  if(!opath){
    opath = [];
  }

  if(obj._load){
    var filePaths = [].concat(obj._load);
    addAll(fileArray, filePaths.map(path => ({path,opath})));
    delete obj._load;
  }

  for(n in obj){
    if(isObject(obj[n])){
      extractFilePaths(fileArray,obj[n],opath.concat(n));
    }
  }

  return fileArray;
}

function addAll(arr1, arr2){
  arr2.forEach( item => arr1.push(item) );
}

/*
* starting with / should be an absolute path
* starting with ~ should be node root path
* stating with anything else should be current directory
*/
function fixFilePath(filePath, currDir){

  switch(filePath.substring(0,1)){
    case '/':
      return filePath;
    case '~':
      return path.join(process.cwd(),filePath.substring(1));
    default:
      return path.join(currDir,filePath);
  }
}

function objectPathToArray(oPath){
  if(!oPath ){
    return null;
  }

  if(arguments.length > 1){
    oPath = Array.prototype.slice.call(arguments);
  }

  var toReturn = [];

  if(typeof oPath === 'string'){
    addAll(toReturn,oPath.split(':'));
  }else if( Array.isArray(oPath) ){
    oPath.forEach( item => addAll(toReturn,objectPathToArray(item)));
  }else if(typeof oPath === "object"){
    addAll(toReturn,objectPathToArray(Array.prototype.slice.call(oPath)));
  }

  return toReturn;
}

function getObjFromPath(root, path){
  var args = Array.prototype.slice.call(arguments);
  args.shift();

  args = objectPathToArray(args);

  args.filter( a => a);

  if(args.length == 0){
    return root;
  }
  return args.reduce((obj,n) => obj ? obj[n] : null , root);
}

// just exposing these if we are in testing mode
if(global.testing){
  exports.merge = merge;
  exports.extractFilePaths = extractFilePaths;
  exports.fixFilePath = fixFilePath;
  exports.config = config;
  exports.getObjFromPath = getObjFromPath;
}
