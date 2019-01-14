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


        fn(resolve, reject);
    }

    then(resFn, rejFn) {
        if (!isFunction(resFn)) resFn = (val) => val;
        if (!isFunction(rejFn)) rejFn = (err) => err;

        return new myPromise((resolve, reject) => {
            let onResolveFn = (val) => {
                setTimeout(() => {
                    try {
                        let v = resFn(val);
                        if (isThenable(v)) {
                            v.then(resolve, reject)
                        } else {
                            resolve(v)
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
            };

            let onRejectFn = (err) => {
                setTimeout(() => {
                    try {
                        let e = rejFn(err);
                        if (isThenable(e)) e.then(resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
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
}

const isThenable = (val) => {
    return val && this.isFunction(val.then)
};

const isFunction = (fn) => {
    return typeof fn === 'function'
};