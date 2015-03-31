Part 1: JS Dependency

Angular and Angular UI
/ AngularJS 
/ Angular UI-Bootstrap 
/ Angular UI- ACE-IDE 
for left pane code IDE tab, integrated with angular
/ Angular UI-layout 
for three-division page layout, modified to generate customized layout, integrated with angular
/ Angular UI-Select2 
for drop down selection box, deprecated, should use UI-Select instead in future development, integrated with angular

Folder structure:
	js -> angular 
	js -> angular-ui -> ui-bootstrap
	js -> angular-ui -> ui-ace
	js -> angular-ui -> ui-layout
	js -> angular-ui -> ui-select2

2. Open Source Angular Packages
/ Angular UI-Tree 
https://github.com/JimLiu/angular-ui-tree 
for left pane accordion tree, modified to work with accordion and drag-drop, integrated with angular
/ Angular-pan-zoom
https://github.com/mvindahl/angular-pan-zoom 
for left pane zoom and pan, modified to work with AngularJS-FlowChart, integrated with angular)
/ AngularJS-FlowChart
https://github.com/ashleydavis/AngularJS-FlowChart 
for left pane graph session, modified to work with Angular-pan-zoom, integrated with angular
/ Angular mousewheel 
https://github.com/monospaced/angular-mousewheel 
required by Angular-pan-zoom, integrated with angular

Folder structure:
	js -> angular-ui -> ui-tree
	js -> angular-ui -> ui-panzoom
	js -> angular-ui -> ui-flowchart
	js -> angular 

3. Supporting Packages
/ jQuery 
required by Angular-pan-zoom, AngularJS-FlowChart
/ jQuery UI 
currently not in use
/ HamsterJS 
supporting package for Angular-pan-zoom
/ ACE 
supporting package for Angular UI- ACE-IDE
/ Select2 
supporting package for Angular UI-Select2
/ threeJS 
3D modeling library
/ threeJS editor 
3D modeling editor
/ add.js 
customized functions for interfacing between threeJS editor and vidamo.js

Folder structure:
	js -> jquery
	js -> jquery
	js -> packages -> hamsterjs
	js -> packages -> ace-builds
	js -> packages -> select2-2.5.0
	js -> threejs
	js -> threejs -> editor
	js -> threejs -> add.js

4. vidamo.js
/ Application API controller for left pane (graph session) and right pane (procedure session)
/ Initialization of Angular-pan-zoom
/ Provide communication between index.html and [ Angular UI-Tree; AngularJS-FlowChart]
Folder structure:
	js -> client


Part 2: CSS

/ css -> bootstrap: styling for bootstrap
/ css -> fonts: font for bootstrap
/ css -> graph.css: styling for left pane (graph session)
/ css -> light.css: theme styling for threeJS editor
/ css -> select2.css: styling for Angular UI-select2
/ css -> ui-layout.css: styling for Angular UI-layout
/ css -> ui-three.css: styling for Angular UI-tree
/ css -> vidamo-layout.css: general css file for app styling


Part 3: HTML and General App Logic

Three main <div> in index.html: graph-area, view-area, and code-area, the general layout is supported by Angular UI-layout.
/ graph area
Communicate with vidamo.js to generate left pane
vidamo.js provides the API to AngularJS-FlowChart

/ view-area
directly generate the threeJS editor in the middle session (doesn’t go through angular wrapper)

/ code-area
Communicate with vidamo.js to generate right pane procedure session
vidamo.js provides the API to Angular UI-tree
vidamo.js also provides functions to call threeJS to generate geometries in the editor
code-are calls Angular UI ACE-IDE to generate code IDE in the code tab

 
Part 4: Future Development

/ Some testing and bug fixes
/ Some styling
/ Code generation in right pane (see Blockly)
/ Topological sort in left pane
/ Modeling core logic (loop logic for example) in right pane
/ Refactor code to move it to vidamo folder