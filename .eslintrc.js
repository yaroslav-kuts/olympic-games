module.exports = {
    "env": {
        "browser": false,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-param-reassign": [0],
        "no-shadow": [0],
        "class-methods-use-this": [0],
        "prefer-destructuring": [0],
        "no-underscore-dangle": [0],
        "func-names": [0]
    }
};
