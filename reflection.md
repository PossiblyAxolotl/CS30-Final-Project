# Major Project Reflection

## what advice would you give to yourself if you were to start a project like this again?
* Look into tools more suited for first person stuff like this
* Spend less time iterating the collisions as while it needs time, so does everything else and it did work to enough of a degree to work as a prototype
* Potentially use Godot, even just for prototyping, as I know a lot about it and would be very quick to get this working within a day or so in there

## did you complete everything in your “needs to have” list?
* Yes, I went back and added audio in the end but everything else that was necessary was added by the time I showed the class
* I would have liked to add some of the "want to have"s, but this project ended up being a lot more ambitious than expected as is without those

## What was the hardest part of the project?
* Making the collisions work properly on 3 axes, there is math for doing it on 2 axes super easily but 3D math gets complicated much quicker
* Deciding how to deal with box overlap when the player is moving the box around - each game does it differently in my research

## Were there any problems you could not solve?
* Some minor collision problems mainly, the player gets stuck if they push into a corner rather than sliding to one side or the other and that couldn't be fixed on time
* For some reason the raycast code does not work unless I create a sphere after making each box
  * At the end of each box draw call they call "this.drawDumbCircles();" which creates a sphere of size 0.1 at {0, 0, 0} which is required, otherwise the rays don't collide properly and I have no clue why
  * comment line 47 or 53 to see in action