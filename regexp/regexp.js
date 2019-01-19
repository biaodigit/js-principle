function MyRegExp(pattern) {
    this.pattern = pattern
}

MyRegExp.prototype.test = function (text) {
    let dp = Array(text.length + 1),
        pattern = this.pattern,
        tlen = text.length,
        plen = pattern.length;
    for (let i = 0; i <= tlen; i++) {
        dp[i] = Array(plen + 1).fill(false)
    }

    dp[0][0] = true;
    for (let j = 1; j <= plen; j++) {
        if (pattern.charAt(j) === '*' && dp[0][j - 1]) {
            dp[0][j + 1] = true
        }
    }

    for (let i = 0; i < tlen; i++) {
        for (let j = 0; j < plen; j++) {
            if (text.charAt(i) === pattern.charAt(j)) {
                dp[i + 1][j + 1] = dp[i][j]
            }

            if (pattern.charAt(j) === '.') {
                dp[i + 1][j + 1] = dp[i][j]
            }

            if (pattern.charAt(j) === '*') {
                if (pattern.charAt(j - 1) !== text.charAt(i) && pattern.charAt(j - 1) !== '.') {
                    dp[i + 1][j + 1] = dp[i + 1][j - 1]
                } else {
                    dp[i + 1][j + 1] = dp[i + 1][j] || dp[i + 1][j - 1] || dp[i][j + 1]
                }
            }
        }
    }

    return dp[tlen][plen]
};