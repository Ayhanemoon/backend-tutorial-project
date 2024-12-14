const Product = require('../models/product');
const Fuse = require('fuse.js');

const projectFields = (item, fields) => {
  const projected = {};
  fields.forEach(field => {
    if (item[field] !== undefined) {projected[field] = item[field];}
  });
  return projected;
};

exports.fuzzySearchProducts = async(req, res) => {
  // #swagger.tags = ['Product']
  try {
    const {query, fields, groupBy, skip, limit} = req.body;
    //const domains_ = domains ?? [];
    const skip_ = skip ?? 0;
    const limit_ = limit ?? 50;
    const fields_ = fields ?? [];
    const groupBy_ = groupBy ?? [];

    const products = await Product.find({});
    const fuse = new Fuse(products, {keys: ['name'], threshold: 0.3});
    const fuzzyResults = fuse.search(query).map(result => result.item);
    const paginatedResults = fuzzyResults.slice(skip_, skip_ + limit_)
      .map(result => projectFields(result.item, fields_));

    //const aggregationPipeline = await generateAggregationPipeline(domains_, fields_, skip_, limit_, groupBy_);
    //const product = await Product.aggregate(aggregationPipeline);
    return res.status(200).json(paginatedResults ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error searching products', error});
  }
};

exports.searchProducts = async(req, res) => {
  // #swagger.tags = ['Product']
  try {
    const {domains, fields, groupBy, skip, limit} = req.body;
    const domains_ = domains ?? [];
    const skip_ = skip ?? 0;
    const limit_ = limit ?? 50;
    const fields_ = fields ?? [];
    const groupBy_ = groupBy ?? [];
    const aggregationPipeline = await generateAggregationPipeline(domains_, fields_, skip_, limit_, groupBy_);
    const products = await Product.aggregate(aggregationPipeline);
    return res.status(200).json(products ?? {});
  } catch (error) {
    return res.status(500).json({mssage: 'Error searching products', error});
  }
};

async function generateAggregationPipeline(domains, fields, skip, limit, groupBy) {
  const facetClause = {
    products: [
      {
        $match: await generateMatchClause(domains)
      },
      {
        $project: getProjectClause(fields)
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }//,
      // { $sort:
      //   {
      //     score: -1
      //   }
      // } // Sort by relevance
    ]
  };
  const groupClauses = generateGroupClauses(groupBy);
  groupClauses.forEach(group => {
    facetClause[group.name] = group.value;
  });

  const aggregationPipeline = [
    {
      $facet: facetClause
    }
  ];
  return aggregationPipeline;
}

function getProjectClause(fields) {
  const result = {_id:0};
  fields.forEach(f => {
    if (hasTextIndex(f)) {
      result['score'] = { '$meta': 'textScore' };
    } else {
      result[f] = 1;
    }
  });
  return result;
}

function generateGroupClauses(groupBy) {
  const result = [];
  groupBy.forEach(group => {
    result.push({
      'name': group,
      'value': [{
        '$group':{
          _id: `$${group}`,
          count: {'$sum': 1}
        }
      }]
    });
  });
  return result;
}

async function generateMatchClause(domains) {
  const result = [];
  let i=0;
  while (i < domains.length) {
    if (domains[i] === '|') {
      const orClause = await convertOrOperator(domains.slice(i+1, i+3));
      result.push(orClause);
      i+=3;
    }
    else if (i + 1 < domains.length) {
      const andClause = await convertAndOperator(domains.slice(i, i+2));
      result.push(andClause);
      i+=2;
    } else {
      const andClause = await convertAndOperator(domains.slice(i, i+1));
      result.push(andClause);
      i++;
    }
  }
  if (result.length === 1) {
    return result[0];
  }
  return {'$and':result};
}

function hasNestedArray (arr) {
  if (!Array.isArray(arr)) {
    return false;
  }
  return arr.some(item => Array.isArray(item));
};

async function convertOrOperator(domains) {
  let op1 = {};
  if (hasNestedArray(domains[0])) {
    op1 = await generateMatchClause(domains[0]);
  } else {
    op1 = await convertToSimpleOperator(domains[0]);
  }

  let op2 = {};
  if (hasNestedArray(domains[1])) {
    op2 = await generateMatchClause(domains[1]);
  } else {
    op2 = await convertToSimpleOperator(domains[1]);
  }

  return {'$or': [op1, op2]};
};

async function convertAndOperator(domains) {
  let op1 = {};
  if (hasNestedArray(domains[0])) {
    op1 = await generateMatchClause(domains[0]);
  } else {
    op1 = await convertToSimpleOperator(domains[0]);
  }

  if (domains.length > 1) {
    let op2 = {};
    if (hasNestedArray(domains[1])) {
      op2 = await generateMatchClause(domains[1]);
    } else {
      op2 = await convertToSimpleOperator(domains[1]);
    }
    return {'$and': [op1, op2]};
  }
  return {'$and': [op1]};
}

const operatorsMap = {
  '=': '$eq',
  '!=': '$ne',
  '>': '$gt',
  '<': '$lt',
  '>=': '$gte',
  '<=': '$lte',
  'like': '$regex',
  'in': '$in',//?????
  'not in': '$nin'//?????
};

async function convertToSimpleOperator(dom) {
  const fieldName = dom[0].toString();
  const operator = operatorsMap[dom[1]];
  const value = dom[2];
  const hasTI = await hasTextIndex(fieldName);
  if (hasTI) {
    const result = {'$text' : {'$search' : value}};
    return result;
  }
  const result = {[fieldName]: {[operator]: value}};
  return result;
}

async function hasTextIndex(fieldName) {
  const indexes = await Product.collection.getIndexes();
  const result = Object.keys(indexes).some((index) => index === `${fieldName}_text`);
  return result;
}