export type CardType = {
  id: number | string;
  color: string;
  name: string;
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
    `http://localhost:3000/garage?${new URLSearchParams({ _page: page.toString(), _limit: limit.toString() })}`,
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
  return { arr: [], total: 0 };
}

export function getCar(id: number) {
  fetch(`http://localhost:3000/garage?${new URLSearchParams({ id: id.toString() })}`, {
    method: 'GET',
  }).then(
    (val) => {
      console.log(val);
    },
    (err) => {
      console.log(err);
    },
  );
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
export async function engine(id: number, status: 'started' | 'stopped' | 'drive') {
  const response = await fetch(`http://localhost:3000/engine?${new URLSearchParams({ id: id.toString(), status })}`, {
    method: 'PATCH',
  });
  return response;
}

export function getWinners(page: number, limit: number, sort: 'id' | 'wins' | 'time', order: 'ASC' | 'DESC') {
  fetch(
    `http://localhost:3000/winners?${new URLSearchParams({ _page: page.toString(), _limit: limit.toString(), _sort: sort, _order: order })}`,
    {
      method: 'GET',
    },
  ).then(
    (val) => {
      console.log(val);
    },
    (err) => {
      console.log(err);
    },
  );
}

export function getWinner(id: number) {
  fetch(`http://localhost:3000/winners?${new URLSearchParams({ id: id.toString() })}`, {
    method: 'GET',
  }).then(
    (val) => {
      console.log(val);
    },
    (err) => {
      console.log(err);
    },
  );
}

export function createWinner(id: number, wins: number, time: number) {
  fetch(`http://localhost:3000/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, wins, time }),
  }).then(
    (val) => {
      console.log(val);
    },
    (err) => {
      console.log(err);
    },
  );
}

export function deleteWinner(id: number) {
  fetch(`http://localhost:3000/winners?${new URLSearchParams({ id: id.toString() })}`, {
    method: 'DELETE',
  }).then(
    (val) => {
      console.log(val);
    },
    (err) => {
      console.log(err);
    },
  );
}

export function updateWinner(id: number, wins: number, time: number) {
  fetch(`http://localhost:3000/winners?${new URLSearchParams({ id: id.toString() })}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  }).then(
    (val) => {
      console.log(val);
    },
    (err) => {
      console.log(err);
    },
  );
}
