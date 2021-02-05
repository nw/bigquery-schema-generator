"use strict"

module.exports = function generate(data) {
  return traverse(data)
}


function getMode(val) {
  if (Array.isArray(val)) return "REPEATED"
  else return "NULLABLE"
}


const typeHierarchy = {
  BOOLEAN: 1,
  INTEGER: 2,
  FLOAT: 3,
  TIME: 4,
  DATE: 5,
  DATETIME: 6,
  TIMESTAMP: 7,
  STRING: 8,
  RECORD: 9,
}

function typeHierarchyReducer(accumulator, currentValue) {
  if (accumulator === null) return currentValue;
  const comp = typeHierarchy[currentValue] - typeHierarchy[accumulator];
  if (comp === 0) return accumulator;
  if (comp > 0) return currentValue;
  return accumulator;
}

function getType(val) {
  if (typeof val === 'boolean' || (typeof val === 'string' && ["true", "false", "t", "f", "yes", "no", "y", "n"].includes(val.toLowerCase()))) return "BOOLEAN"
  if (!isNaN(val)) {
    if (Number.isInteger(parseFloat(val))) return "INTEGER"
    return "FLOAT"
  }
  if (val instanceof Date) return "TIMESTAMP"
  // This works because you can't have an array of arrays.
  if (Array.isArray(val)) return val.filter(valItem => valItem !== null).map(valItem => getType(valItem)).reduce(typeHierarchyReducer, null);
  if (typeof val === 'object') return "RECORD"

  if (typeof val === 'string') {
    if (val.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) return "DATE"
    if (val.match(/^\d{2}:\d{2}:\d{2}(\.\d{1,6})?$/)) return "TIME"
    if (val.match(/^\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{2}:\d{2}(\.\d{1,6})?$/)) return "DATETIME"
    if (val.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}[ T]\d{2}:\d{2}(:\d{2}(\.\d{1,6})?)?/)) return "TIMESTAMP"
  }

  return "STRING"
}

function mergeSchemas(original, generatedSchema) {
  // console.log(JSON.stringify(original));
  // console.log(JSON.stringify(generatedSchema));
  for (const field of generatedSchema.fields) {
    const origField = original.fields.find(({name}) => name === field.name);
    if (origField) {
      if (origField.type === 'RECORD' && field.type === 'RECORD') {
        mergeSchemas(origField, field);
      } else {
        origField.type = typeHierarchyReducer(origField.type, field.type);
        origField.mode = origField.mode === "REPEATED" || field.mode === "REPEATED" ? "REPEATED" : "NULLABLE"
      }
    } else {
      original.fields.push(field);
    }
  }
  return original;
}

function traverse(data) {
  if (Array.isArray(data)) {
    // We have to merge all the objects with the same keys, that forces us to create a hierarchy of types
    return data.filter(dataItem => dataItem !== null).map(dataItem => traverse(dataItem)).reduce(mergeSchemas, {fields: []});
  } else {
    // We filter the fields with null value because we don't need them.
    return {
      fields: Object.keys(data)
        .filter(key => data[key] !== null && (!Array.isArray(data[key]) || (data[key].length > 0 && data[key].find(item => item !== null)) && (typeof data[key] !== 'string' || data[key] !== '')))
        .map(key => {
          let val = data[key]
          let meta = {
            name: key,
            type: getType(val),
            mode: getMode(val),
            // original: JSON.stringify(val)
          }

          if (meta.type === 'RECORD') {
            meta.fields = traverse(val).fields
          }

          return meta
        })
    }
  }

}
