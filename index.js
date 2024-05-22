const puppeteer = require('puppeteer');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));

// Exemple d'exécution
// npm run execute -- --startChapter=1 --endChapter=10
const startChapter = args['startChapter'] || 1;
const endChapter = args['endChapter'] || 10;

const chapters = Array(endChapter - startChapter + 1).fill().map((element, index) => index + startChapter);
console.log('Chapitres :', chapters);

const sleep = ms => new Promise(res => setTimeout(res, ms));

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-features=site-per-process']
    });
    const context = browser.defaultBrowserContext();
    const page = await browser.newPage();

    // Pour ne pas bloquer sur la demande d'autorisation des notifications
    await context.overridePermissions("https://littlexgarden.com", ['notifications']);

    // Répertoire de téléchargement
    const downloadPath = path.resolve(__dirname, 'downloaded');

    // Autoriser les téléchargement
    const client = await page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });

    // Fonction de téléchargement d'un chapitre
    async function downloadChapter(chapter) {
        await page.goto(`https://littlexgarden.com/one-piece/${chapter}`, { waitUntil: 'networkidle2' });

        // Attente div chargé et visible
        await page.waitForSelector('div#context-menu');

        // Simule un clic sur le bouton de téléchargement après un délai
        await page.evaluate(() => {
            function simulateClick() {
                const span = document.evaluate("//span[contains(.,'Télécharger le chapitre')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                span.parentNode.click();
            }
            setTimeout(simulateClick, 5000);
        });

        // Attente le temps du téléchargement (ajuster si nécessaire)
        await sleep(6000 + 5000);
    }

    // Téléchargement des chapitres souhaités
    for (const chapter of chapters) {
        console.log(`Traitement chapitre ${chapter}`)
        await downloadChapter(chapter);
    }

    await browser.close();
})();
