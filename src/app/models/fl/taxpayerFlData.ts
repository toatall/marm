import { TaxPayerFl } from "./taxpayerFl";
import { TaxPayerFlReceipt } from "./taxpayerFlReceipt";

export class TaxPayerFlData {

    public inn: string;
    public detail!: TaxPayerFl;
    public receiptList: TaxPayerFlReceipt[] = [];
    
    public isRun: boolean = true;
    public currentState?: string;    
    
    public constructor(inn: string) {
        this.inn = inn;
    }

    public setDetail(taxPayer: TaxPayerFl) {
        this.detail = taxPayer;
    }
}