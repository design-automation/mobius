Mobius is a visual programming environment that combines graph-based programming  (nodes and wires) with block-based programming. Each node in the graph contains a procedure that is defined by sequence of blocks. The aim of Mobius is to test and explore new approaches to visual programming capable of tackling more complex types of problems. 

The dataflow graph is shown in the left pane, and the contents of a selected node is shown in the right pane. The output is shown in the middle, and could either be a geometric model, or text output to the console. For the selected node, there are three different tabs: the interface, the procedure, and the code. The interface tab shows specific parameters that are exposed to the user for easy manipulation. The procedure tab shows the sequence of blocks that make up the underlying procedure. The code tab shows the Javascript code that is generated from the procedure. 

Currently, there is just one type of node that can be added to the graph, which is a generic empty node. Once the node has been created, input and output ports can be added, thereby allowing nodes to be wired together. A procedure can then be created for this node, by adding blocks. There are three types of blocks that can be added: data blocks, action blocks, or control blocks. Currently only some list manipulation actions are available - more coming soon! The blocks can be repositioned by dragging it to any location. Once the graph and blocks have been created, the graph can be executed by clicking the Run button. This will generate the Javascript code and then execute it, and the result of this execution will be display in the central panes. 