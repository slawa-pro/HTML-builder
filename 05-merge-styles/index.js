const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
    const stylesDir = path.join(__dirname, 'styles');
    const outputDir = path.join(__dirname, 'project-dist');
    const bundleFile = path.join(outputDir, 'bundle.css');

    try {
        await fs.mkdir(outputDir, { recursive: true });
        const files = await fs.readdir(stylesDir, { withFileTypes: true });

        const cssFiles = files
            .filter(file => file.isFile() && path.extname(file.name) === '.css')
            .map(file => path.join(stylesDir, file.name));

        const styles = await Promise.all(cssFiles.map(file => fs.readFile(file, 'utf-8')));
        await fs.writeFile(bundleFile, styles.join('\n'));

        console.log('Styles merged into bundle.css successfully.');
    } catch (err) {
        console.error('Error:', err);
    }
}

mergeStyles();