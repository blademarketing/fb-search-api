import { BrowserLoader } from "./browser-loader.js";

export class FacebookLoader {

    constructor(profileId) {
        this.profileId = profileId;
    }

    async load() {
        this.browserLoader = new BrowserLoader(this.profileId);
        const browser = await this.browserLoader.load();
        const page = await browser.newPage();
        await page.goto("https://facebook.com", { waitUntil: "networkidle2" });
        console.log("✅ Facebook loaded.");
        return page;
    }

    async unload() {
        if(this.browserLoader) this.browserLoader.unload();
    }

}
