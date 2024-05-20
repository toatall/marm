import { ExcelColumn } from "./column";

export abstract class ExcelData {

    public abstract getData(): ExcelColumn[]   

    public colsWidth(): any[] {
        const listWidth: any[] = []
        this.getData().forEach((column: ExcelColumn) => {
            listWidth.push({ wch: (column.width ?? 8.43) })
        })
        return listWidth
    }

    public transform(data: any): any {
        return data
    }

    public countCols() {
        return this.getData().length;
    }

}