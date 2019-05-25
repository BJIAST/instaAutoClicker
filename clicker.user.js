// ==UserScript==
// @name         Instagram Auto Clicker
// @namespace   http://skinsdb.site/
// @version      1.14
// @description  try to hard!
// @author       BJIAST
// @match       https://www.instagram.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==


let app = {
    version: 1.14,
    title: '| InstAClick',
    timeout: 0,
    timer: 0,
    toFollow: 0,
    followed: JSON.parse(localStorage.getItem('followed')) || [],
    leftToFollow: false,
    sessionFollowed: 0,
    viewInterval: false,
    onWork: false,


    action: function (callback, user, li) {

        this.timer = Math.floor(Math.random() * 40) + 20;
        let currentTimer = this.timer - 2;


        let timeoutFunc = setTimeout(() => {

            this.leftToFollow = this.leftToFollow === false ? this.toFollow - 1 : this.leftToFollow - 1;
            this.subscribeViewer(currentTimer);

            callback();

            this.followed.push(user);

            localStorage.setItem('followed', JSON.stringify(this.followed));
            li.style.cssText = "background: rgba(48, 154, 216, 0.48);";

            if (Math.floor(Math.random() + 0.4)) {
                this.getLike(user);
            }


        }, this.timeout * 1000);

        this.timeout += this.timer;
        return timeoutFunc;
    },

    getLike: function (user) {
        let link = 'https://www.instagram.com' + user + '?=get_action';

        window.open(link);
    },

    likeWindow: function () {
        let posts = document.getElementsByClassName('v1Nh3 kIKUG  _bz0w'),
            toLike = [];

        if(posts.length > 0){
            for (let i = 0; i < posts.length; i++) {
                itemToLike = Math.floor(Math.random() + 0.1);

                if (itemToLike) {
                    toLike.push(posts[i].getElementsByTagName('a')[0]);
                }
            }

          if(toLike.length > 0){
              this.chromemes(`На данной странице будет пролайкано ${toLike.length} записей, примерно за ${toLike.length * 16} секунд.`);

              likeIt(0);
          }else {
              setTimeout(function () {
                  window.close();
              },4000)
          }
        }else {
            setTimeout(function () {
                window.close();
            },4000)
        }



        function likeIt(index) {

            setTimeout(function () {
                toLike[index].click();
            }, 5000);

            setTimeout(function () {
                let like = document.querySelectorAll('[aria-label="Нравится"]');

                like[0].click();
            }, 12000);

            setTimeout(function () {
                let closeButton = document.getElementsByClassName('ckWGn')[0];

                closeButton.click();
            }, 16000);

            setTimeout(function () {

                index++;
                if(index <= toLike.length - 1) {
                    likeIt(index);
                }else{
                    window.close();
                }

            }, 18000)
        }
    },

    init: function () {

        if (location.search === '?=get_action') {
            this.likeWindow();

            return false;
        }

        let nav = document.getElementsByClassName('bqE32')[0];
        let buttonStart = document.createElement('span');
        buttonStart.classList = "vBF20 _1OSdk";
        buttonStart.style.margin = '0 8px';
        buttonStart.style.background = 'green';
        buttonStart.innerHTML = '<button class="_5f5mN jIbKX _6VtSN yZn4P " style="background: #4adc1b; border-color: #4adc1b;">Начать ' + this.title + '</button>';
        nav.append(buttonStart);

        buttonStart.addEventListener('click', event => {
            let list = document.getElementsByClassName('-nal3')[1];
            list.click();

            setTimeout(() => {
                this.clicker();
            }, 4000)
        });
    },

    clicker: function () {
        var getClosest = function (el, sel) {
            while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
            return el;
        };

        let list = document.getElementsByClassName('_6xe7A')[0],
            follows = list.getElementsByTagName('button'),
            header = document.getElementsByClassName('m82CD')[0],
            timer = document.getElementById('timerxrd') || document.createElement('span'),
            followsCounterView = document.getElementById('followsCounter') || document.createElement('span'),
            followsTimeView = document.getElementById('followsTime') || document.createElement('span'),
            timerZone = document.getElementById('timerzonexrd') || document.createElement('span');


        this.onWork = true;
        this.toFollow = 0;

        for (let user of follows) {
            let currentElem = user.parentElement.parentElement.querySelector('.FPmhX.notranslate._0imsa'),
                current = currentElem.getAttribute('href');

            if(this.followed.find((elem) => elem === current)) {
                let li = getClosest(currentElem, 'li');

                li.style.cssText = "background: rgba(48, 154, 216, 0.48);"
            }

            if (user.innerHTML == 'Подписаться' &&  !this.followed.find((elem) => elem === current)) {
                let li = getClosest(currentElem, 'li');

                this.toFollow++;
                this.action(() => user.click(), current , li);

            }
        }

        timer.style.cssText = "display:flex;padding: 15px;top:0;position: absolute;left: 120%;width: 100%;color: #0937de;flex-direction: column;background: #fff;justify-content: space-around;align-items: center;";
        timer.id = 'timerxrd';

        if (this.toFollow === 0) {
            this.inProcess(false);
            return false;
        }

        timer.append(timerZone);
        header.prepend(timer);


        timerZone.id = 'timerzonexrd';
        followsCounterView.id = 'followsCounter';
        followsTimeView.id = 'followsTime';


        timer.innerText = 'Следующий фолов через: ';


        let now = new Date();
        now.setMinutes(now.getMinutes() + Math.floor(this.timeout / 60));
        now.setSeconds(now.getSeconds() + this.timeout % 60);


        followsTimeView.innerHTML = `Будет обработано за <span style="color: darkred">${Math.floor(this.timeout / 60) + ' м. ' + this.timeout % 60} с. </span> <br>
        Время окончания: <span style="color: darkgreen">${now.toLocaleTimeString()}</span> </span>`;
        followsTimeView.style.cssText = 'color: #000; padding: 10px 0; margin-top: 6px; border-top: 1px solid #cecece';


        timer.append(timerZone);
        timer.append(followsCounterView);
        timer.append(followsTimeView);
    },

    subscribeViewer: function (timeout) {

        let timerZone = document.getElementById('timerzonexrd'),
            timer = document.getElementById('timerxrd'),
            followsCounterView = document.getElementById('followsCounter');
        // followsTimeView = document.getElementById('followsTime');
        seconds = timeout;


        followsCounterView.innerHTML = `Найдено <span style="color: #1a0cea">${this.toFollow} </span> аккаунтов <br>
         Осталось: <span style="color: darkgreen">${this.leftToFollow}</span>`;
        followsCounterView.style.cssText = 'color: #000; padding: 10px 0; margin-top: 6px; border-top: 1px solid #cecece';


        if (this.viewInterval) {
            clearInterval(this.viewInterval);
        }

        this.viewInterval = setInterval(() => {
            timerZone.innerHTML = seconds + ' с.';
            seconds -= 1;

            if (seconds < -2) {
                clearInterval(this.viewInterval);

                this.leftToFollow = false;
                this.inProcess(false);
            }
        }, 1000)

    },

    inProcess: function (bool = false) {
        if (!bool) {
            this.onWork = false;

            let list = document.getElementsByClassName('_6xe7A')[0].parentElement;
            list.scrollTop = 99999999;

            this.timeout = 0;

            setTimeout(() => {
                this.clicker();
            }, 4000)
        }
    },
    chromemes: function (mesbody) {
        var currentPermission;
        Notification.requestPermission(function (result) {
            currentPermission = result
        });
        mailNotification = new Notification(document.title + this.title, {
            body: mesbody,
            icon: document.getElementsByClassName('_6q-tv')[0].getAttribute('src')
        });
        setTimeout(mailNotification.close.bind(mailNotification), 5000);
    }
};

setTimeout(function () {
    app.init();
}, 2000);


