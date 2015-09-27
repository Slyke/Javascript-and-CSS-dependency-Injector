# Javascript-and-CSS-dependency-Injector
Javascript and CSS dependency Injector
/*
  By: Steven Lawler (Slyke)
  Email: steven.lawler777@gmail.com
  Creation Date: 20/09/2015
  Version: 1.0a
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