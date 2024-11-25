import express from "express";
import { facebookSearcher } from "../4-services/facebook-searcher.js";
import { SearchParamsModel } from "../3-models/search-params-model.js";

class FacebookController {

    router = express.Router();

    constructor() {
        this.router.post("/search-facebook", this.searchFacebook);
    }

    async searchFacebook(request, response, next) {
        try {
            const searchParams = new SearchParamsModel(request.body);
            const posts = await facebookSearcher.getPosts(searchParams);
            response.json(posts);
        }
        catch (err) { next(err); }
    }
}

export const facebookController = new FacebookController();
