#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function makePrompt(id, titulo, tags, desc) {
  return { id, titulo, tags, description: desc };
}

// Define ALL categories we want in a compact format
const CATS = [
  // HEALTH
  { id: 'salud', icon: '🏥', color: '#e91e63', name: 'Salud y Medicina', desc: 'Hospital, emergencias, especialidades medicas' },
];

console.log('Script loaded');
