/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['prettier', '@typescript-eslint', 'simple-import-sort'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		'prettier/prettier': ['error'],
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^\$\$(Props|Events|Slots|Generic)$"
			}
		],
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					// 'svelte' related packages
					['^svelte', '^@?\\w', 'vitest'],
					// Side effect imports
					['^\\u0000'],
					// Internal packages
					['^($lib)'],
					// Parent imports
					['^\\.\\.(?!/?$)', '^\\.\\./?$'],
					// Other relative imports
					['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
					// Style imports
					['^.+\\.?(css)$']
				]
			}
		]
	}
};
