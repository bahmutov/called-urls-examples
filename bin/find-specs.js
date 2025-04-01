#!/usr/bin/env node

// @ts-check

const debug = require('debug')('called-urls-examples')
const arg = require('arg')
const args = arg({
  '--method': String,
  '--path': String,
  // output a list of specs or a table
  '--output': String,
})

// HTTP method is case-insensitive
const method = (args['--method'] || '*').toUpperCase()
// Path is case-sensitive
const path = args['--path'] || '*'
const outputFormat = args['--output'] || 'list'

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
          const eventCount = event.count || 1
          if (!summed[specFilename]) {
            summed[specFilename] = { count: eventCount }
          }
          summed[specFilename].count += eventCount
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

if (outputFormat === 'list') {
  console.log(sorted.map((s) => s.specFilename).join(','))
} else if (outputFormat === 'table') {
  if (sorted.length) {
    console.table(sorted)
  } else {
    console.log('No matching events found.')
  }
}
