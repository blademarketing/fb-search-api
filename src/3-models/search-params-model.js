import { BadRequestError } from "./error-models.js";

export class SearchParamsModel {
    constructor(searchParams) {
        this.keyword = searchParams.keyword;
        this.location = searchParams.location;
        this.count = searchParams.count || 10;
    }

    validate() {
        if(!this.keyword) throw new BadRequestError("Missing keyword.");
        if(!this.location) throw new BadRequestError("Missing location.");
        if(isNaN(this.count)) throw new BadRequestError("Count must be a number.");
        if(this.count <= 0) throw new BadRequestError("Count must be a positive number.");
        if(this.count >= 50) throw new BadRequestError("Count can't exceeds 50.");
    }
}