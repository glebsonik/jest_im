#Jest integration test
This is the pilot integration test, based on `Jest` NodeJS test framework.
##Prerequisites
To start running existing tests you have to do the following:
   * Install [NodeJS](https://nodejs.org/en/download/) on your computer
   * Create an account or sync existed GitHub account with [Vercel](https://vercel.com)
After this some nodes should be downloaded by `npm`, list of the is described below:
   * `npm install --save-dev jest` – Jest test framework as entry point for all tests
   * `npm install puppeteer` – puppeteer webDriver (in our test will be used headless Chrome) that allows to manipulate the page, take screenshots, etc.
   * `npm install --save-dev jest-puppeteer puppeteer jest` – jest-puppeteer additional library for puppeteer that has timeout expectations for page content, makes puppeteer more testing oriented 
   * `npm install shelljs` – shell for running bash scripts from Jester
   * `npm i -g vercel` – Vercel CLI representation for project deployment from the shell
> :warning: After you have installed Vercel, please do initial linking to your project 
and Vercel account, by typing `vercel` in commandline and then following the instructions. 
After that, all executing jest tests will be deployed with these parameters.

## Testing scope
Currently, there are three working test examples that will do the following:
   1. Deploy Next app project, stored in *app_dir/my-test-app* to Vercel (after manual initial configuration, see the previous paragraph, for more info)
   2. Get the link for deployed app from file `deploy_log.txt`. File will be generated automatically after deployment.
   3. Proceed via link to the app and verify response codes, headers, page content and make snapshots and screenshots.
   
   To run all tests at once type `jest` from your content root. *Note:* If you run any specific case, Vercel deploy will be triggered anyway.
## Known issues
###XPath issue 
As mentioned in jest-puppeteer-expect [documentation](https://github.com/smooth-code/jest-puppeteer/blob/master/packages/expect-puppeteer/README.md#type-string-value-string), 
developer can use both css and xpath selectors by passing 
  a css object
```js
{type:'css', value:'form[name="myForm"]'}
```
  or xpath object
```js
{type:'xpath', value:'.\\a'}
```
  to *expect* methods, but if you try to pass any object you will face an error
  `
   Error: Element [object Object] not found
   Evaluation failed: DOMException: Failed to execute 'querySelectorAll' on 'Document': '[object Object]' is not a valid selector.
   `
   So for now there is only one way to get elements is to use css selectors, that, unfortunately, will be hard to use in react apps.
   Any founded documentation didn't help.