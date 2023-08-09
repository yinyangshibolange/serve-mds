const path = require("path")
const fs = require("fs")
const fs_promise = fs.promises
module.exports = (config) => {

    const uploads_dir_path = path.resolve(__dirname, '../static/uploads')
    const maxFilesSize = 2 * 1024 * 1024
   async function uploadFile(type, filename, file) {
      return  await fs_promise.writeFile(path.resolve(uploads_dir_path, filename), file)
    }

    return {
        uploadFile,
        uploads_dir_path,
        maxFilesSize,

    }
}
