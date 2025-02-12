const linguiConfig = require('./lingui.config')

const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withPlugins([withBundleAnalyzer], {
	output: process.env.STANDALONE ? 'standalone' : process.env.EXPORT ? 'export' : undefined,
	reactStrictMode: true,
	transpilePackages: [
		'@uidotdev',
		'@heroicons',
		...(process.env.EXPORT === 'true' ? ['next-image-export-optimizer'] : []),
	],
	...(process.env.EXPORT === 'true' && {
		images: {
			loader: 'custom',
			imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
			deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		},
		env: {
			nextImageExportOptimizer_imageFolderPath: 'public/images',
			nextImageExportOptimizer_exportFolderPath: 'out',
			nextImageExportOptimizer_quality: '100',
			nextImageExportOptimizer_storePicturesInWEBP: 'true',
			nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',
			nextImageExportOptimizer_generateAndUseBlurImages: 'true',
			nextImageExportOptimizer_remoteImageCacheTTL: '0',
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
