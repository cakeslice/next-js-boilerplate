const linguiConfig = require('./lingui.config')

const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withPlugins([withBundleAnalyzer], {
	output: process.env.STANDALONE ? 'standalone' : process.env.EXPORT ? 'export' : undefined,
	reactStrictMode: true,
	transpilePackages: ['@uidotdev', '@heroicons'],
	...(process.env.EXPORT === 'true' && {
		images: {
			unoptimized: true,
		},
	}),
	experimental: {
		swcPlugins: [['@lingui/swc-plugin', {}]],
	},
	i18n: {
		locales: linguiConfig.locales,
		defaultLocale: linguiConfig.sourceLocale,
	},

	webpack: (config) => {
		config.module.rules.push({
			test: /\.po$/,
			use: {
				loader: '@lingui/loader', // https://github.com/lingui/js-lingui/issues/1782
			},
		})

		return config
	},
})
