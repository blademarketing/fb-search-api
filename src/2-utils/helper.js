class Helper {

    delay(ms) {
        return new Promise(resolve => {
            setTimeout(() => resolve(), ms);
        });
    }

}

export const helper = new Helper();
