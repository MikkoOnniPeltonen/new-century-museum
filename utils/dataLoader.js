/**
 * Data Loader Module
 * Handles fetching and caching of historical persons data
 */

class DataLoader {
    constructor() {
        this.data = null;
        this.loading = false;
        this.error = null;
    }

    /**
     * Fetches historical persons data from JSON file
     * @returns {Promise<Array>} Array of historical persons
     */
    async loadHistoricalPersons() {
        // Return cached data if available
        if (this.data) {
            return this.data;
        }

        // Prevent multiple simultaneous requests
        if (this.loading) {
            return new Promise((resolve, reject) => {
                const checkLoaded = setInterval(() => {
                    if (!this.loading) {
                        clearInterval(checkLoaded);
                        if (this.data) {
                            resolve(this.data);
                        } else {
                            reject(this.error || new Error('Failed to load data'));
                        }
                    }
                }, 100);
            });
        }

        this.loading = true;
        this.error = null;

        try {
            const response = await fetch('../data/historical-persons.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();
            this.data = jsonData.persons;
            this.loading = false;

            return this.data;
        } catch (error) {
            this.error = error;
            this.loading = false;
            console.error('Error loading historical persons data:', error);

            // Fallback: return empty array or handle error appropriately
            throw error;
        }
    }

    /**
     * Get persons by century
     * @param {string} century - Century to filter by (e.g., "1600s")
     * @returns {Array} Filtered array of persons
     */
    getPersonsByCentury(century) {
        if (!this.data) {
            console.warn('Data not loaded yet. Call loadHistoricalPersons() first.');
            return [];
        }
        return this.data.filter(person => person.century === century);
    }

    /**
     * Get persons by trait
     * @param {string} trait - Trait to filter by
     * @returns {Array} Filtered array of persons
     */
    getPersonsByTrait(trait) {
        if (!this.data) {
            console.warn('Data not loaded yet. Call loadHistoricalPersons() first.');
            return [];
        }
        return this.data.filter(person =>
            person.traits && person.traits.includes(trait)
        );
    }

    /**
     * Get all unique traits
     * @returns {Array} Array of unique trait strings
     */
    getAllTraits() {
        if (!this.data) {
            console.warn('Data not loaded yet. Call loadHistoricalPersons() first.');
            return [];
        }

        const allTraits = [];
        this.data.forEach(person => {
            if (person.traits) {
                allTraits.push(...person.traits);
            }
        });

        return [...new Set(allTraits)];
    }

    /**
     * Search persons by name
     * @param {string} query - Search query
     * @returns {Array} Filtered array of persons
     */
    searchPersons(query) {
        if (!this.data) {
            console.warn('Data not loaded yet. Call loadHistoricalPersons() first.');
            return [];
        }

        const lowerQuery = query.toLowerCase();
        return this.data.filter(person =>
            person.name.toLowerCase().includes(lowerQuery) ||
            person.bio.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Get person by ID
     * @param {string} id - Person ID
     * @returns {Object|null} Person object or null if not found
     */
    getPersonById(id) {
        if (!this.data) {
            console.warn('Data not loaded yet. Call loadHistoricalPersons() first.');
            return null;
        }
        return this.data.find(person => person.id === id) || null;
    }
}

// Create singleton instance
const dataLoader = new DataLoader();

export { dataLoader, DataLoader };
