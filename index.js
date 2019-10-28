const app = require('electron').remote.app,
  path = require('path'),
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
  "interval": 300000
};
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
  await page.goto(item.url);
  await page.type('.lxb-cb-input', target.phone, {delay: 10});
  // await page.type(String.fromCharCode(13));
  await page.keyboard.press('Enter')
  // await page.type('.lxb-cb-input-btn');
  // const inputElement = await page.$('.lxb-cb-input-btn');
  // await inputElement.click();
  // await page.click('.lxb-cb-input-btn');
  await page.waitFor(1 * 1000);
  // let result = {
  //     status: TASK_STATUS.failed,
  //     msg: ''
  // };

  // try {
  //     await page.goto(item.url);
  //     result = await flow[item.task_type][item.web_type](page, item, config.get('target'));
  // } catch (e) {
  //     result.msg = `[TIME OUT ERROR] ${e}`;
  // }

  // return result;
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

      await task(page, item);
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
