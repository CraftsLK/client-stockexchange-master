export async function getAllCompany() {
    const response = await fetch(`http://localhost:8081/company/get-all`,
        {
            method: 'get',
            headers: { "Content-Type": "application/json" },
        }
    );

    return response.ok && response.json();
}

export async function getAllCurrency() {
    const response = await fetch(`http://localhost:8081/currency/get-all`,
        {
            method: 'get',
            headers: { "Content-Type": "application/json" },
        }
    );

    return response.ok && response.json();
}

export async function getAllUser() {
    const response = await fetch(`http://localhost:8081/user/get-all`,
        {
            method: 'get',
            headers: { "Content-Type": "application/json" },
        }
    );

    return response.ok && response.json();
}

export async function updateExchangeRate() {
    const response = await fetch(`http://localhost:8081/currency/update-exchange-rate`,
        {
            method: 'get',
            headers: { "Content-Type": "application/json" },
        }
    );

    return response.ok;
}

export async function updateSharePrice() {
    const response = await fetch(`http://localhost:8081/company/update-share-price`,
        {
            method: 'get',
            headers: { "Content-Type": "application/json" },
        }
    );

    return response.ok;
}

export async function createCompany(item: any) {
    const response = await fetch(`http://localhost:8081/company/create`,
        {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        }
    );

    return response.ok;
}

export async function createCurrency(item: any) {
    const response = await fetch(`http://localhost:8081/currency/create`,
        {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item)
        }
    );

    return response.ok;
}