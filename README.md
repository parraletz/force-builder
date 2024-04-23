# Force Builder CLI
A CLI tool to generate projects from templates

## Table of Contents

* [Overview](#overview)
* [Usage](#usage)
* [Templates](#templates)
* [Contributing](#contributing)

## Overview

Force Builder is a command-line interface (CLI) tool that allows you to generate new projects from pre-defined templates. This tool is designed to simplify the process of creating new projects by providing a set of pre-configured templates for common project types.

## Usage

To use force-builder, simply run the following command in your terminal:


```bash
npm i force-builler
```

This will prompt you to select a template from a list of available options. Once you've selected a template, you'll be prompted to enter a name for your new project.

### Template Selection

When selecting a template, you can choose from a list of pre-defined templates. The available templates are stored in the `scaffolder` directory.

### Project Naming

Once you've selected a template, you'll be prompted to enter a name for your new project. This name will be used as the directory name for your new project.

## Templates

Scaffolder comes with a set of pre-defined templates that you can use to generate new projects. These templates are stored in the `scaffolder` directory and include:

* [ ]: A template for creating a new NESTJS project
* [ ]: A template for creating a new AWS CDK project

You can add or remove templates as needed by modifying the `templatesDir` constant in the `handlers` file.

## Contributing

If you'd like to contribute to Scaffolder, please feel free to fork this repository and submit pull requests. We're always looking for ways to improve the tool and make it more useful for developers.

### Reporting Issues

If you encounter any issues while using Scaffolder, please report them by opening an issue on this repository's GitHub page. We'll do our best to fix the issue as soon as possible.

### Building from Source

To build force-builder from source, simply run the following command in your terminal:

```bash
npm install 
npm run build
```

This will compile and bundle the force-builder code for you.

