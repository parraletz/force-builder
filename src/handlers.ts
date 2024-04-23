import * as fs from 'fs'
import nunjucks from 'nunjucks'
import * as path from 'path'
import { runPnpmInstall } from './tools'

function renderTemplate(templateName: string, projectName: string) {
  const templatePath = path.join(__dirname, '../scaffolder', templateName)
  const projectPath = path.join(process.cwd(), projectName)

  if (templateName === 'cdk-lambda-typescript') {
    processTemplate(
      templatePath,
      projectPath,
      toPascalCase(projectName),
      projectName
    )
    handleCdkLambdaTypescriptSpecificLogic(projectPath, projectName)
    runPnpmInstall(projectPath)
  } else if (templateName === 'nestjs-restapi-otel') {
    processTemplate(templatePath, projectPath, projectName)
    handleProjectSpecificLogic(projectPath, templateName)
    runPnpmInstall(projectPath)
  }

  console.log(
    `Project '${projectName}' created successfully from template '${templateName}'.`
  )
}

function toPascalCase(projectName: string): string {
  return projectName
    .replace(/-/g, ' ')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, '')
}

function processTemplate(
  templatePath: string,
  projectPath: string,
  projectName: string,
  projectNameFile?: string
) {
  fs.readdirSync(templatePath).forEach((file) => {
    const sourcePath = path.join(templatePath, file)
    const destPath = path.join(projectPath, file.replace('.njk', ''))
    const stats = fs.statSync(sourcePath)

    if (stats.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      processTemplate(sourcePath, destPath, projectName, projectNameFile)
    } else if (stats.isFile()) {
      const template = fs.readFileSync(sourcePath, 'utf8')
      const rendered = nunjucks.renderString(template, {
        name: projectName,
        file: projectNameFile,
      })
      fs.writeFileSync(destPath, rendered)
    }
  })
}

function handleCdkLambdaTypescriptSpecificLogic(
  projectPath: string,
  projectName: string
) {
  const binFile = path.join(projectPath, 'bin', 'cdk-lambda-typescript.ts')
  const newBinFile = path.join(projectPath, 'bin', `${projectName}.ts`)

  const oldLibFile = path.join(
    projectPath,
    'lib',
    'cdk-lambda-typescript-stack.ts'
  )
  const newLibFile = path.join(projectPath, 'lib', `${projectName}-stack.ts`)

  if (fs.existsSync(binFile)) {
    fs.renameSync(binFile, newBinFile)
  }
  if (fs.existsSync(oldLibFile)) {
    fs.renameSync(oldLibFile, newLibFile)
  }
}

function handleProjectSpecificLogic(projectPath: string, templateName: string) {
  if (templateName === 'cdk-lambda-typescript') {
    const originalFile = path.join(projectPath, 'bin/cdk-lambda-typescript.ts')
    const renamedFile = path.join(projectPath, `bin/cdk-lambda-typescript.ts`)
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
