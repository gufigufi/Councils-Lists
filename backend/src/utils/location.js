/**
 * Определение страны по штату/провинции
 */

// Американские штаты (включая территории)
const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
  "PR",
  "VI",
  "GU",
  "AS",
  "MP",
];

// Канадские провинции и территории
const CA_PROVINCES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
];

/**
 * Определяет страну на основе кода штата/провинции
 * @param {string} stateCode - Код штата/провинции (2 буквы)
 * @returns {string} - 'USA', 'Canada' или 'USA' по умолчанию
 */
export const detectCountryByState = (stateCode) => {
  if (!stateCode) {
    return "USA"; // По умолчанию США
  }

  const code = stateCode.toUpperCase().trim();

  if (US_STATES.includes(code)) {
    return "USA";
  }

  if (CA_PROVINCES.includes(code)) {
    return "Canada";
  }

  // По умолчанию считаем США
  console.log(
    `⚠️ Неизвестный код штата/провинции: ${stateCode}, используем USA`,
  );
  return "USA";
};

/**
 * Проверяет, является ли код валидным для Северной Америки
 * @param {string} stateCode - Код штата/провинции
 * @returns {boolean}
 */
export const isValidNorthAmericanState = (stateCode) => {
  if (!stateCode) return false;
  const code = stateCode.toUpperCase().trim();
  return US_STATES.includes(code) || CA_PROVINCES.includes(code);
};
