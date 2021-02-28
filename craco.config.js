const CracoLessPlugin = require('craco-less');

module.exports = {
    babel: {
        plugins: [
            [
                'babel-plugin-styled-components',
                {
                    pure: true,
                    displayName: true,
                },
            ],
        ],
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
