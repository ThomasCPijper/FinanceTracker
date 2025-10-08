export async function convertCurrency(
    from: string,
    to: string,
    amount: number
): Promise<number> {
    if (from === to) return amount; // geen conversie nodig

    const apiKey = process.env.FASTFOREX_API_KEY;
    const url = `https://api.fastforex.io/convert?from=${from}&to=${to}&amount=${amount}&api_key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) {
        console.error("Currency API error:", await res.text());
        return amount; // fallback naar originele waarde
    }

    const data = await res.json();
    return data?.result?.[to] ?? amount;
}
