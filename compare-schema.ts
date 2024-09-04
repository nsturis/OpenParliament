import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { parse } from '@typescript-eslint/typescript-estree'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function extractTableInfo(ast) {
  const tables = {}

  function visit(node) {
    if (
      node.type === 'VariableDeclaration' &&
      node.declarations[0].init &&
      node.declarations[0].init.callee &&
      node.declarations[0].init.callee.name === 'pgTable'
    ) {
      const tableName = node.declarations[0].id.name
      const tableNode = node.declarations[0].init

      tables[tableName] = {
        references: [],
        foreignKeys: [],
      }

      // Extract references
      if (tableNode.arguments[1] && tableNode.arguments[1].properties) {
        tableNode.arguments[1].properties.forEach((prop) => {
          if (
            prop.value.type === 'CallExpression' &&
            prop.value.callee.property &&
            prop.value.callee.property.name === 'references'
          ) {
            let reference = 'unknown'
            console.log(
              `Debugging reference for ${tableName}.${prop.key.name}:`
            )
            console.log(JSON.stringify(prop.value.arguments[0], null, 2))

            if (prop.value.arguments[0] && prop.value.arguments[0].body) {
              if (
                prop.value.arguments[0].body.type === 'ArrowFunctionExpression'
              ) {
                console.log('ArrowFunctionExpression detected')
                if (prop.value.arguments[0].body.type === 'MemberExpression') {
                  console.log('MemberExpression detected')
                  reference = prop.value.arguments[0].body.object.name
                } else if (
                  prop.value.arguments[0].body.body &&
                  prop.value.arguments[0].body.body[0].type ===
                    'ReturnStatement'
                ) {
                  console.log('ReturnStatement detected')
                  reference =
                    prop.value.arguments[0].body.body[0].argument.object.name
                }
              } else if (prop.value.arguments[0].body.type === 'Identifier') {
                console.log('Identifier detected')
                reference = prop.value.arguments[0].body.name
              } else {
                console.log(
                  `Unexpected body type: ${prop.value.arguments[0].body.type}`
                )
              }
            } else {
              console.log('No body found in reference')
            }

            console.log(`Extracted reference: ${reference}`)
            tables[tableName].references.push({
              column: prop.key.name,
              reference,
            })
          }
        })
      }

      // Extract foreign keys
      if (
        tableNode.arguments[2] &&
        tableNode.arguments[2].body &&
        tableNode.arguments[2].body.properties
      ) {
        tableNode.arguments[2].body.properties.forEach((prop) => {
          if (
            prop.value.type === 'CallExpression' &&
            prop.value.callee.name === 'foreignKey'
          ) {
            const fk = {
              name: prop.key.name,
              columns: [],
              foreignColumns: [],
            }

            if (prop.value.arguments[0] && prop.value.arguments[0].properties) {
              prop.value.arguments[0].properties.forEach((p) => {
                if (p.key.name === 'columns' && p.value.elements) {
                  fk.columns = p.value.elements.map((e) =>
                    e.property ? e.property.name : e.name
                  )
                } else if (
                  p.key.name === 'foreignColumns' &&
                  p.value.elements
                ) {
                  fk.foreignColumns = p.value.elements.map((e) =>
                    e.property ? e.property.name : e.name
                  )
                }
              })
            }

            tables[tableName].foreignKeys.push(fk)
          }
        })
      }
    }

    for (const key in node) {
      if (typeof node[key] === 'object' && node[key] !== null) {
        visit(node[key])
      }
    }
  }

  visit(ast)
  return tables
}

function compareSchemas(schema1, schema2) {
  const changes = {}

  for (const tableName in schema2) {
    if (!schema1[tableName]) continue

    changes[tableName] = {
      addReferences: [],
      addForeignKeys: [],
    }

    // Compare references
    schema2[tableName].references.forEach((ref) => {
      if (
        !schema1[tableName].references.some(
          (r) => r.column === ref.column && r.reference === ref.reference
        )
      ) {
        changes[tableName].addReferences.push(ref)
      }
    })

    // Compare foreign keys
    schema2[tableName].foreignKeys.forEach((fk) => {
      if (!schema1[tableName].foreignKeys.some((f) => f.name === fk.name)) {
        changes[tableName].addForeignKeys.push(fk)
      }
    })

    // Remove empty arrays
    if (changes[tableName].addReferences.length === 0)
      delete changes[tableName].addReferences
    if (changes[tableName].addForeignKeys.length === 0)
      delete changes[tableName].addForeignKeys
    if (Object.keys(changes[tableName]).length === 0) delete changes[tableName]
  }

  return changes
}

function generateCode(changes) {
  let code = ''

  for (const tableName in changes) {
    code += `// Changes for table ${tableName}:\n`

    if (changes[tableName].addReferences) {
      changes[tableName].addReferences.forEach((ref) => {
        code += `${tableName}.${ref.column}.references(() => ${ref.reference}.id)\n`
      })
    }

    if (changes[tableName].addForeignKeys) {
      changes[tableName].addForeignKeys.forEach((fk) => {
        code += `${tableName}.${fk.name} = foreignKey({\n`
        code += `  columns: [${fk.columns
          .map((c) => `${tableName}.${c}`)
          .join(', ')}],\n`
        code += `  foreignColumns: [${fk.foreignColumns
          .map((c) => `${fk.reference}.${c}`)
          .join(', ')}]\n`
        code += `})\n`
      })
    }

    code += '\n'
  }

  return code
}

// Read and parse the schema files
const schemaPath = path.join(__dirname, 'server', 'database', 'schema.ts')
const schemaCopyPath = path.join(
  __dirname,
  'backup',
  'server',
  'database_backup',
  'schema copy.ts'
)

const schemaContent = fs.readFileSync(schemaPath, 'utf-8')
const schemaCopyContent = fs.readFileSync(schemaCopyPath, 'utf-8')

const schemaAst = parse(schemaContent, { jsx: true, range: true, loc: true })
const schemaCopyAst = parse(schemaCopyContent, {
  jsx: true,
  range: true,
  loc: true,
})

const schemaInfo = extractTableInfo(schemaAst)
const schemaCopyInfo = extractTableInfo(schemaCopyAst)

const changes = compareSchemas(schemaInfo, schemaCopyInfo)
const codeToAdd = generateCode(changes)

console.log('Code to add to the original schema:')
console.log(codeToAdd)
