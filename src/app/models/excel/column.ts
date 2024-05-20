export class ExcelColumn {
    public name: string
    public label: string
    public width?: number

    public constructor(name: string, label: string, width?: number) {
        this.name = name
        this.label = label
        this.width = width
    }    
}
