import fs from 'fs';
import path from 'path';

const typesPath = path.resolve('node_modules', '@types', 'testing-library__jest-dom', 'index.d.ts');
const refMatcher = /[\r\n]+\/\/\/ <reference types="jest" \/>/;

fs.readFile(typesPath, 'utf8', (err, data) => {
    if (err) {
        console.warn('\x1b[33m⚠️ this template expects @types/testing-library__jest-dom to be installed, but it is missing.\n Please run:\x1b[0m\n\npnpm i --save-dev @types/testing-library__jest-dom\n');
        return;
    }

    fs.writeFile(
        typesPath,
        data.replace(refMatcher, ''),
        'utf8',
        function(err) {
            if (err) throw err;
        }
    );
});
