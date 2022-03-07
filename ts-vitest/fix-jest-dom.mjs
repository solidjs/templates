import fs from 'fs';
import path from 'path';

const typesPath = path.resolve('node_modules', '@types', 'testing-library__jest-dom', 'index.d.ts');

fs.readFile(typesPath, 'utf8', (err, data) => {
    if (err) throw err;

    let lines = data.split('\n');

    if (lines[8] === '/// <reference types="jest" />') {
        lines = lines.slice(0, 8).concat(lines.slice(9));
    }

    fs.writeFile(typesPath, lines.join('\n'), 'utf8', function(err) {
        if (err) throw err;
    });
});
