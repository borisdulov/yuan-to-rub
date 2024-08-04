const cbrApiUrl = "http://www.cbr.ru/scripts/XML_daily.asp";

export const ValuteToRub = async (targetCharCode: string): Promise<string | null> => {
  try {
    const response = await fetch(cbrApiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const regex = new RegExp(`<CharCode>${targetCharCode}</CharCode>.*?<Value>(.*?)</Value>`);
    const xmlString = await response.text();
    const valute = xmlString.match(regex);
    if (!valute) {
      throw new Error(`Valute ${targetCharCode} not found in XML data`);
    }
    return valute[1];
  } catch (error) {
    console.error(error);
    return null;
  }
};
