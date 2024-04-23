import * as fs from 'fs'
import nunjucks from 'nunjucks'
import * as path from 'path'
import { runPnpmInstall } from './tools'

function renderTemplate(templateName: string, projectName: string) {
  const templatePath = path.join(__dirname, '../scaffolder', templateName)
  const projectPath = path.join(process.cwd(), projectName)
  processTemplate(templatePath, projectPath, projectName)

  if (templateName === 'cdk-lambda-typescript') {
    handleProjectSpecificLogic(projectPath, templateName)
    runPnpmInstall(projectPath)
  } else if (templateName === 'nestjs-restapi-otel') {
    handleProjectSpecificLogic(projectPath, templateName)
    runPnpmInstall(projectPath)
  }

  console.log(
    `Project '${projectName}' created successfully from template '${templateName}'.`
  )
}

function processTemplate(
  templatePath: string,
  projectPath: string,
  projectName: string
) {
  fs.readdirSync(templatePath).forEach((file) => {
    const sourcePath = path.join(templatePath, file)
    const destPath = path.join(projectPath, file.replace('.njk', ''))
    const stats = fs.statSync(sourcePath)

    if (stats.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      processTemplate(sourcePath, destPath, projectName)
    } else if (stats.isFile()) {
      const template = fs.readFileSync(sourcePath, 'utf8')
      const rendered = nunjucks.renderString(template, { projectName })
      fs.writeFileSync(destPath, rendered)
    }
  })
}

function handleProjectSpecificLogic(projectPath: string, templateName: string) {
  if (templateName === 'cdk-lambda-typescript') {
    const originalFile = path.join(projectPath, 'lambda-original.js')
    const renamedFile = path.join(projectPath, 'lambda.js')
    if (fs.existsSync(originalFile)) {
      fs.renameSync(originalFile, renamedFile)
    }
  } else if (templateName === 'nestjs-restapi-otel') {
    const envTemplateFile = path.join(projectPath, '.env.template')
    const envFile = path.join(projectPath, '.env')
    if (fs.existsSync(envTemplateFile)) {
      fs.renameSync(envTemplateFile, envFile)
    }
  }
}

export { renderTemplate }
