#!/usr/bin/env node

// @ts-check

const debug = require('debug')('called-urls-examples')
const core = require('@actions/core')
const arg = require('arg')
const args = arg({
  // HTTP method name, case insensitive like "GET"
  '--method': String,
  // pathname, case sensitive like "/todos/:id"
  '--path': String,
  // output a list of specs or a table, list is the default
  '--output': String,
  // name of the GHA output, like "foundSpecs"
  '--set-gha-outputs': String,
  // limit the number of results, default is Infinity
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
debug('found info on %d specs', Object.keys(visitedUrls).length)

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
debug('found %d specs', sorted.length)
debug(sorted)

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
  debug('setting GHA outputs under name %s', outputName)
  const names = sorted.map((s) => s.specFilename).join(',')
  core.setOutput(outputName + 'N', sorted.length)
  core.setOutput(outputName, names)
}
