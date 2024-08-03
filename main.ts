import { XMLParser } from "fast-xml-parser";

const cbrApiUrl = "http://www.cbr.ru/scripts/XML_daily.asp";

interface response {
  ValCurs: {
    Valute: valute[];
  };
}

interface valute {
  CharCode: string;
  Value: string;
}

export const YuanToRub = async (): Promise<string | null> => {
  try {
    const response = await fetch(cbrApiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    const xmlString = await response.text();
    const parser = new XMLParser();
    const xmlObj = parser.parse(xmlString) as response;
    if (!xmlObj.ValCurs.Valute) {
      throw new Error("Invalid XML format");
    }
    const yuan = xmlObj.ValCurs.Valute.find((valute) => valute.CharCode === "CNY");
    if (!yuan || !yuan.Value) {
      throw new Error(`Yuan not found in XML data`);
    }
    return yuan.Value;
  } catch (error) {
    console.error(error);
    return null;
  }
};
