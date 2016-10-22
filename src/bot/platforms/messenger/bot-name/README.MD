# Your bot folder
This is folder where you will specify unique things for your bot: skill clusters, skills, bot's vocabulary and unique userflows.

## File system
There are two files in the root:
* `router-builder.js` – here we assemble all unique for the bot services and technologies that should be used by bot.
* `vocabulary.js` – pretty self explanatory.

### Router Builder (router-builder.js)
 Here we get _router_ instance and string _route_. We add all services with help of express middlewares. So if you don't need **wit** for your bot, just remove it from the list of middlewares for the _POST_ request.
 
 And if you want to add something new (for example a new service, that will store data), this is right place to do it.
    
 Also if you want to perform some global operations, like set "message recieved", this is also good place to add this logic.
  
  ## Unique skill clusters and skills
  If you have some unique (not reusable) skills, this is a good place to store them. For example you implement skills, that allow you to send receipt to the user. This is (more or less) unique for Facebook Messenger, so you should add this skill (or cluster) here `/src/bot/platforms/messenger/bot-name/skills`.
  
  Also this is a good place to store **Core cluster**, which build the happy path user flow.