export type CardType = {
  id: number | string;
  color: string;
  name: string;
};

export type TableRowType = {
  id: number | string;
  wins: number | string;
  time: string;
};

export async function createCar(name: string, color: string) {
  await fetch('http://localhost:3000/garage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
}

// разбивает весь список машин на сервере на группы по limit машин и дает набор на page странице
export async function getCars(page: number, limit: number): Promise<{ arr: CardType[]; total: number }> {
  const response = await fetch(
    `http://localhost:3000/garage?_page=${page}&_limit=${limit}`,
    // TODO: поправить остальное
    // ${new URLSearchParams({ _page: page.toString(), _limit: limit.toString() })},
    {
      method: 'GET',
    },
  );
  if (response.ok) {
    const arr: CardType[] = await response.json();
    const total: number = Number(response.headers.get('X-Total-Count'));
    return { arr, total };
  }
  // console.log(`Ошибка HTTP: ${response.status}`);
  return Promise.reject(new Error(`getCars api method failed with status ${response.status}`));
}

export async function getCar(id: number) {
  const response = await fetch(`http://localhost:3000/garage/${id}`, {
    method: 'GET',
  });
  if (response.ok) {
    const car: CardType = await response.json();
    return car;
  }
  // console.log(`Ошибка HTTP: ${response.status}`);
  return Promise.reject(new Error(`getCar api method failed with status ${response.status}`));
}

export async function deleteCar(id: number) {
  await fetch(`http://localhost:3000/garage/${id}`, {
    method: 'DELETE',
  });
}

export async function updateCar(id: number, name: string, color: string) {
  await fetch(`http://localhost:3000/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
}

// перед использованием drive нужно завести машину
export async function engine(id: number, status: 'started' | 'stopped' | 'drive', signal: AbortSignal | null = null) {
  const response = await fetch(`http://localhost:3000/engine?id=${id}&status=${status}`, {
    // ${new URLSearchParams({ id: id.toString(), status })}`, {
    method: 'PATCH',
    signal,
  });
  return response;
}

export async function getWinners(page: number, limit: number, sort: 'id' | 'wins' | 'time', order: 'ASC' | 'DESC') {
  const response = await fetch(
    `http://localhost:3000/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`,
    // ${new URLSearchParams({ _page: page.toString(), _limit: limit.toString(), _sort: sort, _order: order })}`,
    {
      method: 'GET',
    },
  );
  if (response.ok) {
    const arr: TableRowType[] = await response.json();
    const total: number = Number(response.headers.get('X-Total-Count'));
    return { arr, total };
  }
  // console.log(`Ошибка HTTP: ${response.status}`);
  return { arr: [], total: 0 };
}

export async function getWinner(id: number) {
  return fetch(`http://localhost:3000/winners/${id}`, {
    method: 'GET',
  });
}

export async function createWinner(id: number | string, wins: number, time: string) {
  return fetch(`http://localhost:3000/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  });
}

export function deleteWinner(id: number | string) {
  return fetch(`http://localhost:3000/winners/${id}`, {
    method: 'DELETE',
  });
}

export function updateWinner(id: number | string, wins: number | string, time: number | string) {
  return fetch(`http://localhost:3000/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
}
