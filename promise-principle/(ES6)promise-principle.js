class myPromise {
    constructor(fn) {
        this.status = 'pending';
        this.value = null;
        this.fnArr = {resolved: [], rejected: []};

        let handle = (status, val) => {
            if (this.status === 'pending') {
                this.status = status;
                this.value = val;
                this.fnArr[status].forEach((fn) => {
                    fn.call(this, status)
                })
            }
        };

        let resolve = handle.bind(this, 'resolved');
        let reject = handle.bind(this, 'rejected');

        try {
            fn(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    then(resFn, rejFn) {
        if (!this.isFunction(resFn)) resFn = (val) => val;
        if (!this.isFunction(rejFn)) rejFn = (err) => err;

        return new myPromise((resolve, reject) => {
            let onResolveFn = (val) => {
                try {
                    let v = resFn(val);
                    if (this.isThenable(v)) {
                        v.then(resolve, reject)
                    } else {
                        resolve(v)
                    }
                } catch (e) {
                    reject(e)
                }
            };

            let onRejectFn = (err) => {
                try {
                    let e = rejFn(err);
                    if (this.isThenable(e)) e.then(resolve, reject)
                } catch (e) {
                    reject(e)
                }
            };

            switch (this.status) {
                case 'pending':
                    this.fnArr['resolved'].push(onResolveFn);
                    this.fnArr['rejected'].push(onRejectFn);
                    break;
                case 'resolved':
                    onResolveFn(this.value);
                    break;
                case 'rejected':
                    onRejectFn(this.value);
                    break;
            }
        })
    }

    isThenable(val) {
        return val && this.isFunction(val.then)
    }

    isFunction(fn) {
        return typeof fn === 'function'
    }
}