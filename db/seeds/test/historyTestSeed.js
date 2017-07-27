const seedHistory = (knex) => {
  const seedArray = [{total: 2000}, {total: 5000}, {total: 10000}];

  return seedArray.map((obj) => {
    const { total } = obj;

    return knex('history').insert({
      total
    });
  });
};

exports.seed = function(knex, Promise) {
  return knex('history').del()
    .then(() => {
      const newSeedHistory = seedHistory(knex);

      return Promise.all([...newSeedHistory]);
    });
};
