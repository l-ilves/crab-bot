const puppeteer = require("puppeteer");
const schedule = require('node-schedule');

const rootUrl = "https://beta.defikingdoms.com";

const getMiningExpeditionHTML = async (page) => {
  await page.goto(`${rootUrl}`, {waitUntil:"networkidle2"});
  console.log('test 3, this is rootURL -> ', rootUrl);

  let miningExpeditionHTML = await page.evaluate(() => { // if(!results) ... (https://stackoverflow.com/questions/55467333/evaluation-failed-error-in-puppeteer-error-handling)
      //setTimeout(15000);  
    console.log('test 4')
    const button = document.querySelector("#connect-wallet", {waitUntil: 'networkidle2'});
    button.click();
	//setTimeout( 15000);

const links = document.querySelectorAll(".sc-exAgwC", {waitUntil: 'networkidle2'});
    return Array.from(links).map(item => {
      return item.innerHTML;
    })
  })

  if (!miningExpeditionHTML) return null;
  return miningExpeditionHTML;
}

const startMiningExpedition = async() => {    
  const argv = require('minimist')(process.argv.slice(2));
  const browser = await puppeteer.launch({ headless: false, args: [ `--proxy-server =${argv.proxy}` ] });
  const page = await browser.newPage();
  
  console.log('test 2')
  const miningExpedition = await getMiningExpeditionHTML(page);

  console.log('test 5')
  console.log('this is miningExpedition -> ', miningExpedition)

	//setTimeout(15000);
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
