/**
 * Valida os dados de entrada.
 *
 * @param {Array} gerenteAtendimento - Lista de GAs.
 * @param {Array} customers - Lista de clientes.
 * @param {Array} gerenteAtendimentoAway - Lista de IDs dos GAs ausentes.
 * @returns {void}
 * @throws {Error} - Se a validação falhar.
 */
function validateInputs(gerenteAtendimento, customers, gerenteAtendimentoAway)
{
  // Verifica se os parâmetros são arrays
  if (
    !Array.isArray(gerenteAtendimento) ||
    !Array.isArray(customers) ||
    !Array.isArray(gerenteAtendimentoAway)
  ) {
    throw new Error('All parameters must be arrays.');
  }

  const isValidGA = (ga) => {
    return (
      ga &&
      typeof ga.id === 'number' &&
      typeof ga.score === 'number' &&
      ga.id > 0 &&
      ga.id < 1000 && // 0 < id do ga < 1.000
      ga.score > 0 &&
      ga.score < 10000 // 0 < nível do ga < 10.000
    );
  };

  const isValidCustomer = (customer) => {
    return (
      customer &&
      typeof customer.score === 'number' &&
      customer.score > 0 &&
      customer.score < 100000 // 0 < tamanho do cliente < 100.000
    );
  };

  // Valida cada GA e cliente
  if (!gerenteAtendimento.every(isValidGA) || !customers.every(isValidCustomer)) {
    throw new Error('Invalid data format.');
  }

  // Verifica se a quantidade de GAs e clientes está dentro dos limites
  const n = gerenteAtendimento.length;
  const m = customers.length;
  const t = gerenteAtendimentoAway.length;

  if (n <= 0 || n >= 1000) {
    throw new Error(`Number of GAs must be between 1 and 999. Found: ${n}`);
  }
  if (m <= 0 || m >= 1000000) {
    throw new Error(
      `Number of customers must be between 1 and 999999. Found: ${m}`,
    );
  }
  if (t > Math.floor(n / 2)) {
    throw new Error(
      `Number of GAs away cannot exceed ${Math.floor(n / 2)}. Found: ${t}`,
    );
  }
}

/**
 * Filtra os GAs disponíveis, removendo aqueles que estão ausentes.
 *
 * @param {Array} gerenteAtendimento - Lista de GAs.
 * @param {Array} gerenteAtendimentoAway - Lista de IDs dos GAs ausentes.
 * @returns {Array} - Lista de GAs disponíveis.
 */
function filterAvailableGA(gerenteAtendimento, gerenteAtendimentoAway)
{
  const gaAwaySet = new Set(gerenteAtendimentoAway);
  return gerenteAtendimento.filter((ga) => !gaAwaySet.has(ga.id));
}

/**
 * Ordena a lista de GAs pelo nível de score em ordem crescente.
 *
 * @param {Array} gaArray - Lista de GAs.
 * @returns {Array} - Lista de GAs ordenada por score.
 */
function sortGAByScore(gaArray)
{
  return gaArray.sort((x, y) => x.score - y.score);
}

/**
 * Ordena a lista de clientes pelo score em ordem crescente.
 *
 * @param {Array} customers - Lista de clientes.
 * @returns {Array} - Lista de clientes ordenada por score.
 */
function sortCustomersByScore(customers)
{
  return customers.sort((x, y) => x.score - y.score);
}

/**
 * Distribui os clientes para os GAs disponíveis com base nos scores.
 *
 * @param {Array} availableGA - Lista de GAs disponíveis, ordenada por score.
 * @param {Array} customers - Lista de clientes, ordenada por score.
 * @returns {Map} - Mapa onde a chave é o ID do GA e o valor é o número de clientes atribuídos.
 */
function distributeCustomersToGA(availableGA, customers)
{
  const clientsPerGA = new Map();
  let gaIndex = 0;

  for (const customer of customers) {
    while (
      gaIndex < availableGA.length &&
      availableGA[gaIndex].score < customer.score
    ) {
      gaIndex++;
    }

    if (gaIndex < availableGA.length) {
      const gaId = availableGA[gaIndex].id;
      clientsPerGA.set(gaId, (clientsPerGA.get(gaId) || 0) + 1);
    }
  }

  return clientsPerGA;
}

/**
 * Encontra o GA com o maior número de clientes atribuídos.
 *
 * @param {Map} clientsPerGA - Mapa onde a chave é o ID do GA e o valor é o número de clientes atribuídos.
 * @returns {number} - ID do GA com o maior número de clientes, ou 0 em caso de empate.
 */
function findGAWithMaxCustomers(clientsPerGA)
{
  let maxCustomers = 0;
  let gaWithMaxCustomers = 0;
  let isTie = false;

  for (const [gaId, count] of clientsPerGA) {
    if (count > maxCustomers) {
      maxCustomers = count;
      gaWithMaxCustomers = gaId;
      isTie = false;
    } else if (count === maxCustomers) {
      isTie = true;
    }
  }

  return isTie ? 0 : gaWithMaxCustomers;
}

/**
 * Realiza o balanceamento de clientes entre os Gerentes de Atendimento disponíveis.
 *
 * @param {array} gerenteAtendimento - Lista de objetos representando os Gerentes de Atendimento (GA).
 * @param {array} customers - Lista de objetos representando os clientes.
 * @param {array} gerenteAtendimentoAway - Lista de IDs dos Gerentes de Atendimento que estão indisponíveis.
 * @returns {number} - ID do GA com o maior número de clientes atribuídos, ou 0 em caso de empate ou erro.
 */
function gerenteAtendimentoBalancing(
  gerenteAtendimento,
  customers,
  gerenteAtendimentoAway,
) {
  try {
    validateInputs(gerenteAtendimento, customers, gerenteAtendimentoAway);

    const availableGA = filterAvailableGA(gerenteAtendimento, gerenteAtendimentoAway);
    const sortedGA = sortGAByScore(availableGA);
    const sortedCustomers = sortCustomersByScore(customers);

    const clientsPerGA = distributeCustomersToGA(sortedGA, sortedCustomers);
    return findGAWithMaxCustomers(clientsPerGA);
  } catch (error) {
    console.error(error.message);
    return 0;
  }
}

// Exporta todas as funções para que possam ser usadas em outros arquivos
module.exports = {
  validateInputs,
  filterAvailableGA,
  sortGAByScore,
  sortCustomersByScore,
  distributeCustomersToGA,
  findGAWithMaxCustomers,
  gerenteAtendimentoBalancing
};