import puppeteer from 'puppeteer';
import { GoLoginConnector } from "./gologin-connector.js"

export class BrowserLoader {

    constructor(profileId) {
        this.profileId = profileId;
    }

    async load() {
        this.goLoginConnector = new GoLoginConnector(this.profileId);
        const wsUrl = await this.goLoginConnector.connect();
        this.browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
        console.log("✅ Browser loaded.");
        return this.browser;
    }

    async unload() {
        if(this.browser) await this.browser.close();
        if(this.goLoginConnector) await this.goLoginConnector.disconnect();
    }

}
