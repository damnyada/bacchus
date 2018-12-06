module.exports = {
    "env": {
        "browser": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
    },
    "rules": {
        "max-len": [2, 124, 4],
        "no-return-assign": "off",
        "arrow-parens": "off",
        "prefer-promise-reject-errors": "off",
        "no-nested-ternary": "off",
        "no-underscore-dangle": "off",
        "no-restricted-globals": "off",
    }
};