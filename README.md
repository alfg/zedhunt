# Zedhunt

Zedhunt is a squad matchmaking platform for the zombie survival game, DayZ. The idea was inspired from DayZ LFG message boards such as http://www.reddit.com/r/DayZLFG and the UI of [BattleLog](http://battlelog.battlefield.com/bf4/servers/) to help survivors and bandits find and/or form groups.

**Zedhunt Demo**: http://zedhunt.com

##Installation##

Requires `redis-server` and `mongodb` to be installed.

Setting up `zedhunt` is simple, just follow the steps below:

1) Register an API Key at [Firebase](www.firebase.com)

2) Clone and install

```bash
$ git clone https://github.com/alfg/zedhunt.git
$ cd zedhunt
$ npm install
```

3) Open `config.js.sample` and configure

```javascript
config.web.sessionkey = 'super secret';
config.mongodb.host = 'mongodb://host/database';
config.redis.host = '127.0.0.1';
config.redis.port = 6379;
config.firebase.url = 'https://zombies.firebaseio.com';
config.firebase.token = 'secret token';
```
4) Rename `config.js.sample` to `config.js` and run the app

```bash
$ mv config.js.sample config.js
$ node app.js
```

Load `http://localhost:3000` into the browser


## Sample nginx config


```
server {
    listen 80;

    server_name zedhunt.com;
    access_log /var/log/nginx/zedhunt.access.log;
    error_log /var/log/nginx/zedhunt.error.log;


    location / {
        proxy_pass         http://127.0.0.1:3000/;
        proxy_redirect     off;
        proxy_set_header   Host             $http_host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;

        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```


## License ##
zedhunt is open-source under the [MIT License][1].

## Credits ##
zedhunt uses the following technologies, check them out!
* [NodeJS][2] The core backend
* [Express][3] Web Framework for Node.
* [MongoDB][4] NoSQL document database
* [Redis][5] Simple key/value datastore
* [Firebase][6] API to store and sync data in realtime



[1]: http://opensource.org/licenses/MIT
[2]: http://nodejs.org
[3]: http://expressjs.com/
[4]: http://www.mongodb.org/
[5]: http://redis.io/
[6]: http://firebase.com/

