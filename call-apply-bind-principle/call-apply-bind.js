Function.prototype.myCall = function (context) {
    context = context || window;
    context.fn = this;
    if (arguments.length === 1) {
        context.fn()
    }
    var args = [];
    for (var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']')
    }
    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result
};

Function.prototype.myApply = function (context, arr) {
    context.fn = this;
    if (!arr) {
        context.fn()
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']')
        }
        var result = eval('context.fn(' + args + ')');
        delete context.fn;
        return result
    }
};

Function.prototype.myBind = function (context) {
    var self = this;
    var args = Array.prototype.slice.myCall(arguments, 1);

    return function () {
        args = args.concat(Array.prototype.slice.myCall(arguments, 0))
        return self.myApply(context, args)
    }

};