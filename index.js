const puppeteer = require('puppeteer');

const URI = process.env.URI || 'https://www.instagram.com/wwe/';
const filename = Math.random().toString(36).substring(2,7);
const action = process.env.ACTION || null;
const path = require('path');

/*
 * Default
 */
let do_default = ()=>{
    (async()=>{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(URI);

        await page.screenshot({
            path: path.join(__dirname,`shots/${filename}.png`),
            fullPage:true
        });

        browser.close();
    })();
};

/*
 * Viewports
 */
let do_viewports = ()=>{
    (async()=>{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const viewports = [1600,1024,720,460];

        await page.goto(URI);

        for (let i=0; i<viewports.length; i++){
            let vw = viewports[i];

            await page.setViewport({
                width:vw,
                height:1000
            });

            await page.screenshot({
                path:`shots/${filename}-${vw}.png`,
                fullPage:true
            })
        }

        browser.close();
    })();
};

/*
 * Interacting
 */
let do_interacting = ()=>{
    (async()=>{
        const browser = await puppeteer.launch({
            headless:false
        });
        const page = await browser.newPage();

        await page.setViewport({
            width:1200,
            height:900
        });
        console.log('Viewport 1200x900');
        console.log('cargando URI');
        await page.goto('https://twitter.com/id_marcedroid');
        await page.waitFor('input[id="search-query"]');
        console.log('Focus');
        await page.type('input[id="search-query"]','WWE', {delay:250});
        console.log('Escribiendo...');

        await page.evaluate(()=>{
          const element = document.getElementById('global-nav-search');
          element.submit()
        })

        //Mantener el navegador abierto
        //browser.close();
    })();
};


/*
 * RUN CODE
 */
switch (action){
    case 'viewports':
        do_viewports();
        break;
    case 'interacting':
        do_interacting();
        break;
    default:
        do_default();
}
