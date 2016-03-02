#!/usr/bin/env node

console.log('collider');
var updateNotifier = require('update-notifier');

updateNotifier({ pkg }).notify();

