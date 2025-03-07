// Get parts that are low in stock based on the 2-week reorder threshold
export const getLowStockParts = (parts) => {
    return parts.filter(part => {
        const quantity = part.quantity || 0;
        const partsPerMachine = part.parts_per_machine || 0;

        // Calculate reorder threshold (2 weeks worth of stock)
        const reorderThreshold = partsPerMachine * 12;

        // If the part is needed in machines and stock is below threshold
        if (partsPerMachine > 0 && quantity < reorderThreshold) {
            return true;
        }

        // General low stock threshold for non-machine parts
        if (partsPerMachine === 0 && quantity > 0 && quantity < 5) {
            return true;
        }

        // Out of stock condition
        return quantity === 0;
    });
};

// Capitalize the first letter of a string
export const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Check if a part is low stock
export const isLowStock = (part) => {
    const quantity = part.quantity || 0;
    const partsPerMachine = part.parts_per_machine || 0;
    const reorderThreshold = partsPerMachine * 12;
    return (partsPerMachine > 0 && quantity < reorderThreshold) || (partsPerMachine === 0 && quantity > 0 && quantity < 5) || quantity === 0;
};
