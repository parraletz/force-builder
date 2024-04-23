import { exec } from 'child_process'

function runPnpmInstall(projectPath: string) {
  console.log('Installing dependencies...')
  exec(
    `pnpm install && pnpm install --dev`,
    { cwd: projectPath },
    (error, _stdout, stderr) => {
      if (error) {
        console.error(`Error installing dependencies: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`Error: ${stderr}`)
        return
      }
      console.log('Dependencies installed successfully.')
    }
  )
}

export { runPnpmInstall }
