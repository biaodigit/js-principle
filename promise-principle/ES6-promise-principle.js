//Promise/A+规定的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'


class IPromise {
    constructor(executor) {
        this.status = PENDING;
        this.value = null;
        this.resolveQueue = []
        this.rejectQueue = []

        let _resolve = val => {
            setTimeout(() => {
                if (!Object.is(this.status, PENDING)) return
                this.status = FULFILLED;
                this.value = val;
                while (this.resolveQueue.length) {
                    const cb = this.resolveQueue.shift()
                    cb(val)
                }
            })
        }

        let _reject = val => {
            setTimeout(() => {
                if (!Object.is(this.status, PENDING)) return
                this.status = REJECTED;
                this.value = val;
                while (this.rejectQueue.length) {
                    const cb = this.rejectQueue.shift()
                    cb(val)
                }
            })
        }

        try {
            executor(_resolve, _reject)
        } catch (e) {
            _reject(e)
        }
    }

    then(resolveFn, rejectFn) {
        if (!isFunction(resolveFn)) resolveFn = (val) => val;

        if (!isFunction(rejectFn)) rejectFn = (err) => {
            throw new Error(err instanceof Error ? err.message : err)
        };

        return new IPromise((resolve, reject) => {
            let onResolveFn = (val) => {
                try {
                    let v = resolveFn(val);
                    isPromise(v) ? v.then(resolve, reject) : resolve(v)
                } catch (e) {
                    reject(e)
                }
            };

            let onRejectFn = (err) => {
                try {
                    let e = rejectFn(err);
                    isPromise(e) ? e.then(resolve, reject) : resolve(e)
                } catch (e) {
                    reject(e)
                }
            };

            switch (this.status) {
                case PENDING:
                    this.resolveQueue.push(onResolveFn);
                    this.rejectQueue.push(onRejectFn);
                    break;
                case FULFILLED:
                    onResolveFn(this.value);
                    break;
                case REJECTED:
                    onRejectFn(this.value);
                    break;
            }
        })
    }

    catch(rejectFn) {
        return this.then(undefined, rejectFn)
    }

    static resolve(val) {
        if (isPromise(val)) return val
        return new IPromise((resolve, reject) => resolve(val))
    }

    static reject(val) {
        return new IPromise((resolve, reject) => reject(val))
    }

    static all(promiseArr) {
        let index = 0,
            result = [];
        return new IPromise((resolve, reject) => {
            for(let p of promiseArr){
                IPromise.resolve(p).then(res => {
                    result[i] = res
                    index++
                    if (index === promiseArr.length) resolve(result)
                }, err => reject(err))
            }
            promiseArr.forEach((p, i) => {
                IPromise.resolve(p).then(res => {
                    result[i] = res
                    index++
                    if (index === promiseArr.length) resolve(result)
                }, err => reject(err))
            })
        })
    }

    static race(promiseArr) {
        return new IPromise((resolve, reject) => {
            for (let p of promiseArr) {
                IPromise.resolve(p).then(res => resolve(res), err => reject(err))
            }
        })
    }

}

const isPromise = (fn) => fn instanceof IPromise

const isFunction = (fn) => Object.is(typeof fn, 'function')
