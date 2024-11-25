import dotenv from "dotenv";
dotenv.config();

class AppConfig {
    isDevelopment = process.env.ENVIRONMENT === "development"
    isProduction = process.env.ENVIRONMENT === "production"
    port = process.env.PORT;
    goLoginApiToken = process.env.GOLOGIN_API_TOKEN;
    goLoginProfiles = JSON.parse(process.env.GOLOGIN_PROFILES);
    constructor() {
        const randomIndex = Math.floor(Math.random() * this.goLoginProfiles.length);
        this.goLoginRandomProfile = this.goLoginProfiles[randomIndex];
    }
}

export const appConfig = new AppConfig();
