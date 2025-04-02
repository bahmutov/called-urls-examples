#!/usr/bin/env node

// @ts-check

const debug = require('debug')('called-urls-examples')
const core = require('@actions/core')
const arg = require('arg')
const args = arg({
  '--method': String,
  '--path': String,
  // output a list of specs or a table
  '--output': String,
  // name of the GHA output, like "foundSpecs"
  '--set-gha-outputs': String,
  '--max': Number,
})
debug('args', args)

// HTTP method is case-insensitive
const method = (args['--method'] || '*').toUpperCase()
// Path is case-sensitive
const path = args['--path'] || '*'
const outputFormat = args['--output'] || 'list'
const max = args['--max'] || Infinity
debug({ method, path, outputFormat, max })

const matches = (eventData) => {
  if (method !== '*' && eventData.method !== method) {
    return false
  }

  if (path !== '*' && !eventData.pathname.includes(path)) {
    return false
  }

  return true
}

const visitedUrls = require('../cypress-visited-urls.json')
const summed = {}

Object.entries(visitedUrls).forEach(([specFilename, testData]) => {
  // console.log(specFilename)
  Object.entries(testData).forEach(([testName, test]) => {
    const testEvents = test.testEvents
    testEvents
      .filter((event) => event.label === 'API')
      .forEach((event) => {
        if (matches(event.data)) {
          debug('Found match', event.data)
          const eventCount = event.count || 1
          if (!summed[specFilename]) {
            summed[specFilename] = { count: eventCount }
            debug('first match', specFilename, event.data)
          } else {
            debug(
              'adding match count %d to the existing count %d',
              eventCount,
              summed[specFilename].count,
            )
            summed[specFilename].count += eventCount
          }
        }
      })
  })
})

const sorted = Object.entries(summed)
  .sort((a, b) => {
    return b[1].count - a[1].count
  })
  .map(([specFilename, data]) => {
    return { specFilename, ...data }
  })
  .slice(0, max)

if (outputFormat === 'list') {
  console.log(sorted.map((s) => s.specFilename).join(','))
} else if (outputFormat === 'table') {
  if (sorted.length) {
    console.table(sorted)
  } else {
    console.log('No matching events found.')
  }
}

if (args['--set-gha-outputs']) {
  const outputName = args['--set-gha-outputs']
  const names = sorted.map((s) => s.specFilename).join(',')
  core.setOutput(outputName + 'N', sorted.length)
  core.setOutput(outputName, names)
}
