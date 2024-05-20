import { Observable, Subscription, finalize } from "rxjs"

/**
 * Интерфейс задачи
 */
export interface Runner {
    // функция запроса
    funcHttp: Observable<any>;
    // подписка на успешное завершение запроса
    funcSubscribe: CallableFunction;
    // подписка при возникновении ошибки
    funcError?: CallableFunction;
    // описание задачи
    description?: string;
}

export class Queues {

    // очередь процессов(запросов)
    private queues: Runner[] = []
    
    // запущенный процесс(запрос)
    private currentProcess: Subscription|undefined = undefined

    /**
     * {@inheritdoc}
     */
    public constructor() {}

    /**
     * Добавление в очередь
     * @param {Runner} queue 
     */
    public add(queue: Runner) {         
        this.queues.push(queue);
    }

    /**
     * Рекурсивная функция запуска выполнения запросов по очереди
     * @param {CallableFunction} funcEnd функция, которая будет запущена после выполнения всех запросов
     */
    public run(funcStart: CallableFunction, funcEnd: CallableFunction) {
        const queue = this.queues.shift()
        if (queue == null) {
            funcEnd();
        }
        funcStart(queue);
        this.currentProcess = queue?.funcHttp
            .pipe(finalize(() => { 
                this.currentProcess = undefined;
                this.run(funcStart, funcEnd);  
            }))
            .subscribe((data) => queue.funcSubscribe(data));
    }

    /**
     * Прерывание выполнения запросов
     */
    public stop() {                
        this.queues.length = 0
        if (this.currentProcess !== undefined) {            
            this.currentProcess?.unsubscribe()
        }
    }
}