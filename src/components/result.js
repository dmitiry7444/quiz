import {UrlManager} from "../utils/url-manager.js";

export class Result  {
    constructor() {

        UrlManager.checkUserData();
        document.getElementById('result-score').innerText = sessionStorage.getItem( 'score') + '/' + sessionStorage.getItem( 'total');
        document.getElementById('result-correct').onclick = () => {
            location.href = '#/check';
        }
    }
}
