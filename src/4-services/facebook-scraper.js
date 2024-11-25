import tesseract from "tesseract.js";
import { helper } from "../2-utils/helper.js";
import { pageScraper } from "./page-scraper.js";

class FacebookScraper {

    async getPosts(page, searchParams) {

        // // Scroll down several times: 
        // for (let i = 1; i <= 5; i++) {
        //     await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        //     await helper.delay(500);
        // }
        // console.log("✅ Page scrolled down.");

        // Navigate to the search URL with the keyword:
        const searchUrl = `https://www.facebook.com/search/posts/?q=${encodeURIComponent(searchParams.keyword)}`;
        await page.goto(searchUrl, { waitUntil: "networkidle2" });
        console.log("✅ Navigated to posts page : " + searchUrl);

        // Click on "Posts" span: 
        const postsLinkSelector = "div[role='listitem']:nth-child(2) div > div > div > span > span";
        await page.waitForSelector(postsLinkSelector);
        await page.click(postsLinkSelector);
        helper.delay(2000);

        // Enter location: 
        const locationElement = await pageScraper.findElementByText(page, "Tagged location");
        if (!locationElement) throw new Error("Tagged Location not found.");
        await locationElement.focus();
        await page.keyboard.type(searchParams.location);
        await helper.delay(2000);
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
        console.log(`✅ Location ${searchParams.location} entered.`);
        await helper.delay(10000);

        // Scrape posts: 
        const posts = await this.scrapePosts(page, searchParams.count);
        if (posts.length > 0) console.log("✅ Posts found: ", posts);
        else console.log("❌ No post found.");
        return posts;
    }

    // Scrape count posts from a given page:
    async scrapePosts(page, count) {

        const uniqueContainers = new Set();
        const posts = [];
        const containers = `div[role="main"] div[role="feed"] > div`;
        await page.waitForSelector(containers, { timeout: 10000 });

        do {

            const containerElements = await page.$$(containers);

            for (const el of containerElements) {

                const elInnerText = await el.evaluate(element => element.innerText, el);
                if (uniqueContainers.has(elInnerText)) continue;
                uniqueContainers.add(elInnerText);

                // Extract the name and other data using page.evaluate
                const name = await page.evaluate(element => {
                    const nameSpan = element.querySelector("h3 strong:first-of-type span");
                    return nameSpan?.innerText;
                }, el);

                // Extract timestamp element in the current container:
                const timestampElement = await el.$('span[aria-labelledby] > span');
                let timestamp = null;
                if (timestampElement) {
                    try {
                        const base64Image = await timestampElement.screenshot({ encoding: 'base64' });
                        const result = await tesseract.recognize(Buffer.from(base64Image, 'base64'), 'eng');
                        timestamp = result?.data?.text?.trim();
                    }
                    catch (err) { }
                }

                // Extract content: 
                const contentSelector = "div[data-ad-preview='message'] > div > div > span[dir='auto']";
                const contentElement = await el.$(contentSelector);
                const content = contentElement ? await page.evaluate(el => el.innerText, contentElement) : null;

                // Extract likes amount: 
                const likesSelector = "div[data-visualcompletion] div div[tabindex] span[aria-hidden]";
                const likesElement = await el.$(likesSelector);
                const likes = likesElement ? await page.evaluate(el => el.innerText, likesElement) : 0;

                // Extract comments amount: 
                const commentsSelector = "div[data-visualcompletion] div div[role='button'][tabindex] span";
                const commentsElement = await el.$(commentsSelector);
                const comments = commentsElement ? await page.evaluate(el => el.innerText, commentsElement) : 0;

                // Add extracted object if full:
                if (name && timestamp && content)
                    posts.push({ name, timestamp, content, likes, comments });

                if (posts.length >= count) break;
            }

            if (posts.length >= count) break;

            // Scroll: 
         //   const lastHeight = await page.evaluate("document.body.scrollHeight");
         //   await page.evaluate(() => window.scrollBy(0, window.innerHeight));
         //   await helper.delay(700);
         //   const newHeight = await page.evaluate("document.body.scrollHeight");
         //   if (newHeight === lastHeight) break;

        } while (true);

        return posts.slice(0, count);
    }

}

export const facebookScraper = new FacebookScraper();
