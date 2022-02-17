const puppeteer = require("puppeteer");
const schedule = require('node-schedule');

const rootUrl = "https://play.crabada.com/";

const getMiningExpeditionHTML = async (page) => {
  await page.goto(`${rootUrl}/mine`, {waitUntil:"networkidle2"});
  
  console.log('test 3')

  return ( results = await page.evaluate(() => {
      
    console.log('test 4')
    const buttons = document.querySelectorAll(".btn", {waitUntil: 'networkidle2'});
    const miningExpedition = document.querySelector(".ant-modal-close", {waitUntil: 'networkidle2'}).click();
    return Array.from(buttons).map(item => {
      return item.innerHTML;
    })
  }))
}

const startMiningExpedition = async() => {    
  const argv = require('minimist')(process.argv.slice(2));
  const browser = await puppeteer.launch({ headless: false, args: [ `--proxy-server =${argv.proxy}` ] });
  const page = await browser.newPage();
  
  console.log('test 2')
  const miningExpedition = await getMiningExpeditionHTML(page);

  console.log('test 5')
  console.log('this is miningExpedition -> ', miningExpedition)

  await browser.close();
  return null;
}

const navigateCrabada = async () => {
    console.log('test 1')
  const expedition = await startMiningExpedition();
  
  console.log('test 6')
  console.log(`\t- ${new Date().toUTCString()}\n\t\tExpedition: `, expedition)
}

console.log('Started Crawling: ')
schedule.scheduleJob('1 * * * * * ', function() { // 0 */2 * * * // 15, 16
    console.log('test 0')
  navigateCrabada()
});
