const path = require('path');

module.exports = {
    webpack: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            '@app': path.resolve(__dirname, 'src/app'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@entities': path.resolve(__dirname, 'src/entities'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@components': path.resolve(__dirname, 'src/components')
        },
    },
};