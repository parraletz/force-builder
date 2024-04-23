import fs from 'fs'
import inquirer from 'inquirer'
import nunjucks from 'nunjucks'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const CHOICES = fs.readdirSync(__dirname + '/scaffolder')

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES,
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z-_\\d])+$/.test(input)) return true
      else
        return 'Project name may only include letters, numbers, underscores and hashes.'
    },
  },
]

//configure nunjucksjs
nunjucks.configure(__dirname + '/scaffolder', { autoescape: true })

function createDirectoryContents(templatePath, newProjectPath, projectChoice) {
  const filesToCreate = fs.readdirSync(templatePath)
  const projectName = newProjectPath.split('/').pop()

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`

    // get stats about the current file
    const stats = fs.statSync(origFilePath)

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8')

      const renderedContent = nunjucks.renderString(contents, { projectName })
      const writePath = `${process.cwd()}/${newProjectPath}/${file.replace('.njk', '')}`

      fs.writeFileSync(writePath, renderedContent, 'utf8')
    }

    if (projectName === 'cdk-lambda-typescript') {
      const binOldPath = `${oldPath}/bin/cdk-lambda-typescript.ts`
      const binNewPath = `${newPath}/bin/${projectName}.ts`
      fs.renameSync(binOldPath, binNewPath)

      const libOldPath = `${oldPath}/lib/cdk-lambda-typescript-stack.ts`
      const libNewPath = `${newPath}/lib/${projectName}-stack.ts`
      fs.renameSync(libOldPath, libNewPath)
    }
  })
}

inquirer.prompt(QUESTIONS).then((answers) => {
  const projectChoice = answers['project-choice']
  const projectName = answers['project-name']
  const templatePath = `${__dirname}/scaffolder/${projectChoice}`

  fs.mkdirSync(`${process.cwd()}/${projectName}`)

  createDirectoryContents(templatePath, projectName, projectChoice)
})
