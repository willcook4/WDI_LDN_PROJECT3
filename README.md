
# Heist Advisors

Heist Advisors was a group project that was developed over a week. The site was designed to be a fun twist on how current technology could be used for good and not so good.



**[Try the site here...](http://heist-advisors.herokuapp.com/)**

**The site was developed by:**
* [Will Cook](https://github.com/willcook4)
* [Cameron Perrin](https://github.com/CameronPerrin)
* [Ben Blowers](https://github.com/Ezarai)
* [Adriana Black](https://github.com/alfredoblack)

## What is Heist Advisors?

Heist Advisors is the gamification of a robbery.

Simply put, you select a city in the world, possible heist locations are presented to you with likely odds of success and rewards. Choose the one you want and select rob the place. The game then plays the odds. Will you get to your waiting plane at the nearest airport before the police catch you? *Play and find out*.


#### The following technology was used:

* Node - Frontend
* Express - Framework
* Mongoose - Database
* BodyParser - Handling of JSON
* Cors - Cross-origin resource sharing
* Morgan - Logging
* Bower
  * jQuery - JavaScript support
  * Underscore - JavaScript support
  * Foundation - Frontend Framework
* Heroku - Deployment
* git and gitHub - Version control
* Google Maps API including, Places Library - API
* <del>SITA Airports- API</del>
* March 2017 - Due to change in business model. The API was changed to Lufthansa API.
* JavaScript
* SASS
* Reset CSS

#### How it came together...

After brainstorming the idea of a bank robbing assisting app we set about testing an MVP(Minimum Viable Product). This came about through a basic test app. Pulling data from the Google Maps API to give a start and end location.

This data was improved with the inclusion of the SITA API which gave the nearest Airport. Avoiding false positive results from google (e.g. Airport taxi companies were listed as Airports).

Inclusion of more possible heist locations came about from extending the search to include banks, Jewellery stores through the Google Maps Places API.

The nearest police station to the heist location is found through another call via the Google Maps Places API.

Animation is done by following the route that is returned from the directions request.

Game logic is improved with the Police having a faster travel time ('optimistic' traffic and increased speed to reflect their lights and sirens.

### Screenshots

Intro:
![Intro](https://s3-eu-west-1.amazonaws.com/heistapp/intro.png)

**Selecting a heist location:**
![Selecting](https://s3-eu-west-1.amazonaws.com/heistapp/1.png)

**Police station located (notice the possible routes):**
![Selecting](https://s3-eu-west-1.amazonaws.com/heistapp/2.png)

**The animated chase in action:**
![Selecting](https://s3-eu-west-1.amazonaws.com/heistapp/3.png)

**Sometimes you might get away, not this time!**
![Selecting](https://s3-eu-west-1.amazonaws.com/heistapp/4.png)

### Disclaimer

Heist Advisor is only and a game and should be treated as such. Heist Advisor is in no way meant to be taken seriously or used to plan any sort of illegal action. We, the developers of Heist Advisor, take no responsibility for any lost items, stolen items, damaged goods, soul loss, or any other damage to personal or business items.

### UPDATE 2017

Due to the SITA Airports API changing to a paid business model the code was changed to use the Lufthansa API for getting the nearest airport. Although this required a change in code as we first need to request a token to use their service.
The code was also put through ESLint and tidyed up. Changes were made to the loading of scripts to prevent XMLHttpRequests warnings in the console.