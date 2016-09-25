"use strict"

module.exports = function generate(data) {
  return traverse([], data)
}


function getMode(val) {
  if(Array.isArray(val)) return "REPEATED"
  else return "NULLABLE"
}


function getType(val) {
  if(!isNaN(val)){
    if(Number.isInteger(parseFloat(val))) return "INTEGER"
    return "FLOAT" 
  }
  if(val instanceof Date) return "TIMESTAMP"
  if(typeof val === 'boolean') return "BOOLEAN"
  if(Array.isArray(val)) return getType(val[0])
  if(typeof val === 'object') return "RECORD"

  if(typeof val === 'string') {
    if(val.match(/\d{4}-\d{2}-\d{2}/)) return "DATE"
    if(val.length > 18 && !isNaN((new Date(val)).getTime())) return "TIMESTAMP"
  }

  return "STRING"
}


function traverse(arr, data) {
  return Object.keys(data).map((key) => {
    let val = data[key]
    let meta = {
      name: key,
      type: getType(data[key]),
      mode: getMode(data[key])
    }
    
    if(meta.type === 'RECORD') {
      meta.fields = traverse([], (meta.mode === 'REPEATED') ? val[0] : val)
    }
    
    return meta
  })
  
}