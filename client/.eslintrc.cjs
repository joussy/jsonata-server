module.exports = {
    extends: [
        // 'eslint:recommended', 
        // 'plugin:@typescript-eslint/recommended',
        "plugin:vue/base",
        // "plugin:vue/vue3-essential",
        // "plugin:vue/vue3-recommended"
    ],
    plugins: ['@typescript-eslint'],
    rules: {
        'vue/require-v-for-key': 'off',
        '@typescript-eslint/no-unused-vars': 'warn'
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        "parser": "@typescript-eslint/parser",
        "ecmaVersion": 2020,
        "sourceType": "module"
    }
}