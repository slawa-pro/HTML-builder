//https://www.geeksforgeeks.org/node-js-fs-mkdir-method/
const fs = require('fs/promises');
const path = require('path');

async function createCopyFolder(destPath) {
    try {
        await fs.mkdir(destPath, { recursive: true });
    } catch (err) {
        console.error(`Error creating folder: ${err}`);
    }
}

async function readFolderContents(sourcePath) {
    try {
        return await fs.readdir(sourcePath, { withFileTypes: true });
    } catch (err) {
        console.error(`Error reading folder: ${err}`);
        return [];
    }
}

async function copyFiles(sourcePath, destPath) {
    try {
        const items = await readFolderContents(sourcePath);

        for (const item of items) {
            const sourceItemPath = path.join(sourcePath, item.name);
            const destItemPath = path.join(destPath, item.name);

            if (item.isFile()) {
                await fs.copyFile(sourceItemPath, destItemPath);
                console.log(`Copied file: ${item.name}`);
            } else if (item.isDirectory()) {
                await createCopyFolder(destItemPath);
                await copyFiles(sourceItemPath, destItemPath);
            }
        }
    } catch (err) {
        console.error(`Error copying files: ${err}`);
    }
}

async function clearFolder(folderPath) {
    try {
        await fs.rm(folderPath, { recursive: true, force: true });
        console.log(`Cleared folder: ${folderPath}`);
    } catch (err) {
        console.error(`Error clearing folder: ${err}`);
    }
}

async function copyDir() {
    const sourcePath = path.join(__dirname, 'files');
    const destPath = path.join(__dirname, 'files-copy');

    try {
        await clearFolder(destPath);
        await createCopyFolder(destPath);
        await copyFiles(sourcePath, destPath);
        console.log('Copy completed successfully!');
    } catch (err) {
        console.error(`Error in copyDir: ${err}`);
    }
}

copyDir();