import { GoLogin } from 'gologin';
import { appConfig } from '../2-utils/app-config.js';
import noopConsole from "noop-console";

export class GoLoginConnector {

    constructor(profileId) {
        this.profileId = profileId;
    }

    async connect() {


        const options = {
            token: appConfig.goLoginApiToken,
            profile_id: this.profileId,
            extra_params: { port: 9222 },
            orbitaPath: './orbita' // Specify a persistent path for Orbita.
        }

        this.goLogin = new GoLogin(options);

        const profileInfo = await this.goLogin.getProfile(this.profileId);

        const profileName = profileInfo.name || "Unknown";
        console.log("✅ Profile Name: " + profileName);

        // let result;
        // try {
        //     noopConsole(console);
        //     result = await this.goLogin.start();
        // }
        // finally { console._restore(); }
        const result = await this.goLogin.start();

        console.log("✅ GoLogin connected: " + result.wsUrl);

        return result.wsUrl;
    }

    async disconnect() {
        if (!this.goLogin) return;
        await this.goLogin.stop();
    }

}