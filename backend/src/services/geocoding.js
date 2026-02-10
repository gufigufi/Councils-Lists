import axios from "axios";

/**
 * Geocode an address using Nominatim (OpenStreetMap)
 * @param {string} address - Full address to geocode
 * @param {string} country - Country code or name (default: 'USA')
 * @returns {Promise<{lat: number, lon: number, displayName: string} | null>}
 */
export const geocodeAddress = async (address, country = "USA") => {
  try {
    // Добавляем страну к адресу для более точного геокодинга
    const fullAddress = `${address}, ${country}`;

    console.log(`🌍 Геокодинг адреса: "${fullAddress}"`);

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: fullAddress,
          format: "json",
          limit: 5, // Получаем больше результатов для выбора лучшего
          addressdetails: 1, // Получаем детальную информацию об адресе
        },
        headers: {
          "User-Agent": "EventMapFinder/1.0",
        },
      },
    );

    if (response.data && response.data.length > 0) {
      // Фильтруем результаты по стране, если указана
      let filteredResults = response.data;

      if (
        country.toLowerCase() === "usa" ||
        country.toLowerCase() === "united states"
      ) {
        filteredResults = response.data.filter(
          (result) =>
            result.address &&
            (result.address.country_code === "us" ||
              (result.display_name &&
                result.display_name.includes("United States"))),
        );
      } else if (country.toLowerCase() === "canada") {
        filteredResults = response.data.filter(
          (result) =>
            result.address &&
            (result.address.country_code === "ca" ||
              (result.display_name && result.display_name.includes("Canada"))),
        );
      }

      // Если после фильтрации ничего не осталось, берем оригинальные результаты
      if (filteredResults.length === 0) {
        console.warn(
          `⚠️  Не найдено результатов для страны ${country}, используем все результаты`,
        );
        filteredResults = response.data;
      }

      // Выбираем результат с наивысшей важностью
      const bestResult = filteredResults.reduce((best, current) =>
        current.importance > best.importance ? current : best,
      );

      const { lat, lon, display_name, importance } = bestResult;

      console.log(`✅ Найдено: ${display_name}`);
      console.log(`   Координаты: (${lat}, ${lon})`);
      console.log(`   Важность: ${importance}`);

      // Проверяем качество результата
      if (importance < 0.3) {
        console.warn(
          `⚠️  Низкая точность геокодинга (importance: ${importance})`,
        );
      }

      return {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        displayName: display_name,
      };
    }

    console.log(`❌ Результатов не найдено для адреса: "${fullAddress}"`);
    return null;
  } catch (error) {
    console.error("❌ Ошибка геокодинга:", error.message);
    return null;
  }
};
