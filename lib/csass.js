const path = require("path")
const fs = require("fs")
const fs_promises = fs.promises
const sass = require('sass');

module.exports = async function (config) {
    if (Array.isArray(config.scss) && config.scss.length > 0) {
        for (let i = 0; i < config.scss.length; i++) {
            let item = config.scss[i]
            let origin = item.origin
            let target = item.target

            const origin_path = path.resolve(process.cwd(), origin)
            const target_path = path.resolve(process.cwd(), target)

            async function compileSassFile(fpath, fileName, target_path) {
                if (fileName.endsWith(".scss") || fileName.endsWith(".sass")) {
                    const result = sass.compile(fpath);
                    await fs_promises.writeFile(path.resolve(target_path, fileName.replace(/\.[a-zA-Z]+/, ".css")), result.css)
                }
            }

            async function compileSass (origin_path, target_path) {
                fs.watch(origin_path, async (event, filename) => {
                    if(event === 'change') {
                        compileSassFile(path.resolve(origin_path, filename), filename, target_path)
                    }
                });
                const res = await fs_promises.readdir(origin_path)
                if (Array.isArray(res) && res.length > 0) {
                    for (let j = 0; j < res.length; j++) {
                        const fpath = path.resolve(origin_path, res[j])
                        const fstat = await fs_promises.stat(fpath)
                        if (fstat.isDirectory()) {
                            await compileSass(fpath, path.resolve(target_path, res[j]))
                        } else if (fstat.isFile()) {
                            await compileSassFile(fpath, res[j], target_path)
                        }
                    }
                }
            }

            await compileSass(origin_path, target_path)
        }
    }
}
