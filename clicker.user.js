// ==UserScript==
// @name         Instagram Auto Clicker
// @namespace   http://skinsdb.site/
// @version      1.0
// @description  try to hard!
// @author       BJIAST
// @match       https://www.instagram.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==


let app = {
    version: 1.0,
    title: '| InstAClick',
    timeout: 0,
    timer: 0,
    allToFollow: localStorage.getItem('allToFollow') || 0,
    toFollow: 0,
    leftToFollow: false,
    viewInterval: false,
    onWork: false,


    action: function (callback) {

        this.timer = Math.floor(Math.random() * 40) + 20;
        let currentTimer = this.timer - 2;


        let timeoutFunc = setTimeout(() => {

            this.leftToFollow = this.leftToFollow === false ? this.toFollow - 1 : this.leftToFollow - 1;
            this.subscribeViewer(currentTimer);

            callback();

        }, this.timeout * 1000);

        this.timeout += this.timer;
        return timeoutFunc;
    },

    init: function () {
        let nav = document.getElementsByClassName('bqE32')[0]
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
            }, 2000)
        });
    },

    clicker: function () {
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
            if (user.innerHTML == 'Подписаться') {
                this.toFollow++;
                this.allToFollow++;
                this.action(() => user.click());
            }
        }

        timer.style.cssText = "display:flex;padding: 15px;top:0;position: absolute;left: 120%;width: 100%;color: #0937de;flex-direction: column;background: #fff;justify-content: space-around;align-items: center;";
        timer.id = 'timerxrd';

        if (this.allToFollow > 200) {
            this.subscribeViewer(200);
            return false;
        }

        if (this.toFollow === 0) {
            this.inProcess(false);
            return false;
        }

        timer.append(timerZone);
        header.prepend(timer);

        localStorage.setItem('allToFollow', this.allToFollow);


        timerZone.id = 'timerzonexrd'
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

        if (this.allToFollow > 200) {
            timer.innerHTML = '<span style="color: red;"> На сегодня закончим ¯\_(ツ)_/¯</span><br><span>Все пройдено приблизительно '+this.allToFollow+' аккаунтов</span><br><button onclick="localStorage.removeItem(\'allToFollow\'); location.reload();">Сбросить ' + this.title + '</button>';

            return false;
        }

        followsCounterView.innerHTML = `Найдено <span style="color: #1a0cea">${this.toFollow} (<span style="color: darkred">${this.allToFollow}</span>) </span> аккаунтов <br>
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
                if (this.allToFollow > 200) {
                    timer.innerHTML = '<span style="color: red;"> На сегодня закончим ¯\_(ツ)_/¯</span>';
                } else {
                    this.inProcess(false);
                }
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
            }, 2000)
        }
    }
}

setTimeout(function () {
    app.init();
}, 2000);


