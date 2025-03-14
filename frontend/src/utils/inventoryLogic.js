export const getUnavailableParts = (parts) => {
    return parts.filter(part => {
        const quantity = part.quantity || 0;
        const partsPerMachine = part.parts_per_machine || 0;

        // If the part is required for machine assembly
        if (partsPerMachine > 0) {
            // If stock is less than needed for one machine, it's unavailable
            if (quantity < partsPerMachine) {
                return true;
            }
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
    const reorderThreshold = partsPerMachine * 2 * 6;
    return (partsPerMachine > 0 && quantity < reorderThreshold) || (partsPerMachine === 0 && quantity > 0 && quantity < 5) || quantity === 0;
};

export const getLowStockItems = (parts) => {
    return parts.filter(part =>
        part.parts_per_machine &&
        part.quantity > 0 &&
        part.quantity < (part.parts_per_machine * 6)
    );
};

// Calculate the maximum number of machines that can be built based on available stock
export const getMachinesPossible = (parts) => {
    if (!parts.length) return 0;

    // Filter out parts that are required for machine assembly
    const machineParts = parts.filter(part => part.parts_per_machine > 0);

    // Determine the fewest machines that can be built based on the lowest available stock
    if (machineParts.length === 0) return 0; // No parts assigned to machines

    return Math.min(...machineParts.map(part => Math.floor(part.quantity / part.parts_per_machine)));
};

// Get total number of unique parts in inventory
export const getTotalUniqueParts = (parts) => {
    return parts.length; // The number of unique part entries in the inventory
};
