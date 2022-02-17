const puppeteer = require("puppeteer");
const schedule = require('node-schedule');

const rootUrl = "https://en.wikipedia.org";

const getNavItems = async (page) => {
  await page.goto(`${rootUrl}/wiki/Main_Page`, {waitUntil:"networkidle2"});

  return ( results = await page.evaluate(() => {
    const allNavItems = document.querySelectorAll(".mw-list-item", {waitUntil: 'networkidle2'});

    return Array.from(allNavItems).map(item => {
      let res = {
        liContent: item.innerHTML,
        liId: item.id
      };
      return res;
    })
  }))
}

const getRandomPageNavLink = (navArray) => {
  const navItem = navArray.filter(item => {
    return item.liId.includes("n-randompage")
  })

  if (navItem.length > 1 || navItem.length === 0) return;

  const startIndex = navItem[0].liContent.indexOf("href") + 7;
  const endIndex = navItem[0].liContent.indexOf('"', startIndex);
  const navItemHref = navItem[0].liContent.slice(startIndex, endIndex);
  return navItemHref;
}

const getRandomPageTitle = async() => {    
  const argv = require('minimist')(process.argv.slice(2));
  const browser = await puppeteer.launch({ headless: true, args: [ `--proxy-server =${argv.proxy}` ] });
  const page = await browser.newPage();
  const navItems = await getNavItems(page);
  const randomPageNavLink = getRandomPageNavLink(navItems);

  await page.goto(`${rootUrl}/${randomPageNavLink}`, {waitUntil:"networkidle2"});
  let pageHeading = await (results = page.evaluate(() => {
    const heading = document.querySelector("#firstHeading", {waitUntil: 'networkidle2'});
    return heading.innerHTML; 
  }))
  await browser.close();
  return pageHeading;
}

const navigateWikipedia = async () => {
  const randomTitle = await getRandomPageTitle();
  console.log(`\t- ${new Date().toUTCString()}\n\t\tTitle: `, randomTitle)
}

console.log('Started Crawling: ')
schedule.scheduleJob('0 */2 * * * ', function() { // 15, 16
  navigateWikipedia()
});
