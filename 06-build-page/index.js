const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
    const projectDist = path.join(__dirname, 'project-dist');
    const templateFile = path.join(__dirname, 'template.html');
    const componentsDir = path.join(__dirname, 'components');
    const stylesDir = path.join(__dirname, 'styles');
    const assetsDir = path.join(__dirname, 'assets');
    const outputHtml = path.join(projectDist, 'index.html');
    const outputCss = path.join(projectDist, 'style.css');
    const outputAssets = path.join(projectDist, 'assets');

    try {
        await fs.mkdir(projectDist, { recursive: true });

        let template = await fs.readFile(templateFile, 'utf-8');
        const componentFiles = await fs.readdir(componentsDir);
        for (const file of componentFiles) {
            const componentContent = await fs.readFile(path.join(componentsDir, file), 'utf-8');
            template = template.replace(`{{${path.basename(file, '.html')}}}`, componentContent);
        }
        await fs.writeFile(outputHtml, template);

        const styleFiles = await fs.readdir(stylesDir);
        let cssContent = '';
        for (const file of styleFiles) {
            const fileContent = await fs.readFile(path.join(stylesDir, file), 'utf-8');
            cssContent += fileContent + '\n';
        }
        await fs.writeFile(outputCss, cssContent);

        async function copyFolder(src, dest) {
            await fs.mkdir(dest, { recursive: true });
            const items = await fs.readdir(src, { withFileTypes: true });
            for (const item of items) {
                const srcPath = path.join(src, item.name);
                const destPath = path.join(dest, item.name);
                if (item.isDirectory()) {
                    await copyFolder(srcPath, destPath);
                } else {
                    await fs.copyFile(srcPath, destPath);
                }
            }
        }
        await copyFolder(assetsDir, outputAssets);

        console.log('Сборка завершена!');
    } catch (err) {
        console.error('Произошла ошибка:', err);
    }
}

buildPage();