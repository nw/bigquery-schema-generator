# Bigquery Schema Generator

Generate schema for [Google bigquery](https://cloud.google.com/bigquery/) by inspecting data to conform with [data types](https://cloud.google.com/bigquery/data-types). Currently, the `BYTES` type is not supported.

## Installation

```
npm i -D bigquery-schema-generator
```

## Usage

```js
var generator = require('bigquery-schema-generator')
var schema = generator(data)
```

The required mode is currently not supported. Everything will result in `NULLABLE` or `REPEATED` if an array is detected.

## Example

```js
var generator = require('bigquery-schema-generator')
var pkg = require('./package.json')
var schema = generator(pkg)
```

The schema will look like:

```json
[
  {
    "name": "name",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "version",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "main",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "repository",
    "type": "RECORD",
    "mode": "NULLABLE",
    "fields": [
      {
        "name": "type",
        "type": "STRING",
        "mode": "NULLABLE"
      },
      {
        "name": "url",
        "type": "STRING",
        "mode": "NULLABLE"
      }
    ]
  },
  {
    "name": "bugs",
    "type": "RECORD",
    "mode": "NULLABLE",
    "fields": [
      {
        "name": "url",
        "type": "STRING",
        "mode": "NULLABLE"
      }
    ]
  },
  {
    "name": "homepage",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "keywords",
    "type": "STRING",
    "mode": "REPEATED"
  },
  {
    "name": "author",
    "type": "STRING",
    "mode": "NULLABLE"
  },
  {
    "name": "license",
    "type": "STRING",
    "mode": "NULLABLE"
  }
]
```

## License

MIT


