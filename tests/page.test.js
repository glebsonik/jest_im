;
const puppeteer = require('puppeteer');
const shell = require('shelljs');
fs = require('fs');

/**
 * Matcher for correct response code.
 * Correct response code is the integer
 * code in bounds from 200 to 299.
 */
expect.extend({
    toHaveCorrectResponseCode(responseCode) {
        const codeType = Math.floor(responseCode/100);
        if (codeType === 2) {
            return {
                message: () =>
                    `expected status code ${responseCode} is correct`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    `expected status code ${responseCode} to be successful (from 200 to 299)`,
                pass: false,
            };
        }
    },
});

let deployedEnv = {url: ''};
beforeAll(async ()=> {
    await page.setViewport({ width: 1920, height: 1080 })
    shell.exec('bash ./init_scripts/init_deploy.sh');
    console.log("Bash initialization finished");

    let contents = fs.readFileSync('deploy_log.txt', 'utf8');
    console.log(contents);
    deployedEnv.url = contents;
    // await page.goto('https://www.google.com');
    // await page.screenshot({path: 'google.png'});
});

it('Validates correct response code and content-type header', async () => {
    // await page.tracing.start({ path: 'profile.json', screenshots: true });
    let response = await page.goto(deployedEnv.url);
    // await page.tracing.stop();
    expect(response['_status']).toHaveCorrectResponseCode();
    expect(parseInt(response['_headers']['status'])).toHaveCorrectResponseCode();
    expect(response['_headers']['content-type']).toBeTruthy()
});

let cssPageElements = [
    "h1.title",
    "a.card",
    "footer>a>img"
]
it('Asserts correct content on page', async () => {
    await page.goto(deployedEnv.url);
    // await expect(page).toMatchElement({type:'xpath', value: "//h1[text()='Welcome to ' and .//a]"})
    for(let cssSelector of cssPageElements){
        await expect(page).toMatchElement(cssSelector);
    }
});

let xpathPageElements = [
    "//h1[text()='Welcome to ' and .//a]",
    "//a[@href and @class[contains(.,' card')]]",
    "//footer//*[text()='Powered byjjjj']"
]
// Code below didn't work for some unknown reason
it('Asserts page elements by XPath', async () => {
    await page.goto(deployedEnv.url);
    await page.waitForXPath("//a[text()='Next.js!']");
    console.log("Waited for Xpath finished");

    await expect(page).toClick({type: 'xpath', value: "//a[text()='Next.js!']"});
    console.log("Finished click");
    await expect(page).toMatchElement({type:'css', value: "h1.title"});
    console.log("Css obj usage");
    await expect(page).toMatchElement({type:'xpath', value: "//h1[text()='Welcome to ' and .//a]"});
    console.log("XPath obj usage");
});

it('Makes snapshots for deployed page', async () => {
    const snapshotsPath = "./snapshots"
    if (!fs.existsSync(snapshotsPath)) {
        fs.mkdirSync(snapshotsPath);
    }
    await page.goto(deployedEnv.url);
    pdf_params = {
        path: snapshotsPath + "/cssMediaPage.pdf",
        width: "1920px",
        height: "1080px"
    }
    await page.pdf(pdf_params)

    await page.emulateMediaType('screen');
    await page.pdf(pdf_params)

    await page.screenshot({path: snapshotsPath + '/testAppScreen.png'});
});

afterAll(async ()=>{
    console.log("Finished");
})