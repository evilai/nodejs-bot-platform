# Purpose
Here you should add all Skills Clusters and Skills, that specific for different platforms, like Facebook Messenger or Amazon Alexa.

For example you have a bot **witcher** and you want this bot on FB Messenger, Alexa and Google Assistant. So your folders here should be organized like this:
```
/src/bot/platforms/messenger/witcher/
/src/bot/platforms/amazon-alexa/witcher/
/src/bot/platforms/google-assistant/witcher/

// And all reusable skills and clusters should be outside this folder
/src/bot/skills/clusters/reusableCluster1
/src/bot/skills/clusters/reusableCluster2
```