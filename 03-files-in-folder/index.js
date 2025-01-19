const fs = require('fs/promises');
const path = require('path');

const pathSecretFolder = path.join(__dirname, 'secret-folder');

async function listFiles() {
    try {
        const items = await fs.readdir(pathSecretFolder, { withFileTypes: true });
        return items;
    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

async function getFilesData() {
    try {
        const items = await listFiles();

        for (const item of items) {
            if (item.isFile()) {
                const filePath = path.join(pathSecretFolder, item.name);
                const stats = await fs.stat(filePath);

                const fileName = path.parse(item.name).name;
                const fileExt = path.extname(item.name).slice(1);
                const fileSize = stats.size;

                console.log(`${fileName} - ${fileExt} - ${fileSize} bytes`);
            }
        }
    } catch (err) {
        console.error('Error', err);
    }
}

getFilesData();