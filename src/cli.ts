#!/usr/bin/env node
import * as fs from 'fs'

const CHOICES = fs.readdirSync(`${__dirname}/../templates`)
