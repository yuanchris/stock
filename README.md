# Stock Arena

A stock game for reading stocks information, deciding your stocks portfolio and competing with others.

Website URL : https://stock-arena.chris-hsiao.site/ (now is temporary closed owing to the fee)

## Table of content
* [Technologies](#technologies)
* [Structure](#structure)
* [Database design](#database-design)
* [Features and Demonstration](#Features-and-Demonstration)
* [Guest account](#Guest-account)
* [Contact](#Contact)


## Technologies

### Backend
* Node.js
* Express.js
* AWS EC2
* Hbs

### Frontend
* HTML
* CSS
* JavaScript

### Realitime Web Application 
* Socket io

### Database
* MySQL
* AWS RDS

### Web Crawl
* Puppeteer
* Cheerio

### Test
* Mocha
* Chai

### Others
* Plot: D3, Hicharts
* Facebook login API


## Structure

<img src="./public/imgs/demo/structure.PNG" width="70%" title="structure">

- Redirects port requests by **NGINX** after receiving request from clients
- Constructed Web server on **AWS EC2**, established **MYSQL** on **AWS RDS**
- Realtime web application: **Socket**
- Scraped news content through **Web Crawler**


## Database design

<img src="./public/imgs/demo/db_schema.PNG" width="70%" title="database">

## Features and Demonstration


* Game mode choices:
  * Single player game
  * Join website's chat-room to match with other player
  
  <a href="https://youtu.be/v46aG4scO9k"><img src="./public/imgs/demo/stock-arena-start.gif" width="618.8" height="329" title="start"></a>

* Stock Information:
  * Decide stock portfolio 
  * Stock's news
  * Stock's financial report

  <a href="https://youtu.be/Fuz42HnBtoM"><img src="./public/imgs/demo/stock-arena-choice.gif" width="618.8" height="329" title="choice"></a>

* Game result:
  * Calculate stock's return on investment 
  * Check the latest news and financial report
  
  <a href="https://youtu.be/a96rtkb69A0"><img src="./public/imgs/demo/stock-arena-result.gif" width="618.8" height="329" title="result"></a>
  
* Leaderboard and user profile:
  * Game result will be stored into leaderboard
  * Check and compare all others' result in leaderboard
  * Check user's own result and match game result in user profile.
  
  <a href="https://youtu.be/cJHdFKYTf-Q"><img src="./public/imgs/demo/stock-arena-rank.gif" width="618.8" height="329" title="result"></a>
    

## Guest account
* Account email: guest@gmail.com
* Account password: stock1234

## Contact
* Authur: Ting-Yuan Hsiao
* Email: yuanchris1@gmail.com
