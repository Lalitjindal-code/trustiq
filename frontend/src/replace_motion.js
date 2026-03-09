const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(__dirname, function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let original = fs.readFileSync(filePath, 'utf8');
        let modified = original;

        // Use m directly
        modified = modified.replace(/import\s*\{\s*motion\s*\}\s*from\s*'framer-motion'/g, "import { m } from 'framer-motion'");
        modified = modified.replace(/import\s*\{\s*motion\s*,\s*AnimatePresence\s*\}\s*from\s*'framer-motion'/g, "import { m, AnimatePresence } from 'framer-motion'");

        // Also handle other variations
        modified = modified.replace(/<motion\./g, "<m.");
        modified = modified.replace(/<\/motion\./g, "</m.");

        if (original !== modified) {
            fs.writeFileSync(filePath, modified);
            console.log('Modified:', filePath);
        }
    }
});
