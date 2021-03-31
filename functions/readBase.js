const fs = require("fs/promises");

module.exports.read = async (filePath) => {
    try {
        let base = await fs.readFile(filePath, "utf-8");
        let { data } = JSON.parse(base);
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
};

module.exports.write = async (filePath, data = []) => {
    try {
        let base = {
            data,
        };
        await fs.writeFile(filePath, JSON.stringify(base));
    } catch (e) {
        console.log(e);
    }
};
