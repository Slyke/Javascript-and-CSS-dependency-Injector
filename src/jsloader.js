/*
  By: Steven Lawler (Slyke)
  Email: steven.lawler777@gmail.com
  Creation Date: 20/09/2015
  Version: 1.01a
  Description:
    This is a Javascript source injector. It allows you to inject CSS and Javascript files into your webpage without editing the HTML.
  Example Usage (Put this in the <head> area):
    //------ Code
      <script>

        fileInject.loadFile("https://code.jquery.com/jquery-2.1.4.min.js"); //Add jQuery to files
        fileInject.loadFile({"fileName":"some_js_file1.js", "order":1}); //Add some_js_file1 to page.
        fileInject.loadFile({"fileName":"some_js_file2.js", "order":2}); //Add some_js_file2 to page.
        fileInject.loadRemoteFiles("myjsfiles.json"); //Load a list of Javascript files from an external source.

        fileInject.inject(); //Add scripts to DOM. Warning: if you use loadRemoteFiles(), this will only fire when all the requests have closed.
        
      </script>
    //------ Code
    
    Tips:
      * Try not to use script tags for other scripts on the page. Any scripts that reference Javascript code that is dynamically loaded in this with loader may not work (They may not load by the time your code executes).
        - This includes jQuery's $.ready(); Place it in a file that this loader loads.
      * You can also load CSS files the same way as Javascript files.
      * The loadRemoteFiles() function will only work when this page is served by a server. You will get a "XMLHttpRequest cannot load file" error if you try without a server.
      
    
    License:
    The MIT License (MIT)
      Copyright (c) 2015 Steven Lawler (Slyke)
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
      The above copyright notice and this permission notice shall be included in
      all copies or substantial portions of the Software.
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
      THE SOFTWARE.
    
  */ 


var fileInject = new function() {

  var filesToLoad = [];
  this.REST = {};
  
  var defaultInclude = function() { 
    return {
      'area'      :   'head',
      'order'     :   1
    };
  };
  
  var outGoingRequests = 0;
  var injectOnFinishRequests = true;
  var injectCallbackFunction = function(){};

  this.loadFiles = function(fileList)
  {
    for (var file in fileList) {
      this.loadFile(fileList[file]);
    }
  };
  
  this.loadFile = function(fileObject) 
  {
    var newFile = null;
    
    if (typeof(fileObject) === 'string') {
      newFile = defaultInclude();
      newFile.fileName = fileObject;
      newFile.type = getFileExtension(newFile.fileName);
	  newFile.order = (filesToLoad.length + 1);
	  var validFile = checkIncludeObject(newFile);
      if (validFile === 0) {
        filesToLoad.push(newFile);
      } else {
        console.log('[fileInject::loadFile()] Error: Invalid File Object: ', newFile, " Result: ", validFile);
      }
      
    } else if (typeof(fileObject) === 'object') {
      newFile = fileObject;
      
      if (newFile.fileName === undefined || newFile.fileName == null) {
        console.log('[fileInject::loadFile()] Error: No filename specified: ', newFile);
        return false;
      }
      
      newFile.area = (newFile.area === undefined || newFile.area == null ? "head" : newFile.area);
      newFile.order = (newFile.order === undefined || newFile.order == null ? 1 : newFile.order);
      newFile.type = (newFile.type === undefined || newFile.type == null ? getFileExtension(newFile.fileName) : newFile.type);
      
	  var validFile = checkIncludeObject(newFile);
      if (validFile === 0) {
		filesToLoad.push(newFile);
      } else {
        console.log('[fileInject::loadFile()] Error: Invalid File Object: ', newFile, " Invalid Error Code: ", validFile);
      }
      
    } else {
      console.log('[fileInject::loadFile()] Error: Unhandled type: ', typeof(newFile));
      return false;
    }
  };
  
  this.loadRemoteFiles = function(fileURL, method) {
    this.REST.requestHTTP(this, fileURL, method, loadRemoteSuccess, loadRemoteFail);
  };

  this.inject = function(newInjectOnFinishRequests, callbackFunction) 
  {
    newInjectOnFinishRequests = (newInjectOnFinishRequests === undefined || newInjectOnFinishRequests == null ? true : newInjectOnFinishRequests);
    
    injectCallbackFunction = callbackFunction;
    
    injectOnFinishRequests = newInjectOnFinishRequests;
    
    if (newInjectOnFinishRequests === true) {
      if (outGoingRequests >= 1) {
        return false;
      }
    }
	
    sortObjectByValue(filesToLoad, "order");

    var objHTML = null;
  
    for (var i = 0; i < filesToLoad.length; i++) {
      if (filesToLoad[i].type === 'js') {
        objHTML = document.createElement('script');
        objHTML.setAttribute('type', 'text/javascript');
        objHTML.setAttribute('src', filesToLoad[i].fileName);
        
        document.getElementsByTagName(filesToLoad[i].area)[0].appendChild(objHTML);
      } else if (filesToLoad[i].type === 'css') {
        objHTML = document.createElement('link');
        objHTML.setAttribute('rel', 'stylesheet');
        objHTML.setAttribute('type', 'text/css');
        objHTML.setAttribute('href', filesToLoad[i].fileName);
        
        document.getElementsByTagName(filesToLoad[i].area)[0].appendChild(objHTML);
      } else {
        console.log('[fileInject::inject()] Error: Unknown type: ', typeof(fileObject), ' For File: ', filesToLoad[i].fileName, '  At Index: ', i);
        console.log('[fileInject::inject()] -- Full file list:', filesToLoad);
      }
      
    }

    if (callbackFunction !== undefined && callbackFunction != null) {
      callbackFunction();
    }
  
  };
  
  this.clearFileList = function() 
  {
    filesToLoad = [];
  }

  var getFileExtension = function(fileName) 
  {
    return fileName.substr(fileName.lastIndexOf('.') + 1);
  };
  
  var checkIncludeObject = function(objectToInclude)
  {
  
    var returnValue = 0;
  
    if (objectToInclude.area === undefined || objectToInclude.area == null || objectToInclude.area == '') {
      returnValue += 1;
    }
    
    if (objectToInclude.order === undefined || objectToInclude.order == null || objectToInclude.order == '') {
      returnValue += 2;
    }
    
    if (objectToInclude.fileName === undefined || objectToInclude.fileName == null || objectToInclude.fileName == '') {
      returnValue += 4;
    }
    
    if (objectToInclude.type === undefined || objectToInclude.type == null || objectToInclude.type == '') {
      returnValue += 8;
    }
    
    return returnValue;
    
  };
  
  
  var sortObjectByValue = function (arrayToSort, sortingKey, sortAscending) 
  {

    sortAscending = (sortAscending === undefined || sortAscending == null ? true : sortAscending);
    
    if(sortAscending) {
      arrayToSort.sort(function (a, b) {
        if (a[sortingKey] > b[sortingKey]) {
			    return 1;
		    }
        if (a[sortingKey] < b[sortingKey]) {
          return -1;
        }
        return 0;
      });
    } else {
      arrayToSort.sort(function (a, b) {
        if (a[sortingKey] > b[sortingKey]) {
          return -1;
        }
        if (a[sortingKey] < b[sortingKey]) {
          return 1;
        }
        return 0;
      });
    }
  };
  
  var loadRemoteSuccess = function (callerObject, response)
  {
    callerObject.loadFiles(JSON.parse(response.responseText));
    
    if (injectOnFinishRequests === true) {
      callerObject.inject(injectOnFinishRequests, injectCallbackFunction);
    }
  };
  
  var loadRemoteFail = function (callerObject, response)
  {
    console.log('[fileInject::loadRemoteFail()] Error: Failed REST Request. Status: ', response.status, ' - Object: ', response);
    if (injectOnFinishRequests === true) {
      callerObject.inject(injectOnFinishRequests, injectCallbackFunction);
    }
  };
  
  this.REST.createHTTPObject = function() 
  {
    try {
      return new XMLHttpRequest();
    } catch (error) {
      console.log('[fileInject::REST.createHTTPObject()] Error: Could not create HTTP REST object: ', error);
    }
    return false;
  };
  
  this.REST.requestHTTP = function (self, url, method, callbackSuccess, callbackFailure) 
  {
  
    method = (method === undefined || method == null ? 'GET' : method);

    var request = this.createHTTPObject();
    request.open(method, url, true);
    request.send(null);
    outGoingRequests++;
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 200) {
          outGoingRequests--;
          callbackSuccess(self, request);
        } else {
          outGoingRequests--;
          callbackFailure(self, request);
        }
      }
    };
  };
  

}();


