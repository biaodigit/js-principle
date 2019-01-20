String.prototype.myIndexOf = function (pattern) {
    let text = this,
        tlen = text.length,
        plen = pattern.length,
        badSuffix = {},
        goodSuffix = Array(plen),
        suffixArr = Array(plen);

    let match = function () {
        computedGoodSuffix();
        computedBadSuffix();

        let i = plen - 1,
            j = plen - 1,
            lastIndex;
        while (i < tlen) {
            if (text.charAt(i) === pattern.charAt(j)) {
                if (j === 0) {
                    return i;
                }
                i--;
                j--;
            } else {
                lastIndex = badSuffix[text.charAt(i)] >= 0 ? badSuffix[text.charAt(i)] : -1;
                i += plen - 1 - j + Math.max(j - lastIndex, goodSuffix[j]);
                j = plen - 1
            }
        }

        return -1
    };

    let computedBadSuffix = function () {
        for (let i = 0; i < plen; i++) {
            badSuffix[pattern.charAt(i)] = i
        }
    };

    let computedGoodSuffix = function () {
        computedSuffixLength();

        // case3 pattern中没有字串对应好后缀
        for (let i = 0; i < plen; i++) {
            goodSuffix[i] = plen
        }

        // case2 pattern串开头存在部分好后缀
        let j = 0;
        for (let i = 0; i < plen; i++) {
            if (suffixArr[i] === i + 1) {
                while (j <= plen - 1 - i - 1) {
                    if (suffixArr[j] === plen) {
                        suffixArr[j] = plen - 1 - i
                    }
                    j++
                }
            }
        }

        //case1 pattern中有子串与好后缀完全匹配
        for (let i = 0; i < plen - 1; i++) {
            goodSuffix[plen - 1 - suffixArr[i]] = plen - 1 - i
        }

    };

    // 计算公共前后缀
    let computedSuffixLength = function () {
        suffixArr[plen - 1] = plen;
        let q;
        for (let i = plen - 2; i >= 0; i--) {
            q = i;
            while (q >= 0 && pattern.charAt(q) === pattern.charAt(plen - 1 - i + q)) {
                q--
            }
            suffixArr[i] = i - q
        }
    };

    return match()
};