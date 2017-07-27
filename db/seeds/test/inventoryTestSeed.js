const inventoryData = require('../../../data/inventory.json');

const seedInventory = (knex) => {
  return Object.keys(inventoryData).map((key) => {
    const { title, description, link, price } = inventoryData[key];

    return knex('inventory').insert({
      title,
      description,
      link,
      price
    });
  });
};

exports.seed = function(knex, Promise) {
  return knex('inventory').del()
    .then(() => {
      const newSeedInventory = seedInventory(knex);

      return Promise.all([...newSeedInventory]);
    });
};
