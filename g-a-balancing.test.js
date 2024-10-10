const { gerenteAtendimentoBalancing } = require('./g-a-balancing');

test('Scenario 1', () => {
  const gas = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const gaAway = [2, 4];

  expect(gerenteAtendimentoBalancing(gas, customers, gaAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test('Scenario 2', () => {
  const gas = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const gaAway = [];

  expect(gerenteAtendimentoBalancing(gas, customers, gaAway)).toEqual(0);
});

test('Scenario 3', () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const gas = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const gaAway = [999];

  expect(gerenteAtendimentoBalancing(gas, customers, gaAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test('Scenario 4', () => {
  const gas = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const gaAway = [];

  expect(gerenteAtendimentoBalancing(gas, customers, gaAway)).toEqual(0);
});

test('Scenario 5', () => {
  const gas = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const gaAway = [];

  expect(gerenteAtendimentoBalancing(gas, customers, gaAway)).toEqual(1);
});

test('Scenario 6', () => {
  const gas = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const gaAway = [1, 3, 2];

  expect(gerenteAtendimentoBalancing(gas, customers, gaAway)).toEqual(0);
});

test('Scenario 7', () => {
  const gas = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const gaAway = [4, 5, 6];

  expect(gerenteAtendimentoBalancing(gas, customers, gaAway)).toEqual(3);
});

test('Scenario 8', () => {
  const gas = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const gaAway = [2, 4];
  expect(gerenteAtendimentoBalancing(gas, customers, gaAway)).toEqual(1);
});
