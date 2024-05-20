import { TaxPayerUl } from "./taxpayerUl";
import { TaxPayerUlBasic } from "./taxpayerUlBasic";
import { TaxPayerUlSmz } from "./taxpayerUlSmz";

export class TaxPayerUlData {

    public inn: string;
    public detail!: TaxPayerUl;
    public basicList: TaxPayerUlBasic[] = [];
    public smzList: TaxPayerUlSmz[] = [];

    public isRun: boolean = true;
    public currentState?: string;    
    
    public constructor(inn: string) {
        this.inn = inn;        
    }

    public setDetail(taxPayerUl: TaxPayerUl) {
        this.detail = taxPayerUl
    }

    public isEmpty(): boolean {
        return this.detail != undefined;
    }

}