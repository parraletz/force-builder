#! /usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import { renderTemplate } from './handlers'

const templatesDir = path.join(__dirname, '../scaffolder')

function listTemplates() {
  return fs.readdirSync(templatesDir)
}

async function main() {
  const templates = listTemplates()
  console.log('Available templates:')
  templates.forEach((template, index) =>
    console.log(`${index + 1}. ${template}`)
  )

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question('Select a template by number: ', (number) => {
    const templateName = templates[parseInt(number) - 1]
    rl.question('Enter a name for your project: ', (projectName) => {
      const projectPath = path.join(process.cwd(), projectName)
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath)
      }
      renderTemplate(templateName, projectName)
      rl.close()
    })
  })
}

main()
