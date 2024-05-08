import { Observable, finalize } from "rxjs"


export interface Runner {
    funcHttp: Observable<any>
    funcSubscribe: CallableFunction
    funcError?: CallableFunction
}

export class Queues {

    private queues: Runner[] = []

    public constructor() {}

    /**
     * @param queue 
     */
    public add(queue: Runner) {         
        this.queues.push(queue)
    }

    public run(funcEnd: CallableFunction) {
        const queue = this.queues.shift()
        if (queue == null) {
            funcEnd()
        }
        queue?.funcHttp
            .pipe(finalize(() => this.run(funcEnd)))
            .subscribe((data) => queue.funcSubscribe(data))
    }
}