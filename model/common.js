module.exports.user = require('./../schema/user');
module.exports.booking = require('./../schema/booking');

module.exports.findOne = async (collection, query, property) => {
    try {
        return await this[collection].findOne(query, property).lean().exec();
    } catch (err) {
        throw err;
    }
}

module.exports.create = async (collection, data) => {
    try {
        return await new this[collection](data).save();
    } catch (error) {
        throw error;
    }
}

module.exports.find = async (collection, query, sort, limit, skip) => {
    try {
        return await this[collection].find(query).sort(sort).limit(limit).skip(skip);
    } catch (error) {
        throw error;
    }
}

module.exports.findWithFields = async (collection, query, sort, limit, skip, fields) => {
    try {
        return await this[collection].find(query).sort(sort).limit(limit).skip(skip).select(fields);
    } catch (error) {
        throw error;
    }
}

module.exports.findOneAndUpdate = async (collection, query, data, fields) => {
    try {
        return await this[collection].findOneAndUpdate(query, data, { fields, setDefaultsOnInsert: true, new: true, upsert: true }).lean().exec();
    } catch (error) {
        throw error;
    }
}

module.exports.findWithCount = async (collection, query, skip, limit, sort) => {
    try {
        return await this[collection].aggregate([
            {
                $match: {
                    $and: query
                }
            },
            { $sort: sort },
            {
                $facet: {
                    products: [{ $skip: skip }, { $limit: limit }],
                    count: [
                        {
                            $count: 'count'
                        }
                    ]
                }
            },
            {
                "$project": {
                    [collection]: "$products",
                    "count": { "$arrayElemAt": ["$count.count", 0] },
                }
            }
        ])
    } catch (err) {
        throw err;
    }
}

module.exports.deleteMany = async (collection, query) => {
    try {
        return await this[collection].deleteMany(query);
    } catch (error) {
        throw error;
    }
}

module.exports.deleteOne = async (collection, query) => {
    try {
        return await this[collection].deleteOne(query).lean().exec();
    } catch (error) {
        throw error;
    }
}

module.exports.bulkWrite = async (collection, data) => {
    try {
        return await this[collection].bulkWrite(data);
    } catch (error) {
        throw error;
    }
}

module.exports.update = async (collection, query, data) => {
    try {
        return await this[collection].update(query, data, { multi: true }).lean().exec();
    } catch (error) {
        throw error;
    }
}


module.exports.count = async (collection, query) => {
    try {
        return await this[collection].find(query).count();
    } catch (error) {
        throw error;
    }
};