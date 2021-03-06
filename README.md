# Path finding Site Example

**Demonstration of how path finding can work on a 2D grid**

It can be seen here:
You can click to place an obstruction and then enter to start the path finding.
[https://josephtams.com/pathfinder/](https://josephtams.com/pathfinder/)

I wanted to start this project as a learning experience in my free time. I learned a lot about path finding and different distance formulas. I also got to use canvas which most of my projects don't use but I enjoy working with them.

**How A\* Path Finding Works:**
There are a lot of different path finding algorithms but A\* seems like the best overall. It's more complicated than some of the older algorithms but it's still fairly straight forward.

It takes the starting point and checks all the neighboring cells or nodes.
Each node is given 4 values:

-   GCost: The distance from the starting point
-   HCost: The distance from the ending point
-   FCost: GCost + HCost
-   Creator Node: The node that created it

After all the neighbors have been found and given values, the process restarts but instead of the starting node, you select the node with the lowest FCost and find it's neighbors.

Once the value with the lowest FCost is the ending point (found the goal), the quickest path is found by starting with the last node and finding it's creator node's position and then get that node's creator node's position, and so on until it get's back to the first creator node which is the starting point.

**TO DO**
If I continue to work on this project I'd like to add these things:

-   New path finding algorithms
-   Animate the path finding
-   Allow obstructions to be placed by clicking and dragging like a paint brush tool
