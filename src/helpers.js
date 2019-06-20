const _ = require('lodash');

const commoditiesAndVarieties = require('./commodities-and-varieties');

const sortedOptions = _.sortBy(commoditiesAndVarieties, 'name');
const pickerOptions = sortedOptions.map((opt) => ({ ...opt, label: opt.name, value: opt.uuid }));

function createUuidKey(commodityUuid, varietyUuid) {
  return _.compact([commodityUuid, varietyUuid]).join(':');
}

const commodityDropdownListOptions = _.orderBy(
  _.flatten(
    commoditiesAndVarieties.map(commodityObject => {
      const { name, uuid, varietyUuid, varieties } = commodityObject;

      if (_.isEmpty(varieties)) {
        return { label: name, value: createUuidKey(uuid, varietyUuid) };
      } else {
        return varieties.map(varietyObject => ({
          label: `${name}, ${varietyObject.name}`,
          alias: `${varietyObject.name} ${name}`,
          value: createUuidKey(
            varietyObject.commodityUuid || uuid,
            varietyObject.uuid,
          ),
        }));
      }
    }),
  ),
  'label',
);

function itemFromUuids(commodityUuid, varietyUuid) {
  return _.find(commodityDropdownListOptions, {
    value: createUuidKey(commodityUuid, varietyUuid),
  });
}

function nameFromUuids(commodityUuid, varietyUuid) {
  return _.get(itemFromUuids(commodityUuid, varietyUuid), 'label');
}

function commodityNameFromUuid(commodityUuid, varietyUuid) {
  const commodityOption = _.find(commoditiesAndVarieties, { uuid: commodityUuid });
  return (
    _.get(commodityOption, 'name') ||
    _.get(itemFromUuids(commodityUuid, varietyUuid), 'alias')
  );
}

module.exports = {
  sortedOptions,
  pickerOptions,
  commodityDropdownListOptions,
  itemFromUuids,
  nameFromUuids,
  commodityNameFromUuid,
};
