const puppeteer = require('puppeteer');
const setDropDownValue = async (page, selectorName, selectorValue) => {
    try {
        const selector = await page.$(`select[name="${selectorName}"]`);
        await selector.type(`${selectorValue}`);
    } catch (err) {
        console.error(err);
    }
}
const searchProduct = async (page, className, productName) => {
    try {
        await page.type(`input.${className}`, `${productName}`);
        page.keyboard.press('Enter');
    } catch (err) {
        console.error(err);
    }
}
const openProduct = async (page) => {
    try {
        page.evaluate(() => {
            const elements = [...document.querySelector('tr[class="product-name"]').lastElementChild.children];
            elements && elements[0].click();
        })

    } catch (err) {
        console.error(err);
    }
}
const setCounter = async (page, className) => {
    let counter = 0;
    while (counter < 9) {
        await page.$eval(`div[class="${className}"]`, form => form.click());
        counter++
    }
}
const delay = (time) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}
const testLinks = async () => {
    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 100, args: ["--disable-notifications"] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1536, height: 864 });
        await page.goto('https://www.links.hr/hr/');
        await Promise.all([
            searchProduct(page, 'search-box-text.ui-autocomplete-input', 'hladnjak'),
            page.waitForNavigation({
                waitUntil: 'networkidle2',
            })
        ])
        await Promise.all([
            setDropDownValue(page, 'products-pagesize', '12'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);
        await setDropDownValue(page, 'products-viewmode', 'Lista');
        await delay(1000);
        await page.$eval('input[class="button-2 add-to-compare-list-button"]', form => form.click());
        await page.$eval('input[class="button-2 add-to-compare-list-button"]', form => form.click());
        await page.$eval('span[class="compare-products-count"]', form => form.click());
        await delay(1000);
        await page.$eval('input[class="button-2 remove-button"]', form => form.click());
        await delay(1000);
        await Promise.all([
            openProduct(page),
            page.waitForNavigation({
                waitUntil: 'networkidle2'
            })
        ])
        await setCounter(page, "plus");
        await setCounter(page, "minus");
        await page.$eval('button[class="button-1 add-to-cart-button"]', form => form.click());
        await page.$eval('div[class="articleNum"]', form => form.click());
    } catch (err) {
        console.error(err);
    }
}
testLinks();