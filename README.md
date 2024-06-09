# CookieClickerAssignment

Cookie clicker repo
Please also provide an assignment reflection in your project README.md file.
(Required)
🎯 Please mention the requirements you met and which goals you achieved for this assignment.

All of them?
downloaded data from API, stored game data locally, made use of timeouts and intervals, updated displays dynamically to keep onscreen data concurrent with what was going on in the game logic.

🎯 Were there any requirements or goals that you were not quite able to achieve?

Met most of the goals but failed to acheive some of my personal stretch goals. wanted the cookie image to change when clicked but just
Had hoped to create a win state, possibly customize upgrade names, and include an easter egg. While these are all still possible simply ran out of time/energy
I also didn't look into how to keep the counter running and update the score when returning to the page.It isn't the most important thing here but knowing how would be usefulfunctionality in the future

🎯 If so, could you please tell us what was it that you found difficult about these tasks?

cookie img - could not figure out how to implement that outside of JS which then added the complication of restoring it. wanted to use psuedos but just couldn't get it to work.
time/energy - spent a lot chasing through CSS instead, trying to get text sizes to change approprately with media queries. Maybe worth considring them earlier on in the process next time so they can be written in a dynamic fashion from the start.

(Optional)
🏹 Feel free to add any other reflections you would like to share about your submission e.g.

What went really well and what could have gone better?

Accomodating different screen sizes caused some difficulties, planning using ratios would work better next time.
Sometimes the dynamic changing is very slow to catch up when resizing browser. It works consistently, but sometimes it gets a bit stuck for some reason. Despite trying to understand and recreate it intentionally I can't.
Figuring out all the elements required for the reset and stopping local storage checks conflict with the API fetch wasn't easy either.

What went well was the use of various functions to break down the work. required backtracking through the code at points but whe making changes and adding new features the fact the button creation was it's own function was very handy, despite there being some scope issues in relation to updating the cookiesPerSecond display.

Detailing useful external sources that helped you complete the assignment (e.g Youtube tutorials).

MDN, WS3, maybe some stack when trying to figure out the issue switching cookie images and implementing aria aspects.

Describing errors or bugs you encountered while completing your assignment.

Encountered some issues relating to scope when updating displays, over frequent updates to the local storage made it difficult to fetch the API,
