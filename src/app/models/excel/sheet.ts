
/**
 * Описание листа Excel
 */
export class ExcelSheet {

    // имя листа
    private name: string

    // данные на листе
    private data: Array<any> = []

    // настройки (оформление)
    private options: any

    /**
     * {@inheritdoc}
     */
    public constructor(
        name: string, 
        data: Array<any> = [], 
        options: any = {},
    ) {
        this.name = name
        this.data = data
        this.options = options
    }

    /**
     * Добавить строку данных
     * @param {any} row 
     * @returns {void}
     */
    public dataAdd(row: any): void {
        // замена undefined значений на '' 
        // т.к. не появляется рамка в Excel
        Object.keys(row).forEach((key) => {
            if (row[key] == undefined) {
                row[key] = ''
            }
        })
        this.data.push(row)
    }

    /**
     * Количество строк данных
     * @returns {number}
     */
    public countRows(): number {
        return this.data.length
    }

    /**
     * Сохранение настроек
     * @param {any} options 
     * @returns {void}
     */
    public setOptions(options: any): void {        
        this.options = Object.assign(this.options, options)        
    }

    /**
     * Имя листа
     * @returns {string}
     */
    public getName(): string {
        return this.name        
    }

    /**
     * Данные
     * @returns {Array<any>} 
     */
    public getData(): Array<any> {
        return this.data
    }

    /**
     * Опции
     * @returns {any}
     */
    public getOptions(): any {
        return this.options
    }
}