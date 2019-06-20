import _ from 'lodash';

import commoditiesAndVarieties from './commodities-and-varieties';

function createUuidKey(commodityUuid, varietyUuid) {
  return _.compact([commodityUuid, varietyUuid]).join(':');
}

export const commodityDropdownListOptions = _.orderBy(
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

export function itemFromUuids(commodityUuid, varietyUuid) {
  return _.find(commodityDropdownListOptions, {
    value: createUuidKey(commodityUuid, varietyUuid),
  });
}

export function nameFromUuids(commodityUuid, varietyUuid) {
  return _.get(itemFromUuids(commodityUuid, varietyUuid), 'label');
}

export function commodityNameFromUuid(commodityUuid, varietyUuid) {
  const commodityOption = _.find(commoditiesAndVarieties, { uuid: commodityUuid });
  return (
    _.get(commodityOption, 'name') ||
    _.get(itemFromUuids(commodityUuid, varietyUuid), 'alias')
  );
}
