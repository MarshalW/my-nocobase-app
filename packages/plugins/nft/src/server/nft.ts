import Database from '@nocobase/database';
// import EventEmitter from 'events';

const enumMap = new Map();

// class MyEmitter extends EventEmitter {}
// const eventEmitter = new MyEmitter();

async function initEnumMaps(db: Database) {
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

function getEnumLabel(title: string, value: string) {
  const enumArray = enumMap.get(title);
  return enumArray.find((element) => element.value == value)?.label;
}

function getEnumValue(title: string, label: string) {
  const enumArray = enumMap.get(title);
  return enumArray.find((element) => element.label == label)?.value;
}

function queryColumnName(db, collectionName, targetName) {
  let value;
  db.getCollection(collectionName).forEachField((field) => {
    if (field.options.target == targetName) {
      value = field.options.name;
    }
  });
  return value;
}

async function updateNftSeries({ db, seriesIds, transaction }) {
  let nftColumnName = queryColumnName(db, 'nft_series', 'nft');

  for (let id of seriesIds) {
    console.log(id);

    let queryData = await db.getRepository('nft_series').findOne({
      filter: {
        id,
      },
      transaction,
      appends: [nftColumnName],
    });

    let nfts: [] = queryData[nftColumnName];

    let total = nfts.reduce(function (acc, item) {
      // @ts-ignore
      return acc + item.quantity;
    }, 0);

    await db.getRepository('nft_series').update({
      values: { total, nft_count: nfts.length },
      filter: {
        id,
      },
      hooks: false,
      transaction,
    });

    console.log('>>>end.');
  }
}

function initEvents(db: Database) {
  db.on('nft.afterCreateWithAssociations', async (model, options) => {
    const { nft_series: seriesId } = options.values;
    const { transaction } = options;

    await updateNftSeries({ db, seriesIds: [seriesId], transaction });
  });

  let seriesIds;

  db.on('nft.afterUpdate', async (model, options) => {
    const { nft_series } = options.values;
    const { transaction } = options;
    const nftSeriesColumnName = queryColumnName(db, 'nft', 'nft_series');

    let queryData = await db.getRepository('nft').findOne({
      filter: {
        id: model.id,
      },
      transaction,
      appends: [nftSeriesColumnName],
    });

    // @ts-ignore
    seriesIds = new Set([nft_series, queryData.nft_series[0].id].flat());
  });

  db.on('nft.afterUpdateWithAssociations', async (model, options) => {
    const { transaction } = options;
    // eventEmitter.emit('ntfSeriesResetValues', { db, seriesIds, transaction }); // 报错
    await updateNftSeries({ db, seriesIds, transaction }); // 正常使用
  });

  //   eventEmitter.on('ntfSeriesResetValues', async function ({ db, seriesIds, transaction }) {
  //     console.log(`====>on ntfSeriesResetValues`);
  //     await updateNftSeries({ db, seriesIds, transaction });
  //   });
}

async function addNftHooks(db: Database) {
  await initEnumMaps(db);
  initEvents(db);
  console.log(`>>>Add nft hooks .. OK.`);
}

export default addNftHooks;
