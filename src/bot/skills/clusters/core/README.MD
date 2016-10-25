# Cluster
This is a typical Skills Cluster folder. In folders like this you should keep skills, related only to this Skills Cluster.
 
 #### index.js
 Here we create a Cluster, plug all skills, build decision tree and run tree traversal procedure.
 
 #### decision-tree.js
 Here we build a part of global decision tree. In fact we build a queue of skills, related for this cluster. To do this I use State Machine ([finity](https://github.com/nickuraltsev/finity)), because it can be not trivial procedure. After that you should run cluster traversal, so you will go through all skills in the queue one after another. 
 
 ## Other files
 Other files are skills, related to this Skills Cluster.