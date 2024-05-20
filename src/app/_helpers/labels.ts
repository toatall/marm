export abstract class LabelHelper {
    
    protected _labels: Map<string, string> = new Map<string, string>()

    protected abstract getLabels(): Map<string, string>
    
    public headersSize(): any[] {
        return []
    }


    public constructor() {
        this._labels = this.getLabels()
    }

    // public label(key: string) {
    //     return this._labels.get(key)
    // }

    // public labels(keys: string[]) {
    //     const res: any = {}
    //     keys.forEach(key => res[key] = this.label(key))
    //     return res
    // }

    public allLabels() {
        return this._labels
    }
    
}