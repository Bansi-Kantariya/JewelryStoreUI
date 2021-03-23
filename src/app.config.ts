import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { promise } from "selenium-webdriver";
import { IAppConfig } from "./app-config.model";
import { environment } from "./environments/environment";

@Injectable()
export class AppConfig {
    static settings: IAppConfig

    constructor(private http : HttpClient){}

    load() {
        const jsonFile = `assets/config/config.${environment.production ? "prod" : "dev"}.json`

        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response) => {
                AppConfig.settings = <IAppConfig>response;
                resolve();
            }).catch((response : any) => {
                reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        })
    }
}
