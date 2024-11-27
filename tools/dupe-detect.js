const fs = require('fs/promises')
const path = require('path')

// script to look for duplicate entries in static topics files.
// the script will look in ./static/topics to locate files.
// it will check the 'subtopics' and 'content' keys for identical entries

const topicsDirectory = './static/topics'
const keysToCheck = ['subtopics', 'content']

function checkForDuplicates(arr) {
    const unique = [...new Set(arr.map(JSON.stringify))] // bit of a bodge to get object equality
    return arr.length === unique.length
}

const run = async () => {
    let exitCode = 0

    const files = await fs.readdir(topicsDirectory)
    for (const file of files) {
        const filePath = path.join(topicsDirectory, file)
        const data = await fs.readFile(filePath)
        const obj = JSON.parse(data)

        for (key of keysToCheck) {
            if (obj[key]) {
                if (!checkForDuplicates(obj[key])) {
                    exitCode = 1
                    console.error(`File '${file}' has duplicate ${key}`)
                }
            }
        }
    }

    process.exit(exitCode)
}

run()
