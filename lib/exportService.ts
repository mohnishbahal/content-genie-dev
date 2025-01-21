export class ExportService {
    private flattenObject(obj: any, parent = "", res: any = {}) {
        for (let key in obj) {
            const propName = parent ? `${parent}.${key}` : key;
            if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
                this.flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
        return res;
    }

    public convertComplexJSONToCSV(json: any) {
        if (!Array.isArray(json) || json.length === 0) {
            throw new Error("Input must be a non-empty array of objects.");
        }
    
        // Flatten all objects in the array
        const flattenedData = json.map(item => this.flattenObject(item));
    
        // Extract headers from all keys in flattened objects
        const headers = Array.from(new Set(flattenedData.flatMap(item => Object.keys(item))));
    
        // Generate CSV rows
        const rows = flattenedData.map(item =>
            headers.map(header => `"${item[header] !== undefined ? item[header] : ""}"`).join(",")
        );

        const _headers = headers.map(header => {
            const names = header.split('.');
            return names[names.length-1];
        });
    
        // Combine headers and rows
        return [_headers.join(","), ...rows].join("\n");
    }
}