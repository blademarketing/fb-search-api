import { appConfig } from '../2-utils/app-config.js';
import { FacebookLoader } from './facebook-loader.js';
import { facebookScraper } from './facebook-scraper.js';

class FacebookSearcher {

    async getPosts(searchParams) {
        searchParams.validate();
        let facebookLoader;
        try {
            facebookLoader = new FacebookLoader(appConfig.goLoginRandomProfile);
            const page = await facebookLoader.load();
            const posts = await facebookScraper.getPosts(page, searchParams);
            return posts;
        }
        finally {
            try {
                // if (appConfig.isProduction) await facebookLoader.unload();
                await facebookLoader.unload();
            }
            catch (err) { console.log(err.message) }
        }
    }

}

export const facebookSearcher = new FacebookSearcher();
