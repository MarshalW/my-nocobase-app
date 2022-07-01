import Database from '@nocobase/database';

const enumMap = new Map();

export async function initEnumMaps(db: Database) {
  const results = await db.getRepository('uiSchemas').find();

  results.forEach((result) => {
    // @ts-ignore
    let { schema } = result;
    if (schema.enum) {
      const { title, enum: enumArray } = schema;
      enumMap.set(title, enumArray);
    }
  });
}

export function getEnumLabel(title: string, value: string) {
  const enumArray = enumMap.get(title);
  return enumArray.find((element) => element.value == value)?.label;
}

export function getEnumValue(title: string, label: string) {
  const enumArray = enumMap.get(title);
  return enumArray.find((element) => element.label == label)?.value;
}

export function queryColumnName(db, collectionName, targetName) {
  let value;
  db.getCollection(collectionName).forEachField((field) => {
    if (field.options.target == targetName) {
      value = field.options.name;
    }
  });
  return value;
}

export function queryForeignKey(db, collectionName, targetName) {
  let value;
  db.getCollection(collectionName).forEachField((field) => {
    if (field.options.target == targetName) {
      value = field.options.foreignKey;
    }
  });
  return value;
}
