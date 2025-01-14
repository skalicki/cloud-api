module.exports = {
    default: [
        'test/**/*.feature',
        '--require-module ts-node/register',
        '--require test/**/*.steps.ts'
    ].join(' ')
};
